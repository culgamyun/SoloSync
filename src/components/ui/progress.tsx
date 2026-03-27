'use client';

import type { ComponentPropsWithoutRef } from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';

export function Progress({
  className,
  value
}: ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      className={cn('relative h-2.5 w-full overflow-hidden rounded-full bg-surface-soft', className)}
      value={value}
    >
      <ProgressPrimitive.Indicator
        className='h-full rounded-full bg-primary transition-transform'
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
