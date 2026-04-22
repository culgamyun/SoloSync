import { describe, expect, it } from 'vitest';

import {
  applyRecoverySignalToMissionSeed,
  buildRecoveryCheckInCard,
  buildRecoveryWeeklyMessage,
  deriveRecoverySignal
} from '@/lib/challenges/recovery-check-in';

const baseSeed = {
  title: 'Say a quick hello at the cafe',
  description: 'Make one small point of contact in your normal routine.',
  missionContext: 'A cafe you already visit',
  safeLine: 'Hello.',
  minimumWin: 'A short hello still counts',
  fear: 'They might think I am strange.',
  reframe: 'A brief exchange still matters.',
  conversationStarters: ['Hello.']
};

describe('recovery check-in helpers', () => {
  it('classifies a skipped or difficult week as rough', () => {
    expect(
      deriveRecoverySignal({
        previousStatus: 'skipped',
        previousOutcome: 'could_not_do_it',
        adjustmentCount: 1
      })
    ).toBe('rough_week');
  });

  it('classifies an adjusted week separately when there was no hard stop', () => {
    expect(
      deriveRecoverySignal({
        previousStatus: 'in_progress',
        previousOutcome: null,
        adjustmentCount: 2
      })
    ).toBe('adjusted_week');
  });

  it('classifies a greeted-only week as steady', () => {
    expect(
      deriveRecoverySignal({
        previousStatus: 'in_progress',
        previousOutcome: 'greeted',
        adjustmentCount: 0
      })
    ).toBe('steady_week');
  });

  it('classifies a completed or said-line week as strong', () => {
    expect(
      deriveRecoverySignal({
        previousStatus: 'completed',
        previousOutcome: 'said_line',
        adjustmentCount: 0
      })
    ).toBe('strong_week');
  });

  it('builds a recovery card with a challenge link and title-aware body copy', () => {
    const card = buildRecoveryCheckInCard('en', {
      previousStatus: 'skipped',
      previousOutcome: 'could_not_do_it',
      adjustmentCount: 1,
      currentChallengeId: 'challenge-123',
      currentChallengeTitle: 'Say hello to the barista'
    });

    expect(card.signal).toBe('rough_week');
    expect(card.ctaHref).toBe('/challenges/challenge-123');
    expect(card.body).toContain('Say hello to the barista');
    expect(card.formTitle).toBe('Weekly recovery check-in');
  });

  it('softens the micro-mission seed after a rough week', () => {
    const adjustedSeed = applyRecoverySignalToMissionSeed('en', 'rough_week', baseSeed);

    expect(adjustedSeed.description).toContain('allowed to come back smaller');
    expect(adjustedSeed.safeLine).toBe('Hi.');
    expect(adjustedSeed.minimumWin).toContain('hello still count as success');
  });

  it('builds a recovery-aware weekly summary message', () => {
    expect(buildRecoveryWeeklyMessage('en', 'adjusted_week')).toContain('lower-pressure rhythm');
  });
});
