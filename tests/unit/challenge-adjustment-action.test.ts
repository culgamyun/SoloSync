import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  revalidatePath: vi.fn(),
  redirect: vi.fn(),
  shouldUseDemoDataForRequest: vi.fn()
}));

vi.mock('next/cache', () => ({
  revalidatePath: mocks.revalidatePath
}));

vi.mock('next/navigation', () => ({
  redirect: mocks.redirect
}));

vi.mock('@/lib/server/app-data', () => ({
  getSuggestedWeekLabel: () => '2026-04-20T00:00:00.000Z'
}));

vi.mock('@/lib/server/demo-mode', () => ({
  shouldUseDemoDataForRequest: mocks.shouldUseDemoDataForRequest
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: mocks.createClient
}));

import { adjustMicroMissionAction } from '@/actions/challenges';

function makeAdjustmentForm(overrides: Record<string, string> = {}) {
  const formData = new FormData();
  const entries = {
    locale: 'ko',
    challengeId: 'challenge-1',
    requestType: 'smaller',
    ...overrides
  };

  for (const [key, value] of Object.entries(entries)) {
    formData.set(key, value);
  }

  return formData;
}

function makeRedirectError(url: string) {
  return new Error(`REDIRECT:${url}`);
}

function arrangeSupabase({
  user = { id: 'user-1' },
  challenge = {
    id: 'challenge-1',
    user_id: 'user-1',
    week_number: 16,
    week_start_date: '2026-04-20T00:00:00.000Z',
    title: '단골 카페에서 눈 마주치고 인사하기',
    description: '이번 주는 이미 지나다니는 생활 공간에서 20초짜리 작은 접촉 하나만 만들어봅니다.',
    difficulty: 'easy',
    category: 'reach_out',
    estimated_time: '10min',
    conversation_starters: ['안녕하세요. 오늘도 늦게까지 하시네요.'],
    mission_kind: 'micro_social',
    mission_context: '자주 가는 카페',
    safe_line: '안녕하세요. 오늘도 늦게까지 하시네요.',
    minimum_win: '눈 마주치고 인사만 해도 성공',
    fear: '상대가 이상하게 볼까 봐.',
    reframe: '지나치듯 반응해도 실패가 아닙니다.',
    status: 'in_progress',
    started_at: '2026-04-21T09:00:00.000Z',
    completed_at: null,
    created_at: '2026-04-20T00:00:00.000Z',
    updated_at: '2026-04-20T00:00:00.000Z'
  },
  insertError = null,
  updateError = null
}: {
  user?: { id: string } | null;
  challenge?: Record<string, unknown> | null;
  insertError?: { message: string } | null;
  updateError?: { message: string } | null;
} = {}) {
  const challengeMaybeSingle = vi.fn().mockResolvedValue({ data: challenge, error: null });
  const challengeSelectEqUser = vi.fn(() => ({ maybeSingle: challengeMaybeSingle }));
  const challengeSelectEqId = vi.fn(() => ({ eq: challengeSelectEqUser }));
  const challengeSelect = vi.fn(() => ({ eq: challengeSelectEqId }));
  const challengeUpdateEqUser = vi.fn().mockResolvedValue({ error: updateError });
  const challengeUpdateEqId = vi.fn(() => ({ eq: challengeUpdateEqUser }));
  const challengeUpdate = vi.fn(() => ({ eq: challengeUpdateEqId }));
  const adjustmentInsert = vi.fn().mockResolvedValue({ error: insertError });
  const getUser = vi.fn().mockResolvedValue({ data: { user } });
  const from = vi.fn((table: string) => {
    if (table === 'challenges') {
      return {
        select: challengeSelect,
        update: challengeUpdate
      };
    }

    if (table === 'challenge_mission_adjustments') {
      return {
        insert: adjustmentInsert
      };
    }

    throw new Error(`Unexpected table: ${table}`);
  });

  mocks.createClient.mockResolvedValue({
    auth: { getUser },
    from
  });

  return {
    adjustmentInsert,
    challengeMaybeSingle,
    challengeSelectEqId,
    challengeSelectEqUser,
    challengeUpdate,
    challengeUpdateEqId,
    challengeUpdateEqUser,
    from,
    getUser
  };
}

