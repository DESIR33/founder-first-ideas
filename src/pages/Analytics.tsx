import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Lightbulb,
  Target,
  Clock,
  DollarSign,
  Bookmark,
  StickyNote,
  FolderOpen,
  ArrowLeft,
  Loader2,
  Zap,
  AlertTriangle,
  CheckCircle2,
  User,
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import {
  fetchUserProfile,
  mapDbProfileToFounderProfile,
  mapDbProfileToSummary,
  getSavedIdeas,
  getDismissedIdeaIds,
  getCollections,
  getNoteCounts,
  IdeaCollection
} from '@/lib/profileService';
import { BusinessIdea, FounderProfile, FounderProfileSummary } from '@/types/founder';
import { cn } from '@/lib/utils';

interface AnalyticsData {
  savedIdeas: BusinessIdea[];
  dismissedCount: number;
  collections: IdeaCollection[];
  noteCounts: Record<string, number>;
  profile: FounderProfile | null;
  profileSummary: FounderProfileSummary | null;
}

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    async function loadAnalytics() {
      try {
        const [dbProfile, savedIdeas, dismissedIds, collections] = await Promise.all([
          fetchUserProfile(user.id),
          getSavedIdeas(user.id),
          getDismissedIdeaIds(user.id),
          getCollections(user.id),
        ]);

        const ideaIds = savedIdeas.map(idea => idea.id);
        const noteCounts = await getNoteCounts(user.id, ideaIds);

        const profile = mapDbProfileToFounderProfile(dbProfile);
        const profileSummary = mapDbProfileToSummary(dbProfile);

        setData({
          savedIdeas,
          dismissedCount: dismissedIds.length,
          collections,
          noteCounts,
          profile,
          profileSummary,
        });
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Failed to load analytics.</p>
      </div>
    );
  }

  const { savedIdeas, dismissedCount, collections, noteCounts, profile, profileSummary } = data;
  
  // Calculate insights
  const totalNotes = Object.values(noteCounts).reduce((sum, count) => sum + count, 0);
  const avgMatchScore = savedIdeas.length > 0 
    ? Math.round(savedIdeas.reduce((sum, idea) => sum + idea.matchScore, 0) / savedIdeas.length) 
    : 0;
  
  // Category distribution
  const categoryDist = savedIdeas.reduce((acc, idea) => {
    acc[idea.category] = (acc[idea.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Risk distribution
  const riskDist = savedIdeas.reduce((acc, idea) => {
    acc[idea.riskLevel] = (acc[idea.riskLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Capital needed distribution
  const capitalDist = savedIdeas.reduce((acc, idea) => {
    acc[idea.capitalNeeded] = (acc[idea.capitalNeeded] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-muted/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <span className="text-xl font-semibold">Analytics Dashboard</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/saved')}>
              <Bookmark className="w-4 h-4 mr-2" />
              View Ideas
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8 relative z-10">
        {/* Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatCard
            icon={<Bookmark className="w-5 h-5" />}
            label="Saved Ideas"
            value={savedIdeas.length}
            description="Ideas you're considering"
          />
          <StatCard
            icon={<StickyNote className="w-5 h-5" />}
            label="Total Notes"
            value={totalNotes}
            description="Thoughts captured"
          />
          <StatCard
            icon={<FolderOpen className="w-5 h-5" />}
            label="Collections"
            value={collections.length}
            description="Organized folders"
          />
          <StatCard
            icon={<Target className="w-5 h-5" />}
            label="Avg Match Score"
            value={`${avgMatchScore}%`}
            description="Fit with your profile"
            highlight
          />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Ideas Insights */}
          <div className="lg:col-span-2 space-y-6">
            {/* Exploration Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Exploration Activity
                  </CardTitle>
                  <CardDescription>Your idea discovery journey</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="bg-secondary/50 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-foreground">{savedIdeas.length}</div>
                      <div className="text-sm text-muted-foreground">Saved</div>
                    </div>
                    <div className="bg-secondary/50 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-foreground">{dismissedCount}</div>
                      <div className="text-sm text-muted-foreground">Passed</div>
                    </div>
                    <div className="bg-secondary/50 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-foreground">{savedIdeas.length + dismissedCount}</div>
                      <div className="text-sm text-muted-foreground">Total Reviewed</div>
                    </div>
                  </div>
                  
                  {savedIdeas.length + dismissedCount > 0 && (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Save rate</span>
                        <span className="font-medium">
                          {Math.round((savedIdeas.length / (savedIdeas.length + dismissedCount)) * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={(savedIdeas.length / (savedIdeas.length + dismissedCount)) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Category Distribution */}
            {Object.keys(categoryDist).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5" />
                      Idea Categories
                    </CardTitle>
                    <CardDescription>Types of ideas you've saved</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(categoryDist)
                        .sort((a, b) => b[1] - a[1])
                        .map(([category, count]) => (
                          <div key={category}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="capitalize">{category}</span>
                              <span className="text-muted-foreground">{count} ideas</span>
                            </div>
                            <Progress 
                              value={(count / savedIdeas.length) * 100} 
                              className="h-2"
                            />
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            
            {/* Risk & Capital Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Risk Distribution */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Risk Appetite
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['low', 'medium', 'high'].map(risk => (
                        <div key={risk} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-3 h-3 rounded-full",
                              risk === 'low' ? 'bg-success' : risk === 'medium' ? 'bg-warning' : 'bg-destructive'
                            )} />
                            <span className="capitalize text-sm">{risk}</span>
                          </div>
                          <span className="text-muted-foreground text-sm">
                            {riskDist[risk] || 0} ideas
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Capital Distribution */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Capital Range
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(capitalDist)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 4)
                        .map(([capital, count]) => (
                          <div key={capital} className="flex items-center justify-between">
                            <span className="text-sm">{capital}</span>
                            <span className="text-muted-foreground text-sm">
                              {count} ideas
                            </span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
            
            {/* Top Saved Ideas */}
            {savedIdeas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Top Matching Ideas
                    </CardTitle>
                    <CardDescription>Your best-fit saved ideas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {savedIdeas
                        .sort((a, b) => b.matchScore - a.matchScore)
                        .slice(0, 5)
                        .map((idea, index) => (
                          <div
                            key={idea.id}
                            className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                            onClick={() => navigate(`/idea/${idea.id}`)}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-semibold text-muted-foreground w-5">
                                #{index + 1}
                              </span>
                              <div>
                                <p className="font-medium text-sm">{idea.title}</p>
                                <p className="text-xs text-muted-foreground capitalize">{idea.category}</p>
                              </div>
                            </div>
                            <Badge variant="accent">
                              <Zap className="w-3 h-3 mr-1" />
                              {idea.matchScore}%
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
          
          {/* Right Column - Profile Insights */}
          <div className="space-y-6">
            {/* Founder Profile Summary */}
            {profileSummary && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Founder Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-4 bg-secondary/50 rounded-xl">
                      <Badge variant="accent" className="mb-2">{profileSummary.founderType}</Badge>
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <span>Capacity:</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div
                              key={i}
                              className={cn(
                                "w-2 h-4 rounded-sm",
                                i < profileSummary.weeklyCapacityScore ? "bg-foreground" : "bg-muted"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {profileSummary.executionStrengths.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-success" />
                          Strengths
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {profileSummary.executionStrengths.slice(0, 4).map((strength) => (
                            <Badge key={strength} variant="skill" className="text-xs">{strength}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {profileSummary.idealBusinessModels.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                          <Lightbulb className="w-3 h-3" />
                          Ideal Models
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {profileSummary.idealBusinessModels.slice(0, 4).map((model) => (
                            <Badge key={model} variant="secondary" className="text-xs">{model}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {profileSummary.blindSpots.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-warning" />
                          Watch For
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {profileSummary.blindSpots.slice(0, 3).map((spot) => (
                            <Badge key={spot} variant="outline" className="text-xs">{spot}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
            
            {/* Profile Metrics */}
            {profile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      Profile Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <MetricBar 
                      label="Risk Tolerance" 
                      value={profile.riskTolerance} 
                      max={10}
                      lowLabel="Conservative"
                      highLabel="Aggressive"
                    />
                    <MetricBar 
                      label="Marketing Comfort" 
                      value={profile.marketingComfort} 
                      max={10}
                      lowLabel="Avoid"
                      highLabel="Love it"
                    />
                    <MetricBar 
                      label="Stress Tolerance" 
                      value={profile.stressTolerance} 
                      max={10}
                      lowLabel="Low"
                      highLabel="High"
                    />
                    
                    <div className="pt-4 border-t border-border/50 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Hours/Week</span>
                        <span className="font-medium">{profile.hoursPerWeek}h</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Income Goal</span>
                        <span className="font-medium">${profile.monthlyIncomeGoal.toLocaleString()}/mo</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Capital</span>
                        <span className="font-medium">{profile.capitalAvailable}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            
            {/* Collections Overview */}
            {collections.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FolderOpen className="w-5 h-5" />
                      Collections
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {collections.map((collection) => (
                        <div
                          key={collection.id}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                        >
                          <div className={cn(
                            "w-3 h-3 rounded-full",
                            `bg-${collection.color}-500`
                          )} style={{ backgroundColor: getCollectionColor(collection.color) }} />
                          <span className="text-sm flex-1">{collection.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ 
  icon, 
  label, 
  value, 
  description,
  highlight 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | number;
  description: string;
  highlight?: boolean;
}) {
  return (
    <Card className={cn(highlight && "border-foreground/20 bg-secondary/50")}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="p-2 bg-muted rounded-lg">
            {icon}
          </div>
        </div>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </CardContent>
    </Card>
  );
}

function MetricBar({ 
  label, 
  value, 
  max,
  lowLabel,
  highLabel
}: { 
  label: string; 
  value: number; 
  max: number;
  lowLabel: string;
  highLabel: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{value}/{max}</span>
      </div>
      <Progress value={(value / max) * 100} className="h-2 mb-1" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}

function getCollectionColor(color: string): string {
  const colors: Record<string, string> = {
    gray: '#6b7280',
    red: '#ef4444',
    orange: '#f97316',
    yellow: '#eab308',
    green: '#22c55e',
    blue: '#3b82f6',
    purple: '#a855f7',
    pink: '#ec4899',
  };
  return colors[color] || colors.gray;
}
