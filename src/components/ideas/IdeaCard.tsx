import { forwardRef } from 'react';
import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BusinessIdea } from '@/types/founder';
import { FitExplanation } from './FitExplanation';
import { EffortDescriptor } from './EffortDescriptor';
import { FirstStep } from './FirstStep';
import { 
  cardVariants, 
  cardContentVariants,
  duration,
  easing,
  spring 
} from '@/lib/motion';

export type IdeaCardLevel = 'primary' | 'supporting' | 'background';

interface IdeaCardProps {
  idea: BusinessIdea;
  level?: IdeaCardLevel;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  showActions?: boolean;
  children?: React.ReactNode;
}

/**
 * Visual tokens by hierarchy level
 */
const levelStyles: Record<IdeaCardLevel, {
  scale: number;
  opacity: number;
  glow: boolean;
  textContrast: string;
}> = {
  primary: {
    scale: 1.02,
    opacity: 1,
    glow: true,
    textContrast: 'text-foreground',
  },
  supporting: {
    scale: 1.0,
    opacity: 1,
    glow: false,
    textContrast: 'text-foreground/90',
  },
  background: {
    scale: 0.995,
    opacity: 0.75,
    glow: false,
    textContrast: 'text-foreground/70',
  },
};

/**
 * Animation variants for level transitions
 */
const levelVariants: Variants = {
  primary: {
    scale: 1.02,
    opacity: 1,
    y: -4,
    transition: {
      type: 'spring',
      ...spring.calm,
      opacity: { duration: duration.md / 1000, ease: easing.out },
    },
  },
  supporting: {
    scale: 1.0,
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      ...spring.calm,
      opacity: { duration: duration.md / 1000, ease: easing.out },
    },
  },
  background: {
    scale: 0.995,
    opacity: 0.75,
    y: 0,
    transition: {
      type: 'spring',
      ...spring.calm,
      opacity: { duration: duration.md / 1000, ease: easing.out },
    },
  },
};

/**
 * IdeaCard - Base component for displaying business ideas
 * 
 * Hierarchy levels:
 * - primary: Currently selected/recommended (glow, slightly larger, highest contrast)
 * - supporting: Other viable ideas (normal scale, no glow, slightly reduced contrast)
 * - background: Deferred ideas (lower opacity, slight scale down, de-emphasized)
 */
export const IdeaCard = forwardRef<HTMLDivElement, IdeaCardProps>(
  ({ idea, level = 'supporting', isActive, onClick, className, showActions = false, children }, ref) => {
    const styles = levelStyles[level];
    const firstStep = idea.sevenDayPlan?.[0] || idea.mvpScope?.[0] || '';

    return (
      <motion.div
        ref={ref}
        variants={levelVariants}
        initial="supporting"
        animate={level}
        whileHover={{ 
          scale: styles.scale * 1.005,
          transition: { duration: duration.xxs / 1000 }
        }}
        whileTap={{ 
          scale: styles.scale * 0.995,
          transition: { duration: duration.xxs / 1000 }
        }}
        onClick={onClick}
        className={cn(
          // Base glass surface
          "relative rounded-2xl overflow-hidden",
          "bg-card backdrop-blur-[var(--ff-glass-blur)]",
          "border border-border/30",
          // Cursor
          onClick && "cursor-pointer",
          // Transitions
          "transition-[box-shadow] duration-[var(--ff-dur-md)] ease-[var(--ff-ease-out)]",
          // Glow for primary level
          level === 'primary' && "shadow-[var(--shadow-glow)]",
          className
        )}
        style={{
          // Inner highlight gradient
          background: `linear-gradient(180deg, hsl(var(--ff-glass-highlight)), transparent 50%), hsl(var(--card))`,
        }}
      >
        {/* Ambient glow overlay for primary */}
        {level === 'primary' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.sm / 1000 }}
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, hsl(var(--ff-glow-color) / 0.08), transparent 70%)',
            }}
          />
        )}

        {/* Card Content */}
        <motion.div 
          className="relative z-10 p-5 space-y-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.04,
                delayChildren: 0.1,
              },
            },
          }}
        >
          {/* Idea Name - Largest text, 1 line max */}
          <motion.h3
            variants={cardContentVariants}
            className={cn(
              "text-lg font-semibold leading-tight line-clamp-1",
              styles.textContrast
            )}
          >
            {idea.title}
          </motion.h3>

          {/* Fit Summary */}
          <FitExplanation text={idea.whyYou} />

          {/* Effort/Return Indicator */}
          <EffortDescriptor
            capitalNeeded={idea.capitalNeeded}
            timeToRevenue={idea.timeToFirstRevenue}
            riskLevel={idea.riskLevel}
            executionComplexity={idea.executionComplexity}
          />

          {/* First Concrete Step */}
          {firstStep && <FirstStep step={firstStep} />}

          {/* Additional content (actions, etc.) */}
          {children}
        </motion.div>
      </motion.div>
    );
  }
);

IdeaCard.displayName = 'IdeaCard';

/**
 * PrimaryIdeaCard - Convenience wrapper for primary level
 */
export function PrimaryIdeaCard(props: Omit<IdeaCardProps, 'level'>) {
  return <IdeaCard {...props} level="primary" />;
}
