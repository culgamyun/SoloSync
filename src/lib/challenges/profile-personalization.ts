import type { RoutineSpace, SocialFear } from '../../types/onboarding';

type SupportedLocale = 'ko' | 'en';
type LocalizedLabel = Record<SupportedLocale, string>;

const routineSpaceValues = ['cafe', 'convenience_store', 'gym', 'beauty_salon', 'office_building'] as const;
const socialFearValues = [
  'being_judged',
  'awkward_silence',
  'feeling_pushy',
  'bothering_busy_people',
  'running_into_the_same_person'
] as const;

export const routineSpaceOptions: { value: RoutineSpace; label: LocalizedLabel }[] = [
  { value: 'cafe', label: { ko: '카페', en: 'Cafe' } },
  { value: 'convenience_store', label: { ko: '편의점', en: 'Convenience store' } },
  { value: 'gym', label: { ko: '헬스장', en: 'Gym' } },
  { value: 'beauty_salon', label: { ko: '미용실', en: 'Beauty salon' } },
  { value: 'office_building', label: { ko: '회사 건물', en: 'Office building' } }
] as const;

export const socialFearOptions: { value: SocialFear; label: LocalizedLabel }[] = [
  { value: 'being_judged', label: { ko: '이상하게 볼까 봐', en: 'Being judged' } },
  { value: 'awkward_silence', label: { ko: '말이 끊길까 봐', en: 'Awkward silence' } },
  { value: 'feeling_pushy', label: { ko: '내가 들이대는 사람처럼 보일까 봐', en: 'Feeling pushy' } },
  { value: 'bothering_busy_people', label: { ko: '바쁜 사람을 방해할까 봐', en: 'Bothering busy people' } },
  {
    value: 'running_into_the_same_person',
    label: { ko: '다음에 또 마주치면 어색할까 봐', en: 'Seeing the same person again later' }
  }
] as const;

const routineSpaceMissionCopy: Record<
  RoutineSpace,
  {
    title: LocalizedLabel;
    context: LocalizedLabel;
    safeLine: LocalizedLabel;
  }
> = {
  cafe: {
    title: { ko: '단골 카페에서 눈 마주치고 인사하기', en: 'Greet someone at your regular cafe' },
    context: { ko: '자주 가는 카페', en: 'A cafe you already visit' },
    safeLine: { ko: '안녕하세요.', en: 'Hi.' }
  },
  convenience_store: {
    title: { ko: '편의점에서 짧게 인사하기', en: 'Say a quick hello at the convenience store' },
    context: { ko: '집이나 회사 근처 편의점', en: 'A convenience store near home or work' },
    safeLine: { ko: '안녕하세요.', en: 'Hi.' }
  },
  gym: {
    title: { ko: '헬스장에서 같은 시간대 사람에게 짧게 인사하기', en: 'Say a quick hello at the gym' },
    context: { ko: '자주 가는 헬스장', en: 'The gym you already go to' },
    safeLine: { ko: '안녕하세요.', en: 'Hi.' }
  },
  beauty_salon: {
    title: { ko: '미용실에서 짧게 인사하고 한마디 하기', en: 'Say a quick hello at the salon' },
    context: { ko: '자주 가는 미용실', en: 'A salon you already visit' },
    safeLine: { ko: '안녕하세요. 오늘도 잘 부탁드려요.', en: 'Hi. Good to see you again.' }
  },
  office_building: {
    title: { ko: '회사 건물에서 짧게 인사하기', en: 'Say a quick hello in your office building' },
    context: { ko: '회사 건물 로비나 엘리베이터 앞', en: 'The office lobby or elevator area' },
    safeLine: { ko: '안녕하세요.', en: 'Hi.' }
  }
};

const socialFearCopy: Record<
  SocialFear,
  {
    fear: LocalizedLabel;
    reframe: LocalizedLabel;
  }
