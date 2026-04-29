'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useId } from 'react';

import { cn } from '@/lib/utils';

const ringSizes = {
  default: { wrapper: 'h-52 w-52', radius: 72, stroke: 12, scoreClass: 'text-[3rem]' },
  result: { wrapper: 'h-56 w-56', radius: 76, stroke: 14, scoreClass: 'text-[3.2rem]' },
  compact: { wrapper: 'h-40 w-40', radius: 54, stroke: 10, scoreClass: 'text-[2.25rem]' }
} as const;

export function ScoreRing({
  score,
  label,
  className,
  variant = 'default',
  delta
}: {
  score: number;
  label?: string;
  className?: string;
  variant?: 'default' | 'result' | 'compact';
  delta?: number;
}) {
  const config = ringSizes[variant];
  const circumference = 2 * Math.PI * config.radius;
  const dashOffset = circumference - (score / 100) * circumference;
  const showDeltaInsideRing = typeof delta === 'number' && variant !== 'compact';
  const shouldReduceMotion = useReducedMotion();
  const gradientId = useId().replaceAll(':', '');

  return (
    <div className={cn('relative flex flex-col items-center justify-center', config.wrapper, className)}>
      <div className='absolute inset-0 rounded-full bg-observation/10' />
      <svg className='relative h-full w-full -rotate-90' viewBox='0 0 200 200' aria-hidden>
        <circle
          className='soft-ring-track'
          cx='100'
          cy='100'
          r={config.radius}
          fill='none'
          strokeWidth={config.stroke}
        />
        <motion.circle
          cx='100'
          cy='100'
          r={config.radius}
          fill='none'
          stroke={`url(#${gradientId})`}
          strokeLinecap='round'
          strokeWidth={config.stroke}
          strokeDasharray={circumference}
          initial={shouldReduceMotion ? false : { strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
        <defs>
          <linearGradient id={gradientId} x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor='#73A8EE' />
            <stop offset='100%' stopColor='#126B5A' />
          </linearGradient>
        </defs>
      </svg>
      <div className='absolute inset-0 flex flex-col items-center justify-center text-center'>
        <span className={cn('font-data font-bold tracking-normal text-foreground', config.scoreClass)}>
          {score}
        </span>
        <span className='mt-1 font-data text-[11px] font-bold uppercase tracking-normal text-muted-foreground'>
          {label ?? 'Social score'}
        </span>
        {showDeltaInsideRing ? (
          <motion.span
            className={cn('mt-3 font-data text-[12px] font-bold', delta >= 0 ? 'text-success' : 'text-reflection')}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.24, delay: 0.16 }}
          >
            {delta >= 0 ? '+' : '-'} {Math.abs(delta)}
          </motion.span>
        ) : null}
      </div>
    </div>
  );
}
