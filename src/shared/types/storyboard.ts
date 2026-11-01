export type SceneStatus = 'draft' | 'prompt_ready' | 'generating' | 'review' | 'approved' | 'rejected';
export type CameraAngle = 'wide_shot' | 'extreme_wide' | 'medium_shot' | 'close_up' | 'extreme_close_up' | 'over_the_shoulder' | 'low_angle' | 'high_angle' | 'dutch_angle';
export type CameraMovement = 'static' | 'slow_pan' | 'tracking' | 'dolly_in' | 'dolly_out' | 'crane' | 'handheld';

export interface ScenePrompts {
  shortPrompt: string;
  detailedPrompt: string;
  flowPrompt: string;
  apiPrompt: string;
  manualCopyPrompt: string;
  negativePrompt: string;
}

export interface StoryboardScene {
  id: string;
  projectId: string;
  sceneNumber: number;
  title: string;
  description: string;
  
  // Script link
  dialogue: string;
  action: string;
  emotionalTone: string;
  
  // Entities
  characterIds: string[];
  characterCostumeMap?: Record<string, string>; // characterId -> costumeId
  environmentId?: string;
  
  // Cinematic Direction
  cameraAngle: CameraAngle;
  cameraMovement: CameraMovement;
  lightingMood: string;
  timeOfDay: string;
  weather: string;
  durationSeconds: number;
  
  // Storyboard Preview Image
  storyboardImageUrl?: string;
  storyboardImageApproved: boolean;
  
  // Video Generation
  prompts: ScenePrompts;
  videoUrl?: string;
  videoBlobKey?: string;
  videoDurationSeconds?: number;
  videoApproved: boolean;
  
  // Continuity
  continuityNotes: string;
  previousSceneId?: string;
  nextSceneId?: string;
  continuityScore?: number;
  continuityWarnings?: string[];
  
  status: SceneStatus;
  order: number;
  createdAt: number;
  updatedAt: number;
}
