export type ProviderCategory = 'text' | 'image' | 'video' | 'voice' | 'audio';

export interface AIProviderConfig {
  id: string;
  name: string;
  category: ProviderCategory;
  modelId: string;
  apiEndpoint?: string;
  apiKey?: string;
  isEnabled: boolean;
  isPrimary: boolean;
  priority: number;
  billingType: 'google_flow_credits' | 'free_tier' | 'paid_api';
  capabilities: string[];
  maxDurationSeconds?: number;
  supportedRatios?: string[];
  description: string;
}

export interface ProviderRegistryState {
  providers: AIProviderConfig[];
  autoFallbackEnabled: boolean;
  lastTested?: Record<string, { success: boolean; latencyMs: number; error?: string; timestamp: number }>;
}
