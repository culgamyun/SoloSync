import { cache } from 'react';

import { startOfWeek, subWeeks } from 'date-fns';

import { isSupabaseConfigured } from '@/lib/env';
import { buildRecoveryCheckInCard } from '@/lib/challenges/recovery-check-in';
import { shouldUseDemoDataForRequest } from '@/lib/server/demo-mode';
import { createClient } from '@/lib/supabase/server';
import { calculateBreakdown, sumBreakdown } from '@/lib/utils/score';
import { getLevelFromXp } from '@/lib/utils/xp';
import type { Database } from '@/lib/supabase/types';
import type { ChallengeRecord } from '@/types/challenge';
import type { CoachMessage } from '@/types/coach';
import type { RelationshipMap } from '@/types/onboarding';

const demoChallenges: ChallengeRecord[] = [
  {
    id: 'challenge-1',
    title: '단골 카페에서 눈 마주치고 인사하기',
    description: '이번 주에는 이미 지나치는 생활 공간에서 20초짜리 작은 접촉 하나만 만들어봅니다.',
    difficulty: 'easy',
    category: 'reach_out',
    estimatedTime: '10min',
    conversationStarters: ['안녕하세요. 오늘도 늦게까지 하시네요.'],
    missionKind: 'micro_social',
    missionContext: '자주 가는 편의점 또는 카페',
    safeLine: '안녕하세요. 오늘도 늦게까지 하시네요.',
    minimumWin: '눈 마주치고 인사만 해도 성공',
    fear: '상대가 이상하게 볼까 봐',
    reframe: '상대가 짧게 대답해도 실패가 아닙니다. 낯선 사람에게 예의를 건넨 것만으로 이번 주의 반례는 생겼어요.',
    status: 'in_progress',
    weekNumber: 12,
    weekStartDate: startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString(),
    startedAt: new Date().toISOString(),
    completedAt: null
  },
  {
    id: 'challenge-2',
    title: '동료에게 가볍게 점심 제안하기',
    description: '이번 주에 바로 해볼 수 있는 부담 낮은 1:1 연결을 하나 골라봅니다.',
    difficulty: 'medium',
    category: 'deepen',
    estimatedTime: '30min',
    conversationStarters: ['내일 점심 같이 드실래요?', '요즘 프로젝트는 어떠세요?', '이번 주말에 쉬는 계획 있으세요?'],
    missionKind: 'standard',
    missionContext: null,
    safeLine: null,
    minimumWin: null,
    fear: null,
    reframe: null,
    status: 'pending',
    weekNumber: 12,
    weekStartDate: startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString(),
    startedAt: null,
    completedAt: null
  },
  {
    id: 'challenge-3',
    title: '동네 모임 하나 저장해두기',
    description: '이번 주 안에 가볼 수 있을 만큼 현실적인 생활권 모임을 하나만 골라 저장합니다.',
    difficulty: 'easy',
    category: 'explore',
    estimatedTime: '30min',
    conversationStarters: ['여기 와본 적 있으세요?', '이 모임은 어떻게 알게 되셨어요?', '근처에 비슷한 모임도 있나요?'],
    missionKind: 'standard',
    missionContext: null,
    safeLine: null,
    minimumWin: null,
    fear: null,
    reframe: null,
    status: 'pending',
    weekNumber: 12,
    weekStartDate: startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString(),
    startedAt: null,
    completedAt: null
  }
];

const demoBreakdown = {
  connection_frequency: 16,
  relationship_diversity: 18,
  challenge_completion: 12,
  satisfaction: 15
};

const demoMessages: CoachMessage[] = [
  {
    id: 'm-1',
    role: 'assistant',
    content: '이번 주에는 부담이 낮은 1:1 연결 하나만 성공시키는 데 집중해 봅시다.',
    createdAt: new Date().toISOString()
  }
];

const demoRecoveryCheckIn = buildRecoveryCheckInCard('ko', {
  previousStatus: 'skipped',
  previousOutcome: 'could_not_do_it',
  adjustmentCount: 1,
  currentChallengeId: demoChallenges[0].id,
  currentChallengeTitle: demoChallenges[0].title
});

function mapChallenge(row: Database['public']['Tables']['challenges']['Row']): ChallengeRecord {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    difficulty: row.difficulty,
    category: row.category,
    estimatedTime: row.estimated_time,
    conversationStarters: row.conversation_starters,
    missionKind: row.mission_kind,
    missionContext: row.mission_context,
    safeLine: row.safe_line,
    minimumWin: row.minimum_win,
    fear: row.fear,
    reframe: row.reframe,
    status: row.status,
    weekNumber: row.week_number,
    weekStartDate: row.week_start_date,
    startedAt: row.started_at,
    completedAt: row.completed_at
  };
}

