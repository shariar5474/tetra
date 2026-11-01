import React, { useState } from 'react';
import {
  Sparkles,
  Cpu,
  Copy,
  Check,
  ExternalLink,
  Upload,
  Play,
  Film,
  AlertCircle,
  FileCode,
  Layers,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Scissors,
  Wand2,
} from 'lucide-react';
import { StoryboardScene } from '../../shared/types/storyboard';
import { Character } from '../../shared/types/character';
import { Environment } from '../../shared/types/environment';
import { Project } from '../../shared/types/project';
import { FlowSessionState, ManualHandoffData } from '../../shared/types/flow';
import { copyToClipboard } from '../../shared/utils/helpers';
import { openOfficialFlowTab } from '../../flow/flow-detector';
import { speakDialogue, stopDialogueSpeech } from '../../shared/utils/speech-service';

interface SceneGeneratorViewProps {
  project?: Project;
  scenes: StoryboardScene[];
  characters: Character[];
  environments: Environment[];
  flowSession?: FlowSessionState;
  onQueueGeneration: (scene: StoryboardScene, provider: 'google_flow' | 'gemini_veo' | 'mock_simulation') => Promise<void>;
  onImportSceneVideo: (sceneId: string, videoUrl: string, blob?: Blob) => Promise<void>;
  onNavigateToEditor?: () => void;
  initialSelectedSceneId?: string;
  onGenerateAllScenes?: () => Promise<void>;
  onUpdateScene?: (scene: StoryboardScene) => Promise<void>;
}

