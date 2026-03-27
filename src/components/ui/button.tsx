import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[1.15rem] text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'cta-gradient px-5 py-3 text-primary-foreground shadow-float hover:brightness-105',
        secondary: 'bg-white/88 px-5 py-3 text-foreground shadow-ambient hover:bg-white',
        ghost: 'bg-transparent px-3 py-2 text-muted-foreground hover:bg-white/45 hover:text-foreground',
        outline: 'border border-line/20 bg-white/70 px-5 py-3 text-foreground shadow-ambient hover:bg-white',
        chip: 'bg-surface-low px-4 py-2 text-muted-foreground hover:bg-white hover:text-foreground',
        tonal: 'bg-mint/65 px-5 py-3 text-secondary shadow-ambient hover:bg-mint/80'
      },
      size: {
        default: 'h-12',
        sm: 'h-10 px-4 text-sm',
        lg: 'h-14 px-6 text-base',
        icon: 'h-10 w-10 rounded-full'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, asChild = false, ...props },
  ref
) {
  const Comp = asChild ? Slot : 'button';

  return <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
});

export { Button, buttonVariants };
