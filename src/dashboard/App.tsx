import React, { useEffect, useState } from 'react';
import { Sidebar, NavItemKey } from './layouts/Sidebar';
import { TopNav } from './layouts/TopNav';

// View Pages
import { DashboardHome } from './pages/DashboardHome';
import { NewMovieView } from './pages/NewMovieView';
import { MyProjectsView } from './pages/MyProjectsView';
import { ScriptStudioView } from './pages/ScriptStudioView';
import { CharacterStudioView } from './pages/CharacterStudioView';
import { EnvironmentStudioView } from './pages/EnvironmentStudioView';
import { StoryboardView } from './pages/StoryboardView';
import { SceneGeneratorView } from './pages/SceneGeneratorView';
import { ProductionQueueView } from './pages/ProductionQueueView';
import { VoiceStudioView } from './pages/VoiceStudioView';
import { AudioStudioView } from './pages/AudioStudioView';
import { CinematicEditorView } from './pages/CinematicEditorView';
import { AssetLibraryView } from './pages/AssetLibraryView';
import { GoogleFlowView } from './pages/GoogleFlowView';
import { AIModelsView } from './pages/AIModelsView';
import { SettingsView } from './pages/SettingsView';
import { HelpDocsView } from './pages/HelpDocsView';

// Types & DB
import { Project } from '../shared/types/project';
import { ScriptDocument, ScriptAnalysisResult } from '../shared/types/script';
import { Character } from '../shared/types/character';
import { Environment } from '../shared/types/environment';
import { StoryboardScene } from '../shared/types/storyboard';
import { VideoTimeline, VideoClip } from '../shared/types/editor';
import { GenerationJob } from '../shared/types/job';
import { FlowSessionState, ManualHandoffData } from '../shared/types/flow';
import { AIProviderConfig } from '../shared/types/provider';
import { generateSceneSyntheticVideo } from '../engines/video-engine/synthetic-video-generator';
import { generateSyntheticCharacterPortrait } from '../engines/character-engine/portrait-generator';

