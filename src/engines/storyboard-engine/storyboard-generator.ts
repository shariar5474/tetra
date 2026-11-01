import { StoryboardScene, ScenePrompts } from '../../shared/types/storyboard';
import { ExtractedScene } from '../../shared/types/script';
import { Character } from '../../shared/types/character';
import { Environment } from '../../shared/types/environment';
import { ProjectSettings } from '../../shared/types/project';
import { generateScenePrompts } from '../prompt-engine/prompt-generator';
import { generateId } from '../../shared/utils/helpers';

export function createScenesFromScriptAnalysis(
  projectId: string,
  extractedScenes: ExtractedScene[],
  characters: Character[],
  environments: Environment[],
  projectSettings: ProjectSettings
): StoryboardScene[] {
  const result: StoryboardScene[] = [];

  extractedScenes.forEach((es, index) => {
    // Map character names to IDs
    const matchedCharIds = characters
      .filter(c => es.characterNames.some(name => c.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(c.name.toLowerCase())))
      .map(c => c.id);

    // If none matched, assign primary character
    const assignedCharIds = matchedCharIds.length > 0 ? matchedCharIds : characters.slice(0, 1).map(c => c.id);

    // Map location to environment
    const matchedEnv = environments.find(e => 
      e.name.toLowerCase().includes(es.locationName.toLowerCase()) || es.locationName.toLowerCase().includes(e.name.toLowerCase())
    ) || environments[0];

    const sceneId = generateId('scene');
    const dummyPrompts: ScenePrompts = {
      shortPrompt: '',
      detailedPrompt: '',
      flowPrompt: '',
      apiPrompt: '',
      manualCopyPrompt: '',
      negativePrompt: '',
    };

    const scene: StoryboardScene = {
      id: sceneId,
      projectId,
      sceneNumber: es.sceneNumber || index + 1,
      title: es.title || `Scene ${index + 1}`,
      description: es.actionDescription || 'Cinematic scene',
      dialogue: es.dialogueSnippet || '',
      action: es.actionDescription || '',
      emotionalTone: es.emotionalTone || 'Cinematic Drama',
      characterIds: assignedCharIds,
      environmentId: matchedEnv?.id,
      cameraAngle: (index % 3 === 0 ? 'wide_shot' : index % 3 === 1 ? 'medium_shot' : 'close_up'),
      cameraMovement: (index % 2 === 0 ? 'slow_pan' : 'tracking'),
      lightingMood: es.timeOfDay?.toLowerCase().includes('night') ? 'Low-key atmospheric moonlight' : 'Golden warm natural light',
      timeOfDay: es.timeOfDay || 'Day',
      weather: 'Clear',
      durationSeconds: es.estimatedDurationSeconds || 5,
      storyboardImageApproved: false,
      prompts: dummyPrompts,
      videoApproved: false,
      continuityNotes: `Follows scene structure ${index + 1}`,
      status: 'draft',
      order: index + 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Generate full prompts for scene
    scene.prompts = generateScenePrompts({
      scene,
      projectSettings,
      characters,
      environment: matchedEnv,
      previousScene: result[index - 1],
    });

    result.push(scene);
  });

  return result;
}

export function splitScene(scene: StoryboardScene, splitPointRatio = 0.5): [StoryboardScene, StoryboardScene] {
  const firstDuration = Math.max(2, Math.round(scene.durationSeconds * splitPointRatio));
  const secondDuration = Math.max(2, scene.durationSeconds - firstDuration);

  const firstScene: StoryboardScene = {
    ...scene,
    title: `${scene.title} (Part A)`,
    durationSeconds: firstDuration,
    updatedAt: Date.now(),
  };

  const secondScene: StoryboardScene = {
    ...scene,
    id: generateId('scene'),
    sceneNumber: scene.sceneNumber + 1,
    title: `${scene.title} (Part B)`,
    durationSeconds: secondDuration,
    order: scene.order + 1,
    videoUrl: undefined,
    videoBlobKey: undefined,
    videoApproved: false,
    status: 'draft',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  return [firstScene, secondScene];
}

export function mergeScenes(sceneA: StoryboardScene, sceneB: StoryboardScene): StoryboardScene {
  return {
    ...sceneA,
    title: `${sceneA.title} & ${sceneB.title}`,
    action: `${sceneA.action} Then, ${sceneB.action}`,
    dialogue: sceneA.dialogue ? (sceneB.dialogue ? `${sceneA.dialogue} / ${sceneB.dialogue}` : sceneA.dialogue) : sceneB.dialogue,
    durationSeconds: sceneA.durationSeconds + sceneB.durationSeconds,
    characterIds: Array.from(new Set([...sceneA.characterIds, ...sceneB.characterIds])),
    updatedAt: Date.now(),
  };
}
