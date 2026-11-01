import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Project } from '../shared/types/project';
import { ScriptDocument } from '../shared/types/script';
import { Character, CharacterReferenceImage, CharacterCostume } from '../shared/types/character';
import { Environment, EnvironmentReferenceImage } from '../shared/types/environment';
import { StoryboardScene } from '../shared/types/storyboard';
import { GenerationJob } from '../shared/types/job';
import { VideoTimeline, FinalMovieExport, AudioClip } from '../shared/types/editor';
import { AIProviderConfig } from '../shared/types/provider';

export interface CineForgeDBSchema extends DBSchema {
  projects: {
    key: string;
    value: Project;
    indexes: { 'by-date': number; 'by-status': string };
  };
  scripts: {
    key: string;
    value: ScriptDocument;
    indexes: { 'by-project': string };
  };
  characters: {
    key: string;
    value: Character;
    indexes: { 'by-project': string; 'by-code': string };
  };
  character_references: {
    key: string;
    value: CharacterReferenceImage;
    indexes: { 'by-character': string };
  };
  character_costumes: {
    key: string;
    value: CharacterCostume;
    indexes: { 'by-character': string };
  };
  environments: {
    key: string;
    value: Environment;
    indexes: { 'by-project': string; 'by-code': string };
  };
  environment_references: {
    key: string;
    value: EnvironmentReferenceImage;
    indexes: { 'by-environment': string };
  };
  storyboard_scenes: {
    key: string;
    value: StoryboardScene;
    indexes: { 'by-project': string; 'by-order': number };
  };
  generation_jobs: {
    key: string;
    value: GenerationJob;
    indexes: { 'by-project': string; 'by-status': string; 'by-date': number };
  };
  video_timelines: {
    key: string;
    value: VideoTimeline;
    indexes: { 'by-project': string };
  };
  audio_assets: {
    key: string;
    value: AudioClip & { projectId: string };
    indexes: { 'by-project': string };
  };
  video_exports: {
    key: string;
    value: FinalMovieExport;
    indexes: { 'by-project': string };
  };
  asset_blobs: {
    key: string;
    value: { id: string; name: string; type: string; blob: Blob; size: number; createdAt: number };
    indexes: { 'by-type': string };
  };
  provider_settings: {
    key: string;
    value: AIProviderConfig;
    indexes: { 'by-category': string };
  };
  application_settings: {
    key: string;
    value: { key: string; value: any; updatedAt: number };
  };
  notifications: {
    key: string;
    value: { id: string; title: string; message: string; type: 'info' | 'success' | 'warning' | 'error'; timestamp: number; read: boolean };
    indexes: { 'by-timestamp': number };
  };
}

const DB_NAME = 'CineForgeAI_DB';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<CineForgeDBSchema>> | null = null;

export function getDB(): Promise<IDBPDatabase<CineForgeDBSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<CineForgeDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Projects
        if (!db.objectStoreNames.contains('projects')) {
          const projectStore = db.createObjectStore('projects', { keyPath: 'id' });
          projectStore.createIndex('by-date', 'updatedAt');
          projectStore.createIndex('by-status', 'status');
        }

        // Scripts
        if (!db.objectStoreNames.contains('scripts')) {
          const scriptStore = db.createObjectStore('scripts', { keyPath: 'id' });
          scriptStore.createIndex('by-project', 'projectId');
        }

        // Characters
        if (!db.objectStoreNames.contains('characters')) {
          const charStore = db.createObjectStore('characters', { keyPath: 'id' });
          charStore.createIndex('by-project', 'projectId');
          charStore.createIndex('by-code', 'code');
        }

        // Character References
        if (!db.objectStoreNames.contains('character_references')) {
          const charRefStore = db.createObjectStore('character_references', { keyPath: 'id' });
          charRefStore.createIndex('by-character', 'characterId');
        }

        // Character Costumes
        if (!db.objectStoreNames.contains('character_costumes')) {
          const charCostumeStore = db.createObjectStore('character_costumes', { keyPath: 'id' });
          charCostumeStore.createIndex('by-character', 'characterId');
        }

        // Environments
        if (!db.objectStoreNames.contains('environments')) {
          const envStore = db.createObjectStore('environments', { keyPath: 'id' });
          envStore.createIndex('by-project', 'projectId');
          envStore.createIndex('by-code', 'code');
        }

        // Environment References
        if (!db.objectStoreNames.contains('environment_references')) {
          const envRefStore = db.createObjectStore('environment_references', { keyPath: 'id' });
          envRefStore.createIndex('by-environment', 'environmentId');
        }

        // Storyboard Scenes
        if (!db.objectStoreNames.contains('storyboard_scenes')) {
          const sceneStore = db.createObjectStore('storyboard_scenes', { keyPath: 'id' });
          sceneStore.createIndex('by-project', 'projectId');
          sceneStore.createIndex('by-order', 'order');
        }

        // Generation Jobs
        if (!db.objectStoreNames.contains('generation_jobs')) {
          const jobStore = db.createObjectStore('generation_jobs', { keyPath: 'id' });
          jobStore.createIndex('by-project', 'projectId');
          jobStore.createIndex('by-status', 'status');
          jobStore.createIndex('by-date', 'createdAt');
        }

        // Video Timelines
        if (!db.objectStoreNames.contains('video_timelines')) {
          const timelineStore = db.createObjectStore('video_timelines', { keyPath: 'id' });
          timelineStore.createIndex('by-project', 'projectId');
        }

        // Audio Assets
        if (!db.objectStoreNames.contains('audio_assets')) {
          const audioStore = db.createObjectStore('audio_assets', { keyPath: 'id' });
          audioStore.createIndex('by-project', 'projectId');
        }

        // Video Exports
        if (!db.objectStoreNames.contains('video_exports')) {
          const exportStore = db.createObjectStore('video_exports', { keyPath: 'id' });
          exportStore.createIndex('by-project', 'projectId');
        }

        // Large Binary Asset Blobs (Images, Videos, Audios)
        if (!db.objectStoreNames.contains('asset_blobs')) {
          const blobStore = db.createObjectStore('asset_blobs', { keyPath: 'id' });
          blobStore.createIndex('by-type', 'type');
        }

        // AI Provider Settings
        if (!db.objectStoreNames.contains('provider_settings')) {
          const providerStore = db.createObjectStore('provider_settings', { keyPath: 'id' });
          providerStore.createIndex('by-category', 'category');
        }

        // App Settings
        if (!db.objectStoreNames.contains('application_settings')) {
          db.createObjectStore('application_settings', { keyPath: 'key' });
        }

        // Notifications
        if (!db.objectStoreNames.contains('notifications')) {
          const notifStore = db.createObjectStore('notifications', { keyPath: 'id' });
          notifStore.createIndex('by-timestamp', 'timestamp');
        }
      },
    });
  }
  return dbPromise;
}
