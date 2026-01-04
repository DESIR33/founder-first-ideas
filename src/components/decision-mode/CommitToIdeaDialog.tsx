import { useState } from 'react';
import { Loader2, Focus, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useDecisionMode } from '@/hooks/useDecisionMode';

interface CommitToIdeaDialogProps {
  ideaId: string;
  ideaTitle: string;
  onCommitSuccess?: () => void;
}

export function CommitToIdeaDialog({ ideaId, ideaTitle, onCommitSuccess }: CommitToIdeaDialogProps) {
  const { commitToIdea, isActive } = useDecisionMode();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCommit = async () => {
    setLoading(true);
    const success = await commitToIdea(ideaId);
    setLoading(false);
    
    if (success) {
      setOpen(false);
      onCommitSuccess?.();
    }
  };

  if (isActive) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Focus className="w-4 h-4" />
          Commit to This Idea
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Focus className="w-5 h-5" />
            Enter Decision Mode
          </DialogTitle>
          <DialogDescription className="text-left pt-2">
            You're about to commit to <span className="font-medium text-foreground">"{ideaTitle}"</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Decision Mode helps you focus on execution by removing distractions:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>All other saved ideas will be paused (read-only)</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Idea comparison and new idea browsing will be disabled</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Your dashboard will focus on validation and execution</span>
            </li>
          </ul>
          <p className="text-sm text-muted-foreground pt-2 border-t border-border/50">
            You can exit Decision Mode at any time if circumstances change.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Keep Exploring
          </Button>
          <Button onClick={handleCommit} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Commit & Focus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
