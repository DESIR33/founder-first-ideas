import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cardContentVariants } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface FirstStepProps {
  /** The first concrete step - should start with a verb */
  step: string;
  className?: string;
}

/**
 * FirstStep - Critical for trust
 * 1 short actionable sentence, always starts with a verb, no future fluff
 */
export function FirstStep({ step, className }: FirstStepProps) {
  return (
    <motion.div
      variants={cardContentVariants}
      className={cn(
        "flex items-start gap-2 pt-3 border-t border-border/30",
        className
      )}
    >
      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/60 mt-0.5 flex-shrink-0" />
      <span className="text-sm text-foreground/80 leading-snug">
        {step}
      </span>
    </motion.div>
  );
}
