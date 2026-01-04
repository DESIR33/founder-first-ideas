import { useState } from 'react';
import { HeroSection, HowItWorksSection, DifferentiatorSection, TargetAudienceSection, CTASection } from '@/components/landing/LandingSections';
import { QuestionnaireWizard } from '@/components/questionnaire/QuestionnaireWizard';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { useFounderStore } from '@/store/founderStore';

const Index = () => {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const { hasCompletedOnboarding } = useFounderStore();

  // Show dashboard if onboarding complete
  if (hasCompletedOnboarding) {
    return <Dashboard />;
  }

  // Show questionnaire
  if (showQuestionnaire) {
    return <QuestionnaireWizard onComplete={() => {}} />;
  }

  // Show landing page
  return (
    <div className="min-h-screen">
      <HeroSection onGetStarted={() => setShowQuestionnaire(true)} />
      <HowItWorksSection />
      <DifferentiatorSection />
      <TargetAudienceSection />
      <CTASection onGetStarted={() => setShowQuestionnaire(true)} />
      
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
