import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center whitespace-nowrap rounded px-2.5 py-1.5 text-[11px] font-bold tracking-[0.01em]',
  {
    variants: {
      variant: {
        neutral: 'border border-line bg-surface-low text-muted-foreground',
        primary: 'border border-primary/15 bg-primary/10 text-primary',
        accent: 'border border-observation/25 bg-observation/16 text-foreground',
        success: 'border border-success/20 bg-success/10 text-success',
        warning: 'border border-reflection/20 bg-reflection/10 text-reflection',
        ghost: 'border border-line bg-surface-high text-foreground'
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
