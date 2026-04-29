import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'border border-primary bg-primary px-5 py-3 text-primary-foreground shadow-none hover:bg-primary/90',
        secondary: 'border border-line bg-surface-high px-5 py-3 text-foreground shadow-none hover:bg-surface-low',
        ghost: 'bg-transparent px-3 py-2 text-muted-foreground hover:bg-surface-low hover:text-foreground',
        outline: 'border border-line bg-transparent px-5 py-3 text-foreground shadow-none hover:bg-surface-low',
        chip: 'border border-line bg-surface-low px-4 py-2 text-muted-foreground shadow-none hover:border-primary/40 hover:bg-surface-high hover:text-foreground',
        tonal: 'border border-observation/25 bg-observation/18 px-5 py-3 text-foreground shadow-none hover:bg-observation/24'
      },
      size: {
        default: 'h-11',
        sm: 'h-11 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-11 w-11 shrink-0 rounded-md p-0'
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
