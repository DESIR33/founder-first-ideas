import { supabase } from '@/integrations/supabase/client';

export interface ValidationItem {
  id: string;
  user_id: string;
  idea_id: string;
  label: string;
  description: string | null;
  is_completed: boolean;
  category: string;
  sort_order: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export const DEFAULT_VALIDATION_ITEMS = {
  market: [
    { label: 'Identify 3+ competitors and analyze their strengths/weaknesses', description: 'Research direct and indirect competitors' },
    { label: 'Find 10+ online communities where target customers gather', description: 'Reddit, Facebook groups, Discord servers, forums' },
    { label: 'Estimate total addressable market (TAM) size', description: 'Use industry reports or bottom-up calculations' },
    { label: 'Identify market trends supporting this idea', description: 'Growing demand, regulatory changes, tech shifts' },
  ],
  customer: [
    { label: 'Interview 5+ potential customers about the problem', description: 'Focus on their pain points, not your solution' },
    { label: 'Create an ideal customer profile (ICP)', description: 'Demographics, behaviors, pain points, goals' },
    { label: 'Validate willingness to pay for a solution', description: 'Ask about budget and current spending' },
    { label: 'Identify how customers currently solve this problem', description: 'Workarounds, alternatives, or going without' },
  ],
  product: [
    { label: 'Define MVP features (what to build first)', description: 'Focus on core value proposition only' },
    { label: 'Create a landing page or mockup', description: 'Test messaging and collect interest' },
    { label: 'Get feedback on MVP concept from 5+ people', description: 'Share designs or prototypes' },
    { label: 'Validate technical feasibility', description: 'Can you actually build this with available resources?' },
  ],
  financial: [
    { label: 'Calculate customer acquisition cost estimate', description: 'Based on marketing channel research' },
    { label: 'Project monthly expenses for first 6 months', description: 'Tools, hosting, marketing, time investment' },
    { label: 'Define pricing strategy', description: 'Based on value delivered and competitor pricing' },
    { label: 'Calculate break-even point', description: 'How many customers/sales to cover costs?' },
  ],
};

// Get all validation items for an idea
export async function getValidationItems(userId: string, ideaId: string): Promise<ValidationItem[]> {
  const { data, error } = await supabase
    .from('idea_validation_items')
    .select('*')
    .eq('user_id', userId)
    .eq('idea_id', ideaId)
    .order('category', { ascending: true })
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

// Create a validation item
export async function createValidationItem(
  userId: string,
  ideaId: string,
  item: { label: string; description?: string; category: string; sort_order: number }
): Promise<ValidationItem> {
  const { data, error } = await supabase
    .from('idea_validation_items')
    .insert({
      user_id: userId,
      idea_id: ideaId,
      label: item.label,
      description: item.description || null,
      category: item.category,
      sort_order: item.sort_order,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update a validation item
export async function updateValidationItem(
  itemId: string,
  updates: { is_completed?: boolean; completed_at?: string | null; label?: string; description?: string }
): Promise<ValidationItem> {
  const { data, error } = await supabase
    .from('idea_validation_items')
    .update(updates)
    .eq('id', itemId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete a validation item
export async function deleteValidationItem(itemId: string): Promise<void> {
  const { error } = await supabase
    .from('idea_validation_items')
    .delete()
    .eq('id', itemId);

  if (error) throw error;
}

// Initialize default checklist items for an idea
export async function initializeDefaultChecklist(userId: string, ideaId: string): Promise<void> {
  const items: Array<{
    user_id: string;
    idea_id: string;
    label: string;
    description: string | null;
    category: string;
    sort_order: number;
  }> = [];

  Object.entries(DEFAULT_VALIDATION_ITEMS).forEach(([category, categoryItems]) => {
    categoryItems.forEach((item, index) => {
      items.push({
        user_id: userId,
        idea_id: ideaId,
        label: item.label,
        description: item.description,
        category,
        sort_order: index,
      });
    });
  });

  const { error } = await supabase
    .from('idea_validation_items')
    .insert(items);

  if (error) throw error;
}

// Get validation progress for multiple ideas
export async function getValidationProgress(userId: string, ideaIds: string[]): Promise<Record<string, { completed: number; total: number }>> {
  if (ideaIds.length === 0) return {};

  const { data, error } = await supabase
    .from('idea_validation_items')
    .select('idea_id, is_completed')
    .eq('user_id', userId)
    .in('idea_id', ideaIds);

  if (error) throw error;

  const progress: Record<string, { completed: number; total: number }> = {};
  
  data?.forEach(item => {
    if (!progress[item.idea_id]) {
      progress[item.idea_id] = { completed: 0, total: 0 };
    }
    progress[item.idea_id].total++;
    if (item.is_completed) {
      progress[item.idea_id].completed++;
    }
  });

  return progress;
}
