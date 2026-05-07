'use client';

import { motion, useAnimationControls, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import type { ReactNode } from 'react';

export function MotionPageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const controls = useAnimationControls();

  useEffect(() => {
    if (shouldReduceMotion) {
      controls.set({ opacity: 1, y: 0 });
      return;
    }

    controls.set({ opacity: 0, y: 8 });
    void controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
    });
  }, [controls, pathname, shouldReduceMotion]);

  return (
    <motion.div key={pathname} initial={false} animate={controls}>
      {children}
    </motion.div>
  );
}
