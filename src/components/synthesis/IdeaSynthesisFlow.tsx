/**
 * IdeaSynthesisFlow - Orchestrates the onboarding → idea reveal experience
 * States: synthesizing → framing → revealing → presented
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BusinessIdea, FounderProfile, FounderProfileSummary } from '@/types/founder';
import { generateMatchingIdea, generateProfileSummary } from '@/lib/ideaEngine';
import { AISurface, AIPulse, AIShimmer } from '@/components/ai';
import { SilentFraming } from './SilentFraming';
import { IdeaReveal } from './IdeaReveal';
import { duration, easing, spring } from '@/lib/motion';
import { cn } from '@/lib/utils';

type SynthesisState = 'synthesizing' | 'framing' | 'revealing' | 'presented';

interface IdeaSynthesisFlowProps {
  profile: FounderProfile;
  onComplete: (ideas: BusinessIdea[], summary: FounderProfileSummary) => void;
  onIdeaSelect?: (idea: BusinessIdea) => void;
  className?: string;
}

// Generate framing lines based on profile
function generateFramingLines(profile: FounderProfile, summary: FounderProfileSummary): string[] {
  const lines: string[] = [];

  // Time constraint
  if (profile.hoursPerWeek < 10) {
    lines.push("Optimizing for low time commitment.");
  } else if (profile.hoursPerWeek >= 30) {
    lines.push("Leveraging your full-time availability.");
  }

  // Risk preference
  if (profile.riskTolerance <= 3) {
    lines.push("Favoring stable, low-risk models.");
  } else if (profile.riskTolerance >= 7) {
    lines.push("Looking for asymmetric upside.");
  }

  // Skills
  if (profile.hasWritingSkills) {
    lines.push("Building on your writing ability.");
  }
  if (profile.technicalAbility === 'developer') {
    lines.push("Leveraging your technical skills.");
  } else if (profile.technicalAbility === 'no-code') {
    lines.push("Using no-code friendly approaches.");
  }

  // Marketing
  if (profile.marketingComfort <= 3) {
    lines.push("Avoiding cold outreach.");
  } else if (profile.marketingComfort >= 7) {
    lines.push("Capitalizing on your marketing comfort.");
  }

  // Audience
  if (profile.existingAudience.hasAudience) {
    lines.push("Leveraging your existing audience.");
  }

  // Anti-patterns
  if (summary.antiPatterns.includes('Capital-intensive businesses')) {
    lines.push("Filtering out capital-heavy ideas.");
  }

  // Return max 3 frames
  return lines.slice(0, 3);
}

export function IdeaSynthesisFlow({
  profile,
  onComplete,
  onIdeaSelect,
  className,
}: IdeaSynthesisFlowProps) {
  const [state, setState] = useState<SynthesisState>('synthesizing');
  const [summary, setSummary] = useState<FounderProfileSummary | null>(null);
  const [primaryIdea, setPrimaryIdea] = useState<BusinessIdea | null>(null);
  const [framingLines, setFramingLines] = useState<string[]>([]);

  // Phase 1: Synthesize profile (brief pause for effect)
  useEffect(() => {
    const timer = setTimeout(() => {
      const profileSummary = generateProfileSummary(profile);
      setSummary(profileSummary);
      
      const lines = generateFramingLines(profile, profileSummary);
      setFramingLines(lines);
      
      setState('framing');
    }, 1200); // Brief thinking pause

    return () => clearTimeout(timer);
  }, [profile]);

  // Phase 2: Generate ideas during framing
  useEffect(() => {
    if (state === 'framing' && summary) {
      // Generate idea while framing plays
      const idea = generateMatchingIdea(profile, summary, []);
      setPrimaryIdea(idea);
    }
  }, [state, summary, profile]);

  // Handle framing complete
  const handleFramingComplete = useCallback(() => {
    setState('revealing');
  }, []);

  // Handle reveal settle
  useEffect(() => {
    if (state === 'revealing') {
      const timer = setTimeout(() => {
        setState('presented');
        if (primaryIdea && summary) {
          onComplete([primaryIdea], summary);
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [state, primaryIdea, summary, onComplete]);

  return (
    <div className={cn(
      "min-h-screen bg-background flex items-center justify-center p-6",
      className
    )}>
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-muted/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        <AnimatePresence mode="wait">
          {/* Synthesizing + Framing states */}
          {(state === 'synthesizing' || state === 'framing') && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99, filter: 'blur(4px)' }}
              transition={{
                duration: duration.md / 1000,
                ease: easing.out,
              }}
            >
              <AISurface 
                state="thinking"
                isActive
                showGlow
                glowIntensity={0.1}
                className="p-12 text-center"
              >
                <AIShimmer isActive={state === 'synthesizing'} />
                
                {/* Breathing pulse */}
                <motion.div 
                  className="flex justify-center mb-6"
                  animate={{ scale: [1, 1.015, 1], opacity: [1, 0.92, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: easing.inOut }}
                >
                  <AIPulse variant="ring" size="lg" />
                </motion.div>

                {/* State message */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="text-lg text-foreground/90 mb-4"
                >
                  {state === 'synthesizing' 
                    ? "Let me think about this." 
                    : "Finding what fits you."}
                </motion.p>

                {/* Framing lines */}
                {state === 'framing' && (
                  <SilentFraming
                    frames={framingLines}
                    frameDuration={1800}
                    onComplete={handleFramingComplete}
                  />
                )}
              </AISurface>
            </motion.div>
          )}

          {/* Revealing + Presented states */}
          {(state === 'revealing' || state === 'presented') && primaryIdea && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: duration.md / 1000,
                ease: easing.out,
              }}
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: duration.sm / 1000 }}
                className="text-center mb-8"
              >
                <p className="text-sm text-muted-foreground">
                  Here's what I see
                </p>
              </motion.div>

              {/* Ideas */}
              <IdeaReveal
                primaryIdea={primaryIdea}
                onPrimaryClick={() => onIdeaSelect?.(primaryIdea)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
