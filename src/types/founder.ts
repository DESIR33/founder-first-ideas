// Founder Profile Types
export interface FounderProfile {
  // Background
  employmentStatus: 'employed' | 'self-employed' | 'unemployed' | 'student' | 'retired';
  hoursPerWeek: number;
  monthlyIncomeGoal: number;
  riskTolerance: number; // 1-10
  capitalAvailable: '$0' | '<$1k' | '$1k-$5k' | '$5k+';
  
  // Skills & Assets
  technicalAbility: 'none' | 'no-code' | 'some-code' | 'developer';
  marketingComfort: number; // 1-10
  hasWritingSkills: boolean;
  hasVideoSkills: boolean;
  hasSalesExperience: boolean;
  existingAudience: {
    hasAudience: boolean;
    size?: number;
    platform?: string;
  };
  industryExperience: string[];
  
  // Constraints
  hasFamilyObligations: boolean;
  geographicLimits: boolean;
  hasLegalRestrictions: boolean;
  stressTolerance: number; // 1-10
  needsPredictability: boolean;
  
  // Preferences
  preferredBusinessType: 'b2b' | 'b2c' | 'both';
  preferredModel: ('saas' | 'service' | 'content' | 'marketplace' | 'product')[];
  timeHorizon: 'quick-cash' | 'long-term' | 'flexible';
  teamPreference: 'solo' | 'team' | 'either';
  rolePreference: 'builder' | 'operator' | 'both';
  
  // Personality
  personalityType: {
    builderVsOptimizer: number; // 1=builder, 10=optimizer
    visionaryVsExecutor: number; // 1=visionary, 10=executor
    structureVsAmbiguity: number; // 1=loves structure, 10=loves ambiguity
  };
}

// Computed Profile Summary
export interface FounderProfileSummary {
  founderType: string;
  executionStrengths: string[];
  blindSpots: string[];
  idealBusinessModels: string[];
  antiPatterns: string[];
  weeklyCapacityScore: number;
}

// Business Idea Types
export interface BusinessIdea {
  id: string;
  title: string;
  tagline: string;
  category: string;
  
  // Problem & Solution
  problemStatement: string;
  targetCustomer: string;
  solution: string;
  
  // Requirements
  requiredSkills: string[];
  capitalNeeded: string;
  timeToFirstRevenue: string;
  riskLevel: 'low' | 'medium' | 'high';
  executionComplexity: 'simple' | 'moderate' | 'complex';
  
  // Monetization
  revenueModel: string;
  potentialMonthlyRevenue: string;
  
  // Execution
  mvpScope: string[];
  goToMarketWedge: string;
  sevenDayPlan: string[];
  killCriteria: string[];
  
  // Why this fits
  whyNow: string;
  whyYou: string;
  
  // Metadata
  matchScore: number;
  savedAt?: Date;
  dismissed?: boolean;
}

// Questionnaire Step Types
export type QuestionType = 'choice' | 'slider' | 'multi-select' | 'binary' | 'trade-off';

export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface QuestionStep {
  id: string;
  category: 'background' | 'skills' | 'constraints' | 'preferences' | 'personality';
  type: QuestionType;
  question: string;
  subtext?: string;
  options?: QuestionOption[];
  sliderConfig?: {
    min: number;
    max: number;
    step: number;
    minLabel: string;
    maxLabel: string;
  };
  tradeOffConfig?: {
    optionA: QuestionOption;
    optionB: QuestionOption;
  };
  required: boolean;
}

// User State
export interface UserState {
  hasCompletedOnboarding: boolean;
  profile: Partial<FounderProfile> | null;
  profileSummary: FounderProfileSummary | null;
  savedIdeas: BusinessIdea[];
  dismissedIdeas: string[];
  currentIdea: BusinessIdea | null;
  weeklyIdeaHistory: BusinessIdea[];
}
