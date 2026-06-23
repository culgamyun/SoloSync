import type { ChallengeAdjustmentRequestType, ChallengeRecord } from '@/types/challenge';
import type { RoutineSpace } from '@/types/onboarding';

type SupportedLocale = 'ko' | 'en';
type RoutineSpaceKey = RoutineSpace;

export type ChallengeMissionSnapshot = Pick<
  ChallengeRecord,
  | 'title'
  | 'description'
  | 'difficulty'
  | 'category'
  | 'estimatedTime'
  | 'conversationStarters'
  | 'missionKind'
  | 'missionContext'
  | 'safeLine'
  | 'minimumWin'
  | 'fear'
  | 'reframe'
>;

const adjustmentRequestTypes = new Set<ChallengeAdjustmentRequestType>(['smaller', 'different_space', 'safer_line']);

const routineSpaceCatalog: Record<
  SupportedLocale,
  Record<
    RoutineSpaceKey,
    {
      label: string;
      context: string;
      smallerTitle: string;
      differentSpaceTitle: string;
      saferLineTitle: string;
      saferLine: string;
    }
  >
> = {
  ko: {
    cafe: {
      label: '단골 카페',
      context: '자주 가는 카페',
      smallerTitle: '단골 카페에서 눈 마주치고 고개 끄덕이기',
      differentSpaceTitle: '단골 카페에서 눈 마주치고 인사하기',
      saferLineTitle: '단골 카페에서 짧게 인사하기',
      saferLine: '안녕하세요.'
    },
    convenience_store: {
      label: '편의점',
      context: '집이나 회사 근처 편의점',
      smallerTitle: '편의점에서 계산 전에 고개 끄덕이기',
      differentSpaceTitle: '편의점에서 계산 전에 짧게 인사하기',
      saferLineTitle: '편의점에서 짧게 인사하기',
      saferLine: '안녕하세요.'
    },
    gym: {
      label: '헬스장',
      context: '자주 가는 헬스장',
      smallerTitle: '헬스장에서 같은 시간대 사람에게 고개 끄덕이기',
      differentSpaceTitle: '헬스장에서 같은 시간대 사람에게 짧게 인사하기',
      saferLineTitle: '헬스장에서 짧게 인사하기',
      saferLine: '안녕하세요.'
    },
    beauty_salon: {
      label: '미용실',
      context: '자주 가는 미용실',
      smallerTitle: '미용실에서 들어갈 때 눈인사만 하기',
      differentSpaceTitle: '미용실에서 짧게 인사하고 앉기',
      saferLineTitle: '미용실에서 안전한 한마디 하기',
      saferLine: '안녕하세요. 오늘도 잘 부탁드려요.'
    },
    office_building: {
      label: '회사 건물',
      context: '회사 건물 로비나 엘리베이터 앞',
      smallerTitle: '회사 건물에서 고개 끄덕이고 지나가기',
      differentSpaceTitle: '회사 건물에서 짧게 인사하기',
      saferLineTitle: '회사 건물에서 부담 낮은 인사하기',
      saferLine: '안녕하세요.'
    }
  },
  en: {
    cafe: {
      label: 'regular cafe',
      context: 'A cafe you already visit',
      smallerTitle: 'Make eye contact at your regular cafe',
      differentSpaceTitle: 'Say a quick hello at your regular cafe',
      saferLineTitle: 'Use a short hello at your regular cafe',
      saferLine: 'Hi.'
    },
    convenience_store: {
      label: 'convenience store',
      context: 'A convenience store near home or work',
      smallerTitle: 'Make eye contact before paying at the convenience store',
      differentSpaceTitle: 'Say a quick hello before paying',
      saferLineTitle: 'Use a short hello at the convenience store',
      saferLine: 'Hi.'
    },
    gym: {
      label: 'gym',
      context: 'The gym you already go to',
      smallerTitle: 'Nod to someone at the gym',
      differentSpaceTitle: 'Say a quick hello at the gym',
      saferLineTitle: 'Use a short hello at the gym',
      saferLine: 'Hi.'
    },
    beauty_salon: {
      label: 'beauty salon',
      context: 'A salon you already visit',
      smallerTitle: 'Make eye contact when you arrive at the salon',
      differentSpaceTitle: 'Say a quick hello at the salon',
      saferLineTitle: 'Use a safer line at the salon',
      saferLine: 'Hi. Good to see you again.'
    },
    office_building: {
      label: 'office building',
      context: 'The office lobby or elevator area',
      smallerTitle: 'Nod to someone in your office building',
      differentSpaceTitle: 'Say a quick hello in your office building',
      saferLineTitle: 'Use a low-pressure hello in your office building',
      saferLine: 'Hi.'
    }
  }
};

