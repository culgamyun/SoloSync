'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type MotionRevealProps = {
  as?: 'div' | 'section' | 'article';
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  interactive?: boolean;
};

const motionComponents = {
  div: motion.div,
  section: motion.section,
  article: motion.article
};

export function MotionReveal({
  as = 'div',
  children,
  className,
  delay = 0,
  y = 14,
  interactive = false
}: MotionRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const Component = motionComponents[as];

  return (
    <Component
      className={cn(className)}
      initial={shouldReduceMotion ? false : { opacity: 0, y }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{
        duration: 0.32,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={interactive && !shouldReduceMotion ? { y: -2, scale: 1.006 } : undefined}
      whileTap={interactive && !shouldReduceMotion ? { scale: 0.992 } : undefined}
    >
      {children}
    </Component>
  );
}
