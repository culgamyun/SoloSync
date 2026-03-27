export type LivingSituation = 'alone' | 'with_partner' | 'with_family' | 'with_roommates';
export type ComfortLevel = 'very_low' | 'low' | 'medium' | 'high' | 'very_high';

export type RelationshipMap = {
  close_friends: number;
  casual_friends: number;
  family: number;
  colleagues: number;
};

export type OnboardingDraft = {
  displayName: string;
  city: string;
  livingSituation: LivingSituation | null;
  socialSatisfactionScore: number;
  introversionLevel: number;
  barriers: string[];
  relationshipMap: RelationshipMap;
  goals: string[];
  comfortLevel: ComfortLevel;
};

export type OnboardingAnalysis = {
  score: number;
  breakdown: {
    connection_frequency: number;
    relationship_diversity: number;
    challenge_completion: number;
    satisfaction: number;
  };
  insight: string;
  firstChallenge: {
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    category: 'reach_out' | 'deepen' | 'explore' | 'maintain';
    conversation_starters: string[];
    estimated_time: '10min' | '30min' | '1hr' | '2hr+';
  };
};
