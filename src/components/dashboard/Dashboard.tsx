import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Bookmark, 
  X, 
  DollarSign, 
  Clock, 
  Zap,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  LogOut,
  Loader2,
  Focus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BusinessIdea, FounderProfile, FounderProfileSummary } from '@/types/founder';
import { useAuth } from '@/hooks/useAuth';
import { useDecisionMode } from '@/hooks/useDecisionMode';
import { 
  fetchUserProfile, 
  mapDbProfileToFounderProfile, 
  mapDbProfileToSummary,
  getSavedIdeas,
  getDismissedIdeaIds,
  saveIdea as saveIdeaToDb,
  dismissIdea as dismissIdeaToDb
} from '@/lib/profileService';
import { generateMatchingIdea } from '@/lib/ideaEngine';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { DecisionModeBanner } from '@/components/decision-mode/DecisionModeBanner';
import { DecisionModeTooltip } from '@/components/decision-mode/DecisionModeTooltip';

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [profileSummary, setProfileSummary] = useState<FounderProfileSummary | null>(null);
  const [founderProfile, setFounderProfile] = useState<FounderProfile | null>(null);
  const [currentIdea, setCurrentIdea] = useState<BusinessIdea | null>(null);
  const [savedIdeas, setSavedIdeas] = useState<BusinessIdea[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  
  const { user, signOut } = useAuth();
  const { isActive: isDecisionModeActive, activeIdeaId } = useDecisionMode();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      
      try {
        const [dbProfile, saved, dismissed] = await Promise.all([
          fetchUserProfile(user.id),
          getSavedIdeas(user.id),
          getDismissedIdeaIds(user.id),
        ]);
        
        const profile = mapDbProfileToFounderProfile(dbProfile);
        const summary = mapDbProfileToSummary(dbProfile);
        
        setFounderProfile(profile);
        setProfileSummary(summary);
        setSavedIdeas(saved);
        setDismissedIds(dismissed);
        
        // Generate initial idea
        const idea = generateMatchingIdea(profile, summary, dismissed);
        setCurrentIdea(idea);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load your profile. Please refresh.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [user]);

  const handleSaveIdea = async () => {
    if (!user || !currentIdea) return;
    
    try {
      await saveIdeaToDb(user.id, currentIdea);
      setSavedIdeas(prev => [currentIdea, ...prev]);
      toast({
        title: "Idea saved!",
        description: "You can find it in your saved ideas.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save idea.",
        variant: "destructive",
      });
    }
  };

  const handleDismissIdea = async () => {
    if (!user || !currentIdea || !founderProfile || !profileSummary) return;
    
    try {
      await dismissIdeaToDb(user.id, currentIdea.id);
      const newDismissedIds = [...dismissedIds, currentIdea.id];
      setDismissedIds(newDismissedIds);
      
      // Generate new idea
      const newIdea = generateMatchingIdea(founderProfile, profileSummary, newDismissedIds);
      setCurrentIdea(newIdea);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to dismiss idea.",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-foreground" />
      </div>
    );
  }
  
  if (!profileSummary || !currentIdea) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No ideas available at the moment.</p>
          <Button variant="default" className="mt-4" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </div>
      </div>
    );
  }
  
  // If in Decision Mode, show focused view
  if (isDecisionModeActive && activeIdeaId) {
    return (
      <div className="min-h-screen bg-background relative">
        <DecisionModeBanner />
        
        {/* Subtle gradient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-muted/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        {/* Header */}
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <span className="text-xl font-semibold">FounderFit</span>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/saved')}>
                  <Bookmark className="w-4 h-4 mr-2" />
                  Saved ({savedIdeas.length})
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-6 py-8 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Focus className="w-5 h-5 text-primary" />
              <span className="font-medium">Decision Mode Active</span>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">
              Time to Execute
            </h1>
            <p className="text-muted-foreground mb-8">
              You've committed to an idea. New idea browsing is paused to help you focus on validation and execution.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate(`/idea/${activeIdeaId}`)}>
                <Focus className="w-4 h-4 mr-2" />
                View Your Committed Idea
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/saved')}>
                <Bookmark className="w-4 h-4 mr-2" />
                View All Saved Ideas
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background relative">
      {/* Subtle gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-muted/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold">FounderFit</span>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/analytics')}>
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/saved')}>
                <Bookmark className="w-4 h-4 mr-2" />
                Saved ({savedIdeas.length})
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Idea */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <IdeaCard 
                idea={currentIdea} 
                onSave={handleSaveIdea}
                onDismiss={handleDismissIdea}
              />
            </motion.div>
          </div>
          
          {/* Sidebar - Profile */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ProfileCard profile={profileSummary} />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

interface IdeaCardProps {
  idea: BusinessIdea;
  onSave: () => void;
  onDismiss: () => void;
}

function IdeaCard({ idea, onSave, onDismiss }: IdeaCardProps) {
  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <CardHeader className="bg-secondary p-6 border-b border-border/50">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="accent" className="mb-3">
              This week's idea
            </Badge>
            <CardTitle className="text-2xl sm:text-3xl mb-2">
              {idea.title}
            </CardTitle>
            <p className="text-muted-foreground">{idea.tagline}</p>
          </div>
          <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-full border border-border/50">
            <Zap className="w-4 h-4 text-foreground" />
            <span className="font-semibold">{idea.matchScore}% match</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-8">
        {/* Quick Stats */}
        <div className="grid sm:grid-cols-4 gap-4">
          <Stat 
            icon={<DollarSign className="w-4 h-4" />}
            label="Capital needed"
            value={idea.capitalNeeded}
          />
          <Stat 
            icon={<Clock className="w-4 h-4" />}
            label="First revenue"
            value={idea.timeToFirstRevenue}
          />
          <Stat 
            icon={<TrendingUp className="w-4 h-4" />}
            label="Potential"
            value={idea.potentialMonthlyRevenue}
          />
          <Stat 
            icon={<Target className="w-4 h-4" />}
            label="Risk"
            value={idea.riskLevel}
            valueClass={
              idea.riskLevel === 'low' 
                ? 'text-success' 
                : idea.riskLevel === 'high' 
                  ? 'text-destructive' 
                  : ''
            }
          />
        </div>
        
        {/* Why You */}
        <Section 
          icon={<Lightbulb className="w-5 h-5 text-foreground" />}
          title="Why this fits you"
        >
          <p className="text-muted-foreground">{idea.whyYou}</p>
        </Section>
        
        {/* Problem & Solution */}
        <Section title="The Problem">
          <p className="text-muted-foreground">{idea.problemStatement}</p>
        </Section>
        
        <Section title="Your Solution">
          <p className="text-muted-foreground">{idea.solution}</p>
        </Section>
        
        <Section title="Target Customer">
          <p className="text-muted-foreground">{idea.targetCustomer}</p>
        </Section>
        
        {/* MVP Scope */}
        <Section title="MVP Scope">
          <ul className="space-y-2">
            {idea.mvpScope.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </Section>
        
        {/* 7-Day Plan */}
        <Section title="If I had 7 days, I'd do this">
          <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
            {idea.sevenDayPlan.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-muted text-foreground text-xs font-semibold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </Section>
        
        {/* Kill Criteria */}
        <Section 
          icon={<AlertTriangle className="w-5 h-5 text-destructive" />}
          title="When to stop"
        >
          <ul className="space-y-2">
            {idea.killCriteria.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </Section>
        
        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-border/50">
          <Button variant="default" size="lg" className="flex-1" onClick={onSave}>
            <Bookmark className="w-4 h-4 mr-2" />
            Save this idea
          </Button>
          <Button variant="outline" size="lg" onClick={onDismiss}>
            <X className="w-4 h-4 mr-2" />
            Show me another
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ 
  icon, 
  label, 
  value, 
  valueClass 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="bg-secondary/50 rounded-xl p-3 border border-border/30">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className={cn("font-semibold capitalize", valueClass)}>{value}</p>
    </div>
  );
}

function Section({ 
  icon, 
  title, 
  children 
}: { 
  icon?: React.ReactNode; 
  title: string; 
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ProfileCard({ profile }: { profile: FounderProfileSummary }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Founder Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Founder Type */}
        <div>
          <Badge variant="accent" className="mb-2">{profile.founderType}</Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Capacity:</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-4 rounded-sm",
                    i < profile.weeklyCapacityScore ? "bg-foreground" : "bg-muted"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Strengths */}
        {profile.executionStrengths.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Execution Strengths</h4>
            <div className="flex flex-wrap gap-2">
              {profile.executionStrengths.map((strength) => (
                <Badge key={strength} variant="skill">{strength}</Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Ideal Models */}
        {profile.idealBusinessModels.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Ideal Business Models</h4>
            <div className="flex flex-wrap gap-2">
              {profile.idealBusinessModels.map((model) => (
                <Badge key={model} variant="secondary">{model}</Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Blind Spots */}
        {profile.blindSpots.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Watch Out For</h4>
            <div className="flex flex-wrap gap-2">
              {profile.blindSpots.map((spot) => (
                <Badge key={spot} variant="outline">{spot}</Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Anti-patterns */}
        {profile.antiPatterns.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Avoid These</h4>
            <ul className="space-y-1">
              {profile.antiPatterns.map((pattern) => (
                <li key={pattern} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <X className="w-3 h-3 text-destructive" />
                  {pattern}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <Button variant="outline" className="w-full">
          Update preferences
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}
