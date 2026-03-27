export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';
export type ChallengeCategory = 'reach_out' | 'deepen' | 'explore' | 'maintain';
export type ChallengeStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';
export type ChallengeEstimatedTime = '10min' | '30min' | '1hr' | '2hr+';

export type ChallengeRecord = {
  id: string;
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  category: ChallengeCategory;
  estimatedTime: ChallengeEstimatedTime;
  conversationStarters: string[];
  status: ChallengeStatus;
  weekNumber: number;
  weekStartDate: string;
  startedAt: string | null;
  completedAt: string | null;
};

export type ChallengeReflectionInput = {
  challengeId: string;
  moodBefore: number;
  moodAfter: number;
  difficultyFelt: number;
  reflectionText: string;
};
