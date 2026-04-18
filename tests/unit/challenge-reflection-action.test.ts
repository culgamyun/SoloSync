import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  revalidatePath: vi.fn(),
  shouldUseDemoDataForRequest: vi.fn()
}));

vi.mock('next/cache', () => ({
  revalidatePath: mocks.revalidatePath
}));

vi.mock('@/lib/server/app-data', () => ({
  getSuggestedWeekLabel: () => '2026-04-13T00:00:00.000Z'
}));

vi.mock('@/lib/server/demo-mode', () => ({
  shouldUseDemoDataForRequest: mocks.shouldUseDemoDataForRequest
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: mocks.createClient
}));

import { submitReflectionAction, updateChallengeStatusAction } from '@/actions/challenges';

function makeStatusForm(overrides: Record<string, string> = {}) {
  const formData = new FormData();
  const entries = {
    locale: 'ko',
    challengeId: 'challenge-1',
    status: 'completed',
    ...overrides
  };

  for (const [key, value] of Object.entries(entries)) {
    formData.set(key, value);
  }

  return formData;
}

function makeReflectionForm(overrides: Record<string, string> = {}) {
  const formData = new FormData();
  const entries = {
    locale: 'ko',
    challengeId: 'challenge-1',
    moodBefore: '2',
    moodAfter: '3',
    difficultyFelt: '5',
    outcome: 'could_not_do_it',
    reflectionText: 'I stopped at the door, but I noticed where it got hard.',
    ...overrides
  };

  for (const [key, value] of Object.entries(entries)) {
    formData.set(key, value);
  }

  return formData;
}

function arrangeSupabase({
  user = { id: 'user-1' },
  streak = { xp: 480 },
  insertedReflection = { id: 'reflection-1' }
}: {
  user?: { id: string } | null;
  streak?: { xp: number } | null;
  insertedReflection?: { id: string } | null;
} = {}) {
  const reflectionMaybeSingle = vi.fn().mockResolvedValue({ data: insertedReflection, error: null });
  const reflectionSelect = vi.fn(() => ({ maybeSingle: reflectionMaybeSingle }));
  const reflectionUpsert = vi.fn(() => ({ select: reflectionSelect }));
  const streakMaybeSingle = vi.fn().mockResolvedValue({ data: streak, error: null });
  const streakEq = vi.fn(() => ({ maybeSingle: streakMaybeSingle }));
  const streakSelect = vi.fn(() => ({ eq: streakEq }));
  const streakUpsert = vi.fn().mockResolvedValue({ error: null });
  const getUser = vi.fn().mockResolvedValue({ data: { user } });
  const from = vi.fn((table: string) => {
    if (table === 'challenge_reflections') {
      return { upsert: reflectionUpsert };
    }

    if (table === 'streaks') {
      return { select: streakSelect, upsert: streakUpsert };
    }

    throw new Error(`Unexpected table: ${table}`);
  });

  mocks.createClient.mockResolvedValue({
    auth: { getUser },
    from
  });

  return {
    from,
    getUser,
    reflectionMaybeSingle,
    reflectionSelect,
    reflectionUpsert,
    streakEq,
    streakMaybeSingle,
    streakSelect,
    streakUpsert
  };
}

function arrangeStatusSupabase({
  user = { id: 'user-1' },
  challenge = {
    id: 'challenge-1',
    difficulty: 'easy',
    status: 'in_progress',
    started_at: '2026-04-18T00:00:00.000Z',
    completed_at: null
  },
  updatedChallenge = { id: 'challenge-1' },
  streak = { xp: 480, current_streak: 1, longest_streak: 1, total_challenges_completed: 2 }
}: {
  user?: { id: string } | null;
  challenge?: {
    id: string;
    difficulty: 'easy' | 'medium' | 'hard';
    status: string;
    started_at: string | null;
    completed_at: string | null;
  } | null;
  updatedChallenge?: { id: string } | null;
  streak?: {
    xp: number;
    current_streak: number;
    longest_streak: number;
    total_challenges_completed: number;
  } | null;
} = {}) {
  const challengeSingle = vi.fn().mockResolvedValue({ data: challenge, error: null });
  const challengeSelectEq = vi.fn(() => ({ single: challengeSingle }));
  const challengeSelect = vi.fn(() => ({ eq: challengeSelectEq }));
  const challengeUpdateMaybeSingle = vi.fn().mockResolvedValue({ data: updatedChallenge, error: null });
  const challengeUpdateSelect = vi.fn(() => ({ maybeSingle: challengeUpdateMaybeSingle }));
  const challengeUpdateNeq = vi.fn(() => ({ select: challengeUpdateSelect }));
  const challengeUpdateEq = vi.fn(() => ({ neq: challengeUpdateNeq, select: challengeUpdateSelect }));
  const challengeUpdate = vi.fn(() => ({ eq: challengeUpdateEq }));
  const streakMaybeSingle = vi.fn().mockResolvedValue({ data: streak, error: null });
  const streakEq = vi.fn(() => ({ maybeSingle: streakMaybeSingle }));
  const streakSelect = vi.fn(() => ({ eq: streakEq }));
  const streakUpsert = vi.fn().mockResolvedValue({ error: null });
  const getUser = vi.fn().mockResolvedValue({ data: { user } });
  const from = vi.fn((table: string) => {
    if (table === 'challenges') {
      return { select: challengeSelect, update: challengeUpdate };
    }

    if (table === 'streaks') {
      return { select: streakSelect, upsert: streakUpsert };
    }

    throw new Error(`Unexpected table: ${table}`);
  });

  mocks.createClient.mockResolvedValue({
    auth: { getUser },
    from
  });

  return {
    challengeUpdate,
    challengeUpdateEq,
    challengeUpdateNeq,
    challengeUpdateSelect,
    challengeUpdateMaybeSingle,
    streakSelect,
    streakUpsert
  };
}

