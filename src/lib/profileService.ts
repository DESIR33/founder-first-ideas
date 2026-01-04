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
