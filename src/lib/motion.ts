/**
 * FounderFit Motion & Easing System
 * Natural AI-inspired, calm, premium motion language
 */

import { type Transition, type Variants } from 'framer-motion';

// =============================================================================
// DURATION TOKENS (in seconds for Framer Motion)
// =============================================================================
export const duration = {
  xxs: 0.12,
  xs: 0.18,
  sm: 0.24,
  md: 0.36,
  lg: 0.52,
  xl: 0.7,
} as const;

// =============================================================================
// STAGGER TOKENS (in seconds for Framer Motion)
// =============================================================================
export const stagger = {
  xs: 0.04,
  sm: 0.07,
  md: 0.11,
} as const;

// =============================================================================
// EASING TOKENS
// =============================================================================
export const easing = {
  // For opacity and color transitions
  out: [0.16, 1, 0.3, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
} as const;

// =============================================================================
// SPRING CONFIGURATIONS
// =============================================================================
export const spring = {
  // Primary spring - calm, premium feel
  calm: {
    type: 'spring' as const,
    stiffness: 140,
    damping: 22,
    mass: 1,
  },
  // Snappy spring - micro interactions
  snappy: {
    type: 'spring' as const,
    stiffness: 220,
    damping: 24,
    mass: 0.8,
  },
  // Gentle spring - for larger movements
  gentle: {
    type: 'spring' as const,
    stiffness: 100,
    damping: 20,
    mass: 1.1,
  },
} as const;

// =============================================================================
// TRANSITION PRESETS
// =============================================================================
export const transition = {
  // Default transform transition
  transform: {
    ...spring.calm,
  } as Transition,
  
  // Opacity transition
  opacity: {
    duration: duration.md,
    ease: easing.out,
  } as Transition,
  
  // Combined transform + opacity
  morphIn: {
    ...spring.calm,
    opacity: { duration: duration.md, ease: easing.out },
  } as Transition,
  
  // Exit transition
  morphOut: {
    duration: duration.sm,
    ease: easing.inOut,
  } as Transition,
  
  // Micro interaction
  micro: {
    ...spring.snappy,
  } as Transition,
  
  // Slow, premium feel
  premium: {
    ...spring.gentle,
    opacity: { duration: duration.lg, ease: easing.out },
  } as Transition,
} as const;

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

/**
 * Glass Card Enter/Exit
 * Primary content surfaces - subtle scale, y-shift, and blur
 */
export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.98,
    y: 10,
    filter: 'blur(6px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      ...spring.calm,
      opacity: { duration: duration.md, ease: easing.out },
      filter: { duration: duration.md, ease: easing.out },
    },
  },
  exit: {
    opacity: 0,
    scale: 0.99,
    y: 6,
    filter: 'blur(4px)',
    transition: {
      duration: duration.sm,
      ease: easing.inOut,
    },
  },
};

/**
 * Card content - delayed fade in after container
 */
export const cardContentVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: duration.sm,
      ease: easing.out,
      delay: 0.12, // 120ms after container
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: duration.xs,
      ease: easing.inOut,
    },
  },
};

/**
 * Sheet/Tray Slide Up
 * Bottom panels, modals, drawers
 */
export const trayVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 22,
    scale: 0.995,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      ...spring.calm,
      opacity: { duration: duration.lg, ease: easing.out },
      filter: { duration: duration.md, ease: easing.out, delay: 0.08 },
    },
  },
  exit: {
    opacity: 0,
    y: 16,
    scale: 0.995,
    transition: {
      duration: duration.sm,
      ease: easing.inOut,
    },
  },
};

/**
 * Focus Shift - Active surface wins
 */
export const focusVariants: Variants = {
  inactive: {
    opacity: 0.75,
    scale: 0.995,
    transition: {
      duration: duration.md,
      ease: easing.out,
    },
  },
  active: {
    opacity: 1,
    scale: 1.02,
    transition: {
      ...spring.calm,
    },
  },
};

/**
 * Fade in - Simple opacity transition
 */
export const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: duration.md,
      ease: easing.out,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: duration.sm,
      ease: easing.inOut,
    },
  },
};

/**
 * Slide up - Subtle vertical movement
 */
export const slideUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...spring.calm,
      opacity: { duration: duration.md, ease: easing.out },
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: duration.sm,
      ease: easing.inOut,
    },
  },
};

/**
 * Staggered children container
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.sm,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: stagger.xs,
      staggerDirection: -1,
    },
  },
};

/**
 * Staggered child item
 */
export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 8,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...spring.calm,
      opacity: { duration: duration.sm, ease: easing.out },
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: {
      duration: duration.xs,
      ease: easing.inOut,
    },
  },
};

/**
 * Micro tap/press feedback
 */
export const pressVariants: Variants = {
  idle: {
    scale: 1,
  },
  pressed: {
    scale: 0.985,
    transition: {
      duration: duration.xxs,
      ease: easing.out,
    },
  },
};

/**
 * Hover lift effect
 */
export const hoverLiftVariants: Variants = {
  idle: {
    y: 0,
    scale: 1,
  },
  hover: {
    y: -2,
    scale: 1.005,
    transition: {
      ...spring.snappy,
    },
  },
};

/**
 * Thinking/Loading pulse
 * Subtle, not animated-loader-y
 */
export const pulseVariants: Variants = {
  idle: {
    scale: 1,
    opacity: 1,
  },
  pulsing: {
    scale: [1, 1.015, 1],
    opacity: [1, 0.92, 1],
    transition: {
      duration: 1.8,
      ease: easing.inOut,
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

/**
 * Glow animation for AI active state
 */
export const glowVariants: Variants = {
  idle: {
    boxShadow: '0 0 40px hsl(234 100% 74% / 0.08)',
  },
  active: {
    boxShadow: [
      '0 0 40px hsl(234 100% 74% / 0.08)',
      '0 0 60px hsl(234 100% 74% / 0.15)',
      '0 0 40px hsl(234 100% 74% / 0.08)',
    ],
    transition: {
      duration: 2.2,
      ease: easing.inOut,
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Create a staggered delay for child elements
 */
export function getStaggerDelay(index: number, type: keyof typeof stagger = 'sm'): number {
  return index * stagger[type];
}

/**
 * Create animation props for a card with optional delay
 */
export function createCardAnimation(delay: number = 0) {
  return {
    initial: 'hidden',
    animate: 'visible',
    exit: 'exit',
    variants: cardVariants,
    transition: {
      ...spring.calm,
      delay,
      opacity: { duration: duration.md, ease: easing.out, delay },
      filter: { duration: duration.md, ease: easing.out, delay },
    },
  };
}

/**
 * Create animation props for staggered list items
 */
export function createStaggerAnimation() {
  return {
    container: {
      initial: 'hidden',
      animate: 'visible',
      exit: 'exit',
      variants: staggerContainerVariants,
    },
    item: {
      variants: staggerItemVariants,
    },
  };
}
