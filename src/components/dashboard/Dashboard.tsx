import { motion } from 'framer-motion';
import { 
  Bookmark, 
  X, 
  Calendar, 
  DollarSign, 
  Clock, 
  Zap,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BusinessIdea, FounderProfileSummary } from '@/types/founder';
import { useFounderStore } from '@/store/founderStore';
import { cn } from '@/lib/utils';

export function Dashboard() {
  const { profileSummary, currentIdea, savedIdeas, saveIdea, dismissIdea, generateNewIdea } = useFounderStore();
  
  if (!profileSummary || !currentIdea) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="font-serif text-xl font-semibold">FounderFit</span>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Bookmark className="w-4 h-4 mr-2" />
                Saved ({savedIdeas.length})
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8">
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
                onSave={() => saveIdea(currentIdea.id)}
                onDismiss={() => {
                  dismissIdea(currentIdea.id);
                  generateNewIdea();
                }}
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
      <CardHeader className="bg-primary text-primary-foreground p-6">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="accent" className="mb-3">
              This week's idea
            </Badge>
            <CardTitle className="text-2xl sm:text-3xl mb-2 text-primary-foreground">
              {idea.title}
            </CardTitle>
            <p className="text-primary-foreground/80">{idea.tagline}</p>
          </div>
          <div className="flex items-center gap-2 bg-accent/20 px-3 py-1.5 rounded-full">
            <Zap className="w-4 h-4 text-accent" />
            <span className="font-semibold text-accent">{idea.matchScore}% match</span>
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
          icon={<Lightbulb className="w-5 h-5 text-accent" />}
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
                <div className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-semibold flex items-center justify-center flex-shrink-0">
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
        <div className="flex items-center gap-4 pt-4 border-t">
          <Button variant="accent" size="lg" className="flex-1" onClick={onSave}>
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
    <div className="bg-secondary/50 rounded-lg p-3">
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
        <h3 className="font-serif font-semibold text-lg">{title}</h3>
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
                    i < profile.weeklyCapacityScore ? "bg-accent" : "bg-muted"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Strengths */}
        <div>
          <h4 className="text-sm font-medium mb-2">Execution Strengths</h4>
          <div className="flex flex-wrap gap-2">
            {profile.executionStrengths.map((strength) => (
              <Badge key={strength} variant="skill">{strength}</Badge>
            ))}
          </div>
        </div>
        
        {/* Ideal Models */}
        <div>
          <h4 className="text-sm font-medium mb-2">Ideal Business Models</h4>
          <div className="flex flex-wrap gap-2">
            {profile.idealBusinessModels.map((model) => (
              <Badge key={model} variant="secondary">{model}</Badge>
            ))}
          </div>
        </div>
        
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
        
        <Button variant="subtle" className="w-full">
          Update preferences
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}