describe('adjustMicroMissionAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.shouldUseDemoDataForRequest.mockResolvedValue(false);
    mocks.redirect.mockImplementation((url: string) => {
      throw makeRedirectError(url);
    });
  });

  it('logs before and after mission payloads, updates the challenge, then redirects with adjusted state', async () => {
    const supabase = arrangeSupabase();

    await expect(adjustMicroMissionAction(makeAdjustmentForm())).rejects.toThrow(
      'REDIRECT:/ko/challenges/challenge-1?adjusted=smaller'
    );

    expect(supabase.challengeSelectEqId).toHaveBeenCalledWith('id', 'challenge-1');
    expect(supabase.challengeSelectEqUser).toHaveBeenCalledWith('user_id', 'user-1');
    expect(supabase.adjustmentInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        challenge_id: 'challenge-1',
        user_id: 'user-1',
        request_type: 'smaller',
        previous_mission: expect.objectContaining({
          title: '단골 카페에서 눈 마주치고 인사하기'
        }),
        next_mission: expect.objectContaining({
          minimumWin: '눈을 마주치고 고개만 살짝 끄덕여도 성공'
        })
      })
    );
    expect(supabase.challengeUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '단골 카페에서 눈 마주치고 고개 끄덕이기',
        safe_line: '안녕하세요.',
        minimum_win: '눈을 마주치고 고개만 살짝 끄덕여도 성공'
      })
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/ko/challenges/challenge-1');
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/ko/challenges');
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/ko/home');
  });

  it('redirects with a completed error and skips writes when the mission is already done', async () => {
    const supabase = arrangeSupabase({
      challenge: {
        id: 'challenge-1',
        user_id: 'user-1',
        week_number: 16,
        week_start_date: '2026-04-20T00:00:00.000Z',
        title: '단골 카페에서 눈 마주치고 인사하기',
        description: '...',
        difficulty: 'easy',
        category: 'reach_out',
        estimated_time: '10min',
        conversation_starters: ['안녕하세요.'],
        mission_kind: 'micro_social',
        mission_context: '자주 가는 카페',
        safe_line: '안녕하세요.',
        minimum_win: '눈 마주치고 인사만 해도 성공',
        fear: '상대가 이상하게 볼까 봐.',
        reframe: '...',
        status: 'completed',
        started_at: '2026-04-21T09:00:00.000Z',
        completed_at: '2026-04-21T09:10:00.000Z',
        created_at: '2026-04-20T00:00:00.000Z',
        updated_at: '2026-04-20T00:00:00.000Z'
      }
    });

    await expect(adjustMicroMissionAction(makeAdjustmentForm())).rejects.toThrow(
      'REDIRECT:/ko/challenges/challenge-1?adjustmentError=completed'
    );

    expect(supabase.adjustmentInsert).not.toHaveBeenCalled();
    expect(supabase.challengeUpdate).not.toHaveBeenCalled();
  });

  it('redirects with an unavailable error when the owned challenge cannot be found', async () => {
    const supabase = arrangeSupabase({ challenge: null });

    await expect(adjustMicroMissionAction(makeAdjustmentForm())).rejects.toThrow(
      'REDIRECT:/ko/challenges/challenge-1?adjustmentError=unavailable'
    );

    expect(supabase.adjustmentInsert).not.toHaveBeenCalled();
    expect(supabase.challengeUpdate).not.toHaveBeenCalled();
  });

  it('short-circuits invalid request types before touching Supabase', async () => {
    await expect(adjustMicroMissionAction(makeAdjustmentForm({ requestType: 'please_fix_my_life' }))).rejects.toThrow(
      'REDIRECT:/ko/challenges/challenge-1?adjustmentError=invalid'
    );

    expect(mocks.createClient).not.toHaveBeenCalled();
  });

  it('uses the demo redirect path without creating a client', async () => {
    mocks.shouldUseDemoDataForRequest.mockResolvedValue(true);

    await expect(adjustMicroMissionAction(makeAdjustmentForm({ requestType: 'safer_line' }))).rejects.toThrow(
      'REDIRECT:/ko/challenges/challenge-1?adjusted=safer_line'
    );

    expect(mocks.createClient).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).toHaveBeenCalledWith('/ko/challenges/challenge-1');
  });
});
