export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';
export type ChallengeCategory = 'reach_out' | 'deepen' | 'explore' | 'maintain';
export type ChallengeStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';
export type ChallengeEstimatedTime = '10min' | '30min' | '1hr' | '2hr+';
export type ChallengeMissionKind = 'standard' | 'micro_social';
export type ChallengeReflectionOutcome = 'greeted' | 'said_line' | 'could_not_do_it';
export type ChallengeAdjustmentRequestType = 'smaller' | 'different_space' | 'safer_line';

export type ChallengeRecord = {
  id: string;
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  category: ChallengeCategory;
  estimatedTime: ChallengeEstimatedTime;
  conversationStarters: string[];
  missionKind: ChallengeMissionKind;
  missionContext: string | null;
  safeLine: string | null;
  minimumWin: string | null;
  fear: string | null;
  reframe: string | null;
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
  outcome: ChallengeReflectionOutcome | null;
  reflectionText: string;
};
