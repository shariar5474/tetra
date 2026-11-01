export interface ScriptStoryArc {
  title: string;
  genre: string;
  logline: string;
  theme: string;
  beginning: string;
  incitingIncident: string;
  risingAction: string;
  climax: string;
  resolution: string;
}

export interface ExtractedCharacter {
  name: string;
  identity: string;
  apparentAge: string;
  personality: string;
  keyAppearance: string;
  costume: string;
  speakingStyle: string;
  relationships: string;
}

export interface ExtractedLocation {
  name: string;
  description: string;
  interiorExterior: 'INT' | 'EXT' | 'INT/EXT';
  lighting: string;
  weather: string;
  timeOfDay: 'Day' | 'Night' | 'Morning' | 'Evening' | 'Golden Hour' | 'Dusk';
  keyProps: string[];
}

export interface ExtractedScene {
  sceneNumber: number;
  title: string;
  locationName: string;
  timeOfDay: string;
  characterNames: string[];
  actionDescription: string;
  dialogueSnippet: string;
  emotionalTone: string;
  suggestedShot: string;
  estimatedDurationSeconds: number;
}

export interface ScriptAnalysisResult {
  storyArc: ScriptStoryArc;
  characters: ExtractedCharacter[];
  locations: ExtractedLocation[];
  scenes: ExtractedScene[];
  detectedLanguage: string;
  dialectDetected?: string; // e.g. Chittagong / Chatgaiya
  chunkCount: number;
  analyzedAt: number;
}

export interface ScriptDocument {
  id: string;
  projectId: string;
  rawText: string;
  fileName?: string;
  fileType?: 'paste' | 'txt' | 'docx' | 'pdf' | 'md';
  wordCount: number;
  analysis?: ScriptAnalysisResult;
  updatedAt: number;
}
