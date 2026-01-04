/**
 * IdeaReveal - Animated reveal of ideas
 * Shows primary idea first, then supporting ideas with delay
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BusinessIdea } from '@/types/founder';
import { PrimaryIdeaCard, IdeaCard } from '@/components/ideas';
import { duration, easing, stagger } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface IdeaRevealProps {
  primaryIdea: BusinessIdea;
  supportingIdeas?: BusinessIdea[];
  /** Delay before showing supporting ideas in ms */
  supportingDelay?: number;
  onPrimaryClick?: () => void;
  onSupportingClick?: (idea: BusinessIdea) => void;
  className?: string;
}

export function IdeaReveal({
  primaryIdea,
  supportingIdeas = [],
  supportingDelay = 500,
  onPrimaryClick,
  onSupportingClick,
  className,
}: IdeaRevealProps) {
  const [showSupporting, setShowSupporting] = useState(false);

  useEffect(() => {
    if (supportingIdeas.length > 0) {
      const timer = setTimeout(() => {
        setShowSupporting(true);
      }, supportingDelay);
      return () => clearTimeout(timer);
    }
  }, [supportingIdeas.length, supportingDelay]);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Primary Idea - enters first */}
      <motion.div
        initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{
          duration: duration.md / 1000,
          ease: easing.out,
        }}
      >
        <PrimaryIdeaCard 
          idea={primaryIdea}
          onClick={onPrimaryClick}
        />
      </motion.div>

      {/* Supporting Ideas - enter with stagger after delay */}
      <AnimatePresence>
        {showSupporting && supportingIdeas.length > 0 && (
          <motion.div 
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: stagger.sm / 1000,
                }
              }
            }}
          >
            {supportingIdeas.map((idea, index) => (
              <motion.div
                key={idea.id}
                variants={{
                  hidden: { opacity: 0, y: 12, filter: 'blur(6px)' },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    filter: 'blur(0px)',
                    transition: {
                      duration: duration.md / 1000,
                      ease: easing.out,
                    }
                  },
                }}
              >
                <IdeaCard
                  idea={idea}
                  level="supporting"
                  onClick={() => onSupportingClick?.(idea)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
