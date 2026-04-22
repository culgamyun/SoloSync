import { describe, expect, it } from 'vitest';

import {
  buildPreferredMicroMissionSeed,
  filterRoutineSpaces,
  filterSocialFears,
  getRoutineSpaceLabels,
  getSocialFearLabels
} from '@/lib/challenges/profile-personalization';

describe('profile personalization helpers', () => {
  it('filters routine spaces to the supported allow-list without duplicates', () => {
    expect(filterRoutineSpaces(['gym', 'unknown', 'cafe', 'gym'])).toEqual(['gym', 'cafe']);
  });

  it('filters social fears to the supported allow-list without duplicates', () => {
    expect(filterSocialFears(['being_judged', 'oops', 'awkward_silence', 'being_judged'])).toEqual([
      'being_judged',
      'awkward_silence'
    ]);
  });

  it('returns localized labels for saved preferences', () => {
    expect(getRoutineSpaceLabels('ko', ['gym', 'cafe'])).toEqual(['헬스장', '카페']);
    expect(getSocialFearLabels('en', ['being_judged', 'awkward_silence'])).toEqual([
      'Being judged',
      'Awkward silence'
    ]);
  });

  it('builds a personalized fallback seed from the first selected routine space and fear', () => {
    const seed = buildPreferredMicroMissionSeed('ko', ['gym', 'cafe'], ['awkward_silence', 'being_judged']);

    expect(seed.title).toContain('헬스장');
    expect(seed.missionContext).toBe('자주 가는 헬스장');
    expect(seed.fear).toBe('말이 끊기고 어색해질까 봐.');
    expect(seed.conversationStarters).toEqual(['안녕하세요.']);
  });

  it('falls back to a safe convenience-store seed when no preferences exist', () => {
    const seed = buildPreferredMicroMissionSeed('en', [], []);

    expect(seed.title).toBe('Say a quick hello at the convenience store');
    expect(seed.fear).toBe('They might think I am strange.');
  });
});
