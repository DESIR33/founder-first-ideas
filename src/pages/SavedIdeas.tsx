import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Bookmark,
  Trash2,
  DollarSign,
  Clock,
  TrendingUp,
  Zap,
  Search,
  Filter,
  Loader2,
  LogOut,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MessageSquare,
  FolderPlus,
  Folder,
  Scale,
  CheckSquare,
  Square
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { BusinessIdea } from '@/types/founder';
import { useAuth } from '@/hooks/useAuth';
import { 
  getSavedIdeas, 
  removeSavedIdea, 
  getNoteCounts, 
  getCollections, 
  getIdeaCollectionCounts,
  IdeaCollection
} from '@/lib/profileService';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { CollectionManager, AddToCollectionDialog, getColorClass } from '@/components/ideas/CollectionManager';

export default function SavedIdeas() {
  const [ideas, setIdeas] = useState<BusinessIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'matchScore' | 'risk'>('recent');
  const [filterRisk, setFilterRisk] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [noteCounts, setNoteCounts] = useState<Record<string, number>>({});
  const [collections, setCollections] = useState<IdeaCollection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [ideaCollections, setIdeaCollections] = useState<Record<string, string[]>>({});
  const [compareMode, setCompareMode] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadIdeas() {
      if (!user) {
        navigate('/auth');
        return;
      }
      
      try {
        const [savedIdeas, userCollections] = await Promise.all([
          getSavedIdeas(user.id),
          getCollections(user.id),
        ]);
        
        setIdeas(savedIdeas);
        setCollections(userCollections);
        
        // Load note counts and collection mappings for all ideas
        if (savedIdeas.length > 0) {
          const ideaIds = savedIdeas.map(i => i.id);
          const [counts, collectionMappings] = await Promise.all([
            getNoteCounts(user.id, ideaIds),
            getIdeaCollectionCounts(user.id, ideaIds),
          ]);
          setNoteCounts(counts);
          setIdeaCollections(collectionMappings);
        }
      } catch (error) {
        console.error('Error loading saved ideas:', error);
        toast({
          title: "Error",
          description: "Failed to load saved ideas.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadIdeas();
  }, [user, navigate]);

  const handleRemoveIdea = async (ideaId: string) => {
    if (!user) return;
    
    try {
      await removeSavedIdea(user.id, ideaId);
      setIdeas(prev => prev.filter(idea => idea.id !== ideaId));
      toast({
        title: "Idea removed",
        description: "The idea has been removed from your saved list.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove idea.",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const toggleCompareId = (ideaId: string) => {
    setCompareIds(prev => 
      prev.includes(ideaId) 
        ? prev.filter(id => id !== ideaId)
        : prev.length < 4 ? [...prev, ideaId] : prev
    );
  };

  const handleCompare = () => {
    if (compareIds.length >= 2) {
      navigate(`/compare?ids=${compareIds.join(',')}`);
    }
  };

  // Filter and sort ideas
  const filteredIdeas = ideas
    .filter(idea => {
      const matchesSearch = searchQuery === '' || 
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRisk = filterRisk === 'all' || idea.riskLevel === filterRisk;
      
      const matchesCollection = selectedCollectionId === null || 
        (ideaCollections[idea.id] && ideaCollections[idea.id].includes(selectedCollectionId));
      
      return matchesSearch && matchesRisk && matchesCollection;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'matchScore':
          return b.matchScore - a.matchScore;
        case 'risk':
          const riskOrder = { low: 0, medium: 1, high: 2 };
          return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
        case 'recent':
        default:
          return 0; // Already sorted by saved_at from DB
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-foreground" />
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
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <span className="text-xl font-semibold">Saved Ideas</span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant={compareMode ? "default" : "outline"} 
                size="sm" 
                onClick={() => {
                  setCompareMode(!compareMode);
                  if (compareMode) setCompareIds([]);
                }}
              >
                <Scale className="w-4 h-4 mr-2" />
                {compareMode ? 'Cancel' : 'Compare'}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Compare Mode Bar */}
      <AnimatePresence>
        {compareMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-border/50 bg-secondary/30"
          >
            <div className="container mx-auto px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <CheckSquare className="w-4 h-4" />
                  <span>
                    {compareIds.length} selected 
                    <span className="text-muted-foreground"> (select 2-4 ideas to compare)</span>
                  </span>
                </div>
                <Button 
                  size="sm" 
                  disabled={compareIds.length < 2}
                  onClick={handleCompare}
                >
                  Compare {compareIds.length} Ideas
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="flex gap-8">
          {/* Sidebar - Collections */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Collections</h3>
              {user && (
                <CollectionManager
                  userId={user.id}
                  collections={collections}
                  onCollectionsChange={setCollections}
                  selectedCollectionId={selectedCollectionId}
                  onSelectCollection={setSelectedCollectionId}
                />
              )}
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search ideas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-3">
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="matchScore">Match Score</SelectItem>
                    <SelectItem value="risk">Risk Level</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterRisk} onValueChange={(v) => setFilterRisk(v as any)}>
                  <SelectTrigger className="w-[130px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Risk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risks</SelectItem>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Ideas List */}
            {filteredIdeas.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  {ideas.length === 0 ? "No saved ideas yet" : "No matching ideas"}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {ideas.length === 0 
                    ? "Save ideas from your dashboard to see them here."
                    : selectedCollectionId 
                      ? "This collection is empty. Add ideas to it from the idea cards."
                      : "Try adjusting your search or filters."}
                </p>
                {ideas.length === 0 && (
                  <Button onClick={() => navigate('/')}>
                    Browse Ideas
                  </Button>
                )}
              </motion.div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {filteredIdeas.length} idea{filteredIdeas.length !== 1 ? 's' : ''}
                  {selectedCollectionId && collections.find(c => c.id === selectedCollectionId) 
                    ? ` in "${collections.find(c => c.id === selectedCollectionId)?.name}"`
                    : ' saved'}
                </p>
                
                <AnimatePresence>
                  {filteredIdeas.map((idea, index) => (
                    <motion.div
                      key={idea.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <SavedIdeaCard
                        idea={idea}
                        isExpanded={expandedId === idea.id}
                        compareMode={compareMode}
                        isSelectedForCompare={compareIds.includes(idea.id)}
                        onToggleCompare={() => toggleCompareId(idea.id)}
                        onToggleExpand={() => setExpandedId(expandedId === idea.id ? null : idea.id)}
                        onRemove={() => handleRemoveIdea(idea.id)}
                        onViewDetails={() => navigate(`/idea/${idea.id}`)}
                        noteCount={noteCounts[idea.id] || 0}
                        collections={collections}
                        ideaCollectionIds={ideaCollections[idea.id] || []}
                        userId={user?.id || ''}
                        onCollectionsUpdate={(newIds) => {
                          setIdeaCollections(prev => ({ ...prev, [idea.id]: newIds }));
                        }}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

interface SavedIdeaCardProps {
  idea: BusinessIdea;
  isExpanded: boolean;
  compareMode: boolean;
  isSelectedForCompare: boolean;
  onToggleCompare: () => void;
  onToggleExpand: () => void;
  onRemove: () => void;
  onViewDetails: () => void;
  noteCount: number;
  collections: IdeaCollection[];
  ideaCollectionIds: string[];
  userId: string;
  onCollectionsUpdate: (newIds: string[]) => void;
}

function SavedIdeaCard({ 
  idea, 
  isExpanded,
  compareMode,
  isSelectedForCompare,
  onToggleCompare,
  onToggleExpand, 
  onRemove, 
  onViewDetails, 
  noteCount,
  collections,
  ideaCollectionIds,
  userId,
  onCollectionsUpdate
}: SavedIdeaCardProps) {
  return (
    <Card className={cn(
      "overflow-hidden transition-all",
      isSelectedForCompare && "ring-2 ring-foreground"
    )}>
      {/* Collapsed Header */}
      <div 
        className="p-4 sm:p-6 cursor-pointer hover:bg-secondary/30 transition-colors"
        onClick={compareMode ? onToggleCompare : onToggleExpand}
      >
        <div className="flex items-start justify-between gap-4">
          {/* Compare Checkbox */}
          {compareMode && (
            <div className="flex-shrink-0 pt-1">
              {isSelectedForCompare ? (
                <CheckSquare className="w-5 h-5 text-foreground" />
              ) : (
                <Square className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">{idea.category}</Badge>
              <div className="flex items-center gap-1 text-sm">
                <Zap className="w-3 h-3" />
                <span className="font-medium">{idea.matchScore}%</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-1 truncate">{idea.title}</h3>
            <p className="text-muted-foreground text-sm line-clamp-1">{idea.tagline}</p>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge 
              variant={
                idea.riskLevel === 'low' ? 'success' : 
                idea.riskLevel === 'high' ? 'destructive' : 'secondary'
              }
            >
              {idea.riskLevel} risk
            </Badge>
            
            <Button variant="ghost" size="icon" className="h-8 w-8">
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Quick Stats Row */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            <span>{idea.capitalNeeded}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{idea.timeToFirstRevenue}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{idea.potentialMonthlyRevenue}</span>
          </div>
          {noteCount > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              <span>{noteCount} note{noteCount !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
        
        {/* Collection Tags */}
        {ideaCollectionIds.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {ideaCollectionIds.map(collectionId => {
              const collection = collections.find(c => c.id === collectionId);
              if (!collection) return null;
              return (
                <span 
                  key={collectionId}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/50 text-xs"
                >
                  <span className={cn("w-2 h-2 rounded-full", getColorClass(collection.color))} />
                  {collection.name}
                </span>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <CardContent className="pt-0 pb-6 px-4 sm:px-6 space-y-6 border-t border-border/50">
              <div className="pt-6">
                {/* Why You */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Why This Fits You</h4>
                  <p className="text-muted-foreground text-sm">{idea.whyYou}</p>
                </div>
                
                {/* Problem & Solution */}
                <div className="grid sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium mb-2">The Problem</h4>
                    <p className="text-muted-foreground text-sm">{idea.problemStatement}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Your Solution</h4>
                    <p className="text-muted-foreground text-sm">{idea.solution}</p>
                  </div>
                </div>
                
                {/* 7-Day Plan Preview */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">7-Day Quick Start</h4>
                  <div className="bg-secondary/50 rounded-xl p-4 space-y-2">
                    {idea.sevenDayPlan.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-muted text-foreground text-xs font-semibold flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </div>
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                    {idea.sevenDayPlan.length > 3 && (
                      <p className="text-xs text-muted-foreground pl-8">
                        +{idea.sevenDayPlan.length - 3} more steps...
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border/50">
                  <Button variant="default" size="sm" onClick={onViewDetails}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Full Details
                  </Button>
                  
                  <AddToCollectionDialog
                    userId={userId}
                    ideaId={idea.id}
                    collections={collections}
                    currentCollectionIds={ideaCollectionIds}
                    onUpdate={onCollectionsUpdate}
                    trigger={
                      <Button variant="outline" size="sm">
                        <FolderPlus className="w-4 h-4 mr-2" />
                        Collections
                      </Button>
                    }
                  />
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
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
                        <AlertDialogAction onClick={onRemove}>Remove</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
