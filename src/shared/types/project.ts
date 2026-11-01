export type AspectRatio = '16:9' | '9:16' | '1:1' | '2.39:1';
export type Resolution = '720p' | '1080p' | '4k';
export type ProjectStatus = 'draft' | 'analyzing' | 'storyboarding' | 'production' | 'editing' | 'completed' | 'archived';

export interface ProjectSettings {
  aspectRatio: AspectRatio;
  resolution: Resolution;
  fps: number;
  targetDurationMinutes: number;
  visualStyle: string;
  genre: string;
  language: string;
  dialect?: string; // e.g. Chittagong / Chatgaiya Bangla
  colorPalette?: string[];
  cameraStyle?: string;
  lightingStyle?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  createdAt: number;
  updatedAt: number;
  settings: ProjectSettings;
  stats: {
    totalScenes: number;
    completedScenes: number;
    totalCharacters: number;
    totalEnvironments: number;
    totalDurationSeconds: number;
  };
  thumbnailUrl?: string;
}
