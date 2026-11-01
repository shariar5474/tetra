// IndexedDB Schema Migrations & Integrity Checks
import { IDBPDatabase } from 'idb';
import { CineForgeDBSchema } from './indexeddb';

export function runMigrations(db: IDBPDatabase<CineForgeDBSchema>, oldVersion: number, newVersion: number | null): void {
  console.log(`[CineForge DB] Migrating from version ${oldVersion} to ${newVersion}`);
  // Future schema updates can be added here
}

export async function validateDatabaseIntegrity(db: IDBPDatabase<CineForgeDBSchema>): Promise<boolean> {
  const storeNames = [
    'projects',
    'scripts',
    'characters',
    'character_references',
    'character_costumes',
    'environments',
    'environment_references',
    'storyboard_scenes',
    'generation_jobs',
    'video_timelines',
    'audio_assets',
    'video_exports',
    'asset_blobs',
    'provider_settings',
    'application_settings',
    'notifications',
  ];

  for (const name of storeNames) {
    if (!db.objectStoreNames.contains(name as any)) {
      console.error(`[CineForge DB] Missing expected store: ${name}`);
      return false;
    }
  }
  return true;
}
