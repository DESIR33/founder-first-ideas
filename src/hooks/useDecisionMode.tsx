import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface DecisionModeState {
  isActive: boolean;
  activeIdeaId: string | null;
  loading: boolean;
}

interface DecisionModeContextType extends DecisionModeState {
  commitToIdea: (ideaId: string) => Promise<boolean>;
  exitDecisionMode: (reason?: string) => Promise<boolean>;
  refreshDecisionMode: () => Promise<void>;
}

const DecisionModeContext = createContext<DecisionModeContextType | undefined>(undefined);

export function DecisionModeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DecisionModeState>({
    isActive: false,
    activeIdeaId: null,
    loading: true,
  });
  
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchDecisionModeState = async () => {
    if (!user) {
      setState({ isActive: false, activeIdeaId: null, loading: false });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_decision_mode_active, active_idea_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      setState({
        isActive: data?.is_decision_mode_active ?? false,
        activeIdeaId: data?.active_idea_id ?? null,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching decision mode state:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchDecisionModeState();
  }, [user?.id]);

  const commitToIdea = async (ideaId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          is_decision_mode_active: true,
          active_idea_id: ideaId,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setState({
        isActive: true,
        activeIdeaId: ideaId,
        loading: false,
      });

      toast({
        title: "Decision Mode Activated",
        description: "You're now focused on executing this idea. All distractions are paused.",
      });

      return true;
    } catch (error) {
      console.error('Error committing to idea:', error);
      toast({
        title: "Error",
        description: "Failed to activate Decision Mode.",
        variant: "destructive",
      });
      return false;
    }
  };

  const exitDecisionMode = async (reason?: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          is_decision_mode_active: false,
          active_idea_id: null,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setState({
        isActive: false,
        activeIdeaId: null,
        loading: false,
      });

      toast({
        title: "Decision Mode Deactivated",
        description: "You can now explore other ideas again.",
      });

      return true;
    } catch (error) {
      console.error('Error exiting decision mode:', error);
      toast({
        title: "Error",
        description: "Failed to exit Decision Mode.",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <DecisionModeContext.Provider
      value={{
        ...state,
        commitToIdea,
        exitDecisionMode,
        refreshDecisionMode: fetchDecisionModeState,
      }}
    >
      {children}
    </DecisionModeContext.Provider>
  );
}

export function useDecisionMode() {
  const context = useContext(DecisionModeContext);
  if (context === undefined) {
    throw new Error('useDecisionMode must be used within a DecisionModeProvider');
  }
  return context;
}
