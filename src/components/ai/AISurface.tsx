/**
 * AISurface - Glass container with active/glow states
 * The primary container for AI-driven content
 */

import React from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { cardVariants, spring, duration, easing } from '@/lib/motion';
import { type AIState, stateVisualProps, inactiveVisualProps } from '@/hooks/useAIState';

interface AISurfaceProps {
  children: React.ReactNode;
  state?: AIState;
  isActive?: boolean;
  className?: string;
  showGlow?: boolean;
  glowIntensity?: number;
}

const surfaceVariants: Variants = {
  inactive: {
    scale: inactiveVisualProps.scale,
    opacity: inactiveVisualProps.opacity,
    transition: {
      duration: duration.md,
      ease: easing.out,
    },
  },
  active: {
    scale: 1,
    opacity: 1,
    transition: {
      ...spring.calm,
    },
  },
  focused: {
    scale: 1.02,
    opacity: 1,
    transition: {
      ...spring.calm,
    },
  },
};

export function AISurface({ 
  children, 
  state = 'idle',
  isActive = true,
  className,
  showGlow,
  glowIntensity,
}: AISurfaceProps) {
  const visualProps = stateVisualProps[state];
  const shouldGlow = showGlow ?? visualProps.glow;
  const intensity = glowIntensity ?? visualProps.glowIntensity;
  
  const variant = !isActive 
    ? 'inactive' 
    : state === 'thinking' || state === 'refining' 
      ? 'focused' 
      : 'active';

  return (
    <motion.div
      variants={surfaceVariants}
      initial="active"
      animate={variant}
      className={cn(
        "relative rounded-3xl overflow-hidden",
        "bg-card/60 backdrop-blur-xl",
        "transition-shadow duration-500",
        className
      )}
      style={{
        boxShadow: shouldGlow 
          ? `0 0 ${40 + intensity * 100}px hsl(var(--ff-accent) / ${intensity})` 
          : 'none',
      }}
    >
      {/* Glass highlight at top */}
      <div 
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(var(--ff-text-primary) / 0.1), transparent)',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Ambient glow overlay when active */}
      <AnimatePresence>
        {shouldGlow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.md, ease: easing.out }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 0%, hsl(var(--ff-accent) / ${intensity * 0.5}), transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
