'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { requestOnboardingAnalysis, getWeekContext } from '@/lib/ai/client';
import { isSupabaseConfigured } from '@/lib/env';
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
    comfortLevel: (formData.get('comfortLevel') as OnboardingDraft['comfortLevel']) ?? 'medium'
  };
}

export async function completeOnboardingAction(formData: FormData) {
  const locale = String(formData.get('locale') ?? 'ko');
  const draft = parseDraft(formData);

  if (!isSupabaseConfigured()) {
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
    comfort_level: draft.comfortLevel
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
    title: analysis.firstChallenge.title,
    description: analysis.firstChallenge.description,
    difficulty: analysis.firstChallenge.difficulty,
    category: analysis.firstChallenge.category,
    estimated_time: analysis.firstChallenge.estimated_time,
    conversation_starters: analysis.firstChallenge.conversation_starters
  });

  await supabase.from('streaks').upsert({
    user_id: user.id
  });

  revalidatePath(`/${locale}`);
  redirect(`/${locale}/onboarding/result`);
}
