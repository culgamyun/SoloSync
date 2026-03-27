import * as React from 'react';

import { cn } from '@/lib/utils';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'min-h-32 w-full rounded-[1.8rem] border border-transparent bg-white/92 px-5 py-4 text-[15px] text-foreground outline-none shadow-ambient transition placeholder:text-muted-foreground focus:border-primary/10 focus:ring-2 focus:ring-primary/15',
        className
      )}
      {...props}
    />
  );
});
