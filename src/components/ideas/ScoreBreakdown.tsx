import { motion } from 'framer-motion';
import {
  Clock,
  DollarSign,
  Zap,
  AlertTriangle,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronUp,
  BarChart3
} from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  MatchFactor, 
  calculateMatchBreakdown, 
  getCategoryLabel 
} from '@/lib/matchScoring';
import { FounderProfile, BusinessIdea } from '@/types/founder';
import { cn } from '@/lib/utils';

interface ScoreBreakdownProps {
  profile: FounderProfile;
  idea: BusinessIdea;
  compact?: boolean;
}

export function ScoreBreakdown({ profile, idea, compact = false }: ScoreBreakdownProps) {
  const [expanded, setExpanded] = useState(!compact);
  const { factors, totalScore } = calculateMatchBreakdown(profile, idea);
  
  const positiveFactors = factors.filter(f => f.impact === 'positive');
  const neutralFactors = factors.filter(f => f.impact === 'neutral');
  const negativeFactors = factors.filter(f => f.impact === 'negative');
  
  const positivePoints = positiveFactors.reduce((sum, f) => sum + f.points, 0);
  const negativePoints = Math.abs(negativeFactors.reduce((sum, f) => sum + f.points, 0));

  if (compact && !expanded) {
    return (
      <Card>
        <CardContent className="p-4">
          <button 
            className="w-full flex items-center justify-between"
            onClick={() => setExpanded(true)}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-lg">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-medium">Match Score Breakdown</p>
                <p className="text-sm text-muted-foreground">
                  {positiveFactors.length} positive factors
                </p>
              </div>
            </div>
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Match Score Breakdown
          </CardTitle>
          {compact && (
            <Button variant="ghost" size="sm" onClick={() => setExpanded(false)}>
              <ChevronUp className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Score Summary */}
        <div className="bg-secondary/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Overall Match</span>
            <span className="text-2xl font-bold">{totalScore}%</span>
          </div>
          <Progress value={totalScore} className="h-3 mb-4" />
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 text-success mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="font-semibold">+{positivePoints}</span>
              </div>
              <span className="text-xs text-muted-foreground">Boosts</span>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <Minus className="w-4 h-4" />
                <span className="font-semibold">50</span>
              </div>
              <span className="text-xs text-muted-foreground">Base</span>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-destructive mb-1">
                <TrendingDown className="w-4 h-4" />
                <span className="font-semibold">-{negativePoints}</span>
              </div>
              <span className="text-xs text-muted-foreground">Penalties</span>
            </div>
          </div>
        </div>
        
        {/* Positive Factors */}
        {positiveFactors.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-success flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4" />
              Why This Fits ({positiveFactors.length})
            </h4>
            <div className="space-y-2">
              {positiveFactors.map((factor, i) => (
                <FactorRow key={factor.id} factor={factor} index={i} />
              ))}
            </div>
          </div>
        )}
        
        {/* Neutral Factors */}
        {neutralFactors.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-3">
              <Minus className="w-4 h-4" />
              Neutral Factors ({neutralFactors.length})
            </h4>
            <div className="space-y-2">
              {neutralFactors.map((factor, i) => (
                <FactorRow key={factor.id} factor={factor} index={i} />
              ))}
            </div>
          </div>
        )}
        
        {/* Negative Factors */}
        {negativeFactors.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-destructive flex items-center gap-2 mb-3">
              <TrendingDown className="w-4 h-4" />
              Potential Challenges ({negativeFactors.length})
            </h4>
            <div className="space-y-2">
              {negativeFactors.map((factor, i) => (
                <FactorRow key={factor.id} factor={factor} index={i} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function FactorRow({ factor, index }: { factor: MatchFactor; index: number }) {
  const Icon = getCategoryIconComponent(factor.category);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg",
        factor.impact === 'positive' && "bg-success/10 border border-success/20",
        factor.impact === 'neutral' && "bg-secondary/50 border border-border/30",
        factor.impact === 'negative' && "bg-destructive/10 border border-destructive/20"
      )}
    >
      <div className={cn(
        "p-1.5 rounded",
        factor.impact === 'positive' && "bg-success/20 text-success",
        factor.impact === 'neutral' && "bg-muted text-muted-foreground",
        factor.impact === 'negative' && "bg-destructive/20 text-destructive"
      )}>
        <Icon className="w-4 h-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="font-medium text-sm">{factor.label}</span>
          <Badge 
            variant={
              factor.impact === 'positive' ? 'success' : 
              factor.impact === 'negative' ? 'destructive' : 
              'secondary'
            }
            className="text-xs"
          >
            {factor.points > 0 ? '+' : ''}{factor.points}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-2">{factor.description}</p>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">You:</span>
            <span className="font-medium">{factor.profileValue}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Idea:</span>
            <span className="font-medium">{factor.ideaValue}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function getCategoryIconComponent(category: MatchFactor['category']) {
  switch (category) {
    case 'time': return Clock;
    case 'capital': return DollarSign;
    case 'skills': return Zap;
    case 'risk': return AlertTriangle;
    case 'preferences': return Target;
    default: return Zap;
  }
}

// Compact inline score display
export function ScoreBadge({ 
  profile, 
  idea,
  showBreakdown = false,
  onClick 
}: { 
  profile: FounderProfile; 
  idea: BusinessIdea;
  showBreakdown?: boolean;
  onClick?: () => void;
}) {
  const { factors } = calculateMatchBreakdown(profile, idea);
  const positiveCount = factors.filter(f => f.impact === 'positive').length;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium transition-colors",
        "bg-secondary/50 hover:bg-secondary border border-border/50"
      )}
    >
      <Zap className="w-3.5 h-3.5" />
      <span>{idea.matchScore}%</span>
      {showBreakdown && (
        <span className="text-xs text-muted-foreground">
          ({positiveCount} factors)
        </span>
      )}
    </button>
  );
}
