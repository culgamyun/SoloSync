import type { ChallengeDifficulty } from '@/types/challenge';

const LEVEL_THRESHOLDS = [
  { id: 'bronze', label: 'Bronze Connector', minXp: 0 },
  { id: 'silver', label: 'Silver Socializer', minXp: 500 },
  { id: 'gold', label: 'Gold Networker', minXp: 1500 },
  { id: 'platinum', label: 'Platinum Connector', minXp: 4000 }
] as const;

export type LevelId = (typeof LEVEL_THRESHOLDS)[number]['id'];

export function getChallengeXp(difficulty: ChallengeDifficulty) {
  switch (difficulty) {
    case 'easy':
      return 50;
    case 'medium':
      return 100;
    case 'hard':
      return 200;
  }
}

export function getReflectionXp() {
  return 30;
}

export function getWeeklyCheckInXp() {
  return 20;
}

export function getStreakBonus(streak: number) {
  return Math.max(0, streak) * 50;
}

export function getLevelFromXp(xp: number) {
  const current =
    [...LEVEL_THRESHOLDS].reverse().find((level) => xp >= level.minXp) ?? LEVEL_THRESHOLDS[0];

  return current;
}

export function getNextLevel(xp: number) {
  return LEVEL_THRESHOLDS.find((level) => level.minXp > xp) ?? null;
}
