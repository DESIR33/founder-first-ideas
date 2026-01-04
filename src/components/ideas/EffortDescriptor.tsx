import { motion } from 'framer-motion';
import { cardContentVariants } from '@/lib/motion';
import { cn } from '@/lib/utils';

type EffortLevel = 'low' | 'medium' | 'high';
type RiskLevel = 'low' | 'medium' | 'high';

interface EffortDescriptorProps {
  capitalNeeded: string;
  timeToRevenue: string;
  riskLevel: RiskLevel;
  executionComplexity?: 'simple' | 'moderate' | 'complex';
  className?: string;
}

/**
 * Maps numeric/categorical values to human-readable effort descriptors
 * No numbers, no percentages, no "best" or "top" wording
 */
function getEffortLabel(capitalNeeded: string, executionComplexity?: string): string {
  const isLowCapital = capitalNeeded === '$0' || capitalNeeded === '<$1k';
  const isSimple = executionComplexity === 'simple';
  
  if (isLowCapital && isSimple) return 'Low setup';
  if (isLowCapital) return 'Minimal investment';
  if (executionComplexity === 'complex') return 'Higher effort';
  return 'Moderate effort';
}

function getReturnLabel(timeToRevenue: string, riskLevel: RiskLevel): string {
  const isQuick = timeToRevenue.includes('week') || timeToRevenue === '1-2 weeks';
  
  if (riskLevel === 'low' && isQuick) return 'steady upside';
  if (riskLevel === 'low') return 'stable growth potential';
  if (riskLevel === 'high') return 'asymmetric reward';
  if (isQuick) return 'quick validation possible';
  return 'strong long-term fit';
}

/**
 * EffortDescriptor - Non-gamified effort/return indicator
 * Inline chips or short phrases, neutral language only
 */
export function EffortDescriptor({
  capitalNeeded,
  timeToRevenue,
  riskLevel,
  executionComplexity,
  className
}: EffortDescriptorProps) {
  const effortLabel = getEffortLabel(capitalNeeded, executionComplexity);
  const returnLabel = getReturnLabel(timeToRevenue, riskLevel);

  return (
    <motion.div
      variants={cardContentVariants}
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-secondary/60 text-xs text-muted-foreground">
        {effortLabel}
      </span>
      <span className="text-muted-foreground/40 text-xs">•</span>
      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-secondary/60 text-xs text-muted-foreground">
        {returnLabel}
      </span>
    </motion.div>
  );
}
