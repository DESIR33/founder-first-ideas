/**
 * AIShimmer - Subtle highlight sweep for thinking state
 * Creates an atmospheric "processing" visual without being distracting
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AIShimmerProps {
  isActive?: boolean;
  className?: string;
}

export function AIShimmer({ isActive = false, className }: AIShimmerProps) {
  if (!isActive) return null;

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <motion.div
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ 
          x: ['−100%', '200%'],
          opacity: [0, 0.15, 0],
        }}
        transition={{
          duration: 2.8,
          ease: [0.65, 0, 0.35, 1],
          repeat: Infinity,
          repeatDelay: 0.5,
        }}
        className="absolute inset-y-0 w-1/3"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(var(--ff-accent) / 0.2), transparent)',
        }}
      />
    </div>
  );
}
