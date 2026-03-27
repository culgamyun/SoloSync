import * as React from 'react';

import { cn } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          'flex h-14 w-full rounded-[1.3rem] border border-transparent bg-white/92 px-5 py-3 text-[15px] text-foreground outline-none shadow-ambient transition placeholder:text-muted-foreground focus:border-primary/10 focus:ring-2 focus:ring-primary/15',
          className
        )}
        {...props}
      />
    );
  }
);