describe('updateChallengeStatusAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.shouldUseDemoDataForRequest.mockResolvedValue(false);
  });

  it('awards challenge XP only after a completed transition updates a row', async () => {
    const supabase = arrangeStatusSupabase();

    await updateChallengeStatusAction(makeStatusForm());

    expect(supabase.challengeUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'completed',
        started_at: '2026-04-18T00:00:00.000Z',
        completed_at: expect.any(String)
      })
    );
    expect(supabase.challengeUpdateEq).toHaveBeenCalledWith('id', 'challenge-1');
    expect(supabase.challengeUpdateNeq).toHaveBeenCalledWith('status', 'completed');
    expect(supabase.challengeUpdateSelect).toHaveBeenCalledWith('id');
    expect(supabase.streakUpsert).toHaveBeenCalledWith({
      user_id: 'user-1',
      current_streak: 2,
      longest_streak: 2,
      total_challenges_completed: 3,
      xp: 530,
      level: 'silver'
    });
  });

  it('does not award challenge XP when a duplicate completed request updates no rows', async () => {
    const supabase = arrangeStatusSupabase({ updatedChallenge: null });

    await updateChallengeStatusAction(makeStatusForm());

    expect(supabase.challengeUpdateNeq).toHaveBeenCalledWith('status', 'completed');
    expect(supabase.streakSelect).not.toHaveBeenCalled();
    expect(supabase.streakUpsert).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/ko/challenges');
  });
});

describe('submitReflectionAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.shouldUseDemoDataForRequest.mockResolvedValue(false);
  });

  it('stores a failed micro-mission outcome without treating it as outside the reflection loop', async () => {
    const supabase = arrangeSupabase();

    await submitReflectionAction(makeReflectionForm());

    expect(supabase.reflectionUpsert).toHaveBeenCalledWith(
      {
        challenge_id: 'challenge-1',
        user_id: 'user-1',
        mood_before: 2,
        mood_after: 3,
        difficulty_felt: 5,
        outcome: 'could_not_do_it',
        reflection_text: 'I stopped at the door, but I noticed where it got hard.'
      },
      { onConflict: 'user_id,challenge_id', ignoreDuplicates: true }
    );
    expect(supabase.reflectionSelect).toHaveBeenCalledWith('id');
    expect(supabase.streakEq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(supabase.streakUpsert).toHaveBeenCalledWith({
      user_id: 'user-1',
      xp: 510,
      level: 'silver'
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/ko/challenges');
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/ko/progress');
  });

  it('normalizes unsupported outcome values to null before inserting', async () => {
    const supabase = arrangeSupabase({ streak: null });

    await submitReflectionAction(makeReflectionForm({ outcome: 'ghosted_by_cafe_owner' }));

    expect(supabase.reflectionUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        outcome: null
      }),
      { onConflict: 'user_id,challenge_id', ignoreDuplicates: true }
    );
    expect(supabase.streakUpsert).toHaveBeenCalledWith({
      user_id: 'user-1',
      xp: 30,
      level: 'bronze'
    });
  });

  it('does not award reflection XP again when the reflection already exists', async () => {
    const supabase = arrangeSupabase({ insertedReflection: null });

    await submitReflectionAction(makeReflectionForm());

    expect(supabase.reflectionUpsert).toHaveBeenCalledTimes(1);
    expect(supabase.streakSelect).not.toHaveBeenCalled();
    expect(supabase.streakUpsert).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).toHaveBeenCalledTimes(1);
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/ko/challenges');
  });

  it('does not write reflection rows while the request is using demo data', async () => {
    mocks.shouldUseDemoDataForRequest.mockResolvedValue(true);

    await submitReflectionAction(makeReflectionForm());

    expect(mocks.createClient).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).toHaveBeenCalledTimes(1);
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/ko/challenges');
  });
});
