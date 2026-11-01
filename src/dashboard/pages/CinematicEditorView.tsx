import React, { useState, useRef, useEffect } from 'react';
import {
  Scissors,
  Play,
  Pause,
  Download,
  Film,
  Music,
  Type,
  Plus,
  Trash2,
  Layers,
  Settings,
  Sparkles,
  Maximize2,
  Volume2,
} from 'lucide-react';
import { Project } from '../../shared/types/project';
import { VideoTimeline, VideoClip, AudioClip, SubtitleItem, ExportSettings } from '../../shared/types/editor';
import { StoryboardScene } from '../../shared/types/storyboard';
import { movieExporter, RenderProgress } from '../../engines/export-engine/movie-exporter';
import { formatDuration, formatTimecode } from '../../shared/utils/helpers';
import { speakDialogue, stopDialogueSpeech } from '../../shared/utils/speech-service';

interface CinematicEditorViewProps {
  project?: Project;
  timeline?: VideoTimeline;
  scenes: StoryboardScene[];
  onSaveTimeline: (timeline: VideoTimeline) => Promise<void>;
}

export const CinematicEditorView: React.FC<CinematicEditorViewProps> = ({
  project,
  timeline,
  scenes,
  onSaveTimeline,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportProgress, setExportProgress] = useState<RenderProgress | null>(null);
  const [exportedUrl, setExportedUrl] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Guaranteed non-empty clips: Merge timeline clips and approved scenes
  const approvedScenes = scenes.filter((s) => s.videoUrl);
  const combinedClips: VideoClip[] = [...(timeline?.videoClips || [])];
  approvedScenes.forEach((s) => {
    const existing = combinedClips.find((c) => c.sceneId === s.id);
    if (!existing) {
      combinedClips.push({
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
        order: s.order || combinedClips.length + 1,
        transitionIn: 'cut',
        transitionDuration: 0.5,
      });
    } else if (!existing.videoUrl && s.videoUrl) {
      existing.videoUrl = s.videoUrl;
      existing.blobKey = s.videoBlobKey;
    }
  });
  combinedClips.sort((a, b) => a.order - b.order);
  const videoClips = combinedClips;
  const audioClips = timeline?.audioClips || [];
  const subtitles = timeline?.subtitles || [];

  const totalDuration = videoClips.reduce(
    (acc, c) => acc + (c.sourceDuration - c.trimStart - c.trimEnd),
    0
  ) || 10;

  const currentClip = videoClips.find((c) => c.id === selectedClipId) || videoClips[0];

  // Auto populate timeline from scenes if empty on mount
  useEffect(() => {
    if (scenes.some((s) => s.videoUrl) && (!timeline || timeline.videoClips.length < scenes.filter((s) => s.videoUrl).length)) {
      handlePopulateFromApprovedScenes();
    }
  }, [scenes, timeline]);

  const handlePopulateFromApprovedScenes = () => {
    if (!project) return;
    const newClips: VideoClip[] = scenes.map((s, idx) => ({
      id: `clip-${s.id}`,
      sceneId: s.id,
      title: `Scene ${s.sceneNumber}: ${s.title}`,
      videoUrl: s.videoUrl || '',
      sourceDuration: s.durationSeconds || 5,
      trimStart: 0,
      trimEnd: 0,
      playbackRate: 1.0,
      volume: 1.0,
      order: idx + 1,
      transitionIn: 'cut',
      transitionDuration: 0.5,
    }));

    const newSubtitles: SubtitleItem[] = [];
    let accum = 0;
    scenes.forEach((s) => {
      if (s.dialogue) {
        newSubtitles.push({
          id: `sub-${s.id}`,
          sceneId: s.id,
          startTime: accum + 0.5,
          endTime: accum + (s.durationSeconds || 5) - 0.5,
          text: s.dialogue,
        });
      }
      accum += s.durationSeconds || 5;
    });

    const updatedTimeline: VideoTimeline = {
      id: timeline?.id || 'timeline-default',
      projectId: project.id,
      videoClips: newClips,
      audioClips: [],
      subtitles: newSubtitles,
      subtitleStyle: timeline?.subtitleStyle || {
        fontFamily: 'Inter',
        fontSize: 24,
        color: '#FFFFFF',
        backgroundColor: 'rgba(0,0,0,0.6)',
        outlineColor: '#000000',
        outlineWidth: 2,
        position: 'bottom',
        burnIn: true,
      },
      totalDurationSeconds: accum,
      updatedAt: Date.now(),
    };

    onSaveTimeline(updatedTimeline);
  };

  // Synchronize isPlaying with HTMLVideoElement
  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, currentClip?.videoUrl]);

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleStartExport = async () => {
    let activeTimeline = timeline;
    if (!activeTimeline || activeTimeline.videoClips.length === 0) {
      if (scenes.some((s) => s.videoUrl)) {
        handlePopulateFromApprovedScenes();
      } else {
        alert('No videos have been generated yet! Please generate scene videos first.');
        return;
      }
    }
    const currentClips = activeTimeline?.videoClips.length ? activeTimeline.videoClips : scenes.filter(s => s.videoUrl).map((s, idx) => ({
      id: `clip-${s.id}`,
      sceneId: s.id,
      title: `Scene ${s.sceneNumber}: ${s.title}`,
      videoUrl: s.videoUrl || '',
      sourceDuration: s.durationSeconds || 5,
      trimStart: 0,
      trimEnd: 0,
      playbackRate: 1.0,
      volume: 1.0,
      order: idx + 1,
      transitionIn: 'cut' as const,
      transitionDuration: 0.5,
    }));

    const exportTl: VideoTimeline = activeTimeline || {
      id: 'timeline-export',
      projectId: project?.id || 'proj-default',
      videoClips: currentClips,
      audioClips: [],
      subtitles: [],
      totalDurationSeconds: currentClips.reduce((a, b) => a + b.sourceDuration, 0),
      updatedAt: Date.now(),
    };

    setExportProgress({ stage: 'preparing', percent: 0, message: 'Initializing render engine...' });
    setExportedUrl(null);

    const settings: ExportSettings = {
      format: 'mp4',
      aspectRatio: project?.settings.aspectRatio === '9:16' ? '9:16' : '16:9',
      resolution: project?.settings.resolution === '720p' ? '720p' : '1080p',
      fps: (project?.settings.fps as any) || 30,
      videoBitrateMbps: 8,
      audioBitrateKbps: 192,
      burnInSubtitles: true,
      fileName: `${project?.name.replace(/[^a-zA-Z0-9]/g, '_') || 'cineforge_movie'}.mp4`,
    };

    try {
      const blob = await movieExporter.exportMovie(exportTl, settings, (p) => {
        setExportProgress(p);
      });
      const url = URL.createObjectURL(blob);
      setExportedUrl(url);

      // Download file to Chrome downloads
      if (typeof chrome !== 'undefined' && chrome.downloads?.download) {
        chrome.downloads.download({
          url,
          filename: settings.fileName,
          saveAs: true,
        });
      } else {
        const a = document.createElement('a');
        a.href = url;
        a.download = settings.fileName;
        a.click();
      }
    } catch (err: any) {
      console.error(err);
      setExportProgress({ stage: 'failed', percent: 0, message: err.message || 'Render failed' });
    }
  };

  // Active subtitle at playhead
  const currentSub = subtitles.find((s) => currentTime >= s.startTime && currentTime <= s.endTime);

  return (
    <div className="p-8 max-w-7xl mx-auto overflow-y-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Scissors className="w-4 h-4" />
            Cinematic Non-Linear Video Editor
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Cinematic Editor</h1>
          <p className="text-xs text-slate-400">
            Multi-track timeline for video scenes, audio tracks, and burned-in subtitles with master MP4 export.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePopulateFromApprovedScenes}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
          >
            Import Storyboard Shots
          </button>
          <button
            onClick={() => setExportModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Master Movie</span>
          </button>
        </div>
      </div>

      {/* Main Preview Player */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl border-slate-800 p-4 space-y-3">
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-slate-800">
            {currentClip?.videoUrl ? (
              <video
                key={currentClip.videoUrl}
                ref={videoRef}
                src={currentClip.videoUrl}
                controls
                className="w-full h-full object-contain"
                onPlay={() => {
                  setIsPlaying(true);
                  if (currentSub?.text) {
                    speakDialogue(currentSub.text);
                  }
                }}
                onPause={() => {
                  setIsPlaying(false);
                  stopDialogueSpeech();
                }}
                onEnded={() => {
                  stopDialogueSpeech();
                  const currentIdx = videoClips.findIndex((c) => c.id === currentClip.id);
                  if (currentIdx >= 0 && currentIdx < videoClips.length - 1) {
                    setSelectedClipId(videoClips[currentIdx + 1].id);
                    setIsPlaying(true);
                  } else {
                    setIsPlaying(false);
                  }
                }}
                onTimeUpdate={(e) => setCurrentTime((e.target as HTMLVideoElement).currentTime)}
              />
            ) : (
              <div className="text-center space-y-2 p-6">
                <Film className="w-12 h-12 text-slate-700 mx-auto" />
                <div className="text-sm font-semibold text-slate-400">
                  {currentClip?.title || 'Preview Monitor'}
                </div>
                <p className="text-xs text-slate-600">
                  Import shots from Storyboard to preview scene transitions.
                </p>
              </div>
            )}

            {/* Subtitle Overlay in Player */}
            {currentSub && (
              <div className="absolute bottom-6 left-0 right-0 text-center px-4 pointer-events-none">
                <span className="inline-block bg-black/80 text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-lg border border-slate-800 font-sans">
                  {currentSub.text}
                </span>
              </div>
            )}
          </div>

          {/* Transport Controls */}
          <div className="flex items-center justify-between px-2 pt-1 text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={handleTogglePlay}
                className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <span className="font-mono text-cyan-400 font-bold">
                {formatTimecode(currentTime, project?.settings.fps || 30)}
              </span>
              <span className="text-slate-500">/</span>
              <span className="font-mono text-slate-400">
                {formatTimecode(totalDuration, project?.settings.fps || 30)}
              </span>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              {project?.settings.aspectRatio} • {project?.settings.resolution} • {project?.settings.fps} FPS
            </div>
          </div>
        </div>

        {/* Clip & Subtitle Properties Panel */}
        <div className="glass-card rounded-2xl border-slate-800 p-5 space-y-4">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Clip & Subtitle Properties
          </h2>

          {currentClip ? (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#05070D] rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] block">Active Shot</span>
                <span className="font-bold text-white line-clamp-1">{currentClip.title}</span>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Duration</label>
                <input
                  type="text"
                  disabled
                  value={`${currentClip.sourceDuration} seconds`}
                  className="w-full px-3 py-1.5 bg-[#05070D] border border-slate-800 rounded-lg text-slate-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Transition</label>
                <select
                  value={currentClip.transitionIn}
                  className="w-full px-3 py-1.5 bg-[#05070D] border border-slate-700 rounded-lg text-slate-200 focus:outline-none"
                >
                  <option value="cut">Direct Hard Cut</option>
                  <option value="fade_black">Fade from Black</option>
                  <option value="crossfade">Cinematic Dissolve</option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-400 text-[10px] block mb-1">Subtitle Line</span>
                <p className="text-slate-200 italic p-2.5 rounded bg-[#05070D] border border-slate-800 text-[11px]">
                  {currentSub ? `"${currentSub.text}"` : 'No dialogue at playhead'}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-500 italic">No clip selected.</div>
          )}
        </div>
      </div>

      {/* Multi-Track Timeline */}
      <div className="glass-card rounded-2xl border-slate-800 p-5 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
          <span>Timeline Tracks</span>
          <span className="text-slate-500 font-mono text-[10px]">{videoClips.length} clips</span>
        </div>

        {/* Video Track */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[11px] text-cyan-400 font-bold">
            <Film className="w-3.5 h-3.5" />
            <span>Video Track (V1)</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto p-2 bg-[#05070D] border border-slate-800 rounded-xl min-h-[70px]">
            {videoClips.length === 0 ? (
              <span className="text-xs text-slate-600 px-3">No video clips on timeline.</span>
            ) : (
              videoClips.map((clip) => (
                <div
                  key={clip.id}
                  onClick={() => setSelectedClipId(clip.id)}
                  className={`h-12 px-3 rounded-lg border flex flex-col justify-center cursor-pointer shrink-0 min-w-[120px] transition-all ${
                    selectedClipId === clip.id
                      ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold truncate">{clip.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{clip.sourceDuration}s</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Subtitle Track */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center gap-2 text-[11px] text-purple-400 font-bold">
            <Type className="w-3.5 h-3.5" />
            <span>Subtitles (Burn-In Overlay)</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto p-2 bg-[#05070D] border border-slate-800 rounded-xl min-h-[46px]">
            {subtitles.length === 0 ? (
              <span className="text-xs text-slate-600 px-3">No subtitles defined.</span>
            ) : (
              subtitles.map((sub) => (
                <div
                  key={sub.id}
                  className="h-8 px-3 rounded-lg border border-purple-500/30 bg-purple-950/20 text-purple-200 text-xs flex items-center shrink-0 min-w-[140px] truncate"
                >
                  <span className="truncate">{sub.text}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Export Progress Modal */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white">Final Movie Master Render</h2>
              {!exportProgress && (
                <button onClick={() => setExportModalOpen(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              )}
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-[#05070D] rounded-lg border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span>Format:</span>
                  <strong className="text-white">MP4 (H.264 / WebM VP9)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Resolution:</span>
                  <strong className="text-white">{project?.settings.resolution || '1080p'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Subtitle Burn-In:</span>
                  <strong className="text-cyan-400">Enabled</strong>
                </div>
              </div>

              {exportProgress && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-cyan-400 font-semibold">{exportProgress.message}</span>
                    <span className="font-mono text-white font-bold">{exportProgress.percent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-200"
                      style={{ width: `${exportProgress.percent}%` }}
                    />
                  </div>
                </div>
              )}

              {exportedUrl && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs text-center space-y-2">
                  <div className="font-bold">Movie Rendered Successfully!</div>
                  <p className="text-[11px] text-slate-300">File has been delivered to your Chrome Downloads.</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => setExportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              {!exportedUrl && (
                <button
                  onClick={handleStartExport}
                  disabled={exportProgress?.stage === 'rendering_frames'}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-50"
                >
                  Start Rendering
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