export function isChallengeAdjustmentRequestType(value: string): value is ChallengeAdjustmentRequestType {
  return adjustmentRequestTypes.has(value as ChallengeAdjustmentRequestType);
}

export function createMissionSnapshot(challenge: ChallengeRecord): ChallengeMissionSnapshot {
  return {
    title: challenge.title,
    description: challenge.description,
    difficulty: challenge.difficulty,
    category: challenge.category,
    estimatedTime: challenge.estimatedTime,
    conversationStarters: challenge.conversationStarters,
    missionKind: challenge.missionKind,
    missionContext: challenge.missionContext,
    safeLine: challenge.safeLine,
    minimumWin: challenge.minimumWin,
    fear: challenge.fear,
    reframe: challenge.reframe
  };
}

function normalizeLocale(locale: string): SupportedLocale {
  return locale === 'en' ? 'en' : 'ko';
}

function detectRoutineSpaceKey(value: string | null | undefined): RoutineSpaceKey | null {
  if (!value) {
    return null;
  }

  const normalized = value.toLowerCase();
  if (normalized === 'cafe' || normalized === 'convenience_store' || normalized === 'gym' || normalized === 'beauty_salon' || normalized === 'office_building') {
    return normalized as RoutineSpaceKey;
  }

  if (normalized.includes('카페') || normalized.includes('cafe')) {
    return 'cafe';
  }

  if (normalized.includes('편의점') || normalized.includes('convenience')) {
    return 'convenience_store';
  }

  if (normalized.includes('헬스') || normalized.includes('gym')) {
    return 'gym';
  }

  if (normalized.includes('미용실') || normalized.includes('salon')) {
    return 'beauty_salon';
  }

  if (normalized.includes('회사') || normalized.includes('오피스') || normalized.includes('office') || normalized.includes('elevator')) {
    return 'office_building';
  }

  return null;
}

function getAlternativeRoutineSpace(
  challenge: ChallengeRecord,
  locale: SupportedLocale,
  routineSpaces: string[]
): RoutineSpaceKey {
  const currentSpace =
    detectRoutineSpaceKey(challenge.missionContext) ??
    detectRoutineSpaceKey(challenge.title) ??
    detectRoutineSpaceKey(challenge.safeLine);

  const preferredSpace = routineSpaces
    .map((space) => detectRoutineSpaceKey(space))
    .find((space): space is RoutineSpaceKey => Boolean(space && space !== currentSpace));

  if (preferredSpace) {
    return preferredSpace;
  }

  return currentSpace === 'convenience_store' ? 'cafe' : 'convenience_store';
}

function getLocalizedFear(locale: SupportedLocale, requestType: ChallengeAdjustmentRequestType) {
  if (locale === 'en') {
    if (requestType === 'safer_line') {
      return 'I might sound awkward if I say too much.';
    }

    if (requestType === 'different_space') {
      return 'A new place might still feel tense.';
    }

    return 'They might think I am strange.';
  }

  if (requestType === 'safer_line') {
    return '말을 길게 하다 어색해질까 봐.';
  }

  if (requestType === 'different_space') {
    return '낯선 반응이 더 부담스러울까 봐.';
  }

  return '상대가 이상하게 볼까 봐.';
}

