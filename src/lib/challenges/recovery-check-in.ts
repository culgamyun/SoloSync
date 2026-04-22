export type RecoverySignal = 'fresh_start' | 'rough_week' | 'adjusted_week' | 'steady_week' | 'strong_week';

export type RecoverySource = {
  previousStatus?: 'pending' | 'in_progress' | 'completed' | 'skipped' | null;
  previousOutcome?: 'greeted' | 'said_line' | 'could_not_do_it' | null;
  adjustmentCount?: number | null;
  currentChallengeId?: string | null;
  currentChallengeTitle?: string | null;
};

export type RecoveryCheckInCard = {
  signal: RecoverySignal;
  eyebrow: string;
  title: string;
  body: string;
  previousLabel: string;
  nextLabel: string;
  ctaLabel: string;
  ctaHref: string;
  formTitle: string;
  formHint: string;
  notePrompt: string;
};

export function deriveRecoverySignal(source: RecoverySource): RecoverySignal {
  const previousStatus = source.previousStatus ?? null;
  const previousOutcome = source.previousOutcome ?? null;
  const adjustmentCount = source.adjustmentCount ?? 0;

  if (!previousStatus && !previousOutcome && adjustmentCount === 0) {
    return 'fresh_start';
  }

  if (previousStatus === 'skipped' || previousOutcome === 'could_not_do_it') {
    return 'rough_week';
  }

  if (previousStatus === 'completed' || previousOutcome === 'said_line') {
    return 'strong_week';
  }

  if (adjustmentCount > 0) {
    return 'adjusted_week';
  }

  if (previousOutcome === 'greeted' || previousStatus === 'in_progress' || previousStatus === 'pending') {
    return 'steady_week';
  }

  return 'fresh_start';
}

export function buildRecoveryGenerationContext(locale: string, signal: RecoverySignal) {
  const language = locale === 'en' ? 'en' : 'ko';

  const map = {
    ko: {
      fresh_start: {
        label: '첫 출발',
        guidance: '이번 주는 관계를 크게 넓히려 하기보다 생활 리듬 안에서 아주 작은 접촉 하나를 만들도록 유도하세요.'
      },
      rough_week: {
        label: '힘들었던 주',
        guidance: '지난주는 멈춘 지점이 있었으니 이번 주 미션은 더 작고 더 편안하게 유지하세요. 실패를 만회하라는 톤은 피하세요.'
      },
      adjusted_week: {
        label: '조정이 필요했던 주',
        guidance: '지난주에 이미 부담을 줄인 기록이 있으니 이번 주도 낮은 압력과 높은 성공 가능성을 우선하세요.'
      },
      steady_week: {
        label: '작은 연결이 있던 주',
        guidance: '지난주에 작은 접촉이 있었으니 같은 리듬을 유지하되 갑작스럽게 난도를 올리지 마세요.'
      },
      strong_week: {
        label: '안정적으로 해낸 주',
        guidance: '좋은 흐름은 인정하되 이번 주도 무리 없이 반복 가능한 제안으로 유지하세요.'
      }
    },
    en: {
      fresh_start: {
        label: 'Fresh start',
        guidance: 'Keep this week grounded in one small real-world point of contact rather than broad social ambition.'
      },
      rough_week: {
        label: 'Rough week',
        guidance: 'Last week was hard, so keep this week visibly gentler and non-shaming. Do not frame it as making up for failure.'
      },
      adjusted_week: {
        label: 'Adjusted week',
        guidance: 'Last week already needed a lower-pressure version, so keep this week approachable and easy to re-enter.'
      },
      steady_week: {
        label: 'Steady week',
        guidance: 'There was at least a small point of contact last week. Continue the rhythm without escalating too fast.'
      },
      strong_week: {
        label: 'Strong week',
        guidance: 'Acknowledge momentum while keeping this week calm and repeatable rather than suddenly ambitious.'
      }
    }
  } as const;

  return map[language][signal];
}

