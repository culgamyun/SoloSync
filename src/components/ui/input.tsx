import * as React from 'react';

import { cn } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          'flex h-12 w-full rounded-md border border-line bg-surface-high px-4 py-3 text-[15px] text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/35 focus:ring-2 focus:ring-primary/15',
          className
        )}
        {...props}
      />
    );
  }
);
