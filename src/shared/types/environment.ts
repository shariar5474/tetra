export type EnvironmentViewType = 'wide' | 'front' | 'interior' | 'exterior' | 'left' | 'right' | 'detail';
export type WeatherVariant = 'clear' | 'sunny' | 'rain' | 'fog' | 'storm' | 'cloudy' | 'hazy';
export type TimeVariant = 'day' | 'night' | 'morning' | 'evening' | 'golden_hour' | 'dusk' | 'dawn';

export interface EnvironmentReferenceImage {
  id: string;
  environmentId: string;
  viewType: EnvironmentViewType;
  imageUrl: string;
  blobKey?: string;
  isPrimaryAnchor: boolean;
  notes?: string;
  uploadedAt: number;
}

export interface Environment {
  id: string;
  projectId: string;
  name: string;
  code: string; // e.g. "ENV-001"
  description: string;
  locationType: 'interior' | 'exterior' | 'mixed';
  architecture: string;
  furnitureAndDecor: string;
  keyProps: string[];
  lightingMood: string;
  colorPalette: string[];
  defaultTime: TimeVariant;
  defaultWeather: WeatherVariant;
  ambientAudioNotes?: string;
  
  // Consistency Lock
  isLocked: boolean;
  lockedAt?: number;
  
  references: EnvironmentReferenceImage[];
  createdAt: number;
  updatedAt: number;
}
