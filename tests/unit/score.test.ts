import { describe, expect, it } from 'vitest';

import { calculateBreakdown, countNonZeroRelationships, sumBreakdown } from '@/lib/utils/score';

describe('score utilities', () => {
  it('counts non-zero relationships', () => {
    expect(
      countNonZeroRelationships({
        close_friends: 2,
        casual_friends: 0,
        family: 3,
        colleagues: 0
      })
    ).toBe(2);
  });

  it('calculates a bounded breakdown', () => {
    const breakdown = calculateBreakdown({
      completedChallengesLast4Weeks: 5,
      totalChallengesLast4Weeks: 6,
      relationshipMap: {
        close_friends: 2,
        casual_friends: 4,
        family: 3,
        colleagues: 5
      },
      recentMoodAfterValues: [3, 4, 5]
    });

    expect(breakdown.challenge_completion).toBeGreaterThan(0);
    expect(sumBreakdown(breakdown)).toBeLessThanOrEqual(100);
  });
});