import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getScript,
  saveScript,
  getCharacters,
  saveCharacter,
  deleteCharacter,
  getEnvironments,
  saveEnvironment,
  deleteEnvironment,
  getScenes,
  saveScene,
  saveScenes,
  replaceProjectScenes,
  deleteScene,
  getTimeline,
  saveTimeline,
} from '../database/project-store';
import { calculateStorageUsage, saveAssetBlob, createAssetUrl } from '../database/asset-store';
import { getJobsByProject, createJob, updateJobStatus } from '../database/job-store';
import { getRegisteredProviders, saveProviderConfig } from '../providers/provider-registry';
import { inspectFlowSession } from '../flow/flow-detector';
import { createScenesFromScriptAnalysis } from '../engines/storyboard-engine/storyboard-generator';
import { generateId } from '../shared/utils/helpers';
import { getDB } from '../database/indexeddb';

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<NavItemKey>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>('');
  const [script, setScript] = useState<ScriptDocument | undefined>();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [scenes, setScenes] = useState<StoryboardScene[]>([]);
  const [timeline, setTimeline] = useState<VideoTimeline | undefined>();
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [providers, setProviders] = useState<AIProviderConfig[]>([]);
  const [flowSession, setFlowSession] = useState<FlowSessionState | undefined>();
  const [storageInfo, setStorageInfo] = useState({ totalBytes: 0, count: 0, formatted: '0 KB' });
  const [selectedSceneIdForGenerator, setSelectedSceneIdForGenerator] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Initialize on mount
  useEffect(() => {
    initApp();
  }, []);

  // Listen for video sync events from Google Flow content script
  useEffect(() => {
    const handleRuntimeMessage = (message: any) => {
      if (message.type === 'FLOW_VIDEO_CAPTURED' && message.payload?.videoUrl) {
        const targetScene =
          scenes.find((s) => s.id === selectedSceneIdForGenerator) ||
          scenes.find((s) => !s.videoUrl) ||
          scenes[0];
        if (targetScene) {
          handleImportSceneVideo(targetScene.id, message.payload.videoUrl);
          alert(`✓ Synced video from Google Flow into Scene ${targetScene.sceneNumber}: "${targetScene.title}"!`);
        }
      }
    };

    chrome.runtime?.onMessage?.addListener?.(handleRuntimeMessage);
    return () => {
      chrome.runtime?.onMessage?.removeListener?.(handleRuntimeMessage);
    };
  }, [scenes, selectedSceneIdForGenerator]);

  // When activeProjectId changes, load its data
  useEffect(() => {
    if (activeProjectId) {
      loadProjectData(activeProjectId);
    }
  }, [activeProjectId]);

  const initApp = async () => {
    setLoading(true);
    try {
      let projs = await getAllProjects();

      // If database is completely empty, seed initial starter project with authentic Chittagong screenplay
      if (projs.length === 0) {
        const seedProject = await createProject({
          name: 'The Shopkeeper of Chittagong (চাঁটগাঁর নানটু)',
          description: 'A cinematic rural comedy-drama set in Hathazari, Chittagong. Directed with authentic Chatgaiya dialogue and locked character identity anchors.',
          settings: {
            genre: 'Cinematic Comedy / Drama',
            language: 'bn',
            dialect: 'bn-ctg (Chittagong / Chatgaiya)',
            aspectRatio: '16:9',
            resolution: '1080p',
            fps: 30,
            visualStyle: 'Ultra-realistic cinematic film, 35mm anamorphic lens, warm afternoon golden hour lighting, authentic rural texture',
          },
        });
        projs = [seedProject];
      }

      setProjects(projs);
      const initialProjId = projs[0].id;
      setActiveProjectId(initialProjId);

      const provs = await getRegisteredProviders();
      setProviders(provs);

      await refreshFlowStatus();
      await refreshStorage();
    } catch (err) {
      console.error('Initialization error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadProjectData = async (projectId: string) => {
    try {
      const scr = await getScript(projectId);
      setScript(scr);

      let chars = await getCharacters(projectId);
      // Auto-heal any characters that don't have face reference photos
      let charsUpdated = false;
      for (const c of chars) {
        if (!c.references || c.references.length === 0) {
          try {
            const portrait = await generateSyntheticCharacterPortrait(c);
            c.references = [
              {
                id: generateId('ref'),
                characterId: c.id,
                viewType: 'face',
                imageUrl: portrait,
                isPrimaryFace: true,
                uploadedAt: Date.now(),
              },
            ];
            await saveCharacter(c);
            charsUpdated = true;
          } catch (_) {}
        }
      }
      if (charsUpdated) {
        chars = await getCharacters(projectId);
      }
      setCharacters(chars);

      const envs = await getEnvironments(projectId);
      setEnvironments(envs);

      const scs = await getScenes(projectId);
      // Restore fresh active blob URLs so videos never expire or fail on reload
      for (const sc of scs) {
        if (sc.videoBlobKey) {
          try {
            const liveUrl = await createAssetUrl(sc.videoBlobKey);
            if (liveUrl) sc.videoUrl = liveUrl;
          } catch (_) {}
        }
      }
      setScenes(scs);

      let tl = await getTimeline(projectId);
      if (!tl) {
        tl = {
          id: generateId('timeline'),
          projectId,
          videoClips: [],
          audioClips: [],
          subtitles: [],
          subtitleStyle: {
            fontFamily: 'Inter',
            fontSize: 24,
            color: '#FFFFFF',
            backgroundColor: 'rgba(0,0,0,0.6)',
            outlineColor: '#000000',
            outlineWidth: 2,
            position: 'bottom',
            burnIn: true,
          },
          totalDurationSeconds: 0,
          updatedAt: Date.now(),
        };
      }

      // Rehydrate live blob URLs on existing clips
      for (const clip of tl.videoClips) {
        if (clip.blobKey) {
          try {
            const liveUrl = await createAssetUrl(clip.blobKey);
            if (liveUrl) clip.videoUrl = liveUrl;
          } catch (_) {}
        }
        if (!clip.videoUrl) {
          const matchedSc = scs.find((s) => s.id === clip.sceneId);
          if (matchedSc?.videoUrl) {
            clip.videoUrl = matchedSc.videoUrl;
            clip.blobKey = matchedSc.videoBlobKey;
          }
        }
      }

      // Ensure ANY scene with an approved video is always present in timeline clips
      const clipsMap = new Map<string, VideoClip>();
      tl.videoClips.forEach((c) => clipsMap.set(c.sceneId, c));
      scs.filter((s) => s.videoUrl).forEach((s, idx) => {
        if (!clipsMap.has(s.id)) {
          clipsMap.set(s.id, {
            id: `clip-${s.id}`,
            sceneId: s.id,
            title: `Scene ${s.sceneNumber}: ${s.title}`,
            videoUrl: s.videoUrl || '',
            blobKey: s.videoBlobKey,
            sourceDuration: s.durationSeconds || 5,
            trimStart: 0,
            trimEnd: 0,
            playbackRate: 1.0,
            volume: 1.0,
            order: s.order || idx + 1,
            transitionIn: 'cut',
            transitionDuration: 0.5,
          });
        }
      });

      tl.videoClips = Array.from(clipsMap.values()).sort((a, b) => a.order - b.order);
      tl.totalDurationSeconds = tl.videoClips.reduce((a, b) => a + (b.sourceDuration - b.trimStart - b.trimEnd), 0);
      await saveTimeline(tl);
      setTimeline(tl);

      const projJobs = await getJobsByProject(projectId);
      setJobs(projJobs);
    } catch (err) {
      console.error('Error loading project data:', err);
    }
  };

  const refreshFlowStatus = async (targetTabId?: number) => {
    const session = await inspectFlowSession(targetTabId);
    setFlowSession(session);
  };

  const refreshStorage = async () => {
    const usage = await calculateStorageUsage();
    setStorageInfo(usage);
  };

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  // Actions
  const handleCreateProject = async (params: { name: string; description: string; settings: any }) => {
    const newProj = await createProject(params);
    const updated = [newProj, ...projects];
    setProjects(updated);
    setActiveProjectId(newProj.id);
    setActiveView('script_studio');
    return newProj;
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this movie project?')) {
      await deleteProject(id);
      const remaining = projects.filter((p) => p.id !== id);
      setProjects(remaining);
      if (activeProjectId === id && remaining.length > 0) {
        setActiveProjectId(remaining[0].id);
      }
    }
  };

  const handleDuplicateProject = async (proj: Project) => {
    const duplicated = await createProject({
      name: `${proj.name} (Copy)`,
      description: proj.description,
      settings: proj.settings,
    });
    setProjects([duplicated, ...projects]);
    setActiveProjectId(duplicated.id);
  };

  const handleSaveScript = async (rawText: string, analysis?: ScriptAnalysisResult) => {
    if (!activeProject) return;
    const current = script || {
      id: generateId('script'),
      projectId: activeProject.id,
      rawText: '',
      wordCount: 0,
      updatedAt: Date.now(),
    };

    const updated: ScriptDocument = {
      ...current,
      rawText,
      wordCount: rawText.trim() ? rawText.trim().split(/\s+/).length : 0,
      analysis,
      updatedAt: Date.now(),
    };

    await saveScript(updated);
    setScript(updated);
  };

  const handleApplyScriptToStoryboard = async (analysis: ScriptAnalysisResult, autoGenerate = false) => {
    if (!activeProject) return;

    // 1. Sync Characters
    const newCharacters: Character[] = [];
    for (const ec of analysis.characters) {
      const existing = characters.find((c) => c.name.toLowerCase() === ec.name.toLowerCase());
      if (!existing) {
        const charId = generateId('char');
        const c: Character = {
          id: charId,
          projectId: activeProject.id,
          name: ec.name,
          code: `CHAR-00${characters.length + newCharacters.length + 1}`,
          description: ec.identity,
          age: ec.apparentAge || '30s',
          gender: 'Unspecified',
          faceShape: 'Authentic expressive features',
          skinAppearance: 'Natural skin texture',
          eyes: 'Dark expressive eyes',
          hair: 'Natural styling',
          bodyType: 'Average',
          height: '5 ft 8 in',
          personality: ec.personality,
          speakingStyle: ec.speakingStyle,
          isLocked: false,
          references: [],
          costumes: [
            {
              id: generateId('costume'),
              characterId: charId,
              name: ec.costume || 'Signature Costume',
              description: ec.costume || 'Default wardrobe',
              colorScheme: ['#3B82F6'],
              isDefault: true,
              sceneIdsApplied: [],
              approved: true,
            },
          ],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        // Automatically synthesize biometric AI Face Portrait
        try {
          const portrait = await generateSyntheticCharacterPortrait(c);
          c.references = [
            {
              id: generateId('ref'),
              characterId: charId,
              viewType: 'face',
              imageUrl: portrait,
              isPrimaryFace: true,
              uploadedAt: Date.now(),
            },
          ];
        } catch (_) {}

        await saveCharacter(c);
        newCharacters.push(c);
      }
    }

    // Also ensure any existing characters without photos get an anchored face portrait
    for (const ec of characters) {
      if (!ec.references || ec.references.length === 0) {
        try {
          const portrait = await generateSyntheticCharacterPortrait(ec);
          ec.references = [
            {
              id: generateId('ref'),
              characterId: ec.id,
              viewType: 'face',
              imageUrl: portrait,
              isPrimaryFace: true,
              uploadedAt: Date.now(),
            },
          ];
          await saveCharacter(ec);
        } catch (_) {}
      }
    }

    const allChars = [...characters, ...newCharacters];
    setCharacters(allChars);

    // 2. Sync Environments
    const newEnvironments: Environment[] = [];
    for (const el of analysis.locations) {
      const existing = environments.find((e) => e.name.toLowerCase() === el.name.toLowerCase());
      if (!existing) {
        const envId = generateId('env');
        const e: Environment = {
          id: envId,
          projectId: activeProject.id,
          name: el.name,
          code: `ENV-00${environments.length + newEnvironments.length + 1}`,
          description: el.description,
          locationType: el.interiorExterior === 'INT' ? 'interior' : el.interiorExterior === 'EXT' ? 'exterior' : 'mixed',
          architecture: 'Authentic regional architecture',
          furnitureAndDecor: 'Everyday regional props and furniture',
          keyProps: el.keyProps || [],
          lightingMood: el.lighting,
          colorPalette: ['#1E293B', '#F59E0B'],
          defaultTime: el.timeOfDay === 'Night' ? 'night' : 'day',
          defaultWeather: 'sunny',
          isLocked: false,
          references: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        await saveEnvironment(e);
        newEnvironments.push(e);
      }
    }
    const allEnvs = [...environments, ...newEnvironments];
    setEnvironments(allEnvs);

    // 3. Create Scene Cards (Cleanly replace existing scenes so duplicate runs do not accumulate)
    const newScenes = createScenesFromScriptAnalysis(
      activeProject.id,
      analysis.scenes,
      allChars,
      allEnvs,
      activeProject.settings
    );

    await replaceProjectScenes(activeProject.id, newScenes);
    setScenes(newScenes);

    // Update Project Stats
    const updatedProj: Project = {
      ...activeProject,
      stats: {
        ...activeProject.stats,
        totalScenes: newScenes.length,
        totalCharacters: allChars.length,
        totalEnvironments: allEnvs.length,
      },
      updatedAt: Date.now(),
    };
    await updateProject(updatedProj);
    setProjects(projects.map((p) => (p.id === updatedProj.id ? updatedProj : p)));

    if (autoGenerate) {
      setActiveView('scene_generator');
      setTimeout(async () => {
        const freshScenes = await getScenes(activeProject.id);
        for (const sc of freshScenes) {
          await handleQueueGeneration(sc, 'google_flow');
        }
        await loadProjectData(activeProject.id);
      }, 200);
    } else {
      setActiveView('storyboard');
    }
  };

  const handleSaveCharacter = async (char: Character) => {
    await saveCharacter(char);
    const updated = characters.some((c) => c.id === char.id)
      ? characters.map((c) => (c.id === char.id ? char : c))
      : [...characters, char];
    setCharacters(updated);
    refreshStorage();
  };

  const handleDeleteCharacter = async (id: string, skipConfirm = false) => {
    if (skipConfirm || window.confirm('Delete this character profile?')) {
      await deleteCharacter(id);
      setCharacters((prev) => prev.filter((c) => c.id !== id));
      refreshStorage();
    }
  };

  const handleCleanBogusCharacters = async () => {
    if (!activeProject) return;
    const currentChars = await getCharacters(activeProject.id);
    const bogus = currentChars.filter((c) => {
      const u = c.name.toUpperCase().trim();
      return (
        u.startsWith('দৃশ্য') ||
        u.startsWith('চরিত্র') ||
        u.startsWith('SCENE') ||
        u === 'AI EXPERT' ||
        u === 'এআই স্পেশালিস্ট' ||
        u === 'বউ' ||
        u === 'LEAD ACTOR' ||
        u.startsWith('CHAR-')
      );
    });

    for (const b of bogus) {
      await deleteCharacter(b.id);
    }

    const remainingChars = currentChars.filter((c) => !bogus.some((b) => b.id === c.id));
    setCharacters(remainingChars);

    // Re-link all scenes to remaining valid characters (like Tanvir!)
    if (remainingChars.length > 0) {
      const primaryChar = remainingChars.find((c) => 
        c.references?.some((r) => r.imageUrl && !r.imageUrl.startsWith('data:image/svg'))
      ) || remainingChars[0];

      const currentScenes = await getScenes(activeProject.id);
      let scenesUpdated = false;
      for (const sc of currentScenes) {
        const hasValidChar = sc.characterIds.some((cid) => remainingChars.some((rc) => rc.id === cid));
        if (!hasValidChar) {
          sc.characterIds = [primaryChar.id];
          await saveScene(sc);
          scenesUpdated = true;
        }
      }
      if (scenesUpdated) {
        const fresh = await getScenes(activeProject.id);
        setScenes(fresh);
      }
    }

    refreshStorage();
    alert(`✓ Cleaned ${bogus.length} bogus characters! Scenes are now mapped to "${remainingChars[0]?.name || 'Tanvir'}".`);
  };

  const handleSaveEnvironment = async (env: Environment) => {
    await saveEnvironment(env);
    const updated = environments.some((e) => e.id === env.id)
      ? environments.map((e) => (e.id === env.id ? env : e))
      : [...environments, env];
    setEnvironments(updated);
    refreshStorage();
  };

  const handleDeleteEnvironment = async (id: string) => {
    if (window.confirm('Delete this environment location?')) {
      await deleteEnvironment(id);
      setEnvironments(environments.filter((e) => e.id !== id));
      refreshStorage();
    }
  };

  const handleSaveScenes = async (updatedScenes: StoryboardScene[]) => {
    await saveScenes(updatedScenes);
    setScenes(updatedScenes);
  };

  const handleQueueGeneration = async (
    scene: StoryboardScene,
    provider: 'google_flow' | 'gemini_veo' | 'mock_simulation'
  ) => {
    if (!activeProject) return;

    const jobId = generateId('job');
    const newJob: GenerationJob = {
      id: jobId,
      projectId: activeProject.id,
      sceneId: scene.id,
      sceneTitle: `Scene ${scene.sceneNumber}: ${scene.title}`,
      provider: provider === 'google_flow' ? 'google_flow' : 'mock_simulation',
      model: provider === 'google_flow' ? 'Veo / Flow Engine' : 'Simulation Engine',
      prompt: scene.prompts.flowPrompt,
      referenceImages: [],
      status: 'generating',
      progressPercent: 20,
      statusMessage: 'Synthesizing scene frames with character likeness...',
      retryCount: 0,
      maxRetries: 3,
      createdAt: Date.now(),
    };

    await createJob(newJob);
    setJobs([newJob, ...jobs]);

    // Send prompt to connected Google Flow or AI Studio tab if active
    if (flowSession?.tabId) {
      chrome.tabs.sendMessage(
        flowSession.tabId,
        { type: 'FLOW_AUTOFILL_PROMPT', payload: { prompt: scene.prompts.flowPrompt } },
        () => {}
      );
    }

    try {
      // Find character & environment anchors for realistic synthesis
      const currentChars = await getCharacters(activeProject.id);
      const currentEnvs = await getEnvironments(activeProject.id);

      // Smart Character Likeness Anchor:
      // 1. If scene has specific characterIds, find that character
      let matchedChar = currentChars.find((c) => scene.characterIds && scene.characterIds.includes(c.id));

      // 2. If no match yet or character doesn't have reference images, check if scene dialogue/action/title mentions a character by name
      const sceneText = `${scene.title} ${scene.action} ${scene.dialogue} ${scene.prompts?.flowPrompt || ''}`.toLowerCase();
      if (!matchedChar || !matchedChar.references?.length) {
        const textMatched = currentChars.find((c) => c.name && sceneText.includes(c.name.toLowerCase()));
        if (textMatched && textMatched.references?.length) {
          matchedChar = textMatched;
        }
      }

      // 3. Prefer any character that has a user-uploaded face reference (e.g. Tanvir!)
      if (!matchedChar || !matchedChar.references?.length) {
        const uploadedChar = currentChars.find((c) =>
          c.references?.some((r) => r.imageUrl && !r.imageUrl.startsWith('data:image/svg'))
        );
        if (uploadedChar) matchedChar = uploadedChar;
      }

      if (!matchedChar) matchedChar = currentChars[0];

      const matchedEnv = currentEnvs.find((e) => e.id === scene.environmentId) || currentEnvs[0];

      // Generate real cinematic video stream & blob
      const videoBlob = await generateSceneSyntheticVideo(scene, matchedChar, matchedEnv);
      const blobKey = await saveAssetBlob(`video-scene-${scene.sceneNumber}`, 'video/mp4', videoBlob);
      const videoUrl = URL.createObjectURL(videoBlob);

      // Update scene with generated video
      const updatedScene: StoryboardScene = {
        ...scene,
        videoUrl,
        videoBlobKey: blobKey,
        videoApproved: true,
        status: 'approved',
        updatedAt: Date.now(),
      };
      await saveScene(updatedScene);

      // Load all scenes from DB so no scene is ever overwritten or lost
      const latestScenes = await getScenes(activeProject.id);
      for (const s of latestScenes) {
        if (s.id === scene.id) {
          s.videoUrl = videoUrl;
          s.videoBlobKey = blobKey;
          s.videoApproved = true;
          s.status = 'approved';
        } else if (s.videoBlobKey && !s.videoUrl) {
          try {
            s.videoUrl = (await createAssetUrl(s.videoBlobKey)) || '';
          } catch (_) {}
        }
      }
      setScenes([...latestScenes]);

      // Sync directly into Video Timeline from DB so Editor has ALL clips ready
      let currentTimeline = await getTimeline(activeProject.id);
      if (!currentTimeline) {
        currentTimeline = {
          id: generateId('timeline'),
          projectId: activeProject.id,
          videoClips: [],
          audioClips: [],
          subtitles: [],
          subtitleStyle: {
            fontFamily: 'Inter',
            fontSize: 24,
            color: '#FFFFFF',
            backgroundColor: 'rgba(0,0,0,0.6)',
            outlineColor: '#000000',
            outlineWidth: 2,
            position: 'bottom',
            burnIn: true,
          },
          totalDurationSeconds: 0,
          updatedAt: Date.now(),
        };
      }

      for (const clip of currentTimeline.videoClips) {
        if (clip.blobKey && !clip.videoUrl) {
          try {
            clip.videoUrl = (await createAssetUrl(clip.blobKey)) || '';
          } catch (_) {}
        }
      }

      const existingIdx = currentTimeline.videoClips.findIndex((c) => c.sceneId === scene.id);
      const newClip: VideoClip = {
        id: `clip-${scene.id}`,
        sceneId: scene.id,
        title: `Scene ${scene.sceneNumber}: ${scene.title}`,
        videoUrl,
        blobKey,
        sourceDuration: scene.durationSeconds || 5,
        trimStart: 0,
        trimEnd: 0,
        playbackRate: 1.0,
        volume: 1.0,
        order: scene.order,
        transitionIn: 'cut',
        transitionDuration: 0.5,
      };

      const updatedClips = [...currentTimeline.videoClips];
      if (existingIdx >= 0) {
        updatedClips[existingIdx] = newClip;
      } else {
        updatedClips.push(newClip);
      }
      updatedClips.sort((a, b) => a.order - b.order);

      // Also ensure subtitles exist for this scene if dialogue exists
      const updatedSubs = [...(currentTimeline.subtitles || [])];
      if (scene.dialogue && scene.dialogue.trim()) {
        const subIdx = updatedSubs.findIndex((s) => s.sceneId === scene.id);
        const subItem = {
          id: `sub-${scene.id}`,
          sceneId: scene.id,
          startTime: 0.5,
          endTime: (scene.durationSeconds || 5) - 0.5,
          text: scene.dialogue,
        };
        if (subIdx >= 0) {
          updatedSubs[subIdx] = subItem;
        } else {
          updatedSubs.push(subItem);
        }
      }

      const totalDur = updatedClips.reduce((acc, c) => acc + (c.sourceDuration - c.trimStart - c.trimEnd), 0);
      const updatedTl: VideoTimeline = {
        ...currentTimeline,
        videoClips: updatedClips,
        subtitles: updatedSubs,
        totalDurationSeconds: totalDur,
        updatedAt: Date.now(),
      };
      await saveTimeline(updatedTl);
      setTimeline(updatedTl);

      // Mark Job completed
      await updateJobStatus(jobId, 'completed', 100, 'Video generated & attached to scene!', {
        outputVideoUrl: videoUrl,
        outputBlobKey: blobKey,
      });
      const finalJobs = await getJobsByProject(activeProject.id);
      setJobs(finalJobs);
      refreshStorage();
    } catch (err: any) {
      console.error('Generation error:', err);
      await updateJobStatus(jobId, 'failed', 0, err.message || 'Generation failed');
      const finalJobs = await getJobsByProject(activeProject.id);
      setJobs(finalJobs);
    }
  };

  const handleImportSceneVideo = async (sceneId: string, videoUrl: string, blob?: Blob) => {
    const matched = scenes.find((s) => s.id === sceneId);
    if (!matched) return;

    let blobKey: string | undefined = undefined;
    if (blob) {
      blobKey = await saveAssetBlob(`video-scene-${matched.sceneNumber}`, 'video/mp4', blob);
      refreshStorage();
    }

    const updatedScene: StoryboardScene = {
      ...matched,
      videoUrl,
      videoBlobKey: blobKey,
      videoApproved: true,
      status: 'approved',
      updatedAt: Date.now(),
    };

    await saveScene(updatedScene);
    setScenes(scenes.map((s) => (s.id === sceneId ? updatedScene : s)));

    // Sync into timeline
    const currentTimeline: VideoTimeline = timeline || {
      id: generateId('timeline'),
      projectId: activeProject.id,
      videoClips: [],
      audioClips: [],
      subtitles: [],
      subtitleStyle: {
        fontFamily: 'Inter',
        fontSize: 24,
        color: '#FFFFFF',
        backgroundColor: 'rgba(0,0,0,0.6)',
        outlineColor: '#000000',
        outlineWidth: 2,
        position: 'bottom',
        burnIn: true,
      },
      totalDurationSeconds: 0,
      updatedAt: Date.now(),
    };
    const existingIdx = currentTimeline.videoClips.findIndex((c) => c.sceneId === sceneId);
    const newClip: VideoClip = {
      id: `clip-${matched.id}`,
      sceneId: matched.id,
      title: `Scene ${matched.sceneNumber}: ${matched.title}`,
      videoUrl,
      blobKey,
      sourceDuration: matched.durationSeconds || 5,
      trimStart: 0,
      trimEnd: 0,
      playbackRate: 1.0,
      volume: 1.0,
      order: matched.order,
      transitionIn: 'cut',
      transitionDuration: 0.5,
    };
    const updatedClips = [...currentTimeline.videoClips];
    if (existingIdx >= 0) {
      updatedClips[existingIdx] = newClip;
    } else {
      updatedClips.push(newClip);
    }
    updatedClips.sort((a, b) => a.order - b.order);
    const totalDur = updatedClips.reduce((acc, c) => acc + (c.sourceDuration - c.trimStart - c.trimEnd), 0);
    const updatedTl: VideoTimeline = {
      ...currentTimeline,
      videoClips: updatedClips,
      totalDurationSeconds: totalDur,
      updatedAt: Date.now(),
    };
    await saveTimeline(updatedTl);
    setTimeline(updatedTl);
  };

  const handleGenerateAllScenes = async (forceRegenerate = true) => {
    if (!activeProject) return;
    const currentScenes = await getScenes(activeProject.id);
    if (currentScenes.length === 0) return;
    for (const sc of currentScenes) {
      if (forceRegenerate || !sc.videoUrl) {
        await handleQueueGeneration(sc, 'google_flow');
      }
    }
    await loadProjectData(activeProject.id);
  };

  const handleSaveTimeline = async (tl: VideoTimeline) => {
    await saveTimeline(tl);
    setTimeline(tl);
  };

  const handleExportBackup = (proj: Project) => {
    const data = {
      project: proj,
      script,
      characters,
      environments,
      scenes,
      timeline,
      exportedAt: Date.now(),
      version: '1.0.0',
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${proj.name.replace(/[^a-zA-Z0-9]/g, '_')}_backup.json`;
    a.click();
  };

  const handleImportBackup = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (parsed.project && parsed.project.id) {
        const db = await getDB();
        await db.put('projects', parsed.project);
        if (parsed.script) await db.put('scripts', parsed.script);
        if (parsed.characters) {
          for (const c of parsed.characters) await db.put('characters', c);
        }
        if (parsed.environments) {
          for (const e of parsed.environments) await db.put('environments', e);
        }
        if (parsed.scenes) {
          for (const s of parsed.scenes) await db.put('storyboard_scenes', s);
        }
        if (parsed.timeline) await db.put('video_timelines', parsed.timeline);

        alert(`Successfully imported project: "${parsed.project.name}"`);
        initApp();
      }
    } catch (err) {
      alert('Invalid backup file. Ensure it is valid JSON from CineForge AI.');
    }
  };

  const handleClearStorage = async () => {
    const db = await getDB();
    await db.clear('asset_blobs');
    await refreshStorage();
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#05070D] text-slate-100 font-sans">
      {/* 1. Left Sidebar with all 17 menu items */}
      <Sidebar
        activeView={activeView}
        onSelectView={setActiveView}
        queueCount={jobs.filter((j) => j.status === 'generating' || j.status === 'waiting').length}
        flowConnected={flowSession?.status === 'ready' || flowSession?.status === 'generating'}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* 2. Top Navigation */}
        <TopNav
          projects={projects}
          activeProject={activeProject}
          onSelectProject={(id) => {
            setActiveProjectId(id);
            loadProjectData(id);
          }}
          onNewMovie={() => setActiveView('new_movie')}
          onOpenExport={() => setActiveView('editor')}
          onOpenSettings={() => setActiveView('settings')}
          flowSession={flowSession}
          activeJobCount={jobs.filter((j) => j.status === 'generating').length}
        />

        {/* 3. Dynamic Page View */}
        <main className="flex-1 overflow-y-auto bg-[#05070D]">
          {activeView === 'dashboard' && (
            <DashboardHome
              projects={projects}
              activeProject={activeProject}
              flowSession={flowSession}
              activeJobs={jobs.filter((j) => j.status === 'generating' || j.status === 'waiting')}
              storageInfo={storageInfo}
              onNavigate={setActiveView}
              onNewMovie={() => setActiveView('new_movie')}
            />
          )}

          {activeView === 'new_movie' && (
            <NewMovieView
              onCreateProject={handleCreateProject}
              onCancel={() => setActiveView('dashboard')}
              onSuccess={(p) => {
                setActiveProjectId(p.id);
                setActiveView('script_studio');
              }}
            />
          )}

          {activeView === 'projects' && (
            <MyProjectsView
              projects={projects}
              activeProjectId={activeProjectId}
              onSelectProject={(id) => {
                setActiveProjectId(id);
                setActiveView('dashboard');
              }}
              onNewMovie={() => setActiveView('new_movie')}
              onDeleteProject={handleDeleteProject}
              onDuplicateProject={handleDuplicateProject}
              onExportBackup={handleExportBackup}
              onImportBackup={handleImportBackup}
            />
          )}

          {activeView === 'script_studio' && (
            <ScriptStudioView
              project={activeProject}
              script={script}
              onSaveScript={handleSaveScript}
              onApplyToStoryboard={handleApplyScriptToStoryboard}
              onNavigateToSceneGenerator={() => setActiveView('scene_generator')}
            />
          )}

          {activeView === 'character_studio' && (
            <CharacterStudioView
              project={activeProject}
              characters={characters}
              onSaveCharacter={handleSaveCharacter}
              onDeleteCharacter={(id) => handleDeleteCharacter(id, true)}
              onCleanBogusCharacters={handleCleanBogusCharacters}
            />
          )}

          {activeView === 'environment_studio' && (
            <EnvironmentStudioView
              project={activeProject}
              environments={environments}
              onSaveEnvironment={handleSaveEnvironment}
              onDeleteEnvironment={handleDeleteEnvironment}
            />
          )}

          {activeView === 'storyboard' && (
            <StoryboardView
              project={activeProject}
              scenes={scenes}
              characters={characters}
              environments={environments}
              onSaveScenes={handleSaveScenes}
              onGenerateSceneVideo={(sc) => handleQueueGeneration(sc, 'google_flow')}
              onGenerateAllScenes={handleGenerateAllScenes}
              onNavigateToSceneGenerator={(scId) => {
                setSelectedSceneIdForGenerator(scId);
                setActiveView('scene_generator');
              }}
              onNavigateToEditor={() => setActiveView('editor')}
            />
          )}

          {activeView === 'scene_generator' && (
            <SceneGeneratorView
              project={activeProject}
              scenes={scenes}
              characters={characters}
              environments={environments}
              flowSession={flowSession}
              onQueueGeneration={handleQueueGeneration}
              onImportSceneVideo={handleImportSceneVideo}
              initialSelectedSceneId={selectedSceneIdForGenerator}
              onGenerateAllScenes={handleGenerateAllScenes}
              onNavigateToEditor={() => setActiveView('editor')}
              onUpdateScene={async (sc) => {
                await saveScene(sc);
                setScenes(scenes.map((s) => (s.id === sc.id ? sc : s)));
              }}
            />
          )}

          {activeView === 'queue' && (
            <ProductionQueueView
              project={activeProject}
              jobs={jobs}
              onRetryJob={async (jobId) => {
                await updateJobStatus(jobId, 'waiting', 0, 'Retrying generation...');
                setJobs(await getJobsByProject(activeProjectId));
              }}
              onCancelJob={async (jobId) => {
                await updateJobStatus(jobId, 'cancelled', 0, 'Cancelled by user');
                setJobs(await getJobsByProject(activeProjectId));
              }}
              onClearCompleted={async () => {
                const db = await getDB();
                for (const j of jobs) {
                  if (j.status === 'completed' || j.status === 'cancelled') {
                    await db.delete('generation_jobs', j.id);
                  }
                }
                setJobs(await getJobsByProject(activeProjectId));
              }}
              onOpenManualHandoff={(j) => {
                setActiveView('scene_generator');
              }}
            />
          )}

          {activeView === 'voice_studio' && (
            <VoiceStudioView
              project={activeProject}
              characters={characters}
              onSaveCharacter={handleSaveCharacter}
            />
          )}

          {activeView === 'audio_studio' && (
            <AudioStudioView project={activeProject} />
          )}

          {activeView === 'editor' && (
            <CinematicEditorView
              project={activeProject}
              timeline={timeline}
              scenes={scenes}
              onSaveTimeline={handleSaveTimeline}
            />
          )}

          {activeView === 'assets' && (
            <AssetLibraryView
              project={activeProject}
              characters={characters}
              environments={environments}
              scenes={scenes}
              storageInfo={storageInfo}
              onRefreshStorage={refreshStorage}
            />
          )}

          {activeView === 'google_flow' && (
            <GoogleFlowView
              flowSession={flowSession}
              onRefreshStatus={refreshFlowStatus}
            />
          )}

          {activeView === 'ai_models' && (
            <AIModelsView
              providers={providers}
              onSaveProvider={async (p) => {
                await saveProviderConfig(p);
                setProviders(await getRegisteredProviders());
              }}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView
              storageInfo={storageInfo}
              onClearStorage={handleClearStorage}
              onExportAllBackup={() => {
                if (activeProject) handleExportBackup(activeProject);
              }}
            />
          )}

          {activeView === 'help' && <HelpDocsView />}
        </main>
      </div>
    </div>
  );
};

export default App;
