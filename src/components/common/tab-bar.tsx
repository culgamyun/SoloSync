'use client';

import { motion, useReducedMotion } from 'framer-motion';
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
  const shouldReduceMotion = useReducedMotion();
  const isNestedChallengePage = pathname.includes('/challenges/');

  if (segment === 'coach' || isNestedChallengePage) {
    return null;
  }

  return (
    <div className='pointer-events-none fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[430px] px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]'>
      <nav
        className='pointer-events-auto grid grid-cols-5 rounded-lg border border-line bg-[#fffaf2] px-2 py-2 shadow-float'
        aria-label='주요 내비게이션'
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = segment === item.segment;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative isolate flex min-h-[60px] flex-col items-center justify-center gap-1 overflow-hidden rounded-md px-2 py-3 text-[11px] font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                isActive
                  ? 'text-accent'
                  : 'text-muted-foreground hover:bg-surface-low hover:text-foreground'
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId='solo-tab-active'
                  className='absolute inset-1 rounded-md bg-accent/12'
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                />
              ) : null}
              <motion.span
                className='relative z-10 flex flex-col items-center justify-center gap-1'
                animate={shouldReduceMotion ? undefined : { scale: isActive ? 1.03 : 1, opacity: isActive ? 1 : 0.86 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <Icon className='h-4 w-4' />
                <span>{t(item.key)}</span>
              </motion.span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
