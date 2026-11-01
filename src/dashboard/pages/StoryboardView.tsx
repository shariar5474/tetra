import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Scissors,
  Copy,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Play,
  Film,
  Camera,
  Clock,
  Plus,
  RefreshCw,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { StoryboardScene, CameraAngle, CameraMovement } from '../../shared/types/storyboard';
import { Character } from '../../shared/types/character';
import { Environment } from '../../shared/types/environment';
import { Project } from '../../shared/types/project';
import { splitScene, mergeScenes } from '../../engines/storyboard-engine/storyboard-generator';
import { checkSceneContinuity } from '../../engines/continuity-engine/continuity-checker';

interface StoryboardViewProps {
  project?: Project;
  scenes: StoryboardScene[];
  characters: Character[];
  environments: Environment[];
  onSaveScenes: (scenes: StoryboardScene[]) => Promise<void>;
  onGenerateSceneVideo: (scene: StoryboardScene) => void;
  onGenerateAllScenes?: () => Promise<void>;
  onNavigateToSceneGenerator?: (sceneId: string) => void;
  onNavigateToEditor?: () => void;
}

export const StoryboardView: React.FC<StoryboardViewProps> = ({
  project,
  scenes,
  characters,
  environments,
  onSaveScenes,
  onGenerateSceneVideo,
  onGenerateAllScenes,
  onNavigateToSceneGenerator,
  onNavigateToEditor,
}) => {
  const [selectedSceneId, setSelectedSceneId] = useState<string>(scenes[0]?.id || '');
  const [batchGenerating, setBatchGenerating] = useState(false);

  const selectedScene = scenes.find((s) => s.id === selectedSceneId) || scenes[0];

  const handleToggleApprove = (scene: StoryboardScene) => {
    const updated = scenes.map((s) =>
      s.id === scene.id
        ? {
            ...s,
            videoApproved: !s.videoApproved,
            status: !s.videoApproved ? ('approved' as const) : ('review' as const),
            updatedAt: Date.now(),
          }
        : s
    );
    onSaveScenes(updated);
  };

  const handleSplit = (scene: StoryboardScene) => {
    const [partA, partB] = splitScene(scene);
    const index = scenes.findIndex((s) => s.id === scene.id);
    const updated = [...scenes];
    updated.splice(index, 1, partA, partB);
    updated.forEach((s, idx) => {
      s.sceneNumber = idx + 1;
      s.order = idx + 1;
    });
    onSaveScenes(updated);
    setSelectedSceneId(partA.id);
  };

  const handleMergeNext = (scene: StoryboardScene) => {
    const index = scenes.findIndex((s) => s.id === scene.id);
    if (index >= scenes.length - 1) return;
    const next = scenes[index + 1];
    const merged = mergeScenes(scene, next);
    const updated = [...scenes];
    updated.splice(index, 2, merged);
    updated.forEach((s, idx) => {
      s.sceneNumber = idx + 1;
      s.order = idx + 1;
    });
    onSaveScenes(updated);
    setSelectedSceneId(merged.id);
  };

  const handleDelete = (sceneId: string) => {
    const updated = scenes.filter((s) => s.id !== sceneId);
    updated.forEach((s, idx) => {
      s.sceneNumber = idx + 1;
      s.order = idx + 1;
    });
    onSaveScenes(updated);
    if (selectedSceneId === sceneId && updated.length > 0) {
      setSelectedSceneId(updated[0].id);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === scenes.length - 1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...scenes];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    updated.forEach((s, idx) => {
      s.sceneNumber = idx + 1;
      s.order = idx + 1;
    });
    onSaveScenes(updated);
  };

  const handleUpdateScene = (updatedFields: Partial<StoryboardScene>) => {
    if (!selectedScene) return;
    const updated = scenes.map((s) =>
      s.id === selectedScene.id ? { ...s, ...updatedFields, updatedAt: Date.now() } : s
    );
    onSaveScenes(updated);
  };

  const prevScene = scenes[scenes.findIndex((s) => s.id === selectedScene?.id) - 1];
  const continuity = selectedScene
    ? checkSceneContinuity(selectedScene, prevScene, characters, environments)
    : null;

  return (
    <div className="p-8 max-w-7xl mx-auto overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            Visual Storyboard Engine
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Storyboard Studio</h1>
          <p className="text-xs text-slate-400">
            Organize shots, verify continuity scores, and generate cinematic video clips scene by scene.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="text-xs text-slate-400">
            <span>Scenes: <strong className="text-white">{scenes.length}</strong></span>
            <span className="mx-1.5">•</span>
            <span>Generated: <strong className="text-emerald-400">{scenes.filter((s) => s.videoUrl).length}</strong></span>
          </div>

          {onGenerateAllScenes && scenes.length > 0 && (
            <button
              onClick={async () => {
                setBatchGenerating(true);
                await onGenerateAllScenes();
                setBatchGenerating(false);
              }}
              disabled={batchGenerating}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${batchGenerating ? 'animate-spin' : ''}`} />
              <span>{batchGenerating ? 'Rendering All Shots...' : '⚡ Generate All Videos'}</span>
            </button>
          )}

          {scenes.some((s) => s.videoUrl) && onNavigateToEditor && (
            <button
              onClick={onNavigateToEditor}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer"
            >
              <span>🎞 Open Timeline Editor</span>
            </button>
          )}
        </div>
      </div>

      {scenes.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl space-y-3">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <div className="text-sm font-semibold text-slate-300">No scenes in this storyboard yet.</div>
          <p className="text-xs text-slate-500">
            Analyze your screenplay in Script Studio to generate scene cards automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scene Cards List (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {scenes.map((sc, idx) => {
              const isSelected = sc.id === selectedScene?.id;
              const env = environments.find((e) => e.id === sc.environmentId);
              const sceneChars = characters.filter((c) => sc.characterIds.includes(c.id));

              return (
                <div
                  key={sc.id}
                  onClick={() => setSelectedSceneId(sc.id)}
                  className={`glass-card rounded-xl p-5 border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-950/20 shadow-md shadow-cyan-500/10'
                      : 'border-slate-800 hover:border-slate-700 bg-[#080C14]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                          SCENE {sc.sceneNumber}
                        </span>
                        <h2 className="text-sm font-bold text-white line-clamp-1">{sc.title}</h2>
                        {sc.videoUrl ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 uppercase">
                            ▶ VIDEO READY
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                            PENDING
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{sc.action}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMove(idx, 'up');
                        }}
                        disabled={idx === 0}
                        title="Move Up"
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMove(idx, 'down');
                        }}
                        disabled={idx === scenes.length - 1}
                        title="Move Down"
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </div>
                  </div>

                  {/* Video Player Preview right in Card if Generated */}
                  {sc.videoUrl && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-slate-800 bg-black aspect-video max-h-48 flex items-center justify-center">
                      <video src={sc.videoUrl} controls className="w-full h-full object-contain" />
                    </div>
                  )}

                  {sc.dialogue && (
                    <div className="mt-2.5 p-2 rounded bg-[#05070D] border border-slate-800/80 text-[11px] text-cyan-200 italic font-mono">
                      "{sc.dialogue}"
                    </div>
                  )}

                  {/* Card Meta & Badges */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400 font-mono">
                    <div className="flex items-center gap-3">
                      <span>{sc.cameraAngle.replace(/_/g, ' ')}</span>
                      <span>•</span>
                      <span>{env?.name || 'Default Setting'}</span>
                      <span>•</span>
                      <span>{sc.durationSeconds}s</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {onNavigateToSceneGenerator && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToSceneGenerator(sc.id);
                          }}
                          className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium flex items-center gap-1 cursor-pointer border border-slate-700"
                          title="Open in Scene Generator (Prompts & Flow Handoff)"
                        >
                          <Eye className="w-3 h-3 text-cyan-400" />
                          <span>Inspect</span>
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onGenerateSceneVideo(sc);
                        }}
                        className="px-3 py-1 rounded-md bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-[10px] font-semibold flex items-center gap-1 shadow-sm shadow-blue-500/20 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{sc.videoUrl ? 'Regenerate Video' : 'Generate Video'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scene Inspector (1 col) */}
          {selectedScene && (
            <div className="space-y-4">
              <div className="glass-card rounded-xl border-slate-800 p-5 space-y-4 sticky top-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white">Scene {selectedScene.sceneNumber} Inspector</h3>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleApprove(selectedScene)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        selectedScene.videoApproved
                          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{selectedScene.videoApproved ? 'Approved' : 'Approve'}</span>
                    </button>
                  </div>
                </div>

                {/* Video Preview in Inspector */}
                {selectedScene.videoUrl ? (
                  <div className="space-y-2">
                    <div className="rounded-xl overflow-hidden border border-slate-800 bg-black aspect-video">
                      <video src={selectedScene.videoUrl} controls autoPlay loop className="w-full h-full object-contain" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onGenerateSceneVideo(selectedScene)}
                        className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span>Regenerate</span>
                      </button>
                      {onNavigateToSceneGenerator && (
                        <button
                          onClick={() => onNavigateToSceneGenerator(selectedScene.id)}
                          className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer border border-cyan-500/30"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Flow Prompts</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => onGenerateSceneVideo(selectedScene)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Scene Video Now</span>
                    </button>
                    {onNavigateToSceneGenerator && (
                      <button
                        onClick={() => onNavigateToSceneGenerator(selectedScene.id)}
                        className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                        <span>Open Prompt & Flow Engine</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Continuity Report */}
                {continuity && (
                  <div className="p-3.5 rounded-lg bg-[#05070D] border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300">Continuity Health</span>
                      <span
                        className={`font-mono font-bold text-xs ${
                          continuity.score >= 80 ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {continuity.score}% ({continuity.status.toUpperCase()})
                      </span>
                    </div>
                    {continuity.warnings.length > 0 && (
                      <div className="text-[10px] text-amber-300 space-y-1">
                        {continuity.warnings.slice(0, 2).map((w, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5 text-amber-400" />
                            <span>{w}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Editable Fields */}
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Scene Title</label>
                    <input
                      type="text"
                      value={selectedScene.title}
                      onChange={(e) => handleUpdateScene({ title: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#05070D] border border-slate-700 rounded-lg text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Action Description</label>
                    <textarea
                      rows={3}
                      value={selectedScene.action}
                      onChange={(e) => handleUpdateScene({ action: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#05070D] border border-slate-700 rounded-lg text-slate-200 focus:outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Exact Spoken Dialogue</label>
                    <input
                      type="text"
                      value={selectedScene.dialogue}
                      onChange={(e) => handleUpdateScene({ dialogue: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#05070D] border border-slate-700 rounded-lg text-cyan-200 font-mono text-[11px] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Featured Character Actor</label>
                    <select
                      value={selectedScene.characterIds[0] || ''}
                      onChange={(e) => handleUpdateScene({ characterIds: [e.target.value] })}
                      className="w-full px-2.5 py-1.5 bg-[#05070D] border border-slate-700 rounded-lg text-cyan-300 font-semibold text-xs focus:outline-none"
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

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Camera Angle</label>
                      <select
                        value={selectedScene.cameraAngle}
                        onChange={(e) => handleUpdateScene({ cameraAngle: e.target.value as CameraAngle })}
                        className="w-full px-2.5 py-1.5 bg-[#05070D] border border-slate-700 rounded-lg text-slate-200 focus:outline-none"
                      >
                        <option value="wide_shot">Wide Shot</option>
                        <option value="medium_shot">Medium Shot</option>
                        <option value="close_up">Close-Up</option>
                        <option value="extreme_close_up">Extreme Close-Up</option>
                        <option value="low_angle">Low Angle</option>
                        <option value="high_angle">High Angle</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Duration</label>
                      <input
                        type="number"
                        min={2}
                        max={15}
                        value={selectedScene.durationSeconds}
                        onChange={(e) => handleUpdateScene({ durationSeconds: Number(e.target.value) })}
                        className="w-full px-2.5 py-1.5 bg-[#05070D] border border-slate-700 rounded-lg text-slate-200 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Operations: Split, Merge, Delete */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleSplit(selectedScene)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Scissors className="w-3 h-3 text-cyan-400" />
                    <span>Split Shot</span>
                  </button>
                  <button
                    onClick={() => handleMergeNext(selectedScene)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Merge Next</span>
                  </button>
                  <button
                    onClick={() => handleDelete(selectedScene.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
