import { startOfWeek } from 'date-fns';

import 'server-only';

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
      title:
        locale === 'ko' ? '이번 주 안부 메시지 1개 보내기' : 'Send one thoughtful check-in this week',
      description:
        locale === 'ko'
          ? '오랫동안 연락하지 않은 사람 한 명에게 구체적인 안부 메시지를 보내보세요.'
          : 'Reach out to one person you have drifted from and make the message specific.',
      difficulty: 'easy',
      category: 'maintain',
      conversation_starters:
        locale === 'ko'
          ? ['문득 네 생각이 났어.', '요즘 어떻게 지내?', '이번 주에 잠깐 커피 어때?']
          : ['I thought of you this week.', 'How have you been really?', 'Want to grab coffee sometime soon?'],
      estimated_time: '10min'
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
