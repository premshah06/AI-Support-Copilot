import { motion, MotionProps } from 'framer-motion';
import { forwardRef } from 'react';

/**
 * Performance-optimized motion component that automatically manages will-change
 * Uses transform and opacity for GPU-accelerated animations
 */

interface OptimizedMotionProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
}

export const OptimizedMotionDiv = forwardRef<HTMLDivElement, OptimizedMotionProps>(
  ({ children, style, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        style={{
          ...style,
          // Let Framer Motion handle will-change automatically
          // It adds will-change during animations and removes it after
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

OptimizedMotionDiv.displayName = 'OptimizedMotionDiv';

export const OptimizedMotionArticle = forwardRef<HTMLElement, OptimizedMotionProps>(
  ({ children, style, ...props }, ref) => {
    return (
      <motion.article
        ref={ref as any}
        style={{
          ...style,
        }}
        {...props}
      >
        {children}
      </motion.article>
    );
  }
);

OptimizedMotionArticle.displayName = 'OptimizedMotionArticle';
