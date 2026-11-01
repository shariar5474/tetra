export type TransitionType = 'none' | 'cut' | 'fade_black' | 'crossfade' | 'dissolve';

export interface VideoClip {
  id: string;
  sceneId: string;
  title: string;
  videoUrl: string;
  blobKey?: string;
  sourceDuration: number;
  trimStart: number;
  trimEnd: number;
  playbackRate: number;
  volume: number;
  order: number;
  transitionIn: TransitionType;
  transitionDuration: number; // in seconds
}

export interface AudioClip {
  id: string;
  title: string;
  audioUrl: string;
  blobKey?: string;
  trackType: 'dialogue' | 'music' | 'ambience' | 'sfx';
  startTime: number; // placement on timeline
  duration: number;
  trimStart: number;
  volume: number; // 0.0 to 1.0
  fadeIn: number;
  fadeOut: number;
  muted: boolean;
}

export interface SubtitleItem {
  id: string;
  sceneId?: string;
  startTime: number;
  endTime: number;
  text: string;
  speakerName?: string;
}

export interface SubtitleStyle {
  fontFamily: string;
  fontSize: number;
  color: string;
  backgroundColor: string;
  outlineColor: string;
  outlineWidth: number;
  position: 'bottom' | 'top' | 'middle';
  burnIn: boolean;
}

export interface VideoTimeline {
  id: string;
  projectId: string;
  videoClips: VideoClip[];
  audioClips: AudioClip[];
  subtitles: SubtitleItem[];
  subtitleStyle: SubtitleStyle;
  totalDurationSeconds: number;
  updatedAt: number;
}

export interface ExportSettings {
  format: 'mp4' | 'webm';
  aspectRatio: '16:9' | '9:16' | '1:1';
  resolution: '720p' | '1080p';
  fps: 24 | 30 | 60;
  videoBitrateMbps: number;
  audioBitrateKbps: number;
  burnInSubtitles: boolean;
  fileName: string;
}

export interface FinalMovieExport {
  id: string;
  projectId: string;
  fileName: string;
  fileSize: number;
  durationSeconds: number;
  format: string;
  resolution: string;
  downloadUrl?: string;
  blobKey?: string;
  exportedAt: number;
}
