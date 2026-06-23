import { subWeeks } from 'date-fns';
import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/lib/supabase/types';
import { calculateBreakdown, sumBreakdown } from '@/lib/utils/score';
import type { RelationshipMap } from '@/types/onboarding';

function isRelationshipMap(value: unknown): value is RelationshipMap {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const map = value as Partial<Record<keyof RelationshipMap, unknown>>;
  return ['close_friends', 'casual_friends', 'family', 'colleagues'].every((key) => typeof map[key as keyof RelationshipMap] === 'number');
}

function buildScoreInsight(locale: string, score: number, weakestArea: string | null) {
  const language = locale === 'en' ? 'en' : 'ko';

  if (language === 'en') {
    if (score >= 70) {
      return 'Your recent actions are compounding. Keep the weekly rhythm steady rather than raising the pressure too fast.';
    }

    if (weakestArea === 'challenge_completion') {
      return 'The next lift will likely come from one mission that is small enough to actually finish.';
    }

    if (weakestArea === 'satisfaction') {
      return 'Your next lift may come from choosing a lower-pressure version that feels better after the attempt.';
    }

    return 'One repeatable real-world point of contact this week is enough to move the rhythm forward.';
  }

  if (score >= 70) {
    return '최근 행동이 조금씩 쌓이고 있어요. 갑자기 키우기보다 주간 리듬을 유지하는 편이 좋습니다.';
  }

  if (weakestArea === 'challenge_completion') {
    return '다음 상승은 실제로 끝낼 수 있을 만큼 작은 미션 하나에서 나올 가능성이 큽니다.';
  }

  if (weakestArea === 'satisfaction') {
    return '시도 후 감각이 더 편안해지도록, 이번 주는 부담을 낮춘 버전이 점수에 도움이 됩니다.';
  }

  return '이번 주에는 반복 가능한 실제 접점 하나만 만들어도 흐름을 앞으로 옮길 수 있어요.';
}

export async function refreshSocialHealthScore(
  supabase: SupabaseClient<Database>,
  userId: string,
  locale: string
) {
  const fourWeeksAgo = subWeeks(new Date(), 4).toISOString();
  const twoWeeksAgo = subWeeks(new Date(), 2).toISOString();

  const [profileResult, challengeResult, reflectionResult, checkInResult] = await Promise.all([
    supabase.from('user_profiles').select('relationship_map, social_satisfaction_score').eq('user_id', userId).maybeSingle(),
    supabase.from('challenges').select('id, status').eq('user_id', userId).gte('created_at', fourWeeksAgo),
    supabase.from('challenge_reflections').select('challenge_id, mood_after, outcome').eq('user_id', userId).gte('created_at', twoWeeksAgo),
    supabase.from('weekly_check_ins').select('satisfaction_score').eq('user_id', userId).gte('created_at', twoWeeksAgo)
  ]);

  const relationshipMap = isRelationshipMap(profileResult.data?.relationship_map)
    ? profileResult.data.relationship_map
    : {
        close_friends: 0,
        casual_friends: 0,
        family: 0,
        colleagues: 0
      };
  const challenges = challengeResult.data ?? [];
  const reflections = reflectionResult.data ?? [];
  const completedChallengeIds = new Set(challenges.filter((challenge) => challenge.status === 'completed').map((challenge) => challenge.id));
  const partialSuccessIds = new Set(
    reflections
      .filter((reflection) => reflection.outcome === 'greeted' || reflection.outcome === 'said_line')
      .map((reflection) => reflection.challenge_id)
      .filter((challengeId): challengeId is string => Boolean(challengeId))
  );
  const effectiveCompletedCount = new Set([...completedChallengeIds, ...partialSuccessIds]).size;
  const recentMoodAfterValues = [
    ...reflections.map((reflection) => reflection.mood_after).filter((value): value is number => typeof value === 'number'),
    ...(checkInResult.data ?? []).map((checkIn) => checkIn.satisfaction_score)
  ];
  const breakdown = calculateBreakdown({
    completedChallengesLast4Weeks: effectiveCompletedCount,
    totalChallengesLast4Weeks: challenges.length,
    relationshipMap,
    recentMoodAfterValues,
    onboardingSatisfactionScore: profileResult.data?.social_satisfaction_score ?? undefined
  });
  const weakestArea = Object.entries(breakdown).sort((a, b) => a[1] - b[1])[0]?.[0] ?? null;
  const score = sumBreakdown(breakdown);
  const insight = buildScoreInsight(locale, score, weakestArea);

  await supabase.from('social_health_scores').insert({
    user_id: userId,
    score,
    breakdown,
    insight
  });

  return { score, breakdown, insight };
}
