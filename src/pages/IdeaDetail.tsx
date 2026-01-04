import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Trash2,
  DollarSign,
  Clock,
  TrendingUp,
  Zap,
  Target,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  X,
  LogOut,
  Loader2,
  Share2,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { BusinessIdea, FounderProfile } from '@/types/founder';
import { useAuth } from '@/hooks/useAuth';
import { 
  getSavedIdeas, 
  saveIdea, 
  removeSavedIdea, 
  getIdeaNotes, 
  IdeaNote,
  getCollections,
  getIdeaCollectionIds,
  IdeaCollection,
  fetchUserProfile,
  mapDbProfileToFounderProfile
} from '@/lib/profileService';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { IdeaNotes } from '@/components/ideas/IdeaNotes';
import { AddToCollectionDialog, getColorClass } from '@/components/ideas/CollectionManager';
import { ScoreBreakdown } from '@/components/ideas/ScoreBreakdown';

export default function IdeaDetail() {
  const { id } = useParams<{ id: string }>();
  const [idea, setIdea] = useState<BusinessIdea | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notes, setNotes] = useState<IdeaNote[]>([]);
  const [collections, setCollections] = useState<IdeaCollection[]>([]);
  const [ideaCollectionIds, setIdeaCollectionIds] = useState<string[]>([]);
  const [founderProfile, setFounderProfile] = useState<FounderProfile | null>(null);
  
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadIdea() {
      if (!user) {
        navigate('/auth');
        return;
      }
      
      if (!id) {
        navigate('/saved');
        return;
      }
      
      try {
        const [savedIdeas, dbProfile] = await Promise.all([
          getSavedIdeas(user.id),
          fetchUserProfile(user.id),
        ]);
        
        const foundIdea = savedIdeas.find(i => i.id === id);
        const profile = mapDbProfileToFounderProfile(dbProfile);
        setFounderProfile(profile);
        
        if (foundIdea) {
          setIdea(foundIdea);
          setIsSaved(true);
          
          // Load notes and collections for this idea
          const [ideaNotes, userCollections, collectionIds] = await Promise.all([
            getIdeaNotes(user.id, id),
            getCollections(user.id),
            getIdeaCollectionIds(user.id, id),
          ]);
          setNotes(ideaNotes);
          setCollections(userCollections);
          setIdeaCollectionIds(collectionIds);
        } else {
          toast({
            title: "Idea not found",
            description: "This idea doesn't exist or has been removed.",
            variant: "destructive",
          });
          navigate('/saved');
        }
      } catch (error) {
        console.error('Error loading idea:', error);
        toast({
          title: "Error",
          description: "Failed to load idea details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadIdea();
  }, [user, id, navigate]);

  const handleSaveIdea = async () => {
    if (!user || !idea) return;
    setActionLoading(true);
    
    try {
      await saveIdea(user.id, idea);
      setIsSaved(true);
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
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveIdea = async () => {
    if (!user || !idea) return;
    setActionLoading(true);
    
    try {
      await removeSavedIdea(user.id, idea.id);
      toast({
        title: "Idea removed",
        description: "The idea has been removed from your saved list.",
      });
      navigate('/saved');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove idea.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleShare = async () => {
    if (!idea) return;
    
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Share this link with others.",
      });
    } catch {
      toast({
        title: "Share",
        description: window.location.href,
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-foreground" />
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Idea not found</p>
          <Button onClick={() => navigate('/saved')}>Back to Saved Ideas</Button>
        </div>
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
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8 relative z-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Section */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="secondary">{idea.category}</Badge>
              <div className="flex items-center gap-1.5 bg-secondary px-3 py-1 rounded-full">
                <Zap className="w-4 h-4" />
                <span className="font-semibold text-sm">{idea.matchScore}% match</span>
              </div>
              <Badge 
                variant={
                  idea.riskLevel === 'low' ? 'success' : 
                  idea.riskLevel === 'high' ? 'destructive' : 'secondary'
                }
              >
                {idea.riskLevel} risk
              </Badge>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">{idea.title}</h1>
            <p className="text-xl text-muted-foreground">{idea.tagline}</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <StatCard 
              icon={<DollarSign className="w-5 h-5" />}
              label="Capital Needed"
              value={idea.capitalNeeded}
            />
            <StatCard 
              icon={<Clock className="w-5 h-5" />}
              label="First Revenue"
              value={idea.timeToFirstRevenue}
            />
            <StatCard 
              icon={<TrendingUp className="w-5 h-5" />}
              label="Monthly Potential"
              value={idea.potentialMonthlyRevenue}
            />
            <StatCard 
              icon={<Target className="w-5 h-5" />}
              label="Complexity"
              value={idea.executionComplexity}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-10 pb-8 border-b border-border/50">
            {isSaved ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" disabled={actionLoading}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove from Saved
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove saved idea?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove "{idea.title}" from your saved ideas. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRemoveIdea}>Remove</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Button onClick={handleSaveIdea} disabled={actionLoading}>
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Bookmark className="w-4 h-4 mr-2" />
                )}
                Save This Idea
              </Button>
            )}
            
            <Button variant="outline" onClick={() => navigate('/')}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Get New Idea
            </Button>
            
            {user && idea && collections.length > 0 && (
              <AddToCollectionDialog
                userId={user.id}
                ideaId={idea.id}
                collections={collections}
                currentCollectionIds={ideaCollectionIds}
                onUpdate={setIdeaCollectionIds}
              />
            )}
          </div>
          
          {/* Collection Tags */}
          {ideaCollectionIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {ideaCollectionIds.map(collectionId => {
                const collection = collections.find(c => c.id === collectionId);
                if (!collection) return null;
                return (
                  <span 
                    key={collectionId}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/50 text-sm"
                  >
                    <span className={cn("w-2.5 h-2.5 rounded-full", getColorClass(collection.color))} />
                    {collection.name}
                  </span>
                );
              })}
            </div>
          )}

          {/* Content Sections */}
          <div className="space-y-10">
            {/* Score Breakdown */}
            {founderProfile && idea && (
              <ScoreBreakdown profile={founderProfile} idea={idea} />
            )}
            
            {/* Why This Fits */}
            <Section 
              icon={<Lightbulb className="w-5 h-5 text-foreground" />}
              title="Why This Fits You"
            >
              <p className="text-muted-foreground leading-relaxed">{idea.whyYou}</p>
            </Section>

            {/* Why Now */}
            <Section title="Why Now">
              <p className="text-muted-foreground leading-relaxed">{idea.whyNow}</p>
            </Section>

            {/* Problem & Solution */}
            <div className="grid md:grid-cols-2 gap-8">
              <Section title="The Problem">
                <p className="text-muted-foreground leading-relaxed">{idea.problemStatement}</p>
              </Section>
              
              <Section title="Your Solution">
                <p className="text-muted-foreground leading-relaxed">{idea.solution}</p>
              </Section>
            </div>

            {/* Target Customer */}
            <Section title="Target Customer">
              <p className="text-muted-foreground leading-relaxed">{idea.targetCustomer}</p>
            </Section>

            {/* Revenue Model */}
            <Section title="Revenue Model">
              <p className="text-muted-foreground leading-relaxed">{idea.revenueModel}</p>
            </Section>

            {/* Go-To-Market */}
            <Section title="Go-To-Market Strategy">
              <p className="text-muted-foreground leading-relaxed">{idea.goToMarketWedge}</p>
            </Section>

            {/* Required Skills */}
            <Section title="Required Skills">
              <div className="flex flex-wrap gap-2">
                {idea.requiredSkills.map((skill, i) => (
                  <Badge key={i} variant="skill">{skill}</Badge>
                ))}
              </div>
            </Section>

            {/* MVP Scope */}
            <Section title="MVP Scope">
              <Card className="bg-secondary/30">
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    {idea.mvpScope.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Section>

            {/* 7-Day Plan */}
            <Section title="If I Had 7 Days, I'd Do This">
              <Card className="bg-secondary/30">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {idea.sevenDayPlan.map((item, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-muted text-foreground font-semibold flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-muted-foreground">{item}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Section>

            {/* Kill Criteria */}
            <Section 
              icon={<AlertTriangle className="w-5 h-5 text-destructive" />}
              title="When to Stop (Kill Criteria)"
            >
              <Card className="bg-destructive/5 border-destructive/20">
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    {idea.killCriteria.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <X className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Section>
            {/* Notes Section */}
            {user && idea && (
              <IdeaNotes
                ideaId={idea.id}
                userId={user.id}
                notes={notes}
                onNotesChange={setNotes}
              />
            )}
          </div>

          {/* Bottom Actions */}
          <div className="mt-12 pt-8 border-t border-border/50 flex flex-wrap gap-4">
            {isSaved ? (
              <Button variant="outline" onClick={() => navigate('/saved')}>
                <BookmarkCheck className="w-4 h-4 mr-2" />
                View All Saved Ideas
              </Button>
            ) : (
              <Button onClick={handleSaveIdea} disabled={actionLoading}>
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Bookmark className="w-4 h-4 mr-2" />
                )}
                Save This Idea
              </Button>
            )}
            
            <Button variant="default" onClick={() => navigate('/')}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Get Another Idea
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="bg-secondary/30">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          {icon}
          <span className="text-xs">{label}</span>
        </div>
        <p className="font-semibold capitalize">{value}</p>
      </CardContent>
    </Card>
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
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}
