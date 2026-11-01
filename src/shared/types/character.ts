export type CharacterViewType = 'face' | 'front' | 'side' | 'full_body' | 'back' | 'expressions' | 'costume';

export interface CharacterReferenceImage {
  id: string;
  characterId: string;
  viewType: CharacterViewType;
  imageUrl: string; // Base64 or Blob URL or object key
  blobKey?: string;
  isPrimaryFace: boolean;
  notes?: string;
  uploadedAt: number;
}

export interface CharacterCostume {
  id: string;
  characterId: string;
  name: string; // e.g. "Village Blue Shirt", "Wedding Attire"
  description: string;
  referenceImageUrl?: string;
  colorScheme: string[];
  isDefault: boolean;
  sceneIdsApplied: string[];
  approved: boolean;
}

export interface CharacterVoiceProfile {
  voiceId?: string;
  engine: 'browser_tts' | 'elevenlabs' | 'gemini_audio' | 'custom_recording';
  name: string;
  language: string;
  accent?: string;
  pitch: number; // 0.5 to 2.0
  rate: number;  // 0.5 to 2.0
  sampleAudioUrl?: string;
}

export interface Character {
  id: string;
  projectId: string;
  name: string;
  code: string; // e.g. "CHAR-001"
  description: string;
  age: string;
  gender: string;
  faceShape: string;
  skinAppearance: string;
  eyes: string;
  hair: string;
  facialHair?: string;
  bodyType: string;
  height: string;
  personality: string;
  speakingStyle: string;
  
  // Consistency Lock
  isLocked: boolean;
  lockedAt?: number;
  fingerprintHash?: string; // Descriptive attributes + face anchor hash
  
  // References & Costumes
  references: CharacterReferenceImage[];
  costumes: CharacterCostume[];
  activeCostumeId?: string;
  
  voiceProfile?: CharacterVoiceProfile;
  createdAt: number;
  updatedAt: number;
}
