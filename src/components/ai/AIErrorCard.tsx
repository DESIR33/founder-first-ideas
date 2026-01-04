/**
 * AIErrorCard - Calm error state without harsh visuals
 * Provides retry and edit options
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Edit3, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AISurface } from './AISurface';
import { Button } from '@/components/ui/button';
import { cardVariants, cardContentVariants, duration, easing } from '@/lib/motion';

interface AIErrorCardProps {
  message?: string;
  details?: string;
  onRetry?: () => void;
  onEdit?: () => void;
  isVisible?: boolean;
  className?: string;
}

export function AIErrorCard({
  message = "Something didn't load",
  details,
  onRetry,
  onEdit,
  isVisible = true,
  className,
}: AIErrorCardProps) {
  const [showDetails, setShowDetails] = React.useState(false);

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
          <AISurface state="error" className="p-6">
            <motion.div
              variants={cardContentVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {/* Message */}
              <p className="text-foreground font-medium">{message}</p>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {onRetry && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onRetry}
                    className="gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry
                  </Button>
                )}
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onEdit}
                    className="gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit input
                  </Button>
                )}
              </div>

              {/* Details (collapsed by default) */}
              {details && (
                <div className="pt-2">
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className={cn(
                      "flex items-center gap-1 text-xs text-muted-foreground",
                      "hover:text-foreground transition-colors"
                    )}
                  >
                    <ChevronDown
                      className={cn(
                        "w-3 h-3 transition-transform duration-200",
                        showDetails && "rotate-180"
                      )}
                    />
                    Technical details
                  </button>
                  <AnimatePresence>
                    {showDetails && (
                      <motion.pre
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: duration.sm, ease: easing.out }}
                        className={cn(
                          "mt-2 p-3 rounded-lg overflow-hidden",
                          "bg-background/50 text-xs text-muted-foreground",
                          "font-mono whitespace-pre-wrap"
                        )}
                      >
                        {details}
                      </motion.pre>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </AISurface>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
