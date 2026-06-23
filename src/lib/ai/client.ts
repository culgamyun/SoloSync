import { startOfWeek } from 'date-fns';

import 'server-only';

import { buildPreferredMicroMissionSeed } from '@/lib/challenges/profile-personalization';
import { getSupabaseFunctionsUrl, serverEnv } from '@/lib/env';
import { calculateBreakdown, sumBreakdown } from '@/lib/utils/score';
import type { OnboardingAnalysis, OnboardingDraft } from '@/types/onboarding';

export async function requestOnboardingAnalysis(
  payload: OnboardingDraft,
  locale: string
): Promise<OnboardingAnalysis> {
  const fallback = createFallbackOnboardingAnalysis(payload, locale);
  const functionsUrl = getSupabaseFunctionsUrl();

  if (!functionsUrl || !serverEnv.SUPABASE_SERVICE_ROLE_KEY) {
    return fallback;
  }

  try {
    const response = await fetch(`${functionsUrl}/analyze-onboarding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serverEnv.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({ locale, onboarding: payload })
    });

    if (!response.ok) {
      return fallback;
    }

    return (await response.json()) as OnboardingAnalysis;
  } catch {
    return fallback;
  }
}

export function createFallbackOnboardingAnalysis(payload: OnboardingDraft, locale: string): OnboardingAnalysis {
  const preferredMissionSeed = buildPreferredMicroMissionSeed(locale, payload.routineSpaces ?? [], payload.socialFears ?? []);
  const breakdown = calculateBreakdown({
    completedChallengesLast4Weeks: 0,
    totalChallengesLast4Weeks: 0,
    relationshipMap: payload.relationshipMap,
    recentMoodAfterValues: [],
    onboardingSatisfactionScore: payload.socialSatisfactionScore
  });

  return {
    score: sumBreakdown(breakdown),
    breakdown,
    insight:
      locale === 'ko'
        ? '처음부터 크게 바꾸기보다 부담이 낮은 연결 하나를 꾸준히 만드는 편이 가장 잘 맞아 보여요.'
        : 'A low-pressure, repeatable connection will likely move your score faster than trying to change everything at once.',
    firstChallenge: {
      title: preferredMissionSeed.title,
      description: preferredMissionSeed.description,
      difficulty: 'easy',
      category: 'reach_out',
      conversation_starters: preferredMissionSeed.conversationStarters,
      estimated_time: '10min',
      mission_kind: 'micro_social',
      mission_context: preferredMissionSeed.missionContext,
      safe_line: preferredMissionSeed.safeLine,
      minimum_win: preferredMissionSeed.minimumWin,
      fear: preferredMissionSeed.fear,
      reframe: preferredMissionSeed.reframe
    }
  };
}

export function getWeekContext() {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  return {
    weekStartDate: weekStart.toISOString(),
    weekNumber: Math.ceil((Date.now() - new Date(weekStart.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24 * 7))
  };
}
