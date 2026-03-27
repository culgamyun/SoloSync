import { useMemo } from 'react';

import type { ChallengeRecord } from '@/types/challenge';

export function useChallenges(challenges: ChallengeRecord[]) {
  return useMemo(
    () => ({
      active: challenges.filter((challenge) => ['pending', 'in_progress'].includes(challenge.status)),
      completed: challenges.filter((challenge) => challenge.status === 'completed')
    }),
    [challenges]
  );
}
