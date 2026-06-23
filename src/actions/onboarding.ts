'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { requestOnboardingAnalysis, getWeekContext } from '@/lib/ai/client';
import {
  buildPreferredMicroMissionSeed,
  filterRoutineSpaces,
  filterSocialFears
} from '@/lib/challenges/profile-personalization';
import { shouldUseDemoDataForRequest } from '@/lib/server/demo-mode';
import { createClient } from '@/lib/supabase/server';
import type { OnboardingDraft, RelationshipMap } from '@/types/onboarding';

function parseDraft(formData: FormData): OnboardingDraft {
  return {
    displayName: String(formData.get('displayName') ?? ''),
    city: String(formData.get('city') ?? ''),
    livingSituation: (formData.get('livingSituation') as OnboardingDraft['livingSituation']) ?? null,
    socialSatisfactionScore: Number(formData.get('socialSatisfactionScore') ?? 5),
    introversionLevel: Number(formData.get('introversionLevel') ?? 5),
    barriers: String(formData.get('barriers') ?? '')
      .split(',')
      .filter(Boolean),
    relationshipMap: JSON.parse(String(formData.get('relationshipMap') ?? '{}')) as RelationshipMap,
    goals: String(formData.get('goals') ?? '')
      .split(',')
      .filter(Boolean),
    comfortLevel: (formData.get('comfortLevel') as OnboardingDraft['comfortLevel']) ?? 'medium',
    routineSpaces: filterRoutineSpaces(
      String(formData.get('routineSpaces') ?? '')
        .split(',')
        .filter(Boolean)
    ),
    socialFears: filterSocialFears(
      String(formData.get('socialFears') ?? '')
        .split(',')
        .filter(Boolean)
    )
  };
}

export async function completeOnboardingAction(formData: FormData) {
  const locale = String(formData.get('locale') ?? 'ko');
  const draft = parseDraft(formData);

  if (await shouldUseDemoDataForRequest()) {
    redirect(`/${locale}/onboarding/result`);
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const analysis = await requestOnboardingAnalysis(draft, locale);
  const { weekNumber, weekStartDate } = getWeekContext();
  const preferredMissionSeed = buildPreferredMicroMissionSeed(locale, draft.routineSpaces, draft.socialFears);
  const shouldUsePreferredFirstMission = draft.routineSpaces.length > 0 || draft.socialFears.length > 0;
  const firstChallenge = shouldUsePreferredFirstMission
    ? {
        title: preferredMissionSeed.title,
        description: preferredMissionSeed.description,
        difficulty: 'easy' as const,
        category: 'reach_out' as const,
        estimated_time: '10min' as const,
        conversation_starters: preferredMissionSeed.conversationStarters,
        mission_kind: 'micro_social' as const,
        mission_context: preferredMissionSeed.missionContext,
        safe_line: preferredMissionSeed.safeLine,
        minimum_win: preferredMissionSeed.minimumWin,
        fear: preferredMissionSeed.fear,
        reframe: preferredMissionSeed.reframe
      }
    : analysis.firstChallenge;

  await supabase.from('users').upsert({
    id: user.id,
    email: user.email,
    display_name: draft.displayName,
    locale: locale === 'en' ? 'en' : 'ko',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    onboarding_completed: true
  });

  await supabase.from('user_profiles').upsert({
    user_id: user.id,
    living_situation: draft.livingSituation,
    city: draft.city,
    social_satisfaction_score: draft.socialSatisfactionScore,
    introversion_level: draft.introversionLevel,
    relationship_map: draft.relationshipMap,
    barriers: draft.barriers,
    goals: draft.goals,
    comfort_level: draft.comfortLevel,
    routine_spaces: draft.routineSpaces,
    social_fears: draft.socialFears
  });

  await supabase.from('social_health_scores').insert({
    user_id: user.id,
    score: analysis.score,
    insight: analysis.insight,
    breakdown: analysis.breakdown
  });

  await supabase.from('challenges').upsert({
    user_id: user.id,
    week_number: weekNumber,
    week_start_date: weekStartDate,
    title: firstChallenge.title,
    description: firstChallenge.description,
    difficulty: firstChallenge.difficulty,
    category: firstChallenge.category,
    estimated_time: firstChallenge.estimated_time,
    conversation_starters: firstChallenge.conversation_starters,
    mission_kind: firstChallenge.mission_kind ?? 'standard',
    mission_context: firstChallenge.mission_context ?? null,
    safe_line: firstChallenge.safe_line ?? null,
    minimum_win: firstChallenge.minimum_win ?? null,
    fear: firstChallenge.fear ?? null,
    reframe: firstChallenge.reframe ?? null
  });

  await supabase.from('streaks').upsert({
    user_id: user.id
  });

  revalidatePath(`/${locale}`);
  redirect(`/${locale}/onboarding/result`);
}
