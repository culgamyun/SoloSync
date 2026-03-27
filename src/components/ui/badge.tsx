import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-[0.01em]',
  {
    variants: {
      variant: {
        neutral: 'bg-surface-low text-muted-foreground',
        primary: 'bg-primary/10 text-primary',
        accent: 'bg-sun/35 text-accent',
        success: 'bg-mint/55 text-secondary',
        warning: 'bg-peach/40 text-primary',
        ghost: 'bg-white/70 text-foreground shadow-ambient'
      }
    },
    defaultVariants: {
      variant: 'neutral'
    }
  }
);

export function Badge({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
