import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BusinessIdea } from '@/types/founder';
import { IdeaCard, IdeaCardLevel } from './IdeaCard';
import { stagger, duration, easing } from '@/lib/motion';

interface IdeaStackProps {
  ideas: BusinessIdea[];
  /** ID of the currently focused/primary idea */
  primaryId?: string | null;
  /** Called when user clicks an idea - promotes it to primary */
  onSelectIdea?: (idea: BusinessIdea) => void;
  /** Maximum ideas visible at once (3-5 recommended) */
  maxVisible?: number;
  className?: string;
  /** Render custom content inside each card */
  renderCardContent?: (idea: BusinessIdea, level: IdeaCardLevel) => React.ReactNode;
}

/**
 * IdeaStack - Vertically stacked idea cards with hierarchy
 * 
 * Design rules:
 * - Max 3-5 ideas visible at once
 * - White space is intentional
 * - Cards feel "placed" not "generated"
 * - Selection = Focus, not navigation
 */
export function IdeaStack({
  ideas,
  primaryId,
  onSelectIdea,
  maxVisible = 5,
  className,
  renderCardContent,
}: IdeaStackProps) {
  const visibleIdeas = ideas.slice(0, maxVisible);

  const getLevel = useCallback((ideaId: string, index: number): IdeaCardLevel => {
    if (primaryId === ideaId) return 'primary';
    if (primaryId) {
      // If there's a primary, others become background if beyond first 2
      return index > 1 ? 'background' : 'supporting';
    }
    // No primary selected - first is primary, rest supporting
    return index === 0 ? 'primary' : 'supporting';
  }, [primaryId]);

  const handleSelect = useCallback((idea: BusinessIdea) => {
    onSelectIdea?.(idea);
  }, [onSelectIdea]);

  return (
    <motion.div
      className={cn("space-y-4", className)}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger.sm / 1000,
          },
        },
      }}
    >
      <AnimatePresence mode="popLayout">
        {visibleIdeas.map((idea, index) => {
          const level = getLevel(idea.id, index);
          
          return (
            <motion.div
              key={idea.id}
              layout
              initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                filter: 'blur(0px)',
                transition: {
                  opacity: { duration: duration.md / 1000, ease: easing.out },
                  y: { duration: duration.md / 1000, ease: easing.out },
                  filter: { duration: duration.sm / 1000 },
                  delay: index * (stagger.sm / 1000),
                },
              }}
              exit={{ 
                opacity: 0, 
                y: -8, 
                filter: 'blur(4px)',
                transition: {
                  duration: duration.sm / 1000,
                },
              }}
            >
              <IdeaCard
                idea={idea}
                level={level}
                onClick={() => handleSelect(idea)}
              >
                {renderCardContent?.(idea, level)}
              </IdeaCard>
            </motion.div>
          );
        })}
      </AnimatePresence>
      
      {/* Subtle indicator if more ideas exist */}
      {ideas.length > maxVisible && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-muted-foreground/50 pt-2"
        >
          +{ideas.length - maxVisible} more ideas saved
        </motion.p>
      )}
    </motion.div>
  );
}
