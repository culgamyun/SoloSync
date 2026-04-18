'use client';

import { Home, LayoutList, LineChart, MessageCircleHeart, Settings } from 'lucide-react';
import { usePathname, useSelectedLayoutSegment } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const items = [
  { href: '/home', key: 'home', icon: Home, segment: 'home' },
  { href: '/challenges', key: 'challenges', icon: LayoutList, segment: 'challenges' },
  { href: '/coach', key: 'coach', icon: MessageCircleHeart, segment: 'coach' },
  { href: '/progress', key: 'progress', icon: LineChart, segment: 'progress' },
  { href: '/settings', key: 'settings', icon: Settings, segment: 'settings' }
] as const;

export function TabBar() {
  const pathname = usePathname();
  const segment = useSelectedLayoutSegment();
  const t = useTranslations('nav');
  const isNestedChallengePage = pathname.includes('/challenges/');

  if (segment === 'coach' || isNestedChallengePage) {
    return null;
  }

  return (
    <div className='pointer-events-none fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[430px] px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]'>
      <nav className='glass-nav pointer-events-auto grid grid-cols-5 rounded-lg border border-line px-2 py-2 shadow-ambient'>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = segment === item.segment;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex min-h-[60px] flex-col items-center justify-center gap-1 rounded-md px-2 py-3 text-[11px] font-bold transition',
                isActive
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-surface-low hover:text-foreground'
              )}
            >
              <Icon className={cn('h-4 w-4', isActive && 'fill-current')} />
              <span>{t(item.key)}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
