import type { LabelHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('mb-2 block text-[13px] font-semibold tracking-[0.01em] text-foreground/80', className)}
      {...props}
    />
  );
}
