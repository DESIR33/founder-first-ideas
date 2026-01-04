/**
 * QuickChips - Response chips with staggered animation
 * Quick-select options for reflection questions
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { stagger, spring, duration, easing } from '@/lib/motion';

interface QuickChipsProps {
  options: string[];
  onSelect?: (option: string) => void;
  selectedOption?: string;
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.sm,
      delayChildren: 0.1,
    },
  },
};

const chipVariants = {
  hidden: {
    opacity: 0,
    y: 8,
    scale: 0.95,
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
};

export function QuickChips({
  options,
  onSelect,
  selectedOption,
  className,
}: QuickChipsProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("flex flex-wrap gap-2", className)}
    >
      {options.map((option) => (
        <motion.button
          key={option}
          variants={chipVariants}
          onClick={() => onSelect?.(option)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-medium",
            "transition-colors duration-200",
            selectedOption === option
              ? "bg-primary text-primary-foreground"
              : "bg-secondary/80 text-secondary-foreground hover:bg-secondary"
          )}
        >
          {option}
        </motion.button>
      ))}
    </motion.div>
  );
}
