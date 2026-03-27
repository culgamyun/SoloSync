'use server';

import { revalidatePath } from 'next/cache';

import { getSuggestedWeekLabel } from '@/lib/server/app-data';
import { isSupabaseConfigured } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';
import { getChallengeXp, getReflectionXp, getLevelFromXp } from '@/lib/utils/xp';

export async function updateChallengeStatusAction(formData: FormData) {
  const locale = String(formData.get('locale') ?? 'ko');
  const challengeId = String(formData.get('challengeId'));
  const nextStatus = String(formData.get('status')) as 'pending' | 'in_progress' | 'completed' | 'skipped';

  if (!isSupabaseConfigured()) {
    revalidatePath(`/${locale}/challenges`);
    return;
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) {
    return;
  }

  const { data: challenge } = await supabase.from('challenges').select('*').eq('id', challengeId).single();
  if (!challenge) {
    return;
  }

  await supabase
    .from('challenges')
    .update({
      status: nextStatus,
      started_at: nextStatus === 'in_progress' ? new Date().toISOString() : challenge.started_at,
      completed_at: nextStatus === 'completed' ? new Date().toISOString() : challenge.completed_at
    })
    .eq('id', challengeId);

  if (nextStatus === 'completed') {
    const { data: streak } = await supabase.from('streaks').select('*').eq('user_id', user.id).maybeSingle();
    const currentXp = streak?.xp ?? 0;
    const currentStreak = (streak?.current_streak ?? 0) + 1;
    const nextXp = currentXp + getChallengeXp(challenge.difficulty);
    await supabase.from('streaks').upsert({
      user_id: user.id,
      current_streak: currentStreak,
      longest_streak: Math.max(currentStreak, streak?.longest_streak ?? 0),
      total_challenges_completed: (streak?.total_challenges_completed ?? 0) + 1,
      xp: nextXp,
      level: getLevelFromXp(nextXp).id
    });
  }

  revalidatePath(`/${locale}/home`);
  revalidatePath(`/${locale}/challenges`);
  revalidatePath(`/${locale}/progress`);
}

export async function submitReflectionAction(formData: FormData) {
  const locale = String(formData.get('locale') ?? 'ko');
  if (!isSupabaseConfigured()) {
    revalidatePath(`/${locale}/challenges`);
    return;
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) {
    return;
  }

  const challengeId = String(formData.get('challengeId'));
  await supabase.from('challenge_reflections').insert({
    challenge_id: challengeId,
    user_id: user.id,
    mood_before: Number(formData.get('moodBefore') ?? 3),
    mood_after: Number(formData.get('moodAfter') ?? 3),
    difficulty_felt: Number(formData.get('difficultyFelt') ?? 3),
    reflection_text: String(formData.get('reflectionText') ?? '')
  });

  const { data: streak } = await supabase.from('streaks').select('*').eq('user_id', user.id).maybeSingle();
  const xp = (streak?.xp ?? 0) + getReflectionXp();
  await supabase.from('streaks').upsert({
    user_id: user.id,
    xp,
    level: getLevelFromXp(xp).id
  });

  revalidatePath(`/${locale}/challenges`);
  revalidatePath(`/${locale}/progress`);
}

export async function submitWeeklyCheckInAction(formData: FormData) {
  const locale = String(formData.get('locale') ?? 'ko');
  if (!isSupabaseConfigured()) {
    revalidatePath(`/${locale}/home`);
    return;
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) {
    return;
  }

  await supabase.from('weekly_check_ins').upsert({
    user_id: user.id,
    week_start_date: getSuggestedWeekLabel(),
    satisfaction_score: Number(formData.get('satisfactionScore') ?? 3),
    energy_score: Number(formData.get('energyScore') ?? 3),
    note: String(formData.get('note') ?? '')
  });

  revalidatePath(`/${locale}/home`);
  revalidatePath(`/${locale}/progress`);
}
