import { describe, expect, it } from 'vitest';

import { isPreviewRuntime, isProductionRuntime, isQaBypassAllowedRuntime } from '@/lib/qa/runtime';

describe('QA runtime helpers', () => {
  it('treats vercel preview as preview even when node env is production', () => {
    expect(isPreviewRuntime({ nodeEnv: 'production', vercelEnv: 'preview' })).toBe(true);
    expect(isProductionRuntime({ nodeEnv: 'production', vercelEnv: 'preview' })).toBe(false);
    expect(isQaBypassAllowedRuntime({ nodeEnv: 'production', vercelEnv: 'preview' })).toBe(true);
  });

  it('blocks the bypass in real production', () => {
    expect(isProductionRuntime({ nodeEnv: 'production', vercelEnv: 'production' })).toBe(true);
    expect(isQaBypassAllowedRuntime({ nodeEnv: 'production', vercelEnv: 'production' })).toBe(false);
  });

  it('allows the bypass in local development and test environments', () => {
    expect(isQaBypassAllowedRuntime({ nodeEnv: 'development' })).toBe(true);
    expect(isQaBypassAllowedRuntime({ nodeEnv: 'test' })).toBe(true);
  });
});
