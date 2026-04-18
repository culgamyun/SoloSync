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
        'min-h-32 w-full rounded-md border border-line bg-surface-high px-4 py-3 text-[15px] text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/35 focus:ring-2 focus:ring-primary/15',
        className
      )}
      {...props}
    />
  );
});
