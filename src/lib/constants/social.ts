import type {
  ChallengeCategory,
  ChallengeDifficulty,
  ChallengeEstimatedTime,
  ChallengeStatus
} from '@/types/challenge';
import type { ComfortLevel, LivingSituation } from '@/types/onboarding';

export const SUPPORTED_LOCALES = ['ko', 'en'] as const;

export const livingSituationOptions: {
  value: LivingSituation;
  icon: string;
  label: Record<'ko' | 'en', string>;
}[] = [
  { value: 'alone', icon: '🏠', label: { ko: '혼자 살아요', en: 'Live alone' } },
  { value: 'with_partner', icon: '🧑‍🤝‍🧑', label: { ko: '파트너와 함께', en: 'With a partner' } },
  { value: 'with_family', icon: '👨‍👩‍👧', label: { ko: '가족과 함께', en: 'With family' } },
  { value: 'with_roommates', icon: '🏘️', label: { ko: '룸메이트와 함께', en: 'With roommates' } }
];

export const barrierOptions = [
  { value: 'new_city', label: { ko: '새로운 도시', en: 'New city' } },
  { value: 'remote_work', label: { ko: '재택/원격 근무', en: 'Remote work' } },
  { value: 'social_anxiety', label: { ko: '대화가 긴장돼요', en: 'Social anxiety' } },
  { value: 'busy_schedule', label: { ko: '시간이 부족해요', en: 'Busy schedule' } },
  { value: 'recent_breakup', label: { ko: '최근 큰 관계 변화', en: 'Recent breakup' } },
  { value: 'drifted_friends', label: { ko: '멀어진 친구들', en: 'Drifted friendships' } },
  { value: 'parenting', label: { ko: '양육/돌봄', en: 'Parenting or care' } },
  { value: 'other', label: { ko: '기타', en: 'Other' } }
] as const;

export const goalOptions = [
  { value: 'make_new_friends', icon: '🌱', label: { ko: '새로운 친구 만들기', en: 'Make new friends' } },
  { value: 'deepen_existing', icon: '💎', label: { ko: '기존 관계 더 깊게 하기', en: 'Deepen existing ties' } },
  { value: 'join_community', icon: '🏘️', label: { ko: '커뮤니티 참여하기', en: 'Join a community' } },
  { value: 'maintain_relationships', icon: '🔁', label: { ko: '연락 끊긴 사람 다시 잇기', en: 'Reconnect with someone' } },
  { value: 'build_confidence', icon: '💪', label: { ko: '사회적 자신감 키우기', en: 'Build confidence' } }
] as const;

export const comfortOptions: {
  value: ComfortLevel;
  label: Record<'ko' | 'en', string>;
}[] = [
  { value: 'very_low', label: { ko: '매우 낮음', en: 'Very low' } },
  { value: 'low', label: { ko: '낮음', en: 'Low' } },
  { value: 'medium', label: { ko: '보통', en: 'Medium' } },
  { value: 'high', label: { ko: '높음', en: 'High' } },
  { value: 'very_high', label: { ko: '매우 높음', en: 'Very high' } }
];

const challengeCategoryLabels: Record<'ko' | 'en', Record<ChallengeCategory, string>> = {
  ko: {
    reach_out: '새로운 연결',
    deepen: '더 깊게',
    explore: '탐색',
    maintain: '관계 유지'
  },
  en: {
    reach_out: 'Reach out',
    deepen: 'Deepen',
    explore: 'Explore',
    maintain: 'Maintain'
  }
};

export const challengeDifficultyTone: Record<ChallengeDifficulty, string> = {
  easy: 'bg-mint/55 text-secondary',
  medium: 'bg-sun/35 text-accent',
  hard: 'bg-peach/45 text-primary'
};

const estimatedTimeLabels: Record<'ko' | 'en', Record<ChallengeEstimatedTime, string>> = {
  ko: {
    '10min': '10분',
    '30min': '30분',
    '1hr': '1시간',
    '2hr+': '2시간+'
  },
  en: {
    '10min': '10 min',
    '30min': '30 min',
    '1hr': '1 hour',
    '2hr+': '2+ hours'
  }
};

const challengeDifficultyLabels: Record<'ko' | 'en', Record<ChallengeDifficulty, string>> = {
  ko: {
    easy: '가볍게',
    medium: '적당히',
    hard: '도전'
  },
  en: {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard'
  }
};

const challengeStatusLabels: Record<'ko' | 'en', Record<ChallengeStatus, string>> = {
  ko: {
    pending: '대기',
    in_progress: '진행 중',
    completed: '완료',
    skipped: '건너뜀'
  },
  en: {
    pending: 'Pending',
    in_progress: 'In progress',
    completed: 'Completed',
    skipped: 'Skipped'
  }
};

export function getChallengeCategoryLabel(category: ChallengeCategory, locale: string) {
  return challengeCategoryLabels[locale === 'en' ? 'en' : 'ko'][category];
}

export function getEstimatedTimeLabel(estimatedTime: ChallengeEstimatedTime, locale: string) {
  return estimatedTimeLabels[locale === 'en' ? 'en' : 'ko'][estimatedTime];
}

export function getChallengeDifficultyLabel(difficulty: ChallengeDifficulty, locale: string) {
  return challengeDifficultyLabels[locale === 'en' ? 'en' : 'ko'][difficulty];
}

export function getChallengeStatusLabel(status: ChallengeStatus, locale: string) {
  return challengeStatusLabels[locale === 'en' ? 'en' : 'ko'][status];
}