export const SceneGeneratorView: React.FC<SceneGeneratorViewProps> = ({
  project,
  scenes,
  characters,
  environments,
  flowSession,
  onQueueGeneration,
  onImportSceneVideo,
  onNavigateToEditor,
  initialSelectedSceneId,
  onGenerateAllScenes,
  onUpdateScene,
}) => {
  const [selectedSceneId, setSelectedSceneId] = useState<string>(initialSelectedSceneId || scenes[0]?.id || '');
  const [activePromptTab, setActivePromptTab] = useState<'flow' | 'detailed' | 'short' | 'api' | 'manual'>('flow');
  const [copied, setCopied] = useState(false);
  const [handoffModal, setHandoffModal] = useState<ManualHandoffData | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generationMsg, setGenerationMsg] = useState('');

  React.useEffect(() => {
    if (initialSelectedSceneId) {
      setSelectedSceneId(initialSelectedSceneId);
    }
  }, [initialSelectedSceneId]);

  const selectedScene = scenes.find((s) => s.id === selectedSceneId) || scenes[0];
  const env = environments.find((e) => e.id === selectedScene?.environmentId);
  const activeChars = characters.filter((c) => selectedScene?.characterIds.includes(c.id));

  const handleCopyPrompt = async (text: string) => {
    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartGeneration = async () => {
    if (!selectedScene) return;
    setGenerating(true);
    setGenerationMsg('Synthesizing cinematic frames, character anchors & audio track...');

    try {
      await onQueueGeneration(selectedScene, 'google_flow');
      setGenerationMsg('Cinematic video generated successfully!');
      setTimeout(() => setGenerationMsg(''), 3000);
    } catch (err: any) {
      console.error(err);
      setGenerationMsg('Generation encountered an issue.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSendToFlowAndSwitch = async () => {
    if (!selectedScene) return;
    const prompt = selectedScene.prompts.flowPrompt;

    // Autofill into connected tab
    if (flowSession?.tabId) {
      chrome.tabs.sendMessage(
        flowSession.tabId,
        { type: 'FLOW_AUTOFILL_PROMPT', payload: { prompt } },
        () => {}
      );
      // Switch focus to Flow tab
      await chrome.tabs.update(flowSession.tabId, { active: true });
      if (typeof chrome.windows !== 'undefined') {
        const tab = await chrome.tabs.get(flowSession.tabId);
        if (tab.windowId) {
          await chrome.windows.update(tab.windowId, { focused: true });
        }
      }
    } else {
      // If no tab connected yet, open Flow and copy prompt
      await copyToClipboard(prompt);
      await openOfficialFlowTab();
    }
  };

  const handleVideoImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedScene) return;

    try {
      const url = URL.createObjectURL(file);
      await onImportSceneVideo(selectedScene.id, url, file);
      setHandoffModal(null);
      setGenerationMsg('Video file imported into scene successfully!');
      setTimeout(() => setGenerationMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFetchVideoFromFlow = async () => {
    if (!selectedScene) return;
    if (!flowSession?.tabId) {
      setGenerationMsg('Please connect your Google Flow or AI Studio tab first.');
      setTimeout(() => setGenerationMsg(''), 3000);
      return;
    }
    setGenerationMsg('Scanning connected Flow tab for generated video...');
    chrome.tabs.sendMessage(flowSession.tabId, { type: 'FLOW_DOM_INSPECT' }, async (response) => {
      if (response?.data?.videoUrl) {
        await onImportSceneVideo(selectedScene.id, response.data.videoUrl);
        setGenerationMsg('✓ Video successfully imported from Google Flow tab!');
        setTimeout(() => setGenerationMsg(''), 3500);
      } else {
        setGenerationMsg('No completed video found in Flow tab yet. Please click Generate in Flow first.');
        setTimeout(() => setGenerationMsg(''), 4000);
      }
    });
  };

  if (scenes.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400">
        No scenes available. Create scenes in Script Studio or Storyboard first.
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            AI Scene Production & Prompt Engine
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Scene Video Generator</h1>
          <p className="text-xs text-slate-400">
            Generate and preview cinematic shots with locked character likeness, camera movements, and direct Google Flow integration.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onGenerateAllScenes && scenes.some((s) => !s.videoUrl) && (
            <button
              onClick={async () => {
                setGenerating(true);
                setGenerationMsg('Batch producing all pending shots with character likeness...');
                await onGenerateAllScenes();
                setGenerating(false);
                setGenerationMsg('All shots produced successfully!');
                setTimeout(() => setGenerationMsg(''), 3000);
              }}
              disabled={generating}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
              <span>⚡ Generate All Scenes</span>
            </button>
          )}

          <button
            onClick={handleSendToFlowAndSwitch}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-semibold transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-purple-300" />
            <span>Send to Flow</span>
          </button>
          <button
            onClick={handleFetchVideoFromFlow}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 text-xs font-semibold transition-colors cursor-pointer"
            title="Scan connected Flow/AI Studio tab and import generated video"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fetch from Flow</span>
          </button>
          <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Import MP4</span>
            <input type="file" accept="video/mp4,video/webm" className="hidden" onChange={handleVideoImportFile} />
          </label>
          {scenes.some((s) => s.videoUrl) && onNavigateToEditor && (
            <button
              onClick={onNavigateToEditor}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer"
            >
              <Scissors className="w-3.5 h-3.5 text-cyan-400" />
              <span>Timeline Editor</span>
            </button>
          )}
        </div>
      </div>

      {generationMsg && (
        <div className="p-3 bg-cyan-950/40 border border-cyan-500/40 rounded-xl text-xs text-cyan-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 animate-spin" />
          <span>{generationMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Scene Selector List */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Scenes ({scenes.length})
          </span>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {scenes.map((sc) => {
              const isSelected = sc.id === selectedScene?.id;
              return (
                <div
                  key={sc.id}
                  onClick={() => setSelectedSceneId(sc.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-950/20 shadow-md shadow-cyan-500/10'
                      : 'border-slate-800 bg-[#080C14] hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-cyan-400">#{sc.sceneNumber}</span>
                      <span className="text-xs font-bold text-white line-clamp-1">{sc.title}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {sc.cameraAngle.replace(/_/g, ' ')} • {sc.durationSeconds}s
                    </div>
                  </div>
                  {sc.videoUrl ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-[9px] font-bold text-emerald-400 uppercase">
                      VIDEO READY
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[9px] text-slate-500 uppercase">
                      PENDING
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Main Video Monitor & Prompt Inspector */}
        {selectedScene && (
          <div className="lg:col-span-2 space-y-6">
            {/* HERO VIDEO MONITOR: Where the generated video actually plays! */}
            <div className="glass-card rounded-2xl border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                    SCENE {selectedScene.sceneNumber}
                  </span>
                  <h2 className="text-base font-bold text-white">{selectedScene.title}</h2>
                </div>
                {selectedScene.videoUrl && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Cinematic Video Active
                  </span>
                )}
              </div>

              {/* Video Player or Generation Hero Area */}
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-slate-800">
                {selectedScene.videoUrl ? (
                  <video
                    key={selectedScene.videoUrl}
                    src={selectedScene.videoUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-contain"
                    onPlay={() => {
                      if (selectedScene.dialogue) {
                        speakDialogue(selectedScene.dialogue);
                      }
                    }}
                    onPause={() => stopDialogueSpeech()}
                  />
                ) : (
                  <div className="p-8 text-center space-y-4 max-w-md">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
                      <Film className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">No Video Generated Yet for Scene {selectedScene.sceneNumber}</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Click "Generate Scene Video Now" to synthesize this shot with character likeness and audio, or send the prompt to Google Flow.
                      </p>
                    </div>

                    <button
                      onClick={handleStartGeneration}
                      disabled={generating}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-lg shadow-blue-500/30 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {generating ? (
                        <>
                          <Wand2 className="w-4 h-4 animate-spin" />
                          <span>Rendering Scene Frames...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Generate Scene Video Now</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Action Toolbar under Video */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleStartGeneration}
                    disabled={generating}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{selectedScene.videoUrl ? 'Regenerate Scene Video' : 'Generate Video'}</span>
                  </button>
                  <button
                    onClick={handleSendToFlowAndSwitch}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Send to Flow</span>
                  </button>
                  <button
                    onClick={handleFetchVideoFromFlow}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold cursor-pointer"
                    title="Import completed video from Google Flow tab"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Fetch Video</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Import MP4</span>
                    <input type="file" accept="video/mp4,video/webm" className="hidden" onChange={handleVideoImportFile} />
                  </label>
                  {selectedScene.videoUrl && onNavigateToEditor && (
                    <button
                      onClick={onNavigateToEditor}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium cursor-pointer"
                    >
                      <Scissors className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Edit in Timeline</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Consistency Anchors Card */}
            <div className="glass-card p-5 rounded-xl border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Active Continuity Anchors for this Scene
                </span>
                {onUpdateScene && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">Featured Actor:</span>
                    <select
                      value={selectedScene.characterIds[0] || ''}
                      onChange={(e) => onUpdateScene({ ...selectedScene, characterIds: [e.target.value] })}
                      className="px-2.5 py-1 bg-[#05070D] border border-slate-700 rounded-lg text-cyan-300 font-semibold text-xs focus:outline-none"
                    >
                      {characters.map((c) => {
                        const hasReal = c.references?.some((r) => r.imageUrl && !r.imageUrl.startsWith('data:image/svg'));
                        return (
                          <option key={c.id} value={c.id}>
                            {c.name} {hasReal ? '📸 (Real Face Photo)' : '✨ (AI Actor)'}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {activeChars.map((c) => {
                  const face = c.references.find((r) => r.isPrimaryFace) || c.references[0];
                  return (
                    <div key={c.id} className="flex items-center gap-2 p-2 rounded-lg bg-[#05070D] border border-slate-800">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                        {face ? <img src={face.imageUrl} alt={c.name} className="w-full h-full object-cover" /> : null}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1">
                          <span>{c.name}</span>
                          {c.isLocked && <span className="text-[9px] text-emerald-400">🔒 LOCKED</span>}
                        </div>
                        <div className="text-[10px] text-slate-400">{c.costumes[0]?.name || 'Signature Costume'}</div>
                      </div>
                    </div>
                  );
                })}
                {env && (
                  <div className="p-2 rounded-lg bg-[#05070D] border border-slate-800 text-xs">
                    <span className="font-bold text-white">{env.name}</span>
                    <span className="text-[10px] text-slate-400 block">{selectedScene.lightingMood}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Prompt Engine Inspector Tabs */}
            <div className="glass-card rounded-xl border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                  {[
                    { key: 'flow', label: 'Flow Prompt (Veo Optimized)' },
                    { key: 'detailed', label: 'Detailed Cinematic Prompt' },
                    { key: 'short', label: 'Short Prompt' },
                    { key: 'manual', label: 'Manual Copy Block' },
                    { key: 'api', label: 'Official API JSON' },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActivePromptTab(tab.key as any)}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                        activePromptTab === tab.key
                          ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    const textToCopy =
                      activePromptTab === 'flow'
                        ? selectedScene.prompts.flowPrompt
                        : activePromptTab === 'detailed'
                        ? selectedScene.prompts.detailedPrompt
                        : activePromptTab === 'short'
                        ? selectedScene.prompts.shortPrompt
                        : activePromptTab === 'manual'
                        ? selectedScene.prompts.manualCopyPrompt
                        : selectedScene.prompts.apiPrompt;
                    handleCopyPrompt(textToCopy);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              {/* Active Prompt Box */}
              <div className="p-4 bg-[#05070D] border border-slate-800 rounded-lg text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                {activePromptTab === 'flow' && selectedScene.prompts.flowPrompt}
                {activePromptTab === 'detailed' && selectedScene.prompts.detailedPrompt}
                {activePromptTab === 'short' && selectedScene.prompts.shortPrompt}
                {activePromptTab === 'manual' && selectedScene.prompts.manualCopyPrompt}
                {activePromptTab === 'api' && selectedScene.prompts.apiPrompt}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
