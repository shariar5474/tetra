export type FlowConnectionStatus = 
  | 'disconnected'
  | 'tab_not_found'
  | 'tab_detected'
  | 'unauthenticated'
  | 'ready'
  | 'generating'
  | 'handoff_required'
  | 'error';

export interface FlowSessionState {
  status: FlowConnectionStatus;
  tabId?: number;
  tabUrl?: string;
  isLoggedIn: boolean;
  userEmail?: string;
  verifiedCreditInfo?: {
    hasCredits: boolean;
    rawText: string;
    verifiedAt: number;
  };
  detectedModel?: string;
  lastChecked: number;
  lastError?: {
    code: string;
    message: string;
    fixSuggestion: string;
  };
}

export interface FlowGenerationPayload {
  jobId: string;
  sceneId: string;
  prompt: string;
  aspectRatio: string;
  characterImageUrls?: string[];
  environmentImageUrl?: string;
  startFrameUrl?: string;
}

export interface FlowGenerationResult {
  jobId: string;
  sceneId: string;
  videoUrl?: string;
  blobData?: Blob;
  downloadUrl?: string;
  duration?: number;
  completedAt: number;
  creditsRemainingText?: string;
}

export interface ManualHandoffData {
  sceneId: string;
  sceneTitle: string;
  prompt: string;
  referenceImages: { name: string; url: string; type: string }[];
  instructions: string[];
}
