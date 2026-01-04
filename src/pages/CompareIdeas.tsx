import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  X,
  DollarSign,
  Clock,
  TrendingUp,
  Zap,
  Target,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Scale,
  Plus,
  BarChart3,
  TrendingDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { BusinessIdea, FounderProfile } from '@/types/founder';
import { useAuth } from '@/hooks/useAuth';
import { getSavedIdeas, fetchUserProfile, mapDbProfileToFounderProfile } from '@/lib/profileService';
import { calculateMatchBreakdown, MatchFactor } from '@/lib/matchScoring';
import { cn } from '@/lib/utils';

export default function CompareIdeas() {
  const [allIdeas, setAllIdeas] = useState<BusinessIdea[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [founderProfile, setFounderProfile] = useState<FounderProfile | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    async function loadIdeas() {
      try {
        const [savedIdeas, dbProfile] = await Promise.all([
          getSavedIdeas(user.id),
          fetchUserProfile(user.id),
        ]);
        
        setAllIdeas(savedIdeas);
        setFounderProfile(mapDbProfileToFounderProfile(dbProfile));
        
        // Get selected IDs from URL params
        const idsParam = searchParams.get('ids');
        if (idsParam) {
          const ids = idsParam.split(',').filter(id => 
            savedIdeas.some(idea => idea.id === id)
          );
          setSelectedIds(ids);
        }
      } catch (error) {
        console.error('Error loading ideas:', error);
      } finally {
        setLoading(false);
      }
    }

    loadIdeas();
  }, [user, navigate, searchParams]);

  const selectedIdeas = allIdeas.filter(idea => selectedIds.includes(idea.id));
  const availableIdeas = allIdeas.filter(idea => !selectedIds.includes(idea.id));

  const handleAddIdea = (ideaId: string) => {
    if (selectedIds.length < 4) {
      const newIds = [...selectedIds, ideaId];
      setSelectedIds(newIds);
      navigate(`/compare?ids=${newIds.join(',')}`, { replace: true });
    }
  };

  const handleRemoveIdea = (ideaId: string) => {
    const newIds = selectedIds.filter(id => id !== ideaId);
    setSelectedIds(newIds);
    navigate(`/compare?ids=${newIds.join(',')}`, { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-muted/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/saved')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Ideas
              </Button>
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5" />
                <span className="text-xl font-semibold">Compare Ideas</span>
              </div>
            </div>
            <Badge variant="secondary">
              {selectedIds.length}/4 selected
            </Badge>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8 relative z-10">
        {selectedIdeas.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Scale className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Select ideas to compare</h2>
            <p className="text-muted-foreground mb-6">
              Choose up to 4 ideas from your saved list to compare them side-by-side.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ScrollArea className="w-full pb-4">
              <div className="flex gap-4" style={{ minWidth: `${selectedIdeas.length * 320}px` }}>
                {selectedIdeas.map((idea, index) => (
                  <ComparisonCard
                    key={idea.id}
                    idea={idea}
                    profile={founderProfile}
                    index={index}
                    onRemove={() => handleRemoveIdea(idea.id)}
                    onViewDetails={() => navigate(`/idea/${idea.id}`)}
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </motion.div>
        )}
        
        {/* Add more ideas */}
        {availableIdeas.length > 0 && selectedIds.length < 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add ideas to compare
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {availableIdeas.slice(0, 8).map((idea) => (
                <Card
                  key={idea.id}
                  className="cursor-pointer hover:border-foreground/30 transition-colors"
                  onClick={() => handleAddIdea(idea.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">{idea.category}</Badge>
                      <div className="flex items-center gap-1 text-xs">
                        <Zap className="w-3 h-3" />
                        {idea.matchScore}%
                      </div>
                    </div>
                    <h4 className="font-medium text-sm line-clamp-2">{idea.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{idea.tagline}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

interface ComparisonCardProps {
  idea: BusinessIdea;
  profile: FounderProfile | null;
  index: number;
  onRemove: () => void;
  onViewDetails: () => void;
}

function ComparisonCard({ idea, profile, index, onRemove, onViewDetails }: ComparisonCardProps) {
  const breakdown = profile ? calculateMatchBreakdown(profile, idea) : null;
  const positiveFactors = breakdown?.factors.filter(f => f.impact === 'positive') || [];
  const negativeFactors = breakdown?.factors.filter(f => f.impact === 'negative') || [];
  return (
    <Card className="w-80 flex-shrink-0">
      <CardHeader className="pb-3 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-6 w-6"
          onClick={onRemove}
        >
          <X className="w-4 h-4" />
        </Button>
        <Badge variant="secondary" className="w-fit text-xs mb-2">{idea.category}</Badge>
        <CardTitle className="text-base pr-8 line-clamp-2">{idea.title}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">{idea.tagline}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Match Score */}
        <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Match Score</span>
          </div>
          <span className="text-lg font-bold">{idea.matchScore}%</span>
        </div>
        
        {/* Key Metrics */}
        <div className="space-y-3">
          <MetricRow
            icon={<Target className="w-4 h-4" />}
            label="Risk Level"
            value={idea.riskLevel}
            valueClass={cn(
              idea.riskLevel === 'low' ? 'text-success' :
              idea.riskLevel === 'high' ? 'text-destructive' : ''
            )}
          />
          <MetricRow
            icon={<DollarSign className="w-4 h-4" />}
            label="Capital Needed"
            value={idea.capitalNeeded}
          />
          <MetricRow
            icon={<Clock className="w-4 h-4" />}
            label="Time to Revenue"
            value={idea.timeToFirstRevenue}
          />
          <MetricRow
            icon={<TrendingUp className="w-4 h-4" />}
            label="Monthly Potential"
            value={idea.potentialMonthlyRevenue}
          />
          <MetricRow
            icon={<AlertTriangle className="w-4 h-4" />}
            label="Complexity"
            value={idea.executionComplexity}
          />
        </div>
        
        {/* Required Skills */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">Required Skills</h4>
          <div className="flex flex-wrap gap-1">
            {idea.requiredSkills.slice(0, 4).map((skill, i) => (
              <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
            ))}
            {idea.requiredSkills.length > 4 && (
              <Badge variant="outline" className="text-xs">+{idea.requiredSkills.length - 4}</Badge>
            )}
          </div>
        </div>
        
        {/* MVP Scope Preview */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">MVP Scope</h4>
          <div className="space-y-1">
            {idea.mvpScope.slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <CheckCircle2 className="w-3 h-3 text-success mt-0.5 flex-shrink-0" />
                <span className="line-clamp-1">{item}</span>
              </div>
            ))}
            {idea.mvpScope.length > 3 && (
              <span className="text-xs text-muted-foreground pl-5">
                +{idea.mvpScope.length - 3} more...
              </span>
            )}
          </div>
        </div>
        
        {/* Score Factors Summary */}
        {breakdown && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              Match Factors
            </h4>
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 text-success">
                <TrendingUp className="w-3 h-3" />
                <span>{positiveFactors.length} positive</span>
              </div>
              {negativeFactors.length > 0 && (
                <div className="flex items-center gap-1 text-destructive">
                  <TrendingDown className="w-3 h-3" />
                  <span>{negativeFactors.length} challenge{negativeFactors.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
            {positiveFactors.slice(0, 2).map((factor, i) => (
              <div key={i} className="text-xs text-muted-foreground bg-success/10 px-2 py-1 rounded">
                ✓ {factor.label}
              </div>
            ))}
          </div>
        )}
        
        {/* View Details Button */}
        <Button variant="outline" size="sm" className="w-full mt-2" onClick={onViewDetails}>
          View Full Details
        </Button>
      </CardContent>
    </Card>
  );
}

function MetricRow({
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
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <span className={cn("font-medium capitalize", valueClass)}>{value}</span>
    </div>
  );
}
