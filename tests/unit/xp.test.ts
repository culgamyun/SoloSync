import { describe, expect, it } from 'vitest';

import { getChallengeXp, getLevelFromXp, getNextLevel } from '@/lib/utils/xp';

describe('xp utilities', () => {
  it('maps challenge difficulty to xp', () => {
    expect(getChallengeXp('easy')).toBe(50);
    expect(getChallengeXp('medium')).toBe(100);
    expect(getChallengeXp('hard')).toBe(200);
  });

  it('resolves level thresholds', () => {
    expect(getLevelFromXp(0).id).toBe('bronze');
    expect(getLevelFromXp(900).id).toBe('silver');
    expect(getNextLevel(900)?.id).toBe('gold');
  });
});