export const getViewer = cache(async () => {
  if (await shouldUseDemoDataForRequest()) {
    return {
      id: 'demo-user',
      email: 'demo@solosync.app',
      displayName: 'Mina',
      locale: 'ko' as const,
      timezone: 'Asia/Seoul',
      onboardingCompleted: true,
      isDemo: true
    };
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single();

  return {
    id: user.id,
    email: profile?.email ?? user.email ?? '',
    displayName: profile?.display_name ?? user.user_metadata.full_name ?? 'SoloSync User',
    locale: profile?.locale ?? 'ko',
    timezone: profile?.timezone ?? 'UTC',
    onboardingCompleted: profile?.onboarding_completed ?? false,
    isDemo: false
  };
});

export const getEntryDestination = cache(async (locale: string) => {
  const viewer = await getViewer();
  if (!viewer) {
    return `/${locale}/welcome`;
  }

  if (!viewer.onboardingCompleted) {
    return `/${locale}/onboarding/step/1`;
  }

  return `/${locale}/home`;
});

export const getHomeSnapshot = cache(async () => {
  const viewer = await getViewer();

  if (!viewer || viewer.isDemo || !isSupabaseConfigured()) {
    return {
      viewer,
      latestScore: 61,
      latestInsight: '이번 주에는 부담이 낮은 1:1 연결을 늘리면 점수가 가장 빨리 올라갈 수 있어요.',
      breakdown: demoBreakdown,
      scoreHistory: [
        { label: '4w', score: 44 },
        { label: '3w', score: 48 },
        { label: '2w', score: 53 },
        { label: '1w', score: 58 },
        { label: 'Now', score: 61 }
      ],
      streak: { current: 3, longest: 8, xp: 720, level: getLevelFromXp(720) },
      challenges: demoChallenges,
      recoveryCheckIn: demoRecoveryCheckIn,
      weeklyCheckIn: { satisfaction: 4, energy: 3, note: '주중에는 괜찮았지만 주말 약속은 미뤘어요.' }
    };
  }

  const supabase = await createClient();
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString();

  const [scoreResult, historyResult, challengeResult, previousMicroMissionResult, streakResult, checkInResult] = await Promise.all([
    supabase
      .from('social_health_scores')
      .select('*')
      .eq('user_id', viewer.id)
      .order('measured_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('social_health_scores')
      .select('*')
      .eq('user_id', viewer.id)
      .order('measured_at', { ascending: false })
      .limit(5),
    supabase
      .from('challenges')
      .select('*')
      .eq('user_id', viewer.id)
      .eq('week_start_date', weekStart)
      .order('created_at', { ascending: true }),
    supabase
      .from('challenges')
      .select('*')
      .eq('user_id', viewer.id)
      .eq('mission_kind', 'micro_social')
      .lt('week_start_date', weekStart)
      .order('week_start_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.from('streaks').select('*').eq('user_id', viewer.id).maybeSingle(),
    supabase.from('weekly_check_ins').select('*').eq('user_id', viewer.id).eq('week_start_date', weekStart).maybeSingle()
  ]);

  const currentChallenges = (challengeResult.data ?? []).map(mapChallenge);
  const currentMicroMission = currentChallenges.find((challenge: ChallengeRecord) => challenge.missionKind === 'micro_social') ?? null;
  const previousMicroMission = previousMicroMissionResult.data ?? null;

  let previousOutcome: Database['public']['Tables']['challenge_reflections']['Row']['outcome'] = null;
  let previousAdjustmentCount = 0;

  if (previousMicroMission) {
    const [previousReflectionResult, previousAdjustmentCountResult] = await Promise.all([
      supabase
        .from('challenge_reflections')
        .select('outcome')
        .eq('challenge_id', previousMicroMission.id)
        .eq('user_id', viewer.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('challenge_mission_adjustments')
        .select('id', { count: 'exact', head: true })
        .eq('challenge_id', previousMicroMission.id)
        .eq('user_id', viewer.id)
    ]);

    previousOutcome = previousReflectionResult.data?.outcome ?? null;
    previousAdjustmentCount = previousAdjustmentCountResult.count ?? 0;
  }

  const recoveryCheckIn = buildRecoveryCheckInCard(viewer.locale, {
    previousStatus: previousMicroMission?.status ?? null,
    previousOutcome,
    adjustmentCount: previousAdjustmentCount,
    currentChallengeId: currentMicroMission?.id ?? null,
    currentChallengeTitle: currentMicroMission?.title ?? null
  });

  return {
    viewer,
    latestScore: scoreResult.data?.score ?? 0,
    latestInsight: scoreResult.data?.insight ?? '이번 주 첫 행동을 시작하면 인사이트가 채워집니다.',
    breakdown: (scoreResult.data?.breakdown as typeof demoBreakdown | null) ?? demoBreakdown,
    scoreHistory: (historyResult.data ?? []).reverse().map((item: { score: number }, index: number) => ({
      label: `${index + 1}w`,
      score: item.score
    })),
    streak: {
      current: streakResult.data?.current_streak ?? 0,
      longest: streakResult.data?.longest_streak ?? 0,
      xp: streakResult.data?.xp ?? 0,
      level: getLevelFromXp(streakResult.data?.xp ?? 0)
    },
    challenges: currentChallenges,
    recoveryCheckIn,
    weeklyCheckIn: checkInResult.data
      ? {
          satisfaction: checkInResult.data.satisfaction_score,
          energy: checkInResult.data.energy_score,
          note: checkInResult.data.note
        }
      : null
  };
});

export const getChallengesSnapshot = cache(async () => {
  const viewer = await getViewer();
  if (!viewer || viewer.isDemo || !isSupabaseConfigured()) {
    return demoChallenges;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from('challenges')
    .select('*')
    .eq('user_id', viewer.id)
    .order('week_start_date', { ascending: false })
    .order('created_at', { ascending: true });

  return (data ?? []).map(mapChallenge);
});

export const getChallengeDetail = cache(async (challengeId: string) => {
  const viewer = await getViewer();
  if (!viewer || viewer.isDemo || !isSupabaseConfigured()) {
    return demoChallenges.find((challenge: ChallengeRecord) => challenge.id === challengeId) ?? demoChallenges[0];
  }

  const supabase = await createClient();
  const { data } = await supabase.from('challenges').select('*').eq('id', challengeId).single();
  return data ? mapChallenge(data) : null;
});

export const getProgressSnapshot = cache(async () => {
  const home = await getHomeSnapshot();
  const strongestArea = Object.entries(home.breakdown as Record<string, number>).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return {
    latestScore: home.latestScore,
    breakdown: home.breakdown,
    scoreHistory: home.scoreHistory,
    streak: home.streak,
    stats: {
      challengesCompleted: home.challenges.filter((challenge: ChallengeRecord) => challenge.status === 'completed').length,
      strongestArea,
      totalScore: sumBreakdown(home.breakdown)
    }
  };
});

export const getCoachSnapshot = cache(async () => {
  const home = await getHomeSnapshot();

  return {
    viewer: home.viewer,
    messages: demoMessages,
    suggestedContext: home.challenges.slice(0, 2)
  };
});

export const getProfileSnapshot = cache(async () => {
  const viewer = await getViewer();
  if (!viewer || viewer.isDemo || !isSupabaseConfigured()) {
    return {
      viewer,
      profile: {
        city: 'Seoul',
        livingSituation: 'alone',
        socialSatisfactionScore: 6,
        introversionLevel: 7,
        relationshipMap: {
          close_friends: 2,
          casual_friends: 4,
          family: 3,
          colleagues: 6
        } as RelationshipMap,
        barriers: ['busy_schedule'],
        goals: ['deepen_existing', 'build_confidence'],
        comfortLevel: 'medium',
        routineSpaces: ['gym', 'cafe'],
        socialFears: ['being_judged', 'awkward_silence']
      }
    };
  }

  const supabase = await createClient();
  const { data } = await supabase.from('user_profiles').select('*').eq('user_id', viewer.id).maybeSingle();

  return {
    viewer,
    profile: data
      ? {
          city: data.city,
          livingSituation: data.living_situation,
          socialSatisfactionScore: data.social_satisfaction_score,
          introversionLevel: data.introversion_level,
          relationshipMap: data.relationship_map as RelationshipMap,
          barriers: data.barriers,
          goals: data.goals,
          comfortLevel: data.comfort_level,
          routineSpaces: data.routine_spaces,
          socialFears: data.social_fears
        }
      : null
  };
});

export function getScorePreviewFromDraft(relationshipMap: RelationshipMap, satisfaction: number) {
  const breakdown = calculateBreakdown({
    completedChallengesLast4Weeks: 0,
    totalChallengesLast4Weeks: 0,
    relationshipMap,
    recentMoodAfterValues: [],
    onboardingSatisfactionScore: satisfaction
  });

  return {
    score: sumBreakdown(breakdown),
    breakdown
  };
}

export function getSuggestedWeekLabel() {
  return startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString();
}

export function getHistoricWindowStart() {
  return subWeeks(new Date(), 4).toISOString();
}

