import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardCheck, 
  Plus, 
  Check, 
  Trash2, 
  ChevronDown,
  ChevronRight,
  Loader2,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  ValidationItem,
  getValidationItems,
  createValidationItem,
  updateValidationItem,
  deleteValidationItem,
  initializeDefaultChecklist,
  DEFAULT_VALIDATION_ITEMS,
} from '@/lib/validationService';

interface ValidationChecklistProps {
  ideaId: string;
  userId: string;
}

type CategoryKey = keyof typeof DEFAULT_VALIDATION_ITEMS;

const CATEGORY_CONFIG: Record<CategoryKey, { label: string; icon: string }> = {
  market: { label: 'Market Validation', icon: '🎯' },
  customer: { label: 'Customer Discovery', icon: '👥' },
  product: { label: 'Product Validation', icon: '🔧' },
  financial: { label: 'Financial Validation', icon: '💰' },
};

export function ValidationChecklist({ ideaId, userId }: ValidationChecklistProps) {
  const [items, setItems] = useState<ValidationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['market', 'customer']));
  const [newItemText, setNewItemText] = useState('');
  const [addingToCategory, setAddingToCategory] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    loadItems();
  }, [ideaId, userId]);

  async function loadItems() {
    try {
      let validationItems = await getValidationItems(userId, ideaId);
      
      // If no items exist, initialize with defaults
      if (validationItems.length === 0) {
        await initializeDefaultChecklist(userId, ideaId);
        validationItems = await getValidationItems(userId, ideaId);
      }
      
      setItems(validationItems);
    } catch (error) {
      console.error('Error loading validation items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load validation checklist.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleToggleComplete = async (item: ValidationItem) => {
    setActionLoading(item.id);
    try {
      const updated = await updateValidationItem(item.id, {
        is_completed: !item.is_completed,
        completed_at: !item.is_completed ? new Date().toISOString() : null,
      });
      setItems(prev => prev.map(i => i.id === item.id ? updated : i));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update item.',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddItem = async (category: string) => {
    if (!newItemText.trim()) return;
    
    setActionLoading('adding');
    try {
      const maxOrder = items
        .filter(i => i.category === category)
        .reduce((max, i) => Math.max(max, i.sort_order), 0);
      
      const newItem = await createValidationItem(userId, ideaId, {
        label: newItemText.trim(),
        category,
        sort_order: maxOrder + 1,
      });
      
      setItems(prev => [...prev, newItem]);
      setNewItemText('');
      setAddingToCategory(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item.',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    setActionLoading(itemId);
    try {
      await deleteValidationItem(itemId);
      setItems(prev => prev.filter(i => i.id !== itemId));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete item.',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const completedCount = items.filter(i => i.is_completed).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const itemsByCategory = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ValidationItem[]>);

  // Sort items within each category
  Object.values(itemsByCategory).forEach(categoryItems => {
    categoryItems.sort((a, b) => a.sort_order - b.sort_order);
  });

  if (loading) {
    return (
      <Card className="bg-secondary/30">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ClipboardCheck className="w-5 h-5 text-foreground" />
          <h3 className="text-xl font-semibold">Validation Checklist</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {completedCount}/{totalCount} complete
          </span>
          {progressPercent === 100 && (
            <span className="flex items-center gap-1 text-sm text-success">
              <Sparkles className="w-4 h-4" />
              Fully validated!
            </span>
          )}
        </div>
      </div>

      <Progress value={progressPercent} className="h-2" />

      <div className="space-y-3">
        {(Object.keys(CATEGORY_CONFIG) as CategoryKey[]).map(category => {
          const config = CATEGORY_CONFIG[category];
          const categoryItems = itemsByCategory[category] || [];
          const categoryCompleted = categoryItems.filter(i => i.is_completed).length;
          const isExpanded = expandedCategories.has(category);

          return (
            <Card key={category} className="bg-secondary/30 overflow-hidden">
              <button
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary/50 transition-colors"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{config.icon}</span>
                  <span className="font-medium">{config.label}</span>
                  <span className="text-sm text-muted-foreground">
                    ({categoryCompleted}/{categoryItems.length})
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardContent className="pt-0 pb-4 px-4 space-y-2">
                      {categoryItems.map(item => (
                        <div
                          key={item.id}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg transition-colors group",
                            item.is_completed ? "bg-success/10" : "bg-background/50 hover:bg-background/80"
                          )}
                        >
                          <button
                            className={cn(
                              "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                              item.is_completed
                                ? "bg-success border-success text-success-foreground"
                                : "border-muted-foreground/50 hover:border-foreground"
                            )}
                            onClick={() => handleToggleComplete(item)}
                            disabled={actionLoading === item.id}
                          >
                            {actionLoading === item.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : item.is_completed ? (
                              <Check className="w-3 h-3" />
                            ) : null}
                          </button>
                          
                          <div className="flex-1">
                            <span className={cn(
                              "text-sm",
                              item.is_completed && "line-through text-muted-foreground"
                            )}>
                              {item.label}
                            </span>
                            {item.description && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {item.description}
                              </p>
                            )}
                          </div>
                          
                          <button
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-opacity"
                            onClick={() => handleDeleteItem(item.id)}
                            disabled={actionLoading === item.id}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </button>
                        </div>
                      ))}

                      {addingToCategory === category ? (
                        <div className="flex gap-2 pt-2">
                          <Input
                            value={newItemText}
                            onChange={(e) => setNewItemText(e.target.value)}
                            placeholder="New validation step..."
                            className="flex-1"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddItem(category);
                              if (e.key === 'Escape') {
                                setAddingToCategory(null);
                                setNewItemText('');
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={() => handleAddItem(category)}
                            disabled={actionLoading === 'adding' || !newItemText.trim()}
                          >
                            {actionLoading === 'adding' ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              'Add'
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setAddingToCategory(null);
                              setNewItemText('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <button
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors pt-2"
                          onClick={() => setAddingToCategory(category)}
                        >
                          <Plus className="w-4 h-4" />
                          Add custom step
                        </button>
                      )}
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
