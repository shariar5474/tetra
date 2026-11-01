export type JobStatus = 
  | 'waiting'
  | 'preparing'
  | 'ready'
  | 'generating'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'paused'
  | 'cancelled'
  | 'needs_manual_action';

export type VideoProviderType = 'google_flow' | 'gemini_veo' | 'mock_simulation' | 'custom_api';

export interface GenerationJob {
  id: string;
  projectId: string;
  sceneId: string;
  sceneTitle: string;
  provider: VideoProviderType;
  model: string;
  prompt: string;
  referenceImages: string[];
  status: JobStatus;
  progressPercent: number;
  statusMessage: string;
  retryCount: number;
  maxRetries: number;
  outputVideoUrl?: string;
  outputBlobKey?: string;
  error?: {
    code: string;
    message: string;
    fixSuggestion: string;
  };
  manualHandoffData?: any;
  startTime?: number;
  endTime?: number;
  createdAt: number;
}
