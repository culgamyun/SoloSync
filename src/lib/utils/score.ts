import type { RelationshipMap } from '@/types/onboarding';

export type ScoreBreakdown = {
  connection_frequency: number;
  relationship_diversity: number;
  challenge_completion: number;
  satisfaction: number;
};

export type ScoreComputationInput = {
  completedChallengesLast4Weeks: number;
  totalChallengesLast4Weeks: number;
  relationshipMap: RelationshipMap;
  recentMoodAfterValues: number[];
  onboardingSatisfactionScore?: number;
};

export function countNonZeroRelationships(relationshipMap: RelationshipMap) {
  return Object.values(relationshipMap).filter((value) => value > 0).length;
}

export function calculateBreakdown(input: ScoreComputationInput): ScoreBreakdown {
  const connection_frequency = Math.min(25, input.completedChallengesLast4Weeks * 3);
  const relationship_diversity = Math.min(25, countNonZeroRelationships(input.relationshipMap) * 6);
  const challenge_completion =
    input.totalChallengesLast4Weeks > 0
      ? Math.round((input.completedChallengesLast4Weeks / input.totalChallengesLast4Weeks) * 25)
      : 0;

  const moodValues =
    input.recentMoodAfterValues.length > 0
      ? input.recentMoodAfterValues
      : [input.onboardingSatisfactionScore ? input.onboardingSatisfactionScore / 2 : 2.5];
  const moodAverage = moodValues.reduce((sum, value) => sum + value, 0) / moodValues.length;
  const satisfaction = Math.round((moodAverage / 5) * 25);

  return {
    connection_frequency,
    relationship_diversity,
    challenge_completion,
    satisfaction
  };
}

export function sumBreakdown(breakdown: ScoreBreakdown) {
  return (
    breakdown.connection_frequency +
    breakdown.relationship_diversity +
    breakdown.challenge_completion +
    breakdown.satisfaction
  );
}
