import { describe, it, expect } from 'vitest';
import { createFlowError } from '../../src/flow/flow-errors';
import { FlowAdapter } from '../../src/flow/flow-adapter';
import { VideoCoordinator } from '../../src/engines/video-engine/video-coordinator';
import { DEFAULT_PROVIDERS } from '../../src/providers/provider-registry';

describe('Google Flow Integration & Messaging', () => {
  it('creates actionable categorized Flow errors', () => {
    const tabError = createFlowError('TAB_NOT_FOUND');
    expect(tabError.code).toBe('TAB_NOT_FOUND');
    expect(tabError.recommendation).toContain('Open Google Flow');

    const handoffError = createFlowError('MANUAL_HANDOFF_NEEDED');
    expect(handoffError.recommendation).toContain('Copy Prompt');
  });

  it('determines fallback video provider when Flow is unavailable', () => {
    const fallback = VideoCoordinator.determineFallbackProvider('google_flow', DEFAULT_PROVIDERS);
    // When Flow is unavailable, fallback checks other providers
    expect(fallback).toBeDefined();
  });

  it('detects model capabilities', () => {
    const caps = FlowAdapter.detectCapabilities();
    expect(caps.supportsCharacterReference).toBe(true);
    expect(caps.availableAspectRatios).toContain('16:9');
    expect(caps.availableAspectRatios).toContain('9:16');
  });
});
