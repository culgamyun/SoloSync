'use client';

import { motion, useAnimationControls, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';
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
  const controls = useAnimationControls();
  const Component = motionComponents[as];

  useEffect(() => {
    if (shouldReduceMotion) {
      controls.set({ opacity: 1, y: 0 });
      return;
    }

    controls.set({ opacity: 0, y });
    void controls.start({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.32,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }
    });
  }, [controls, delay, shouldReduceMotion, y]);

  return (
    <Component
      className={cn(className)}
      initial={false}
      animate={controls}
      whileHover={interactive && !shouldReduceMotion ? { y: -2, scale: 1.006 } : undefined}
      whileTap={interactive && !shouldReduceMotion ? { scale: 0.992 } : undefined}
    >
      {children}
    </Component>
  );
}
