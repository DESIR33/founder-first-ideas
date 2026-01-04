/**
 * SilentFraming - Shows how AI is thinking (not what yet)
 * Displays 1 line at a time with gentle fade in/out
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { duration, easing } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface SilentFramingProps {
  frames: string[];
  /** Time to show each frame in ms */
  frameDuration?: number;
  /** Called when all frames have been shown */
  onComplete?: () => void;
  className?: string;
}

export function SilentFraming({ 
  frames, 
  frameDuration = 1800,
  onComplete,
  className,
}: SilentFramingProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (frames.length === 0) {
      onComplete?.();
      return;
    }

    const showTimer = setTimeout(() => {
      setIsVisible(false);
    }, frameDuration - 400); // Start fade out before next

    const nextTimer = setTimeout(() => {
      if (currentIndex < frames.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setIsVisible(true);
      } else {
        onComplete?.();
      }
    }, frameDuration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(nextTimer);
    };
  }, [currentIndex, frames.length, frameDuration, onComplete]);

  if (frames.length === 0) return null;

  return (
    <div className={cn("h-6 flex items-center justify-center", className)}>
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, y: 4, filter: 'blur(4px)' }}
            animate={{ opacity: 0.7, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -4, filter: 'blur(4px)' }}
            transition={{ 
              duration: duration.sm / 1000,
              ease: easing.out,
            }}
            className="text-sm text-muted-foreground italic"
          >
            {frames[currentIndex]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