> = {
  being_judged: {
    fear: { ko: '상대가 이상하게 볼까 봐.', en: 'They might think I am strange.' },
    reframe: {
      ko: '짧게 반응해도 실패가 아니에요. 낯선 사람에게 예의를 건넨 것만으로 이번 주의 반례는 생겨요.',
      en: 'A short response is not failure. A small courtesy still counts as this week’s counterexample.'
    }
  },
  awkward_silence: {
    fear: { ko: '말이 끊기고 어색해질까 봐.', en: 'The conversation might stall and feel awkward.' },
    reframe: {
      ko: '이번 주 목표는 대화를 길게 이어가는 게 아니라 짧은 접촉을 남기는 거예요.',
      en: 'The goal is not a long conversation. It is leaving a small point of contact.'
    }
  },
  feeling_pushy: {
    fear: { ko: '내가 들이대는 사람처럼 보일까 봐.', en: 'I might come across as pushy.' },
    reframe: {
      ko: '짧은 인사는 밀어붙이는 행동이 아니라 생활 속 예의에 가까워요.',
      en: 'A brief hello reads more like everyday courtesy than pressure.'
    }
  },
  bothering_busy_people: {
    fear: { ko: '바쁜 사람을 방해할까 봐.', en: 'I might bother someone who is busy.' },
    reframe: {
      ko: '그래서 더 짧게 가면 돼요. 한마디와 눈인사만으로도 충분해요.',
      en: 'That is exactly why the mission stays short. A hello and eye contact are enough.'
    }
  },
  running_into_the_same_person: {
    fear: { ko: '다음에 또 마주치면 더 어색해질까 봐.', en: 'It might feel awkward the next time we meet.' },
    reframe: {
      ko: '다음에 다시 마주치는 건 오히려 생활 리듬 안에 작은 익숙함이 생겼다는 뜻이에요.',
      en: 'Seeing the same person again can mean the interaction is becoming part of everyday rhythm.'
    }
  }
};

function normalizeLocale(locale: string): SupportedLocale {
  return locale === 'en' ? 'en' : 'ko';
}

export function isRoutineSpace(value: string): value is RoutineSpace {
  return routineSpaceValues.includes(value as RoutineSpace);
}

export function isSocialFear(value: string): value is SocialFear {
  return socialFearValues.includes(value as SocialFear);
}

export function filterRoutineSpaces(values: string[]): RoutineSpace[] {
  const filtered = values.filter(isRoutineSpace);
  return [...new Set(filtered)];
}

export function filterSocialFears(values: string[]): SocialFear[] {
  const filtered = values.filter(isSocialFear);
  return [...new Set(filtered)];
}

export function getRoutineSpaceLabels(locale: string, routineSpaces: string[]) {
  const language = normalizeLocale(locale);
  return filterRoutineSpaces(routineSpaces).map(
    (routineSpace) => routineSpaceOptions.find((option) => option.value === routineSpace)?.label[language] ?? routineSpace
  );
}

export function getSocialFearLabels(locale: string, socialFears: string[]) {
  const language = normalizeLocale(locale);
  return filterSocialFears(socialFears).map(
    (socialFear) => socialFearOptions.find((option) => option.value === socialFear)?.label[language] ?? socialFear
  );
}

export function buildPreferredMicroMissionSeed(locale: string, routineSpaces: string[], socialFears: string[]) {
  const language = normalizeLocale(locale);
  const preferredRoutineSpace = filterRoutineSpaces(routineSpaces)[0] ?? 'convenience_store';
  const preferredSocialFear = filterSocialFears(socialFears)[0] ?? 'being_judged';
  const routineCopy = routineSpaceMissionCopy[preferredRoutineSpace];
  const fearCopy = socialFearCopy[preferredSocialFear];

  return {
    title: routineCopy.title[language],
    description:
      language === 'en'
        ? 'Create one tiny, low-pressure point of contact in a place that is already part of your routine.'
        : '이미 지나치는 생활 공간에서 부담이 적은 작은 접촉 하나만 만들어보세요.',
    missionContext: routineCopy.context[language],
    safeLine: routineCopy.safeLine[language],
    minimumWin:
      language === 'en' ? 'Eye contact and a short hello still count as success.' : '눈 마주치고 짧게 인사만 해도 성공',
    fear: fearCopy.fear[language],
    reframe: fearCopy.reframe[language],
    conversationStarters: [routineCopy.safeLine[language]]
  };
}
