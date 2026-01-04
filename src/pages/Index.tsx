import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection, HowItWorksSection, DifferentiatorSection, TargetAudienceSection, CTASection } from '@/components/landing/LandingSections';
import { QuestionnaireWizard } from '@/components/questionnaire/QuestionnaireWizard';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { useAuth } from '@/hooks/useAuth';
import { fetchUserProfile } from '@/lib/profileService';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function checkOnboarding() {
      if (authLoading) return;
      
      if (user) {
        try {
          const profile = await fetchUserProfile(user.id);
          setHasCompletedOnboarding(profile?.has_completed_onboarding || false);
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
      setShowQuestionnaire(true);
    }
  };

  const handleQuestionnaireComplete = () => {
    setHasCompletedOnboarding(true);
    setShowQuestionnaire(false);
  };

  // Show loading while checking auth
  if (authLoading || loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  // Show dashboard if logged in and onboarded
  if (user && hasCompletedOnboarding) {
    return <Dashboard />;
  }

  // Show questionnaire if logged in but not onboarded
  if (user && showQuestionnaire) {
    return <QuestionnaireWizard onComplete={handleQuestionnaireComplete} />;
  }

  // Show landing page
  return (
    <div className="min-h-screen">
      <HeroSection onGetStarted={handleGetStarted} />
      <HowItWorksSection />
      <DifferentiatorSection />
      <TargetAudienceSection />
      <CTASection onGetStarted={handleGetStarted} />
      
      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-6 text-center">
          <p className="font-serif text-xl font-semibold mb-2">FounderFit</p>
          <p className="text-sm text-muted-foreground">
            Ideas that actually fit you.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
