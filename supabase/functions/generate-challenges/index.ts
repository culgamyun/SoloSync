import { corsHeaders } from '../_shared/cors.ts';
import { generateJson } from '../_shared/gemini.ts';
import { createServiceClient, localClock, weekStartForTimezone } from '../_shared/helpers.ts';

const allowedDifficulties = ['easy', 'medium', 'hard'];
const allowedCategories = ['reach_out', 'deepen', 'explore', 'maintain'];
const allowedEstimatedTimes = ['10min', '30min', '1hr', '2hr+'];
const allowedMissionKinds = ['standard', 'micro_social'];

type GeneratedChallenge = {
  title: string;
  description: string;
  difficulty: string;
  category: string;
  conversation_starters: string[];
  estimated_time: string;
  mission_kind?: string;
  mission_context?: string | null;
  safe_line?: string | null;
  minimum_win?: string | null;
  fear?: string | null;
  reframe?: string | null;
};

type ChallengeGeneration = {
  challenges: GeneratedChallenge[];
  weekly_message: string;
};

function fallbackChallenges(locale: string): ChallengeGeneration {
  return {
    challenges: [
      {
        title: locale === 'ko' ? '단골 카페에서 눈 마주치고 인사하기' : 'Greet someone at a regular cafe',
        description:
          locale === 'ko'
            ? '이미 지나치는 생활 공간에서 20초짜리 작은 접촉 하나만 만들어보세요.'
            : 'Create one tiny, low-pressure point of contact in a place you already visit.',
        difficulty: 'easy',
        category: 'reach_out',
        conversation_starters:
          locale === 'ko'
            ? ['안녕하세요. 오늘도 늦게까지 하시네요.']
            : ['Hi. You are here late today too.'],
        estimated_time: '10min',
        mission_kind: 'micro_social',
        mission_context: locale === 'ko' ? '자주 가는 편의점 또는 카페' : 'A regular convenience store or cafe',
        safe_line: locale === 'ko' ? '안녕하세요. 오늘도 늦게까지 하시네요.' : 'Hi. You are here late today too.',
        minimum_win: locale === 'ko' ? '눈 마주치고 인사만 해도 성공' : 'Eye contact and a greeting count as success',
        fear: locale === 'ko' ? '상대가 이상하게 볼까 봐' : 'They might think I am strange',
        reframe:
          locale === 'ko'
            ? '상대가 짧게 대답해도 실패가 아닙니다. 낯선 사람에게 예의를 건넨 것만으로 이번 주의 반례는 생겼어요.'
            : 'A short answer is not failure. Offering a small courtesy is already this week’s counterexample.'
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
        estimated_time: '30min',
        mission_kind: 'standard'
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
        estimated_time: '30min',
        mission_kind: 'standard'
      }
    ],
    weekly_message:
      locale === 'ko'
        ? '이번 주에는 적은 수의 행동을 확실히 해내는 데 집중해 봅시다.'
        : 'This week, focus on doing a small number of actions with intention.'
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function safeString(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback;
}

function safeNullableString(value: unknown, fallback: string | null) {
  if (value === null || value === undefined) {
    return fallback;
  }

  return typeof value === 'string' ? value : fallback;
}

function safeEnum(value: unknown, allowed: string[], fallback: string) {
  return typeof value === 'string' && allowed.includes(value) ? value : fallback;
}

function safeStringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const strings = value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  return strings.length > 0 ? strings : fallback;
}

function normalizeChallenge(candidate: unknown, fallback: ReturnType<typeof fallbackChallenges>['challenges'][number]) {
  const challenge = isRecord(candidate) ? candidate : {};

  return {
    title: safeString(challenge.title, fallback.title),
    description: safeString(challenge.description, fallback.description),
    difficulty: safeEnum(challenge.difficulty, allowedDifficulties, fallback.difficulty),
    category: safeEnum(challenge.category, allowedCategories, fallback.category),
    estimated_time: safeEnum(challenge.estimated_time, allowedEstimatedTimes, fallback.estimated_time),
    conversation_starters: safeStringArray(challenge.conversation_starters, fallback.conversation_starters),
    mission_kind: safeEnum(challenge.mission_kind, allowedMissionKinds, fallback.mission_kind ?? 'standard'),
    mission_context: safeNullableString(challenge.mission_context, fallback.mission_context ?? null),
    safe_line: safeNullableString(challenge.safe_line, fallback.safe_line ?? null),
    minimum_win: safeNullableString(challenge.minimum_win, fallback.minimum_win ?? null),
    fear: safeNullableString(challenge.fear, fallback.fear ?? null),
    reframe: safeNullableString(challenge.reframe, fallback.reframe ?? null)
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
  const generatedChallenges = Array.isArray(generated.challenges) ? generated.challenges : [];
  const challenges = fallback.challenges.map((fallbackChallenge, index) => normalizeChallenge(generatedChallenges[index], fallbackChallenge));

  for (const challenge of challenges) {
    await supabase.from('challenges').upsert({
      user_id: userId,
      week_number: weekNumber,
      week_start_date: weekStartDate,
      title: challenge.title,
      description: challenge.description,
      difficulty: challenge.difficulty,
      category: challenge.category,
      estimated_time: challenge.estimated_time,
      conversation_starters: challenge.conversation_starters,
      mission_kind: challenge.mission_kind,
      mission_context: challenge.mission_context,
      safe_line: challenge.safe_line,
      minimum_win: challenge.minimum_win,
      fear: challenge.fear,
      reframe: challenge.reframe
    });
  }

  return {
    challenges,
    weekly_message: safeString(generated.weekly_message, fallback.weekly_message)
  };
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
