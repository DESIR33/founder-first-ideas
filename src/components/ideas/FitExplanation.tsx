import { motion } from 'framer-motion';
import { cardContentVariants, duration, easing } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface FitExplanationProps {
  text: string;
  className?: string;
}

/**
 * FitExplanation - "Why This Fits You" summary
 * 1-2 short lines, secondary text, written as explanation not praise
 */
export function FitExplanation({ text, className }: FitExplanationProps) {
  return (
    <motion.p
      variants={cardContentVariants}
      className={cn(
        "text-sm text-muted-foreground leading-relaxed",
        "line-clamp-2",
        className
      )}
    >
      {text}
    </motion.p>
  );
}
