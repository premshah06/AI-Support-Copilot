/**
 * Framer Motion Transition Configurations
 * Standard timing and easing functions for consistent animations
 */

import { Transition } from 'framer-motion';

// Standard transition timings
export const transitions = {
  fast: 0.15,
  base: 0.2,
  slow: 0.3,
} as const;

// Easing functions
export const easings = {
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  sharp: [0.4, 0, 0.6, 1],
} as const;

// Predefined transition configurations
export const fastTransition: Transition = {
  duration: transitions.fast,
  ease: easings.easeOut,
};

export const baseTransition: Transition = {
  duration: transitions.base,
  ease: easings.easeOut,
};

export const slowTransition: Transition = {
  duration: transitions.slow,
  ease: easings.easeOut,
};

// Spring transitions for natural movement
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export const gentleSpring: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 25,
};

export const bouncySpring: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 20,
};
