import { describe, expect, it } from 'vitest';

import {
  buildAdjustedMicroMission,
  createMissionSnapshot,
  isChallengeAdjustmentRequestType
} from '@/lib/challenges/micro-mission-adjustments';
import type { ChallengeRecord } from '@/types/challenge';

const baseChallenge: ChallengeRecord = {
  id: 'challenge-1',
  title: '단골 카페에서 눈 마주치고 인사하기',
  description: '이번 주는 이미 지나다니는 생활 공간에서 20초짜리 작은 접촉 하나만 만들어봅니다.',
  difficulty: 'easy',
  category: 'reach_out',
  estimatedTime: '10min',
  conversationStarters: ['안녕하세요. 오늘도 늦게까지 하시네요.'],
  missionKind: 'micro_social',
  missionContext: '자주 가는 카페',
  safeLine: '안녕하세요. 오늘도 늦게까지 하시네요.',
  minimumWin: '눈 마주치고 인사만 해도 성공',
  fear: '상대가 이상하게 볼까 봐.',
  reframe: '지나치듯 반응해도 실패가 아닙니다.',
  status: 'in_progress',
  weekNumber: 16,
  weekStartDate: '2026-04-20T00:00:00.000Z',
  startedAt: '2026-04-21T09:00:00.000Z',
  completedAt: null
};

describe('micro mission adjustments', () => {
  it('recognizes valid adjustment request types', () => {
    expect(isChallengeAdjustmentRequestType('smaller')).toBe(true);
    expect(isChallengeAdjustmentRequestType('different_space')).toBe(true);
    expect(isChallengeAdjustmentRequestType('safer_line')).toBe(true);
    expect(isChallengeAdjustmentRequestType('make_it_weird')).toBe(false);
  });

  it('builds a smaller mission without changing the current routine space', () => {
    const adjusted = buildAdjustedMicroMission(baseChallenge, 'smaller', 'ko');

    expect(adjusted.missionContext).toBe('자주 가는 카페');
    expect(adjusted.minimumWin).toBe('눈을 마주치고 고개만 살짝 끄덕여도 성공');
    expect(adjusted.safeLine).toBe('안녕하세요.');
    expect(adjusted.status).toBe('in_progress');
  });

  it('switches to a different everyday space when requested', () => {
    const adjusted = buildAdjustedMicroMission(baseChallenge, 'different_space', 'ko');

    expect(adjusted.title).toContain('편의점');
    expect(adjusted.missionContext).toContain('편의점');
    expect(adjusted.minimumWin).toBe('눈 마주치고 인사만 해도 성공');
    expect(adjusted.estimatedTime).toBe('10min');
  });

  it('uses a saved preferred routine space when switching places', () => {
    const adjusted = buildAdjustedMicroMission(baseChallenge, 'different_space', 'ko', ['gym']);

    expect(adjusted.title).toContain('헬스장');
    expect(adjusted.missionContext).toContain('헬스장');
    expect(adjusted.safeLine).toBe('안녕하세요.');
  });

  it('uses a shorter safer line while keeping the mission active', () => {
    const adjusted = buildAdjustedMicroMission(baseChallenge, 'safer_line', 'ko');

    expect(adjusted.title).toContain('짧게 인사하기');
    expect(adjusted.safeLine).toBe('안녕하세요.');
    expect(adjusted.minimumWin).toBe('짧게 인사 한마디만 해도 성공');
    expect(adjusted.status).toBe(baseChallenge.status);
  });

  it('creates a compact mission snapshot for adjustment logging', () => {
    expect(createMissionSnapshot(baseChallenge)).toEqual({
      title: baseChallenge.title,
      description: baseChallenge.description,
      difficulty: baseChallenge.difficulty,
      category: baseChallenge.category,
      estimatedTime: baseChallenge.estimatedTime,
      conversationStarters: baseChallenge.conversationStarters,
      missionKind: baseChallenge.missionKind,
      missionContext: baseChallenge.missionContext,
      safeLine: baseChallenge.safeLine,
      minimumWin: baseChallenge.minimumWin,
      fear: baseChallenge.fear,
      reframe: baseChallenge.reframe
    });
  });
});
