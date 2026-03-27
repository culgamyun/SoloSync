import { cn } from '@/lib/utils';

const breakdownMeta = {
  connection_frequency: {
    icon: '🤝',
    tone: 'bg-mint/75',
    labels: { ko: '연결 빈도', en: 'Connection frequency' }
  },
  relationship_diversity: {
    icon: '🌈',
    tone: 'bg-peach/80',
    labels: { ko: '관계 다양성', en: 'Relationship diversity' }
  },
  challenge_completion: {
    icon: '✅',
    tone: 'bg-surface-soft',
    labels: { ko: '활동', en: 'Challenge completion' }
  },
  satisfaction: {
    icon: '😊',
    tone: 'bg-sun/70',
    labels: { ko: '만족도', en: 'Subjective satisfaction' }
  }
} as const;

const fallbackMeta = {
  icon: '•',
  tone: 'bg-primary/50',
  labels: { ko: '기타', en: 'Other' }
} as const;

export function ScoreBreakdown({
  breakdown,
  locale = 'ko',
  variant = 'default'
}: {
  breakdown: Record<string, number>;
  locale?: string;
  variant?: 'default' | 'result' | 'compact';
}) {
  const language = locale === 'en' ? 'en' : 'ko';
  const items = Object.entries(breakdown).map(([key, value]) => {
    const meta = key in breakdownMeta ? breakdownMeta[key as keyof typeof breakdownMeta] : fallbackMeta;

    return {
      key,
      value,
      icon: meta.icon,
      tone: meta.tone,
      label: key in breakdownMeta ? meta.labels[language] : key,
      percent: Math.max(4, Math.round((value / 25) * 100))
    };
  });

  if (variant === 'compact') {
    return (
      <div className='grid grid-cols-2 gap-3'>
        {items.map((item) => (
          <div key={item.key} className='rounded-[1.35rem] bg-white/78 px-4 py-3 shadow-ambient'>
            <div className='flex items-center justify-between text-[13px] font-semibold'>
              <span>
                {item.icon} {item.value}
              </span>
              <span className='text-[11px] text-muted-foreground'>/25</span>
            </div>
            <p className='mt-2 text-[11px] text-muted-foreground'>{item.label}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn(variant === 'result' ? 'grid grid-cols-2 gap-x-5 gap-y-7' : 'space-y-5')}>
      {items.map((item) => (
        <div key={item.key} className='space-y-3'>
          <div className='flex items-center justify-between gap-3'>
            <span className='text-[13px] font-semibold text-foreground'>
              {item.icon} {item.label}
            </span>
            <span className='font-mono text-[12px] text-muted-foreground'>{item.value}/25</span>
          </div>
          <div className='h-2.5 overflow-hidden rounded-full bg-surface-soft'>
            <div className={cn('h-full rounded-full', item.tone)} style={{ width: `${item.percent}%` }} />
          </div>
          {item.key === 'challenge_completion' && item.value <= 2 ? (
            <p className='text-[10px] font-semibold text-muted-foreground'>
              {language === 'ko' ? '이제 시작이에요!' : 'Just getting started.'}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
