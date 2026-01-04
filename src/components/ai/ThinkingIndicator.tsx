/**
 * ThinkingIndicator - Combined thinking state UI
 * Shows "Thinking..." text with subtle pulse animation
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AIPulse } from './AIPulse';
import { cardVariants, duration, easing } from '@/lib/motion';

interface ThinkingIndicatorProps {
  isVisible?: boolean;
  message?: string;
  className?: string;
}

export function ThinkingIndicator({ 
  isVisible = false, 
  message = 'Thinking',
  className,
}: ThinkingIndicatorProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            "flex items-center gap-3 px-4 py-3",
            "rounded-2xl bg-card/40 backdrop-blur-lg",
            className
          )}
        >
          <AIPulse variant="ring" size="sm" />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12, duration: duration.sm, ease: easing.out }}
            className="text-sm text-muted-foreground"
          >
            {message}
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: easing.inOut }}
            >
              …
            </motion.span>
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
