import { supabase } from '@/integrations/supabase/client';
import { FounderProfile, FounderProfileSummary, BusinessIdea } from '@/types/founder';
import { generateProfileSummary, generateMatchingIdea } from '@/lib/ideaEngine';

// Fetch user profile from database
export async function fetchUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (error) throw error;
  return data;
}

// Update user profile in database
export async function updateUserProfile(userId: string, updates: Partial<any>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

// Save founder questionnaire answers
export async function saveFounderProfile(
  userId: string, 
  profile: FounderProfile,
  summary: FounderProfileSummary
) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      // Background
      employment_status: profile.employmentStatus,
      hours_per_week: profile.hoursPerWeek,
      monthly_income_goal: profile.monthlyIncomeGoal,
      risk_tolerance: profile.riskTolerance,
      capital_available: profile.capitalAvailable,
      
      // Skills
      technical_ability: profile.technicalAbility,
      marketing_comfort: profile.marketingComfort,
      has_writing_skills: profile.hasWritingSkills,
      has_video_skills: profile.hasVideoSkills,
      has_sales_experience: profile.hasSalesExperience,
      has_audience: profile.existingAudience.hasAudience,
      audience_size: profile.existingAudience.size || 0,
      audience_platform: profile.existingAudience.platform || null,
      industry_experience: profile.industryExperience,
      
      // Constraints
      has_family_obligations: profile.hasFamilyObligations,
      geographic_limits: profile.geographicLimits,
      has_legal_restrictions: profile.hasLegalRestrictions,
      stress_tolerance: profile.stressTolerance,
      needs_predictability: profile.needsPredictability,
      
      // Preferences
      preferred_business_type: profile.preferredBusinessType,
      preferred_models: profile.preferredModel,
      time_horizon: profile.timeHorizon,
      team_preference: profile.teamPreference,
      role_preference: profile.rolePreference,
      
      // Personality
      builder_vs_optimizer: profile.personalityType.builderVsOptimizer,
      visionary_vs_executor: profile.personalityType.visionaryVsExecutor,
      structure_vs_ambiguity: profile.personalityType.structureVsAmbiguity,
      
      // Summary
      founder_type: summary.founderType,
      execution_strengths: summary.executionStrengths,
      blind_spots: summary.blindSpots,
      ideal_business_models: summary.idealBusinessModels,
      anti_patterns: summary.antiPatterns,
      weekly_capacity_score: summary.weeklyCapacityScore,
      
      // Mark as complete
      has_completed_onboarding: true,
    })
    .eq('user_id', userId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

// Map database profile to app profile types
export function mapDbProfileToFounderProfile(dbProfile: any): FounderProfile {
  return {
    employmentStatus: dbProfile.employment_status || 'employed',
    hoursPerWeek: dbProfile.hours_per_week || 10,
    monthlyIncomeGoal: dbProfile.monthly_income_goal || 3000,
    riskTolerance: dbProfile.risk_tolerance || 5,
    capitalAvailable: dbProfile.capital_available || '$0',
    technicalAbility: dbProfile.technical_ability || 'none',
    marketingComfort: dbProfile.marketing_comfort || 5,
    hasWritingSkills: dbProfile.has_writing_skills || false,
    hasVideoSkills: dbProfile.has_video_skills || false,
    hasSalesExperience: dbProfile.has_sales_experience || false,
    existingAudience: {
      hasAudience: dbProfile.has_audience || false,
      size: dbProfile.audience_size || 0,
      platform: dbProfile.audience_platform || undefined,
    },
    industryExperience: dbProfile.industry_experience || [],
    hasFamilyObligations: dbProfile.has_family_obligations || false,
    geographicLimits: dbProfile.geographic_limits || false,
    hasLegalRestrictions: dbProfile.has_legal_restrictions || false,
    stressTolerance: dbProfile.stress_tolerance || 5,
    needsPredictability: dbProfile.needs_predictability || false,
    preferredBusinessType: dbProfile.preferred_business_type || 'both',
    preferredModel: dbProfile.preferred_models || [],
    timeHorizon: dbProfile.time_horizon || 'flexible',
    teamPreference: dbProfile.team_preference || 'solo',
    rolePreference: dbProfile.role_preference || 'both',
    personalityType: {
      builderVsOptimizer: dbProfile.builder_vs_optimizer || 5,
      visionaryVsExecutor: dbProfile.visionary_vs_executor || 5,
      structureVsAmbiguity: dbProfile.structure_vs_ambiguity || 5,
    },
  };
}

export function mapDbProfileToSummary(dbProfile: any): FounderProfileSummary {
  return {
    founderType: dbProfile.founder_type || 'Unknown',
    executionStrengths: dbProfile.execution_strengths || [],
    blindSpots: dbProfile.blind_spots || [],
    idealBusinessModels: dbProfile.ideal_business_models || [],
    antiPatterns: dbProfile.anti_patterns || [],
    weeklyCapacityScore: dbProfile.weekly_capacity_score || 5,
  };
}

// Save an idea
export async function saveIdea(userId: string, idea: BusinessIdea) {
  const { error } = await supabase
    .from('saved_ideas')
    .upsert({
      user_id: userId,
      idea_id: idea.id,
      idea_data: idea as any,
    });
    
  if (error) throw error;
}

// Get saved ideas
export async function getSavedIdeas(userId: string): Promise<BusinessIdea[]> {
  const { data, error } = await supabase
    .from('saved_ideas')
    .select('*')
    .eq('user_id', userId)
    .order('saved_at', { ascending: false });
    
  if (error) throw error;
  return data?.map(row => row.idea_data as unknown as BusinessIdea) || [];
}

// Remove a saved idea
export async function removeSavedIdea(userId: string, ideaId: string) {
  const { error } = await supabase
    .from('saved_ideas')
    .delete()
    .eq('user_id', userId)
    .eq('idea_id', ideaId);
    
  if (error) throw error;
}

// Dismiss an idea
export async function dismissIdea(userId: string, ideaId: string) {
  const { error } = await supabase
    .from('dismissed_ideas')
    .upsert({
      user_id: userId,
      idea_id: ideaId,
    });
    
  if (error) throw error;
}

// Get dismissed idea IDs
export async function getDismissedIdeaIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('dismissed_ideas')
    .select('idea_id')
    .eq('user_id', userId);
    
  if (error) throw error;
  return data?.map(row => row.idea_id) || [];
}

