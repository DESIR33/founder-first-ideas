import { FounderProfile, FounderProfileSummary, BusinessIdea } from '@/types/founder';

export interface MatchFactor {
  id: string;
  category: 'time' | 'capital' | 'skills' | 'risk' | 'preferences';
  label: string;
  description: string;
  impact: 'positive' | 'neutral' | 'negative';
  points: number;
  profileValue: string;
  ideaValue: string;
}

export function calculateMatchBreakdown(
  profile: FounderProfile,
  idea: BusinessIdea
): { factors: MatchFactor[]; totalScore: number } {
  const factors: MatchFactor[] = [];
  let totalScore = 50; // Base score

  // Time availability
  if (profile.hoursPerWeek < 10 && idea.executionComplexity === 'simple') {
    factors.push({
      id: 'time-low-simple',
      category: 'time',
      label: 'Time Availability',
      description: 'Your limited hours work well with simple execution',
      impact: 'positive',
      points: 15,
      profileValue: `${profile.hoursPerWeek} hrs/week`,
      ideaValue: `${idea.executionComplexity} complexity`
    });
    totalScore += 15;
  } else if (profile.hoursPerWeek >= 20 && idea.executionComplexity !== 'simple') {
    factors.push({
      id: 'time-high-complex',
      category: 'time',
      label: 'Time Availability',
      description: 'Your available hours can handle this complexity',
      impact: 'positive',
      points: 10,
      profileValue: `${profile.hoursPerWeek} hrs/week`,
      ideaValue: `${idea.executionComplexity} complexity`
    });
    totalScore += 10;
  } else if (profile.hoursPerWeek < 10 && idea.executionComplexity !== 'simple') {
    factors.push({
      id: 'time-mismatch',
      category: 'time',
      label: 'Time Availability',
      description: 'Limited hours may be challenging for this complexity',
      impact: 'negative',
      points: -5,
      profileValue: `${profile.hoursPerWeek} hrs/week`,
      ideaValue: `${idea.executionComplexity} complexity`
    });
    totalScore -= 5;
  } else {
    factors.push({
      id: 'time-neutral',
      category: 'time',
      label: 'Time Availability',
      description: 'Your schedule is compatible',
      impact: 'neutral',
      points: 0,
      profileValue: `${profile.hoursPerWeek} hrs/week`,
      ideaValue: `${idea.executionComplexity} complexity`
    });
  }

  // Capital match
  const lowCapital = profile.capitalAvailable === '$0' || profile.capitalAvailable === '<$1k';
  const lowCostIdea = idea.capitalNeeded.includes('$0') || idea.capitalNeeded.includes('$100');
  
  if (lowCapital && lowCostIdea) {
    factors.push({
      id: 'capital-match',
      category: 'capital',
      label: 'Capital Requirements',
      description: 'Low startup costs match your available capital',
      impact: 'positive',
      points: 15,
      profileValue: profile.capitalAvailable,
      ideaValue: idea.capitalNeeded
    });
    totalScore += 15;
  } else if (!lowCapital) {
    factors.push({
      id: 'capital-available',
      category: 'capital',
      label: 'Capital Requirements',
      description: 'You have capital to invest if needed',
      impact: 'positive',
      points: 5,
      profileValue: profile.capitalAvailable,
      ideaValue: idea.capitalNeeded
    });
    totalScore += 5;
  } else {
    factors.push({
      id: 'capital-neutral',
      category: 'capital',
      label: 'Capital Requirements',
      description: 'Capital needs are manageable',
      impact: 'neutral',
      points: 0,
      profileValue: profile.capitalAvailable,
      ideaValue: idea.capitalNeeded
    });
  }

  // Risk tolerance
  if (profile.riskTolerance >= 7 && idea.riskLevel === 'high') {
    factors.push({
      id: 'risk-high-match',
      category: 'risk',
      label: 'Risk Tolerance',
      description: 'Your high risk tolerance suits this venture',
      impact: 'positive',
      points: 10,
      profileValue: `${profile.riskTolerance}/10`,
      ideaValue: `${idea.riskLevel} risk`
    });
    totalScore += 10;
  } else if (profile.riskTolerance <= 3 && idea.riskLevel === 'low') {
    factors.push({
      id: 'risk-low-match',
      category: 'risk',
      label: 'Risk Tolerance',
      description: 'Low-risk idea matches your conservative approach',
      impact: 'positive',
      points: 15,
      profileValue: `${profile.riskTolerance}/10`,
      ideaValue: `${idea.riskLevel} risk`
    });
    totalScore += 15;
  } else if (profile.riskTolerance <= 3 && idea.riskLevel === 'high') {
    factors.push({
      id: 'risk-mismatch',
      category: 'risk',
      label: 'Risk Tolerance',
      description: 'Higher risk than your comfort level',
      impact: 'negative',
      points: -10,
      profileValue: `${profile.riskTolerance}/10`,
      ideaValue: `${idea.riskLevel} risk`
    });
    totalScore -= 10;
  } else {
    factors.push({
      id: 'risk-neutral',
      category: 'risk',
      label: 'Risk Tolerance',
      description: 'Risk level is within your comfort zone',
      impact: 'neutral',
      points: 0,
      profileValue: `${profile.riskTolerance}/10`,
      ideaValue: `${idea.riskLevel} risk`
    });
  }

  // Technical ability
  if (profile.technicalAbility === 'developer' && idea.category === 'SaaS') {
    factors.push({
      id: 'tech-dev-saas',
      category: 'skills',
      label: 'Technical Skills',
      description: 'Your dev skills are perfect for SaaS',
      impact: 'positive',
      points: 15,
      profileValue: 'Developer',
      ideaValue: idea.category
    });
    totalScore += 15;
  } else if (profile.technicalAbility === 'none' && idea.executionComplexity === 'simple') {
    factors.push({
      id: 'tech-none-simple',
      category: 'skills',
      label: 'Technical Skills',
      description: 'No technical skills needed for this',
      impact: 'positive',
      points: 10,
      profileValue: 'Non-technical',
      ideaValue: `${idea.executionComplexity} execution`
    });
    totalScore += 10;
  } else if (profile.technicalAbility === 'no-code' && idea.category === 'SaaS') {
    factors.push({
      id: 'tech-nocode-saas',
      category: 'skills',
      label: 'Technical Skills',
      description: 'No-code tools can build this SaaS',
      impact: 'positive',
      points: 10,
      profileValue: 'No-code',
      ideaValue: idea.category
    });
    totalScore += 10;
  } else {
    factors.push({
      id: 'tech-neutral',
      category: 'skills',
      label: 'Technical Skills',
      description: 'Your technical level works for this',
      impact: 'neutral',
      points: 0,
      profileValue: profile.technicalAbility || 'None',
      ideaValue: idea.category
    });
  }

  // Marketing comfort
  if (profile.marketingComfort >= 7 && idea.category === 'Content') {
    factors.push({
      id: 'marketing-content',
      category: 'skills',
      label: 'Marketing Comfort',
      description: 'Your marketing skills excel at content',
      impact: 'positive',
      points: 15,
      profileValue: `${profile.marketingComfort}/10`,
      ideaValue: 'Content-based'
    });
    totalScore += 15;
  } else if (profile.marketingComfort >= 7 && idea.category === 'Community') {
    factors.push({
      id: 'marketing-community',
      category: 'skills',
      label: 'Marketing Comfort',
      description: 'Community building needs marketing skills',
      impact: 'positive',
      points: 10,
      profileValue: `${profile.marketingComfort}/10`,
      ideaValue: 'Community-based'
    });
    totalScore += 10;
  } else if (profile.marketingComfort <= 3) {
    factors.push({
      id: 'marketing-low',
      category: 'skills',
      label: 'Marketing Comfort',
      description: 'Marketing may be a growth challenge',
      impact: 'neutral',
      points: 0,
      profileValue: `${profile.marketingComfort}/10`,
      ideaValue: idea.category
    });
  }

  // Writing skills
  if (profile.hasWritingSkills && idea.requiredSkills.includes('Writing')) {
    factors.push({
      id: 'writing-match',
      category: 'skills',
      label: 'Writing Skills',
      description: 'Your writing ability is a core asset here',
      impact: 'positive',
      points: 15,
      profileValue: 'Has writing skills',
      ideaValue: 'Writing required'
    });
    totalScore += 15;
  }

  // Sales experience
  if (profile.hasSalesExperience && idea.category === 'Service') {
    factors.push({
      id: 'sales-service',
      category: 'skills',
      label: 'Sales Experience',
      description: 'Sales skills help close service clients',
      impact: 'positive',
      points: 15,
      profileValue: 'Has sales experience',
      ideaValue: 'Service business'
    });
    totalScore += 15;
  }

  // Existing audience
  if (profile.existingAudience.hasAudience && idea.category === 'Content') {
    factors.push({
      id: 'audience-content',
      category: 'skills',
      label: 'Existing Audience',
      description: 'Your audience gives instant distribution',
      impact: 'positive',
      points: 20,
      profileValue: `${profile.existingAudience.size?.toLocaleString() || 'Has'} followers`,
      ideaValue: 'Content business'
    });
    totalScore += 20;
  } else if (profile.existingAudience.hasAudience && idea.category === 'Community') {
    factors.push({
      id: 'audience-community',
      category: 'skills',
      label: 'Existing Audience',
      description: 'Audience can seed your community',
      impact: 'positive',
      points: 15,
      profileValue: `${profile.existingAudience.size?.toLocaleString() || 'Has'} followers`,
      ideaValue: 'Community business'
    });
    totalScore += 15;
  }

  // Time horizon
  if (profile.timeHorizon === 'quick-cash' && idea.timeToFirstRevenue.includes('week')) {
    factors.push({
      id: 'horizon-quick',
      category: 'preferences',
      label: 'Time to Revenue',
      description: 'Fast revenue matches your quick-cash goal',
      impact: 'positive',
      points: 15,
      profileValue: 'Quick cash preferred',
      ideaValue: idea.timeToFirstRevenue
    });
    totalScore += 15;
  }

  // Business type preference
  if (profile.preferredBusinessType === 'b2b' && idea.category === 'Service') {
    factors.push({
      id: 'biz-type-b2b',
      category: 'preferences',
      label: 'Business Type',
      description: 'B2B preference fits service model',
      impact: 'positive',
      points: 10,
      profileValue: 'B2B preferred',
      ideaValue: 'Service (B2B)'
    });
    totalScore += 10;
  }

  // Solo preference
  if (profile.teamPreference === 'solo' && idea.executionComplexity !== 'complex') {
    factors.push({
      id: 'solo-simple',
      category: 'preferences',
      label: 'Team Preference',
      description: 'Can be executed solo as you prefer',
      impact: 'positive',
      points: 10,
      profileValue: 'Solo preferred',
      ideaValue: `${idea.executionComplexity} execution`
    });
    totalScore += 10;
  }

  // Sort by impact (positive first, then neutral, then negative)
  factors.sort((a, b) => {
    const order = { positive: 0, neutral: 1, negative: 2 };
    return order[a.impact] - order[b.impact];
  });

  return {
    factors,
    totalScore: Math.min(100, Math.max(0, totalScore))
  };
}

export function getCategoryIcon(category: MatchFactor['category']): string {
  switch (category) {
    case 'time': return 'Clock';
    case 'capital': return 'DollarSign';
    case 'skills': return 'Zap';
    case 'risk': return 'AlertTriangle';
    case 'preferences': return 'Target';
    default: return 'Circle';
  }
}

export function getCategoryLabel(category: MatchFactor['category']): string {
  switch (category) {
    case 'time': return 'Time & Capacity';
    case 'capital': return 'Capital';
    case 'skills': return 'Skills & Assets';
    case 'risk': return 'Risk';
    case 'preferences': return 'Preferences';
    default: return 'Other';
  }
}
