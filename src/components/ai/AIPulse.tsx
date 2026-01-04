/**
 * AIPulse - Breathing animation for listening/thinking states
 * Subtle, calm pulsing that indicates AI activity
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { easing } from '@/lib/motion';

interface AIPulseProps {
  isActive?: boolean;
  variant?: 'dot' | 'ring' | 'bar';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { dot: 'w-2 h-2', ring: 'w-4 h-4', bar: 'w-8 h-1' },
  md: { dot: 'w-3 h-3', ring: 'w-6 h-6', bar: 'w-12 h-1.5' },
  lg: { dot: 'w-4 h-4', ring: 'w-8 h-8', bar: 'w-16 h-2' },
};

const pulseAnimation = {
  scale: [1, 1.015, 1],
  opacity: [1, 0.92, 1],
};

const pulseTransition = {
  duration: 1.8,
  ease: easing.inOut,
  repeat: Infinity,
  repeatType: 'loop' as const,
};

export function AIPulse({ 
  isActive = true, 
  variant = 'dot',
  size = 'md',
  className,
}: AIPulseProps) {
  if (!isActive) return null;

  const sizeClass = sizeMap[size][variant];

  if (variant === 'dot') {
    return (
      <motion.div
        animate={pulseAnimation}
        transition={pulseTransition}
        className={cn(
          sizeClass,
          "rounded-full bg-ff-accent",
          className
        )}
      />
    );
  }

  if (variant === 'ring') {
    return (
      <div className={cn("relative", sizeClass, className)}>
        <motion.div
          animate={pulseAnimation}
          transition={pulseTransition}
          className="absolute inset-0 rounded-full border-2 border-ff-accent/50"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            ...pulseTransition,
            duration: 2.2,
          }}
          className="absolute inset-0 rounded-full border border-ff-accent/30"
        />
      </div>
    );
  }

  // Bar variant - minimal waveform-like
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            scaleY: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            ...pulseTransition,
            delay: i * 0.15,
            duration: 1.2,
          }}
          className={cn(
            "rounded-full bg-ff-accent",
            size === 'sm' ? 'w-0.5 h-2' : size === 'md' ? 'w-1 h-3' : 'w-1.5 h-4'
          )}
        />
      ))}
    </div>
  );
}
