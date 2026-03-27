import { corsHeaders } from '../_shared/cors.ts';
import { generateJson } from '../_shared/gemini.ts';
import { createServiceClient, localClock, weekStartForTimezone } from '../_shared/helpers.ts';

function fallbackChallenges(locale: string) {
  return {
    challenges: [
      {
        title: locale === 'ko' ? '안부 메시지 1개 보내기' : 'Send one check-in message',
        description:
          locale === 'ko'
            ? '부담이 낮은 연결 한 개를 이번 주 안에 시도하세요.'
            : 'Try one low-pressure connection this week.',
        difficulty: 'easy',
        category: 'maintain',
        conversation_starters:
          locale === 'ko'
            ? ['문득 네 생각이 났어.', '요즘 어떤가?', '이번 주 어때?']
            : ['I thought of you this week.', 'How have you been lately?', 'How is your week going?'],
        estimated_time: '10min'
      },
      {
        title: locale === 'ko' ? '점심 제안 한 번 하기' : 'Invite one person to lunch',
        description:
          locale === 'ko'
            ? '현실에서 만날 수 있는 가벼운 제안을 하나 해보세요.'
            : 'Make one light-weight real-world invitation.',
        difficulty: 'medium',
        category: 'deepen',
        conversation_starters:
          locale === 'ko'
            ? ['이번 주 점심 같이 할래?', '요즘 프로젝트는 어때?', '주말 계획 있어?']
            : ['Want to grab lunch this week?', 'How is the project feeling lately?', 'Any plans for the weekend?'],
        estimated_time: '30min'
      },
      {
        title: locale === 'ko' ? '로컬 모임 하나 저장하기' : 'Save one local event',
        description:
          locale === 'ko'
            ? '현실에서 참여할 수 있는 이벤트를 하나 찾아 저장하세요.'
            : 'Find one local event you could realistically attend and save it.',
        difficulty: 'easy',
        category: 'explore',
        conversation_starters:
          locale === 'ko'
            ? ['이 모임은 처음이세요?', '여기 자주 오세요?', '비슷한 모임도 있나요?']
            : ['Is this your first time here?', 'Do you come to events like this often?', 'Do you know similar groups nearby?'],
        estimated_time: '30min'
      }
    ],
    weekly_message:
      locale === 'ko'
        ? '이번 주에는 적은 수의 행동을 확실히 해내는 데 집중해 봅시다.'
        : 'This week, focus on doing a small number of actions with intention.'
  };
}

async function createChallengesForUser(supabase: ReturnType<typeof createServiceClient>, userId: string, locale: string, timezone: string) {
  const fallback = fallbackChallenges(locale);
  const context = { userId, locale, timezone };
  const generated = await generateJson(
    'You are SoloSync\'s challenge generator. Return JSON with challenges and weekly_message.',
    context,
    fallback
  );
  const weekStartDate = weekStartForTimezone(timezone);
  const weekNumber = Number(weekStartDate.slice(5, 7)) * 4;

  for (const challenge of generated.challenges) {
    await supabase.from('challenges').upsert({
      user_id: userId,
      week_number: weekNumber,
      week_start_date: weekStartDate,
      title: challenge.title,
      description: challenge.description,
      difficulty: challenge.difficulty,
      category: challenge.category,
      estimated_time: challenge.estimated_time,
      conversation_starters: challenge.conversation_starters
    });
  }

  return generated;
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const payload = await request.json().catch(() => ({}));
  const supabase = createServiceClient();

  if (payload.userId) {
    const { data: userRow } = await supabase.from('users').select('locale, timezone').eq('id', payload.userId).single();
    const generated = await createChallengesForUser(supabase, payload.userId, userRow?.locale ?? 'ko', userRow?.timezone ?? 'UTC');
    return Response.json(generated, { headers: corsHeaders });
  }

  const { data: users } = await supabase.from('users').select('id, locale, timezone').eq('onboarding_completed', true);
  let processed = 0;

  for (const user of users ?? []) {
    const clock = localClock(user.timezone ?? 'UTC');
    if (payload.scheduled && !(clock.weekday === 'Mon' && clock.hour === 0)) {
      continue;
    }

    await createChallengesForUser(supabase, user.id, user.locale ?? 'ko', user.timezone ?? 'UTC');
    processed += 1;
  }

  return Response.json({ processed }, { headers: corsHeaders });
});