export function buildRecoveryCheckInCard(locale: string, source: RecoverySource): RecoveryCheckInCard {
  const language = locale === 'en' ? 'en' : 'ko';
  const signal = deriveRecoverySignal(source);
  const currentChallengeTitle = source.currentChallengeTitle?.trim() || null;
  const ctaHref = source.currentChallengeId ? `/challenges/${source.currentChallengeId}` : '/challenges';

  const map = {
    ko: {
      eyebrow: '회복 체크인',
      ctaLabel: currentChallengeTitle ? '이번 주 미션 보기' : '이번 주 챌린지 보기',
      fresh_start: {
        title: '이번 주는 아주 작게\n시작해도 충분해요',
        body: '처음부터 잘해내야 하는 주간은 아니에요. 생활 리듬 안에서 작은 접촉 하나만 만들어도 괜찮아요.',
        previousLabel: '이번 주: 새 리듬 시작',
        nextLabel: '기준: 아주 작게',
        formTitle: '주간 체크인',
        formHint: '이번 주를 무리 없이 시작할 수 있도록 지금 상태를 짧게 적어보세요.',
        notePrompt: '이번 주는 어느 정도의 연결이 현실적으로 가능할까요?'
      },
      rough_week: {
        title: '지난주는 거기까지여도 됐어요.\n이번 주는 더 작게 가도 괜찮아요',
        body: '멈춘 지점이 있었다는 걸 이미 알고 있어요. 이번 주 미션은 다시 증명하는 일이 아니라, 부담을 줄인 상태로 연결을 이어보는 일이에요.',
        previousLabel: '지난주: 어려운 지점이 있었음',
        nextLabel: '이번 주: 압력 낮추기',
        formTitle: '주간 복구 체크인',
        formHint: '지난주의 부담을 끌고 가지 않도록 이번 주 시작 감각을 짧게 적어보세요.',
        notePrompt: '지난주에 특히 버거웠던 지점과, 이번 주엔 무엇을 조금 덜어내고 싶은지 적어보세요.'
      },
      adjusted_week: {
        title: '지난주엔 이미 줄였어요.\n이번 주도 그 감각을 이어가면 돼요',
        body: '부담을 알아차리고 낮춘 선택 자체가 중요한 신호예요. 이번 주도 그 톤을 유지해도 충분해요.',
        previousLabel: '지난주: 미션 조정',
        nextLabel: '이번 주: 낮은 압력 유지',
        formTitle: '주간 복구 체크인',
        formHint: '어느 정도까지 줄이면 편안했는지 떠올리면서 이번 주 페이스를 적어보세요.',
        notePrompt: '지난주에 도움이 됐던 조정과, 이번 주에도 유지하고 싶은 안전장치를 적어보세요.'
      },
      steady_week: {
        title: '작게라도 연결은 있었어요.\n이번 주는 그 리듬만 이어가면 돼요',
        body: '완벽하지 않아도 흐름은 이미 만들어졌어요. 이번 주는 같은 톤으로 한 번만 더 이어가면 충분해요.',
        previousLabel: '지난주: 작은 접촉',
        nextLabel: '이번 주: 리듬 이어가기',
        formTitle: '주간 복구 체크인',
        formHint: '지난주 리듬을 이어가기 위해 지금 컨디션을 짧게 확인해보세요.',
        notePrompt: '지난주에 괜찮았던 방식 중 이번 주에도 이어가고 싶은 것을 적어보세요.'
      },
      strong_week: {
        title: '지난주의 감각을\n무리 없이 이어가볼까요?',
        body: '좋은 주였다고 해서 갑자기 더 크게 나갈 필요는 없어요. 이번 주도 안정적으로 반복 가능한 연결이면 충분해요.',
        previousLabel: '지난주: 연결 성공',
        nextLabel: '이번 주: 차분하게 반복',
        formTitle: '주간 복구 체크인',
        formHint: '좋았던 흐름을 무리 없이 이어가기 위해 이번 주 컨디션을 짧게 적어보세요.',
        notePrompt: '지난주에 잘 맞았던 방식 중 이번 주에도 반복하고 싶은 것을 적어보세요.'
      }
    },
    en: {
      eyebrow: 'Recovery check-in',
      ctaLabel: currentChallengeTitle ? "Open this week's mission" : "Open this week's challenges",
      fresh_start: {
        title: 'A very small start\nis enough this week',
        body: 'This does not need to be a week of proving anything. One small point of contact inside your normal routine is enough.',
        previousLabel: 'This week: new rhythm',
        nextLabel: 'Baseline: keep it small',
        formTitle: 'Weekly check-in',
        formHint: 'Leave a short note about how gently you want to start this week.',
        notePrompt: 'What level of connection would feel realistic this week?'
      },
      rough_week: {
        title: 'Last week stopped here.\nThis week can be smaller',
        body: 'The app already knows there was a hard stop last week. This week is not about making up for failure. It is about returning with less pressure.',
        previousLabel: 'Last week: hard stop',
        nextLabel: 'This week: lower the pressure',
        formTitle: 'Weekly recovery check-in',
        formHint: "Leave a quick note so this week starts from your real energy instead of last week's pressure.",
        notePrompt: 'What felt especially heavy last week, and what would you want to soften this time?'
      },
      adjusted_week: {
        title: 'You already scaled it down.\nThis week can stay gentle',
        body: 'Choosing a lower-pressure version last week was a useful signal. This week can keep that same approachable tone.',
        previousLabel: 'Last week: mission adjusted',
        nextLabel: 'This week: keep it low-pressure',
        formTitle: 'Weekly recovery check-in',
        formHint: 'Leave a short note about the level that still felt doable.',
        notePrompt: 'What adjustment helped last week, and what should stay gentle this week?'
      },
      steady_week: {
        title: 'There was still a small connection.\nThis week can continue the rhythm',
        body: 'It did not need to be perfect to count. This week can build on that same small rhythm.',
        previousLabel: 'Last week: small contact',
        nextLabel: 'This week: continue the rhythm',
        formTitle: 'Weekly recovery check-in',
        formHint: 'Leave a short note about the pace you want to keep this week.',
        notePrompt: 'What felt sustainable last week that you want to keep?'
      },
      strong_week: {
        title: "Let's carry last week forward\nwithout forcing it",
        body: 'A good week does not mean you need to suddenly raise the bar. This week can still be calm and repeatable.',
        previousLabel: 'Last week: steady success',
        nextLabel: 'This week: repeat calmly',
        formTitle: 'Weekly recovery check-in',
        formHint: 'Leave a short note about how to keep the momentum steady this week.',
        notePrompt: 'What part of last week felt worth repeating?'
      }
    }
  } as const;

  const copy = map[language][signal];

  return {
    signal,
    eyebrow: map[language].eyebrow,
    title: copy.title,
    body: currentChallengeTitle ? `${copy.body} ${language === 'ko' ? '이번 주 미션은' : "This week's mission is"} ${currentChallengeTitle}.` : copy.body,
    previousLabel: copy.previousLabel,
    nextLabel: copy.nextLabel,
    ctaLabel: map[language].ctaLabel,
    ctaHref,
    formTitle: copy.formTitle,
    formHint: copy.formHint,
    notePrompt: copy.notePrompt
  };
}

