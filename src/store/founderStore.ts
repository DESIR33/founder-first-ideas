import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FounderProfile, FounderProfileSummary, BusinessIdea, UserState } from '@/types/founder';
import { generateProfileSummary, generateMatchingIdea } from '@/lib/ideaEngine';

interface FounderStore extends UserState {
  // Questionnaire actions
  updateProfile: (updates: Partial<FounderProfile>) => void;
  completeOnboarding: () => void;
  
  // Idea actions
  saveIdea: (ideaId: string) => void;
  dismissIdea: (ideaId: string) => void;
  generateNewIdea: () => void;
  
  // Reset
  resetProfile: () => void;
}

const initialState: UserState = {
  hasCompletedOnboarding: false,
  profile: null,
  profileSummary: null,
  savedIdeas: [],
  dismissedIdeas: [],
  currentIdea: null,
  weeklyIdeaHistory: [],
};

export const useFounderStore = create<FounderStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      updateProfile: (updates) => {
        set((state) => ({
          profile: { ...state.profile, ...updates },
        }));
      },
      
      completeOnboarding: () => {
        const { profile } = get();
        if (profile) {
          const profileSummary = generateProfileSummary(profile as FounderProfile);
          const currentIdea = generateMatchingIdea(profile as FounderProfile, profileSummary);
          
          set({
            hasCompletedOnboarding: true,
            profileSummary,
            currentIdea,
            weeklyIdeaHistory: currentIdea ? [currentIdea] : [],
          });
        }
      },
      
      saveIdea: (ideaId) => {
        const { currentIdea, savedIdeas } = get();
        if (currentIdea && currentIdea.id === ideaId) {
          set({
            savedIdeas: [...savedIdeas, { ...currentIdea, savedAt: new Date() }],
          });
        }
      },
      
      dismissIdea: (ideaId) => {
        set((state) => ({
          dismissedIdeas: [...state.dismissedIdeas, ideaId],
        }));
      },
      
      generateNewIdea: () => {
        const { profile, profileSummary, dismissedIdeas, weeklyIdeaHistory } = get();
        if (profile && profileSummary) {
          const newIdea = generateMatchingIdea(
            profile as FounderProfile, 
            profileSummary,
            dismissedIdeas
          );
          if (newIdea) {
            set({
              currentIdea: newIdea,
              weeklyIdeaHistory: [...weeklyIdeaHistory, newIdea],
            });
          }
        }
      },
      
      resetProfile: () => {
        set(initialState);
      },
    }),
    {
      name: 'founder-profile',
    }
  )
);
