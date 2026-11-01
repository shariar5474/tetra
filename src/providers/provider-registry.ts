import { AIProviderConfig } from '../shared/types/provider';
import { getDB } from '../database/indexeddb';

export const DEFAULT_PROVIDERS: AIProviderConfig[] = [
  {
    id: 'google-flow-primary',
    name: 'Google Flow (Browser Session)',
    category: 'video',
    modelId: 'veo-flow-browser',
    isEnabled: true,
    isPrimary: true,
    priority: 1,
    billingType: 'google_flow_credits',
    capabilities: ['character_reference', 'environment_reference', 'photorealistic_motion', '1080p'],
    maxDurationSeconds: 10,
    supportedRatios: ['16:9', '9:16', '1:1'],
    description: "Uses your own authorized Google Account and Flow session directly in Chrome without API fees.",
  },
  {
    id: 'gemini-flash-script',
    name: 'Gemini 2.5 Flash',
    category: 'text',
    modelId: 'gemini-2.5-flash',
    isEnabled: true,
    isPrimary: true,
    priority: 1,
    billingType: 'free_tier',
    capabilities: ['story_analysis', 'character_extraction', 'scene_breakdown', 'chittagong_dialect_support'],
    description: 'High-speed script intelligence and character breakdown engine.',
  },
  {
    id: 'google-veo-api',
    name: 'Google Veo Video API (Official)',
    category: 'video',
    modelId: 'veo-2.0-generate-001',
    apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/veo-2.0-generate-001',
    isEnabled: false,
    isPrimary: false,
    priority: 2,
    billingType: 'paid_api',
    capabilities: ['direct_api', '4k_upscaling', 'seed_control'],
    maxDurationSeconds: 8,
    supportedRatios: ['16:9', '9:16'],
    description: 'Optional official Google Cloud / AI Studio API integration when direct API key is supplied.',
  },
];

export async function getRegisteredProviders(): Promise<AIProviderConfig[]> {
  const db = await getDB();
  const stored = await db.getAll('provider_settings');
  if (stored.length === 0) {
    // Seed defaults
    for (const p of DEFAULT_PROVIDERS) {
      await db.put('provider_settings', p);
    }
    return DEFAULT_PROVIDERS;
  }
  return stored;
}

export async function saveProviderConfig(config: AIProviderConfig): Promise<void> {
  const db = await getDB();
  await db.put('provider_settings', config);
}
