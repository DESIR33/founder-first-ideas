/**
 * AI State Machine for Founder Fit
 * Manages UI states for AI interactions with Natural AI visual language
 */

import { useState, useCallback, createContext, useContext, ReactNode } from 'react';

// =============================================================================
// STATE TYPES
// =============================================================================

export type AIState = 
  | 'idle'       // Ready for input
  | 'listening'  // Capturing user input
  | 'thinking'   // Model is processing
  | 'reflecting' // Asking clarifying questions
  | 'presenting' // Delivering results
  | 'refining'   // Iterating based on feedback
  | 'error';     // Recoverable failure

export interface AIStateContext {
  state: AIState;
  previousState: AIState | null;
  errorMessage: string | null;
  reflectionQuestion: string | null;
  reflectionOptions: string[];
  
  // Transition actions
  setIdle: () => void;
  setListening: () => void;
  setThinking: () => void;
  setReflecting: (question: string, options?: string[]) => void;
  setPresenting: () => void;
  setRefining: () => void;
  setError: (message: string) => void;
  
  // Helpers
  isActive: boolean;
  canInteract: boolean;
}

// =============================================================================
// DEFAULT VALUES
// =============================================================================

const defaultContext: AIStateContext = {
  state: 'idle',
  previousState: null,
  errorMessage: null,
  reflectionQuestion: null,
  reflectionOptions: [],
  
  setIdle: () => {},
  setListening: () => {},
  setThinking: () => {},
  setReflecting: () => {},
  setPresenting: () => {},
  setRefining: () => {},
  setError: () => {},
  
  isActive: false,
  canInteract: true,
};

// =============================================================================
// CONTEXT
// =============================================================================

const AIStateContext = createContext<AIStateContext>(defaultContext);

// =============================================================================
// PROVIDER
// =============================================================================

interface AIStateProviderProps {
  children: ReactNode;
}

export function AIStateProvider({ children }: AIStateProviderProps) {
  const [state, setState] = useState<AIState>('idle');
  const [previousState, setPreviousState] = useState<AIState | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reflectionQuestion, setReflectionQuestion] = useState<string | null>(null);
  const [reflectionOptions, setReflectionOptions] = useState<string[]>([]);

  const transition = useCallback((newState: AIState) => {
    setState(current => {
      setPreviousState(current);
      return newState;
    });
  }, []);

  const setIdle = useCallback(() => {
    setErrorMessage(null);
    setReflectionQuestion(null);
    setReflectionOptions([]);
    transition('idle');
  }, [transition]);

  const setListening = useCallback(() => {
    transition('listening');
  }, [transition]);

  const setThinking = useCallback(() => {
    transition('thinking');
  }, [transition]);

  const setReflecting = useCallback((question: string, options: string[] = []) => {
    setReflectionQuestion(question);
    setReflectionOptions(options);
    transition('reflecting');
  }, [transition]);

  const setPresenting = useCallback(() => {
    setReflectionQuestion(null);
    setReflectionOptions([]);
    transition('presenting');
  }, [transition]);

  const setRefining = useCallback(() => {
    transition('refining');
  }, [transition]);

  const setError = useCallback((message: string) => {
    setErrorMessage(message);
    transition('error');
  }, [transition]);

  // Computed helpers
  const isActive = state === 'listening' || state === 'thinking' || state === 'reflecting';
  const canInteract = state === 'idle' || state === 'presenting' || state === 'error';

  const value: AIStateContext = {
    state,
    previousState,
    errorMessage,
    reflectionQuestion,
    reflectionOptions,
    setIdle,
    setListening,
    setThinking,
    setReflecting,
    setPresenting,
    setRefining,
    setError,
    isActive,
    canInteract,
  };

  return (
    <AIStateContext.Provider value={value}>
      {children}
    </AIStateContext.Provider>
  );
}

// =============================================================================
// HOOK
// =============================================================================

export function useAIState() {
  const context = useContext(AIStateContext);
  if (!context) {
    throw new Error('useAIState must be used within an AIStateProvider');
  }
  return context;
}

// =============================================================================
// STATE VISUAL PROPERTIES
// =============================================================================

export const stateVisualProps = {
  idle: {
    glow: false,
    glowIntensity: 0,
    pulse: false,
    shimmer: false,
    scale: 1,
    opacity: 1,
  },
  listening: {
    glow: true,
    glowIntensity: 0.1,
    pulse: true,
    shimmer: false,
    scale: 1.01,
    opacity: 1,
  },
  thinking: {
    glow: true,
    glowIntensity: 0.15,
    pulse: true,
    shimmer: true,
    scale: 1.02,
    opacity: 1,
  },
  reflecting: {
    glow: true,
    glowIntensity: 0.08,
    pulse: false,
    shimmer: false,
    scale: 1.01,
    opacity: 1,
  },
  presenting: {
    glow: false,
    glowIntensity: 0.05,
    pulse: false,
    shimmer: false,
    scale: 1,
    opacity: 1,
  },
  refining: {
    glow: true,
    glowIntensity: 0.1,
    pulse: false,
    shimmer: false,
    scale: 1.02,
    opacity: 1,
  },
  error: {
    glow: false,
    glowIntensity: 0,
    pulse: false,
    shimmer: false,
    scale: 1,
    opacity: 1,
  },
} as const;

// Get visual props for inactive surfaces when another is active
export const inactiveVisualProps = {
  scale: 0.995,
  opacity: 0.78,
} as const;
