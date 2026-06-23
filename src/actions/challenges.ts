'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import {
  buildAdjustedMicroMission,
  createMissionSnapshot,
  isChallengeAdjustmentRequestType
} from '@/lib/challenges/micro-mission-adjustments';
import { getSuggestedWeekLabel } from '@/lib/server/app-data';
import { shouldUseDemoDataForRequest } from '@/lib/server/demo-mode';
import { refreshSocialHealthScore } from '@/lib/server/score-rollup';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/supabase/types';
import { getChallengeXp, getReflectionXp, getLevelFromXp } from '@/lib/utils/xp';
import type { ChallengeRecord, ChallengeReflectionOutcome } from '@/types/challenge';

const reflectionOutcomes = new Set<ChallengeReflectionOutcome>(['greeted', 'said_line', 'could_not_do_it']);

function getChallengeDetailHref(locale: string, challengeId: string, params?: Record<string, string>) {
  const basePath = `/${locale}/challenges/${challengeId}`;

  if (!params || Object.keys(params).length === 0) {
    return basePath;
  }

  const searchParams = new URLSearchParams(params);
  return `${basePath}?${searchParams.toString()}`;
}

function mapChallengeRowToRecord(row: Database['public']['Tables']['challenges']['Row']): ChallengeRecord {
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

function mapRecordToChallengeUpdate(challenge: ChallengeRecord): Database['public']['Tables']['challenges']['Update'] {
  return {
    title: challenge.title,
    description: challenge.description,
    difficulty: challenge.difficulty,
    category: challenge.category,
    estimated_time: challenge.estimatedTime,
    conversation_starters: challenge.conversationStarters,
    mission_kind: challenge.missionKind,
    mission_context: challenge.missionContext,
    safe_line: challenge.safeLine,
    minimum_win: challenge.minimumWin,
    fear: challenge.fear,
    reframe: challenge.reframe
  };
}

function redirectTo(href: string): never {
  redirect(href as never);
}

function redirectToProgress(locale: string): never {
  redirectTo(`/${locale}/progress`);
}

async function refreshScoreSafely(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  locale: string
) {
  try {
    await refreshSocialHealthScore(supabase, userId, locale);
  } catch {
    // Score refresh should never block the core mission/reflection flow.
  }
}

export async function updateChallengeStatusAction(formData: FormData) {
  const locale = String(formData.get('locale') ?? 'ko');
  const challengeId = String(formData.get('challengeId'));
  const nextStatus = String(formData.get('status')) as 'pending' | 'in_progress' | 'completed' | 'skipped';

  if (await shouldUseDemoDataForRequest()) {
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

  const challengeUpdate = supabase
    .from('challenges')
    .update({
      status: nextStatus,
      started_at: nextStatus === 'in_progress' ? new Date().toISOString() : challenge.started_at,
      completed_at: nextStatus === 'completed' ? new Date().toISOString() : challenge.completed_at
    })
    .eq('id', challengeId);

  const { data: updatedChallenge } = await (nextStatus === 'completed' ? challengeUpdate.neq('status', 'completed') : challengeUpdate)
    .select('id')
    .maybeSingle();

  if (nextStatus === 'completed' && updatedChallenge) {
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

  if (nextStatus === 'completed' || nextStatus === 'skipped') {
    await refreshScoreSafely(supabase, user.id, locale);
  }

  revalidatePath(`/${locale}/home`);
  revalidatePath(`/${locale}/challenges`);
  revalidatePath(`/${locale}/progress`);
}

export async function submitReflectionAction(formData: FormData) {
  const locale = String(formData.get('locale') ?? 'ko');
  if (await shouldUseDemoDataForRequest()) {
    revalidatePath(`/${locale}/challenges`);
    revalidatePath(`/${locale}/progress`);
    redirectToProgress(locale);
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) {
    return;
  }

  const challengeId = String(formData.get('challengeId'));
  const rawOutcome = String(formData.get('outcome') ?? '');
  const outcome = reflectionOutcomes.has(rawOutcome as ChallengeReflectionOutcome)
    ? (rawOutcome as ChallengeReflectionOutcome)
    : null;

  const { data: insertedReflection } = await supabase
    .from('challenge_reflections')
    .upsert(
      {
        challenge_id: challengeId,
        user_id: user.id,
        mood_before: Number(formData.get('moodBefore') ?? 3),
        mood_after: Number(formData.get('moodAfter') ?? 3),
        difficulty_felt: Number(formData.get('difficultyFelt') ?? 3),
        outcome,
        reflection_text: String(formData.get('reflectionText') ?? '')
      },
      { onConflict: 'user_id,challenge_id', ignoreDuplicates: true }
    )
    .select('id')
    .maybeSingle();

  if (!insertedReflection) {
    await refreshScoreSafely(supabase, user.id, locale);
    revalidatePath(`/${locale}/challenges`);
    revalidatePath(`/${locale}/progress`);
    redirectToProgress(locale);
  }

  const { data: streak } = await supabase.from('streaks').select('*').eq('user_id', user.id).maybeSingle();
  const xp = (streak?.xp ?? 0) + getReflectionXp();
  await supabase.from('streaks').upsert({
    user_id: user.id,
    xp,
    level: getLevelFromXp(xp).id
  });

  await refreshScoreSafely(supabase, user.id, locale);

  revalidatePath(`/${locale}/challenges`);
  revalidatePath(`/${locale}/progress`);
  redirectToProgress(locale);
}

export async function submitWeeklyCheckInAction(formData: FormData) {
  const locale = String(formData.get('locale') ?? 'ko');
  if (await shouldUseDemoDataForRequest()) {
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

  await refreshScoreSafely(supabase, user.id, locale);

  revalidatePath(`/${locale}/home`);
  revalidatePath(`/${locale}/progress`);
}

export async function adjustMicroMissionAction(formData: FormData) {
  const locale = String(formData.get('locale') ?? 'ko');
  const challengeId = String(formData.get('challengeId') ?? '');
  const rawRequestType = String(formData.get('requestType') ?? '');
  const detailHref = getChallengeDetailHref(locale, challengeId);

  if (!challengeId || !isChallengeAdjustmentRequestType(rawRequestType)) {
    redirectTo(getChallengeDetailHref(locale, challengeId, { adjustmentError: 'invalid' }));
  }

  const requestType = rawRequestType;

  if (await shouldUseDemoDataForRequest()) {
    revalidatePath(detailHref);
    redirectTo(getChallengeDetailHref(locale, challengeId, { adjusted: requestType }));
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirectTo(getChallengeDetailHref(locale, challengeId, { adjustmentError: 'unavailable' }));
  }

  const { data: challenge } = await supabase
    .from('challenges')
    .select('*')
    .eq('id', challengeId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!challenge || challenge.mission_kind !== 'micro_social') {
    redirectTo(getChallengeDetailHref(locale, challengeId, { adjustmentError: 'unavailable' }));
  }

  if (challenge.status === 'completed') {
    redirectTo(getChallengeDetailHref(locale, challengeId, { adjustmentError: 'completed' }));
  }

  let routineSpaces: string[] = [];

  try {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('routine_spaces')
      .eq('user_id', user.id)
      .maybeSingle();
    routineSpaces = profile?.routine_spaces ?? [];
  } catch {
    routineSpaces = [];
  }

  const currentMission = mapChallengeRowToRecord(challenge);
  const nextMission = buildAdjustedMicroMission(currentMission, requestType, locale, routineSpaces);

  const { error: adjustmentInsertError } = await supabase.from('challenge_mission_adjustments').insert({
    challenge_id: challenge.id,
    user_id: user.id,
    request_type: requestType,
    previous_mission: createMissionSnapshot(currentMission),
    next_mission: createMissionSnapshot(nextMission)
  });

  if (adjustmentInsertError) {
    redirectTo(getChallengeDetailHref(locale, challengeId, { adjustmentError: 'unavailable' }));
  }

  const { error: challengeUpdateError } = await supabase
    .from('challenges')
    .update(mapRecordToChallengeUpdate(nextMission))
    .eq('id', challenge.id)
    .eq('user_id', user.id);

  if (challengeUpdateError) {
    redirectTo(getChallengeDetailHref(locale, challengeId, { adjustmentError: 'unavailable' }));
  }

  revalidatePath(detailHref);
  revalidatePath(`/${locale}/challenges`);
  revalidatePath(`/${locale}/home`);
  redirectTo(getChallengeDetailHref(locale, challengeId, { adjusted: requestType }));
}
