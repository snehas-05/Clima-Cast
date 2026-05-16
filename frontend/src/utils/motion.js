/**
 * CLIMA-CAST Unified Motion System
 * 
 * Calm, Cinematic, and Performance-Safe constants for Framer Motion.
 * Focuses on atmospheric transitions and depth-based interactions.
 */

export const TIMING = {
  FAST: 0.2,    // Tooltips, toggle interactions, small micro-interactions
  MEDIUM: 0.4,  // Card entries, modal transitions, layout shifts
  SLOW: 0.8     // Cinematic reveals, route transitions, hero animations
};

export const EASING = {
  SOFT: [0.4, 0, 0.2, 1],       // Standard smooth curve
  CINEMATIC: [0.22, 1, 0.36, 1], // Decelerate for premium reveal feel
  APPROACH: [0, 0.55, 0.45, 1],  // Soft entrance
};

export const SPRING = {
  DEFAULT: { type: 'spring', stiffness: 100, damping: 20 },
  SOFT: { type: 'spring', stiffness: 60, damping: 25 },
  TACTILE: { type: 'spring', stiffness: 300, damping: 30 }
};

export const TRANSITIONS = {
  ROUTE: {
    initial: { opacity: 0, filter: 'blur(10px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(10px)' },
    transition: { duration: TIMING.SLOW, ease: EASING.CINEMATIC }
  },
  FADE_IN: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: TIMING.MEDIUM, ease: EASING.SOFT }
  },
  SOFT_REVEAL: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: TIMING.MEDIUM, ease: EASING.CINEMATIC }
  }
};

export const HOVER = {
  DEPTH: {
    whileHover: { 
      y: -4,
      boxShadow: '0 20px 40px -15px rgba(192, 132, 252, 0.15)',
      borderColor: 'rgba(192, 132, 252, 0.4)'
    },
    transition: { duration: TIMING.FAST, ease: EASING.SOFT }
  },
  GLOW: {
    whileHover: {
      borderColor: 'rgba(192, 132, 252, 0.5)',
      boxShadow: '0 0 20px rgba(192, 132, 252, 0.2)'
    },
    transition: { duration: TIMING.FAST, ease: EASING.SOFT }
  }
};
