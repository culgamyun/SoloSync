import { type ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

export function MobileHeader({
  title,
  subtitle,
  backHref,
  backLabel = '뒤로 가기',
  trailing,
  className,
  centered = false
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  trailing?: ReactNode;
  className?: string;
  centered?: boolean;
}) {
  return (
    <header className={cn('sticky top-0 z-30 border-b border-line bg-background/92 px-5 py-4 backdrop-blur-xl', className)}>
      <div className='grid min-h-11 grid-cols-[44px,1fr,44px] items-center gap-3'>
        <div className='flex justify-start'>
          {backHref ? (
            <Link
              href={backHref}
              className='flex h-11 w-11 items-center justify-center rounded-md text-foreground transition hover:bg-surface-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background'
              aria-label={backLabel}
            >
              <ChevronLeft className='h-5 w-5' />
            </Link>
          ) : null}
        </div>
        <div className={cn('min-w-0', centered && 'text-center')}>
          {subtitle ? (
            <p className='truncate font-data text-[11px] font-bold uppercase text-accent'>
              {subtitle}
            </p>
          ) : null}
          <h1 className='truncate text-[1.1rem] font-bold tracking-normal text-foreground'>{title}</h1>
        </div>
        <div className='flex justify-end'>{trailing}</div>
      </div>
    </header>
  );
}
