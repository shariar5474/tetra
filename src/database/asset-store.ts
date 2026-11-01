import { getDB } from './indexeddb';
import { generateId } from '../shared/utils/helpers';

export async function saveAssetBlob(name: string, type: string, blob: Blob): Promise<string> {
  const db = await getDB();
  const id = generateId('blob');
  await db.put('asset_blobs', {
    id,
    name,
    type,
    blob,
    size: blob.size,
    createdAt: Date.now(),
  });
  return id;
}

export async function getAssetBlob(id: string): Promise<Blob | null> {
  const db = await getDB();
  const item = await db.get('asset_blobs', id);
  return item ? item.blob : null;
}

export async function createAssetUrl(id: string): Promise<string | null> {
  const blob = await getAssetBlob(id);
  if (!blob) return null;
  return URL.createObjectURL(blob);
}

export async function deleteAssetBlob(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('asset_blobs', id);
}

export async function calculateStorageUsage(): Promise<{ totalBytes: number; count: number; formatted: string }> {
  const db = await getDB();
  const allBlobs = await db.getAll('asset_blobs');
  let totalBytes = 0;
  for (const b of allBlobs) {
    totalBytes += b.size || 0;
  }
  
  let formatted = '';
  if (totalBytes < 1024 * 1024) {
    formatted = `${(totalBytes / 1024).toFixed(1)} KB`;
  } else if (totalBytes < 1024 * 1024 * 1024) {
    formatted = `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`;
  } else {
    formatted = `${(totalBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }

  return { totalBytes, count: allBlobs.length, formatted };
}