// ============= Idea Notes =============

export interface IdeaNote {
  id: string;
  user_id: string;
  idea_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Get notes for an idea
export async function getIdeaNotes(userId: string, ideaId: string): Promise<IdeaNote[]> {
  const { data, error } = await supabase
    .from('idea_notes')
    .select('*')
    .eq('user_id', userId)
    .eq('idea_id', ideaId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data || [];
}

// Add a note to an idea
export async function addIdeaNote(userId: string, ideaId: string, content: string): Promise<IdeaNote> {
  const { data, error } = await supabase
    .from('idea_notes')
    .insert({
      user_id: userId,
      idea_id: ideaId,
      content: content.trim(),
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

// Update a note
export async function updateIdeaNote(noteId: string, content: string): Promise<IdeaNote> {
  const { data, error } = await supabase
    .from('idea_notes')
    .update({ content: content.trim() })
    .eq('id', noteId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

// Delete a note
export async function deleteIdeaNote(noteId: string): Promise<void> {
  const { error } = await supabase
    .from('idea_notes')
    .delete()
    .eq('id', noteId);
    
  if (error) throw error;
}

// Get note count for multiple ideas (for list view)
export async function getNoteCounts(userId: string, ideaIds: string[]): Promise<Record<string, number>> {
  if (ideaIds.length === 0) return {};
  
  const { data, error } = await supabase
    .from('idea_notes')
    .select('idea_id')
    .eq('user_id', userId)
    .in('idea_id', ideaIds);
    
  if (error) throw error;
  
  const counts: Record<string, number> = {};
  data?.forEach(row => {
    counts[row.idea_id] = (counts[row.idea_id] || 0) + 1;
  });
  return counts;
}

// ============= Idea Collections =============

export interface IdeaCollection {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export const COLLECTION_COLORS = [
  'gray', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'
] as const;

// Get all collections for a user
export async function getCollections(userId: string): Promise<IdeaCollection[]> {
  const { data, error } = await supabase
    .from('idea_collections')
    .select('*')
    .eq('user_id', userId)
    .order('name', { ascending: true });
    
  if (error) throw error;
  return data || [];
}

// Create a new collection
export async function createCollection(userId: string, name: string, color: string = 'gray'): Promise<IdeaCollection> {
  const { data, error } = await supabase
    .from('idea_collections')
    .insert({
      user_id: userId,
      name: name.trim(),
      color,
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

// Update a collection
export async function updateCollection(collectionId: string, updates: { name?: string; color?: string }): Promise<IdeaCollection> {
  const { data, error } = await supabase
    .from('idea_collections')
    .update(updates)
    .eq('id', collectionId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

// Delete a collection
export async function deleteCollection(collectionId: string): Promise<void> {
  const { error } = await supabase
    .from('idea_collections')
    .delete()
    .eq('id', collectionId);
    
  if (error) throw error;
}

// Add idea to collection
export async function addIdeaToCollection(userId: string, collectionId: string, ideaId: string): Promise<void> {
  const { error } = await supabase
    .from('idea_collection_items')
    .insert({
      user_id: userId,
      collection_id: collectionId,
      idea_id: ideaId,
    });
    
  if (error && error.code !== '23505') throw error; // Ignore duplicate key error
}

// Remove idea from collection
export async function removeIdeaFromCollection(collectionId: string, ideaId: string): Promise<void> {
  const { error } = await supabase
    .from('idea_collection_items')
    .delete()
    .eq('collection_id', collectionId)
    .eq('idea_id', ideaId);
    
  if (error) throw error;
}

// Get collection IDs for an idea
export async function getIdeaCollectionIds(userId: string, ideaId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('idea_collection_items')
    .select('collection_id')
    .eq('user_id', userId)
    .eq('idea_id', ideaId);
    
  if (error) throw error;
  return data?.map(row => row.collection_id) || [];
}

// Get all ideas in a collection
export async function getCollectionIdeaIds(collectionId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('idea_collection_items')
    .select('idea_id')
    .eq('collection_id', collectionId);
    
  if (error) throw error;
  return data?.map(row => row.idea_id) || [];
}

// Get collection counts for multiple ideas
export async function getIdeaCollectionCounts(userId: string, ideaIds: string[]): Promise<Record<string, string[]>> {
  if (ideaIds.length === 0) return {};
  
  const { data, error } = await supabase
    .from('idea_collection_items')
    .select('idea_id, collection_id')
    .eq('user_id', userId)
    .in('idea_id', ideaIds);
    
  if (error) throw error;
  
  const mapping: Record<string, string[]> = {};
  data?.forEach(row => {
    if (!mapping[row.idea_id]) mapping[row.idea_id] = [];
    mapping[row.idea_id].push(row.collection_id);
  });
  return mapping;
}
