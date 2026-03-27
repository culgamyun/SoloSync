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

  return (
    <div className={cn('relative flex flex-col items-center justify-center', config.wrapper, className)}>
      <div className='absolute inset-0 rounded-full bg-peach/20 blur-3xl' />
      <svg className='relative h-full w-full -rotate-90' viewBox='0 0 200 200' aria-hidden>
        <circle
          className='soft-ring-track'
          cx='100'
          cy='100'
          r={config.radius}
          fill='none'
          strokeWidth={config.stroke}
        />
        <circle
          cx='100'
          cy='100'
          r={config.radius}
          fill='none'
          stroke='url(#solo-sync-ring)'
          strokeLinecap='round'
          strokeWidth={config.stroke}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
        <defs>
          <linearGradient id='solo-sync-ring' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor='#FEABA7' />
            <stop offset='100%' stopColor='#8D4C4A' />
          </linearGradient>
        </defs>
      </svg>
      <div className='absolute inset-0 flex flex-col items-center justify-center text-center'>
        <span className={cn('font-display font-bold tracking-[-0.05em] text-foreground', config.scoreClass)}>
          {score}
        </span>
        <span className='mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
          {label ?? 'Social score'}
        </span>
        {typeof delta === 'number' ? (
          <span className={cn('mt-4 text-[12px] font-semibold', delta >= 0 ? 'text-secondary' : 'text-primary')}>
            {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}
          </span>
        ) : null}
      </div>
    </div>
  );
}
