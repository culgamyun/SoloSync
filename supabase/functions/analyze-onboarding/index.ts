import { corsHeaders } from '../_shared/cors.ts';
import { generateJson } from '../_shared/gemini.ts';

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const { onboarding, locale = 'ko' } = await request.json();
  const relationshipMap = onboarding.relationshipMap ?? {};
  const nonZeroRelationships = Object.values(relationshipMap).filter((value) => Number(value) > 0).length;
  const fallback = {
    score: Math.min(100, nonZeroRelationships * 8 + Number(onboarding.socialSatisfactionScore ?? 5) * 3),
    breakdown: {
      connection_frequency: 8,
      relationship_diversity: Math.min(25, nonZeroRelationships * 6),
      challenge_completion: 0,
      satisfaction: Math.round((Number(onboarding.socialSatisfactionScore ?? 5) / 10) * 25)
    },
    insight:
      locale === 'ko'
        ? '작은 연결을 반복할수록 점수가 안정적으로 올라갈 가능성이 높아요.'
        : 'Small, repeatable moments of connection are likely to move your score most reliably.',
    firstChallenge: {
      title: locale === 'ko' ? '이번 주 안부 메시지 보내기' : 'Send a thoughtful check-in this week',
      description:
        locale === 'ko'
          ? '오랫동안 연락하지 않은 사람에게 구체적인 안부 메시지를 보내보세요.'
          : 'Reach out to someone you have not spoken to in a while with a specific message.',
      difficulty: 'easy',
      category: 'maintain',
      conversation_starters:
        locale === 'ko'
          ? ['문득 네 생각이 났어.', '요즘 어떻게 지내?', '이번 주에 잠깐 통화할래?']
          : ['I thought of you this week.', 'How have you been really?', 'Want to catch up for 10 minutes this week?'],
      estimated_time: '10min'
    }
  };

  const result = await generateJson(
    'You are SoloSync\'s social health coach. Return JSON with score, breakdown, insight and firstChallenge.',
    { onboarding, locale },
    fallback
  );

  return Response.json(result, { headers: corsHeaders });
});
