import { cn } from '@/lib/utils';

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = 'left',
  size = 'section'
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: 'left' | 'center';
  size?: 'hero' | 'section';
}) {
  return (
    <div className={cn('space-y-3', align === 'center' && 'text-center', className)}>
      {eyebrow ? (
        <p className='text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/75'>{eyebrow}</p>
      ) : null}
      <div className={cn('space-y-2', size === 'hero' && 'editorial-rule')}>
        <h2
          className={cn(
            'break-keep text-balance font-display font-bold tracking-normal text-foreground',
            size === 'hero' ? 'text-[2.4rem] leading-[1.08]' : 'text-[1.85rem] leading-[1.16]'
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              'max-w-[32rem] text-[0.95rem] leading-7 text-muted-foreground',
              align === 'center' && 'mx-auto'
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
