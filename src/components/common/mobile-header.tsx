import { type ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

export function MobileHeader({
  title,
  subtitle,
  backHref,
  trailing,
  className,
  centered = false
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  trailing?: ReactNode;
  className?: string;
  centered?: boolean;
}) {
  return (
    <header className={cn('glass-nav sticky top-0 z-30 border-b border-line px-5 py-4', className)}>
      <div className='grid min-h-11 grid-cols-[44px,1fr,44px] items-center gap-3'>
        <div className='flex justify-start'>
          {backHref ? (
            <Link
              href={backHref}
              className='flex h-11 w-11 items-center justify-center rounded-md text-foreground transition hover:bg-surface-low'
              aria-label='Go back'
            >
              <ChevronLeft className='h-5 w-5' />
            </Link>
          ) : null}
        </div>
        <div className={cn('min-w-0', centered && 'text-center')}>
          {subtitle ? (
            <p className='truncate font-data text-[11px] font-bold uppercase tracking-normal text-primary/70'>
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
