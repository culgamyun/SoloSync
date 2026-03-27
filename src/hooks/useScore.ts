import { useMemo } from 'react';

import type { ScoreBreakdown } from '@/lib/utils/score';

export function useScore(breakdown: ScoreBreakdown) {
  return useMemo(() => {
    const total = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
    return {
      total,
      strongest: Object.entries(breakdown).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
    };
  }, [breakdown]);
}
