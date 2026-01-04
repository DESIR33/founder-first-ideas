import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDecisionMode } from '@/hooks/useDecisionMode';

interface ExitDecisionModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EXIT_REASONS = [
  { value: 'validated', label: 'Idea validated — continuing later' },
  { value: 'failed', label: 'Idea failed validation' },
  { value: 'constraints', label: 'Personal constraints changed' },
  { value: 'other', label: 'Other reason' },
];

export function ExitDecisionModeDialog({ open, onOpenChange }: ExitDecisionModeDialogProps) {
  const { exitDecisionMode } = useDecisionMode();
  const [reason, setReason] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleExit = async () => {
    setLoading(true);
    const success = await exitDecisionMode(reason);
    setLoading(false);
    
    if (success) {
      onOpenChange(false);
      setReason('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exit Decision Mode?</DialogTitle>
          <DialogDescription>
            This will restore full exploration mode. You'll be able to browse, compare, and save new ideas again.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <label className="text-sm font-medium mb-2 block">
            Why are you exiting? (optional)
          </label>
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger>
              <SelectValue placeholder="Select a reason..." />
            </SelectTrigger>
            <SelectContent>
              {EXIT_REASONS.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Stay Focused
          </Button>
          <Button onClick={handleExit} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Exit Decision Mode
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