type MissionSeed = {
  title: string;
  description: string;
  missionContext: string;
  safeLine: string;
  minimumWin: string;
  fear: string;
  reframe: string;
  conversationStarters: string[];
};

export function applyRecoverySignalToMissionSeed(locale: string, signal: RecoverySignal, seed: MissionSeed): MissionSeed {
  const language = locale === 'en' ? 'en' : 'ko';

  if (signal === 'rough_week') {
    return {
      ...seed,
      description:
        language === 'ko'
          ? `지난주가 버거웠다면 이번 주는 더 작게 돌아와도 충분합니다. ${seed.description}`
          : `If last week felt heavy, this week is allowed to come back smaller. ${seed.description}`,
      safeLine: language === 'ko' ? '안녕하세요.' : 'Hi.',
      minimumWin: language === 'ko' ? '눈 마주치고 짧게 인사만 해도 성공' : 'Eye contact and a simple hello still count as success',
      reframe:
        language === 'ko'
          ? '지난주에 멈춘 지점을 안다는 것만으로도 이번 주는 더 선명하게 줄일 수 있어요.'
          : 'Knowing where last week got heavy already makes this week easier to shape.'
    };
  }

  if (signal === 'adjusted_week') {
    return {
      ...seed,
      description:
        language === 'ko'
          ? `지난주에도 이미 톤을 낮췄어요. 이번 주도 같은 압력으로 이어가면 충분합니다. ${seed.description}`
          : `You already scaled things down well last week. It is fine to keep this week gentle too. ${seed.description}`,
      reframe:
        language === 'ko'
          ? '줄여서라도 리듬을 지킨 건 중요한 감각이에요. 이번 주도 그 흐름을 이어가면 됩니다.'
          : 'Keeping the rhythm alive in a smaller form still matters. This week can continue from there.'
    };
  }

  if (signal === 'steady_week') {
    return {
      ...seed,
      description:
        language === 'ko'
          ? `지난주의 작은 접촉을 이번 주에도 같은 톤으로 이어가보세요. ${seed.description}`
          : `Carry last week's small point of contact forward in the same tone. ${seed.description}`,
      reframe:
        language === 'ko'
          ? '완벽하지 않아도 이미 리듬은 생겼어요. 이번 주는 그 흐름을 한 번 더 꺼내면 됩니다.'
          : 'It did not need to be perfect to count. This week only needs to keep the rhythm going.'
    };
  }

  if (signal === 'strong_week') {
    return {
      ...seed,
      description:
        language === 'ko'
          ? `지난주의 감각을 무리 없이 이어가는 주로 생각해보세요. ${seed.description}`
          : `Use this week to continue last week's momentum without forcing a bigger leap. ${seed.description}`,
      reframe:
        language === 'ko'
          ? '좋은 다음 주일수록 갑자기 크게 올리기보다 안정적으로 반복하는 편이 더 오래 갑니다.'
          : 'The week after a good one often works better when it stays calm and repeatable.'
    };
  }

  return seed;
}

