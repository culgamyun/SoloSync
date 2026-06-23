import { cn } from '@/lib/utils';

const breakdownMeta = {
  connection_frequency: {
    icon: '🤝',
    tone: 'bg-primary',
    labels: { ko: '연결 빈도', en: 'Connection frequency' }
  },
  relationship_diversity: {
    icon: '🌈',
    tone: 'bg-observation',
    labels: { ko: '관계 다양성', en: 'Relationship diversity' }
  },
  challenge_completion: {
    icon: '✅',
    tone: 'bg-success',
    labels: { ko: '활동', en: 'Challenge completion' }
  },
  satisfaction: {
    icon: '😊',
    tone: 'bg-reflection',
    labels: { ko: '만족도', en: 'Subjective satisfaction' }
  }
} as const;

const fallbackMeta = {
  icon: '•',
  tone: 'bg-primary',
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
          <div key={item.key} className='rounded-md border border-[#e8ded2] bg-white/72 px-4 py-3'>
            <div className='flex items-center justify-between font-data text-[13px] font-bold'>
              <span>
                {item.icon} {item.value}
              </span>
              <span className='text-[11px] text-[#8e877c]'>/25</span>
            </div>
            <p className='mt-2 text-[11px] text-[#777268]'>{item.label}</p>
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
            <span className='text-[13px] font-semibold text-[#22251f]'>
              {item.icon} {item.label}
            </span>
            <span className='font-data text-[12px] font-bold text-[#8e877c]'>{item.value}/25</span>
          </div>
          <div className='h-2 overflow-hidden rounded bg-[#f1e6da]'>
            <div className={cn('h-full rounded', item.tone)} style={{ width: `${item.percent}%` }} />
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
