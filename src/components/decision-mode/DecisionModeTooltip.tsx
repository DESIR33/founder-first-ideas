import { ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDecisionMode } from '@/hooks/useDecisionMode';

interface DecisionModeTooltipProps {
  children: ReactNode;
  action?: string;
}

export function DecisionModeTooltip({ children, action = "this action" }: DecisionModeTooltipProps) {
  const { isActive } = useDecisionMode();

  if (!isActive) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-not-allowed">
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Exit Decision Mode to {action}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