export function buildRecoveryWeeklyMessage(locale: string, signal: RecoverySignal) {
  const language = locale === 'en' ? 'en' : 'ko';

  const messages = {
    ko: {
      fresh_start: '이번 주는 생활 리듬 안에서 아주 작은 연결 하나를 만드는 데 집중해보세요.',
      rough_week: '지난주의 부담을 만회하려 하지 말고, 이번 주는 더 작은 연결 하나로 돌아오면 충분해요.',
      adjusted_week: '지난주에 이미 낮춘 감각을 이어 받아, 이번 주도 같은 압력의 연결 하나를 만들어보세요.',
      steady_week: '지난주의 작은 연결 리듬을 이번 주에도 한 번 더 이어가보세요.',
      strong_week: '지난주의 좋은 감각을 유지하되, 이번 주도 무리 없이 반복 가능한 연결에 집중해보세요.'
    },
    en: {
      fresh_start: 'Focus on creating one very small real-world point of contact inside your normal routine this week.',
      rough_week: 'You do not need to make up for last week. Coming back with one smaller point of contact is enough.',
      adjusted_week: 'Keep the lower-pressure rhythm from last week and build one approachable point of contact from there.',
      steady_week: "Carry last week's small rhythm forward with one more realistic point of contact.",
      strong_week: "Keep last week's momentum steady by choosing one repeatable point of contact rather than a bigger leap."
    }
  } as const;

  return messages[language][signal];
}
