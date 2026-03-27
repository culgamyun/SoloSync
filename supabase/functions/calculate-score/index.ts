import { corsHeaders } from '../_shared/cors.ts';
import { createServiceClient, localClock } from '../_shared/helpers.ts';

function countNonZeroRelationships(map: Record<string, number>) {
  return Object.values(map ?? {}).filter((value) => Number(value) > 0).length;
}

async function calculateForUser(supabase: ReturnType<typeof createServiceClient>, userId: string) {
  const fourWeeksAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 28).toISOString();
  const twoWeeksAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString();

  const [profileResult, challengeResult, reflectionResult] = await Promise.all([
    supabase.from('user_profiles').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('challenges').select('*').eq('user_id', userId).gte('created_at', fourWeeksAgo),
    supabase.from('challenge_reflections').select('*').eq('user_id', userId).gte('created_at', twoWeeksAgo)
  ]);

  const completedCount = (challengeResult.data ?? []).filter((item) => item.status === 'completed').length;
  const totalCount = challengeResult.data?.length ?? 0;
  const relationshipDiversity = Math.min(25, countNonZeroRelationships(profileResult.data?.relationship_map as Record<string, number>) * 6);
  const connectionFrequency = Math.min(25, completedCount * 3);
  const challengeCompletion = totalCount > 0 ? Math.round((completedCount / totalCount) * 25) : 0;
  const moodValues = (reflectionResult.data ?? []).map((item) => item.mood_after).filter(Boolean) as number[];
  const moodAverage = moodValues.length > 0 ? moodValues.reduce((sum, value) => sum + value, 0) / moodValues.length : 2.5;
  const satisfaction = Math.round((moodAverage / 5) * 25);
  const breakdown = {
    connection_frequency: connectionFrequency,
    relationship_diversity: relationshipDiversity,
    challenge_completion: challengeCompletion,
    satisfaction
  };
  const score = Object.values(breakdown).reduce((sum, value) => sum + value, 0);

  await supabase.from('social_health_scores').insert({
    user_id: userId,
    score,
    breakdown,
    insight:
      score >= 70
        ? 'Your recent actions are compounding. Keep the cadence steady.'
        : 'Your next score lift will likely come from one consistent real-world action this week.'
  });

  return { userId, score, breakdown };
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const payload = await request.json().catch(() => ({}));
  const supabase = createServiceClient();

  if (payload.userId) {
    const result = await calculateForUser(supabase, payload.userId);
    return Response.json(result, { headers: corsHeaders });
  }

  const { data: users } = await supabase.from('users').select('id, timezone').eq('onboarding_completed', true);
  const results = [];
  for (const user of users ?? []) {
    const clock = localClock(user.timezone ?? 'UTC');
    if (payload.scheduled && !(clock.weekday === 'Sun' && clock.hour === 23)) {
      continue;
    }
    results.push(await calculateForUser(supabase, user.id));
  }

  return Response.json({ processed: results.length, results }, { headers: corsHeaders });
});
