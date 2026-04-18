import { type ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function AppShell({
  children,
  className,
  header,
  padded = true,
  tabBarInset = true,
  surfaceClassName,
  contentClassName
}: {
  children: ReactNode;
  className?: string;
  header?: ReactNode;
  padded?: boolean;
  tabBarInset?: boolean;
  surfaceClassName?: string;
  contentClassName?: string;
}) {
  return (
    <main
      className={cn(
        'app-shell-frame mx-auto flex min-h-screen w-full max-w-[430px] flex-col overflow-hidden border-x border-line md:my-5 md:min-h-[calc(100svh-2.5rem)] md:rounded-lg md:border md:shadow-sanctuary',
        surfaceClassName,
        className
      )}
    >
      {header}
      <div
        className={cn(
          'flex-1',
          padded && 'px-5 pb-10 pt-6',
          tabBarInset && 'pb-32',
          contentClassName
        )}
      >
        {children}
      </div>
    </main>
  );
}
