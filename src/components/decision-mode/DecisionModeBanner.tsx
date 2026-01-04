import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Focus, ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDecisionMode } from '@/hooks/useDecisionMode';
import { ExitDecisionModeDialog } from './ExitDecisionModeDialog';

export function DecisionModeBanner() {
  const { isActive, activeIdeaId } = useDecisionMode();
  const navigate = useNavigate();
  const [showExitDialog, setShowExitDialog] = useState(false);

  if (!isActive) return null;

  return (
    <>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-primary/10 border-b border-primary/20"
      >
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-full bg-primary/20">
                <Focus className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Decision Mode Active</p>
                <p className="text-xs text-muted-foreground">
                  You're focused on executing one idea. Everything else is paused.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {activeIdeaId && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`/idea/${activeIdeaId}`)}
                >
                  View Idea
                  <ExternalLink className="w-3 h-3 ml-1.5" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowExitDialog(true)}
              >
                Exit Mode
                <X className="w-3 h-3 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <ExitDecisionModeDialog 
        open={showExitDialog} 
        onOpenChange={setShowExitDialog}
      />
    </>
  );
}
