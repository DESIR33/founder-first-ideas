import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection, ToolSuiteSection, ManifestoSection, CTASection, Footer } from '@/components/landing/LandingSections';
import { Header } from '@/components/landing/Header';
import { QuestionnaireWizard } from '@/components/questionnaire/QuestionnaireWizard';
import { IdeaSynthesisFlow } from '@/components/synthesis';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { useAuth } from '@/hooks/useAuth';
import { fetchUserProfile, saveFounderProfile } from '@/lib/profileService';
import { BusinessIdea, FounderProfile, FounderProfileSummary } from '@/types/founder';
import { Loader2 } from 'lucide-react';

type FlowState = 'landing' | 'questionnaire' | 'synthesis' | 'dashboard';

const Index = () => {
  const [flowState, setFlowState] = useState<FlowState>('landing');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [founderProfile, setFounderProfile] = useState<FounderProfile | null>(null);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Set dark mode by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    async function checkOnboarding() {
      if (authLoading) return;
      
      if (user) {
        try {
          const profile = await fetchUserProfile(user.id);
          const completed = profile?.has_completed_onboarding || false;
          setHasCompletedOnboarding(completed);
          if (completed) {
            setFlowState('dashboard');
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
      setLoading(false);
    }
    
    checkOnboarding();
  }, [user, authLoading]);

  const handleGetStarted = () => {
    if (!user) {
      navigate('/auth');
    } else {
      setFlowState('questionnaire');
    }
  };

  const handleQuestionnaireComplete = (profile: FounderProfile) => {
    setFounderProfile(profile);
    setFlowState('synthesis');
  };

  const handleSynthesisComplete = async (ideas: BusinessIdea[], summary: FounderProfileSummary) => {
    if (user && founderProfile) {
      try {
        await saveFounderProfile(user.id, founderProfile, summary);
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    }
    setHasCompletedOnboarding(true);
    setFlowState('dashboard');
  };

  const handleIdeaSelect = (idea: BusinessIdea) => {
    navigate(`/idea/${idea.id}`);
  };

  // Show loading while checking auth
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Show dashboard if logged in and onboarded
  if (flowState === 'dashboard' && user && hasCompletedOnboarding) {
    return <Dashboard />;
  }

  // Show synthesis flow
  if (flowState === 'synthesis' && founderProfile) {
    return (
      <IdeaSynthesisFlow
        profile={founderProfile}
        onComplete={handleSynthesisComplete}
        onIdeaSelect={handleIdeaSelect}
      />
    );
  }

  // Show questionnaire if logged in but not onboarded
  if (flowState === 'questionnaire' && user) {
    return <QuestionnaireWizard onComplete={handleQuestionnaireComplete} />;
  }

  // Show landing page
  return (
    <div className="min-h-screen bg-background">
      <Header onGetStarted={handleGetStarted} />
      <HeroSection onGetStarted={handleGetStarted} />
      <ToolSuiteSection />
      <ManifestoSection />
      <CTASection onGetStarted={handleGetStarted} />
      <Footer />
    </div>
  );
};

export default Index;
