/**
 * ReflectionCard - Single-question card for guided reflection
 * Coach-like interface that asks one clarifying question at a time
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AISurface } from './AISurface';
import { QuickChips } from './QuickChips';
import { cardVariants, cardContentVariants, duration, easing } from '@/lib/motion';

interface ReflectionCardProps {
  question: string;
  options?: string[];
  onOptionSelect?: (option: string) => void;
  onCustomInput?: (value: string) => void;
  isVisible?: boolean;
  className?: string;
}

export function ReflectionCard({
  question,
  options = [],
  onOptionSelect,
  onCustomInput,
  isVisible = true,
  className,
}: ReflectionCardProps) {
  const [customValue, setCustomValue] = React.useState('');
  const [showCustomInput, setShowCustomInput] = React.useState(false);

  const handleOptionSelect = (option: string) => {
    if (option === 'custom') {
      setShowCustomInput(true);
    } else {
      onOptionSelect?.(option);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customValue.trim()) {
      onCustomInput?.(customValue.trim());
      setCustomValue('');
      setShowCustomInput(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={className}
        >
          <AISurface state="reflecting" className="p-6">
            {/* Question */}
            <motion.p
              variants={cardContentVariants}
              initial="hidden"
              animate="visible"
              className="text-lg font-medium text-foreground mb-6"
            >
              {question}
            </motion.p>

            {/* Options */}
            {options.length > 0 && !showCustomInput && (
              <QuickChips
                options={[...options, 'Type your own']}
                onSelect={(opt) => handleOptionSelect(opt === 'Type your own' ? 'custom' : opt)}
              />
            )}

            {/* Custom input */}
            <AnimatePresence>
              {showCustomInput && (
                <motion.form
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: duration.sm, ease: easing.out }}
                  onSubmit={handleCustomSubmit}
                  className="space-y-3"
                >
                  <input
                    type="text"
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    placeholder="Type your answer..."
                    autoFocus
                    className={cn(
                      "w-full px-4 py-3 rounded-xl",
                      "bg-background/50 backdrop-blur-sm",
                      "border-none outline-none",
                      "text-foreground placeholder:text-muted-foreground/50",
                      "focus:ring-2 focus:ring-ff-accent/30 focus:ring-offset-0",
                      "transition-all duration-200"
                    )}
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={!customValue.trim()}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-medium",
                        "bg-primary text-primary-foreground",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "transition-all duration-200",
                        "hover:scale-[1.02] active:scale-[0.98]"
                      )}
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCustomInput(false)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-medium",
                        "bg-secondary text-secondary-foreground",
                        "transition-all duration-200",
                        "hover:bg-secondary/80"
                      )}
                    >
                      Back
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </AISurface>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