function getLocalizedReframe(locale: SupportedLocale, requestType: ChallengeAdjustmentRequestType) {
  if (locale === 'en') {
    if (requestType === 'safer_line') {
      return 'Shortening the line is not avoiding the mission. It is how you keep today workable.';
    }

    if (requestType === 'different_space') {
      return 'Changing the place is not backing out. It is how you find a version you can actually do.';
    }

    return 'Today is about leaving a tiny social trace, not proving anything.';
  }

  if (requestType === 'safer_line') {
    return '문장을 줄이는 건 도망이 아니라 조절이에요. 오늘 할 수 있는 만큼으로 충분해요.';
  }

  if (requestType === 'different_space') {
    return '장소를 바꾸는 건 후퇴가 아니라 조정이에요. 되는 버전으로 다시 잡는 게 더 중요해요.';
  }

  return '오늘은 잘 해내는 날보다 흔적을 남기는 날이에요. 아주 작아도 연결은 시작돼요.';
}

export function buildAdjustedMicroMission(
  challenge: ChallengeRecord,
  requestType: ChallengeAdjustmentRequestType,
  locale: string,
  routineSpaces: string[] = []
): ChallengeRecord {
  if (challenge.missionKind !== 'micro_social') {
    throw new Error('Only micro-social challenges can be adjusted.');
  }

  const language = normalizeLocale(locale);
  const currentSpace =
    detectRoutineSpaceKey(challenge.missionContext) ??
    detectRoutineSpaceKey(challenge.title) ??
    detectRoutineSpaceKey(challenge.safeLine) ??
    'cafe';
  const nextSpace = requestType === 'different_space' ? getAlternativeRoutineSpace(challenge, language, routineSpaces) : currentSpace;
  const space = routineSpaceCatalog[language][nextSpace];
  const nextFear = challenge.fear ?? getLocalizedFear(language, requestType);
  const nextReframe = getLocalizedReframe(language, requestType);

  if (requestType === 'smaller') {
    return {
      ...challenge,
      title: space.smallerTitle,
      description:
        language === 'en'
          ? 'Lower the bar for today. Eye contact or a small nod is enough to keep the loop alive.'
          : '이번 주는 기준을 더 낮춥니다. 말이 길어지지 않아도 되고, 작은 신호 하나면 충분해요.',
      difficulty: 'easy',
      category: 'reach_out',
      estimatedTime: '10min',
      conversationStarters: [space.saferLine],
      missionContext: space.context,
      safeLine: space.saferLine,
      minimumWin:
        language === 'en' ? 'Eye contact or a small nod still counts as success.' : '눈을 마주치고 고개만 살짝 끄덕여도 성공',
      fear: nextFear,
      reframe: nextReframe
    };
  }

  if (requestType === 'safer_line') {
    return {
      ...challenge,
      title: space.saferLineTitle,
      description:
        language === 'en'
          ? 'Keep the same place, but switch to a shorter line that feels easier to carry today.'
          : '같은 장소에서 더 짧고 안전한 한마디로 시작해 봅니다. 오늘은 짧을수록 좋아요.',
      difficulty: 'easy',
      category: 'reach_out',
      estimatedTime: '10min',
      conversationStarters: [space.saferLine],
      missionContext: space.context,
      safeLine: space.saferLine,
      minimumWin: language === 'en' ? 'One short hello is enough.' : '짧게 인사 한마디만 해도 성공',
      fear: nextFear,
      reframe: nextReframe
    };
  }

  return {
    ...challenge,
    title: space.differentSpaceTitle,
    description:
      language === 'en'
        ? 'Move the mission to a steadier daily spot so the interaction feels easier to start.'
        : '이번 주는 장소를 바꿔 더 편한 생활 공간에서 시도합니다. 되는 장소로 옮겨도 괜찮아요.',
    difficulty: 'easy',
    category: 'reach_out',
    estimatedTime: '10min',
    conversationStarters: [space.saferLine],
    missionContext: space.context,
    safeLine: space.saferLine,
    minimumWin: language === 'en' ? 'Eye contact and a quick hello still count as success.' : '눈 마주치고 인사만 해도 성공',
    fear: nextFear,
    reframe: nextReframe
  };
}
