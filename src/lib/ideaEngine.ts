import { FounderProfile, FounderProfileSummary, BusinessIdea } from '@/types/founder';

// Generate a profile summary based on the founder's answers
export function generateProfileSummary(profile: FounderProfile): FounderProfileSummary {
  const strengths: string[] = [];
  const blindSpots: string[] = [];
  const idealModels: string[] = [];
  const antiPatterns: string[] = [];
  
  // Analyze technical ability
  if (profile.technicalAbility === 'developer') {
    strengths.push('Technical execution');
    idealModels.push('SaaS', 'Developer tools');
  } else if (profile.technicalAbility === 'no-code') {
    strengths.push('No-code tool proficiency');
    idealModels.push('Micro-SaaS', 'Automation services');
  } else {
    blindSpots.push('Technical execution');
    antiPatterns.push('Code-heavy products');
  }
  
  // Analyze marketing comfort
  if (profile.marketingComfort >= 7) {
    strengths.push('Marketing & distribution');
    idealModels.push('Content business', 'Audience-first products');
  } else if (profile.marketingComfort <= 3) {
    blindSpots.push('Marketing & promotion');
    antiPatterns.push('Consumer products requiring viral growth');
  }
  
  // Analyze sales experience
  if (profile.hasSalesExperience) {
    strengths.push('Sales & closing');
    idealModels.push('Service business', 'B2B sales');
  }
  
  // Analyze audience
  if (profile.existingAudience.hasAudience && (profile.existingAudience.size || 0) > 1000) {
    strengths.push('Existing distribution');
    idealModels.push('Info products', 'Community-based business');
  }
  
  // Analyze risk tolerance
  if (profile.riskTolerance >= 7) {
    strengths.push('Risk-taking ability');
  } else if (profile.riskTolerance <= 3) {
    antiPatterns.push('High-burn ventures');
    idealModels.push('Low-risk service business');
  }
  
  // Analyze time constraints
  if (profile.hoursPerWeek < 10) {
    antiPatterns.push('Time-intensive operations');
    idealModels.push('Passive income products', 'Automated systems');
  } else if (profile.hoursPerWeek >= 30) {
    idealModels.push('Full-time venture');
  }
  
  // Analyze capital
  if (profile.capitalAvailable === '$0' || profile.capitalAvailable === '<$1k') {
    antiPatterns.push('Capital-intensive businesses');
    idealModels.push('Service-first model', 'Bootstrap-friendly');
  }
  
  // Analyze personality
  if (profile.personalityType.builderVsOptimizer <= 4) {
    strengths.push('Building from scratch');
  } else {
    strengths.push('Optimizing existing systems');
  }
  
  if (profile.personalityType.structureVsAmbiguity <= 4) {
    antiPatterns.push('Highly ambiguous markets');
  }
  
  // Calculate weekly capacity score
  const capacityScore = Math.min(10, Math.round(
    (profile.hoursPerWeek / 40) * 5 +
    (profile.stressTolerance / 10) * 3 +
    (profile.needsPredictability ? 0 : 2)
  ));
  
  // Determine founder type
  const founderType = determineFounderType(profile, strengths);
  
  return {
    founderType,
    executionStrengths: strengths.slice(0, 4),
    blindSpots: blindSpots.slice(0, 3),
    idealBusinessModels: [...new Set(idealModels)].slice(0, 4),
    antiPatterns: [...new Set(antiPatterns)].slice(0, 3),
    weeklyCapacityScore: capacityScore,
  };
}

function determineFounderType(profile: FounderProfile, strengths: string[]): string {
  const parts: string[] = [];
  
  // Capital descriptor
  if (profile.capitalAvailable === '$0' || profile.capitalAvailable === '<$1k') {
    parts.push('Bootstrap');
  } else if (profile.capitalAvailable === '$5k+') {
    parts.push('Funded');
  }
  
  // Technical descriptor
  if (profile.technicalAbility === 'developer') {
    parts.push('Technical');
  } else if (profile.technicalAbility === 'no-code') {
    parts.push('No-Code');
  } else {
    parts.push('Non-Technical');
  }
  
  // Role descriptor
  if (profile.personalityType.builderVsOptimizer <= 4) {
    parts.push('Builder');
  } else {
    parts.push('Operator');
  }
  
  return parts.join(' ');
}

// Sample idea database
const ideaDatabase: Omit<BusinessIdea, 'matchScore' | 'whyYou'>[] = [
  {
    id: 'newsletter-niche',
    title: 'Niche Newsletter Business',
    tagline: 'Turn expertise into recurring revenue through focused content',
    category: 'Content',
    problemStatement: 'Professionals in specific industries lack curated, actionable insights delivered consistently.',
    targetCustomer: 'Mid-career professionals in a specific niche (finance, HR, marketing ops, etc.)',
    solution: 'A premium newsletter that delivers 1-2 high-value insights per week, monetized through subscriptions or sponsorships.',
    requiredSkills: ['Writing', 'Industry expertise', 'Basic marketing'],
    capitalNeeded: '$0-$100',
    timeToFirstRevenue: '2-4 weeks',
    riskLevel: 'low',
    executionComplexity: 'simple',
    revenueModel: 'Paid subscriptions ($5-15/month) or sponsorships ($200-2000/issue)',
    potentialMonthlyRevenue: '$1,000 - $10,000',
    mvpScope: [
      'Pick a niche you know well',
      'Set up Substack or Beehiiv (free)',
      'Write 3 sample issues',
      'Share with 50 people in your network',
    ],
    goToMarketWedge: 'Start by offering free content to build initial audience, convert 5-10% to paid after 8 issues.',
    sevenDayPlan: [
      'Day 1: Define niche and unique angle',
      'Day 2: Set up newsletter platform',
      'Day 3-4: Write first 2 issues',
      'Day 5: Create simple landing page',
      'Day 6: Share with network, post in relevant communities',
      'Day 7: Send first issue, gather feedback',
    ],
    killCriteria: [
      'Less than 100 subscribers after 4 weeks',
      'Open rate below 30%',
      'No one willing to pay after 2 months',
    ],
    whyNow: 'Newsletter monetization tools have matured. Readers pay for focused, high-quality content.',
  },
  {
    id: 'micro-saas-automation',
    title: 'Micro-SaaS Automation Tool',
    tagline: 'Solve one painful workflow problem for a specific role',
    category: 'SaaS',
    problemStatement: 'Teams waste hours on repetitive tasks that could be automated with simple tooling.',
    targetCustomer: 'Operations managers, recruiters, or marketers at SMBs',
    solution: 'A focused tool that automates one specific workflow (e.g., candidate outreach, report generation, data cleanup).',
    requiredSkills: ['No-code/low-code', 'Understanding of target workflow'],
    capitalNeeded: '$0-$500',
    timeToFirstRevenue: '4-8 weeks',
    riskLevel: 'medium',
    executionComplexity: 'moderate',
    revenueModel: 'SaaS subscription ($29-99/month per seat)',
    potentialMonthlyRevenue: '$2,000 - $20,000',
    mvpScope: [
      'Interview 5-10 people with the problem',
      'Build MVP with no-code tools (Bubble, Retool)',
      'Manual backend processes are fine initially',
      'Charge from day 1',
    ],
    goToMarketWedge: 'Find where your target users complain online (Reddit, Slack communities). Offer to solve their problem.',
    sevenDayPlan: [
      'Day 1-2: Talk to 5 potential users, validate problem',
      'Day 3-4: Design solution, create mockups',
      'Day 5-6: Build functional MVP',
      'Day 7: Get first beta user, gather feedback',
    ],
    killCriteria: [
      'No one willing to pay after 10 conversations',
      'Problem not painful enough to switch tools',
      'Technical complexity exceeds your ability',
    ],
    whyNow: 'No-code tools make it possible to build and iterate without engineering resources.',
  },
  {
    id: 'productized-service',
    title: 'Productized Service',
    tagline: 'Package your expertise as a fixed-price, repeatable service',
    category: 'Service',
    problemStatement: 'Businesses need specialized help but hate unpredictable freelancer pricing and scope creep.',
    targetCustomer: 'Small business owners or startup founders needing specific expertise',
    solution: 'A fixed-scope, fixed-price service delivered consistently (e.g., "Website in a week for $2,000").',
    requiredSkills: ['Domain expertise', 'Basic project management'],
    capitalNeeded: '$0-$200',
    timeToFirstRevenue: '1-2 weeks',
    riskLevel: 'low',
    executionComplexity: 'simple',
    revenueModel: 'Fixed project fees ($500-$5,000) or monthly retainers',
    potentialMonthlyRevenue: '$3,000 - $15,000',
    mvpScope: [
      'Define exactly what you deliver',
      'Set fixed price and timeline',
      'Create simple sales page',
      'Reach out to 20 potential clients',
    ],
    goToMarketWedge: 'Leverage existing network. Offer "founding client" discount for first 3 customers.',
    sevenDayPlan: [
      'Day 1: Define service scope and pricing',
      'Day 2: Create Carrd or Notion landing page',
      'Day 3-4: Reach out to 20 people in network',
      'Day 5: Refine pitch based on objections',
      'Day 6: Follow up with interested leads',
      'Day 7: Close first client or schedule calls',
    ],
    killCriteria: [
      'No interest after 30 outreach attempts',
      'Price too low to be sustainable',
      'Scope too variable to standardize',
    ],
    whyNow: 'Businesses increasingly prefer predictable costs and outcomes over open-ended consulting.',
  },
  {
    id: 'digital-templates',
    title: 'Digital Templates & Tools',
    tagline: 'Create once, sell forever with high-value digital products',
    category: 'Product',
    problemStatement: 'Professionals need ready-made frameworks but building from scratch wastes time.',
    targetCustomer: 'Professionals who value their time (consultants, marketers, project managers)',
    solution: 'Premium templates, spreadsheets, or Notion setups that solve specific problems.',
    requiredSkills: ['Domain expertise', 'Basic design sense'],
    capitalNeeded: '$0-$100',
    timeToFirstRevenue: '2-4 weeks',
    riskLevel: 'low',
    executionComplexity: 'simple',
    revenueModel: 'One-time purchases ($19-199) via Gumroad or Lemonsqueezy',
    potentialMonthlyRevenue: '$500 - $5,000',
    mvpScope: [
      'Identify problem you solve repeatedly',
      'Create polished template or tool',
      'Write compelling sales page',
      'Launch to existing audience or communities',
    ],
    goToMarketWedge: 'Share free samples on Twitter/LinkedIn. Let quality drive word-of-mouth.',
    sevenDayPlan: [
      'Day 1: Identify 3 template ideas, validate with audience',
      'Day 2-3: Build the most requested template',
      'Day 4: Create preview graphics and sales copy',
      'Day 5: Set up Gumroad store',
      'Day 6: Create launch content',
      'Day 7: Launch and promote',
    ],
    killCriteria: [
      'Less than 10 sales in first month',
      'High refund rate (>10%)',
      'Market too crowded with free alternatives',
    ],
    whyNow: 'Creator economy tools make selling digital products trivially easy.',
  },
  {
    id: 'community-platform',
    title: 'Paid Community',
    tagline: 'Build a tribe around a shared interest or goal',
    category: 'Community',
    problemStatement: 'Professionals feel isolated and lack peer support for specific challenges.',
    targetCustomer: 'People with shared identity or goal (indie hackers, first-time managers, career changers)',
    solution: 'A curated community with exclusive content, events, and peer connections.',
    requiredSkills: ['Community building', 'Content creation', 'Facilitation'],
    capitalNeeded: '$0-$500',
    timeToFirstRevenue: '4-8 weeks',
    riskLevel: 'medium',
    executionComplexity: 'moderate',
    revenueModel: 'Monthly membership ($20-100/month)',
    potentialMonthlyRevenue: '$1,000 - $10,000',
    mvpScope: [
      'Define the tribe identity clearly',
      'Start with free Discord/Slack',
      'Host weekly calls or AMAs',
      'Convert engaged members to paid tier',
    ],
    goToMarketWedge: 'Build in public on Twitter/LinkedIn. Let your journey attract others on similar paths.',
    sevenDayPlan: [
      'Day 1: Define community identity and value prop',
      'Day 2: Set up Circle, Discord, or Slack',
      'Day 3: Invite 20 people personally',
      'Day 4: Create welcome content',
      'Day 5: Host first event or discussion',
      'Day 6: Gather feedback, iterate',
      'Day 7: Plan paid tier structure',
    ],
    killCriteria: [
      'Less than 30 engaged members after 6 weeks',
      'Conversations die without your constant input',
      'No one willing to pay for premium access',
    ],
    whyNow: 'Remote work created demand for curated professional connections.',
  },
];

// Generate a matching idea based on founder profile
export function generateMatchingIdea(
  profile: FounderProfile,
  summary: FounderProfileSummary,
  dismissedIds: string[] = []
): BusinessIdea | null {
  const availableIdeas = ideaDatabase.filter(idea => !dismissedIds.includes(idea.id));
  
  if (availableIdeas.length === 0) return null;
  
  // Score each idea
  const scoredIdeas = availableIdeas.map(idea => {
    let score = 50; // Base score
    
    // Time availability
    if (profile.hoursPerWeek < 10 && idea.executionComplexity === 'simple') score += 15;
    if (profile.hoursPerWeek >= 20 && idea.executionComplexity !== 'simple') score += 10;
    
    // Capital match
    if ((profile.capitalAvailable === '$0' || profile.capitalAvailable === '<$1k') && 
        idea.capitalNeeded.includes('$0')) score += 15;
    
    // Risk tolerance
    if (profile.riskTolerance >= 7 && idea.riskLevel === 'high') score += 10;
    if (profile.riskTolerance <= 3 && idea.riskLevel === 'low') score += 15;
    
    // Technical ability
    if (profile.technicalAbility === 'developer' && idea.category === 'SaaS') score += 15;
    if (profile.technicalAbility === 'none' && idea.executionComplexity === 'simple') score += 10;
    if (profile.technicalAbility === 'no-code' && idea.category === 'SaaS') score += 10;
    
    // Marketing comfort
    if (profile.marketingComfort >= 7 && idea.category === 'Content') score += 15;
    if (profile.marketingComfort >= 7 && idea.category === 'Community') score += 10;
    
    // Writing skills
    if (profile.hasWritingSkills && idea.requiredSkills.includes('Writing')) score += 15;
    
    // Sales experience
    if (profile.hasSalesExperience && idea.category === 'Service') score += 15;
    
    // Existing audience
    if (profile.existingAudience.hasAudience && idea.category === 'Content') score += 20;
    if (profile.existingAudience.hasAudience && idea.category === 'Community') score += 15;
    
    // Time horizon
    if (profile.timeHorizon === 'quick-cash' && idea.timeToFirstRevenue.includes('week')) score += 15;
    
    // Business type preference
    if (profile.preferredBusinessType === 'b2b' && idea.category === 'Service') score += 10;
    
    // Solo preference
    if (profile.teamPreference === 'solo' && idea.executionComplexity !== 'complex') score += 10;
    
    return { ...idea, score };
  });
  
  // Sort by score and pick the best
  scoredIdeas.sort((a, b) => b.score - a.score);
  const bestIdea = scoredIdeas[0];
  
  // Generate personalized "why you" message
  const whyYou = generateWhyYou(profile, summary, bestIdea);
  
  return {
    ...bestIdea,
    matchScore: Math.min(100, bestIdea.score),
    whyYou,
  };
}

function generateWhyYou(
  profile: FounderProfile, 
  summary: FounderProfileSummary, 
  idea: Omit<BusinessIdea, 'matchScore' | 'whyYou'>
): string {
  const reasons: string[] = [];
  
  // Time match
  if (profile.hoursPerWeek < 15) {
    reasons.push(`With ${profile.hoursPerWeek} hours/week available, this ${idea.executionComplexity} execution model fits your schedule.`);
  } else {
    reasons.push(`Your ${profile.hoursPerWeek} hours/week gives you enough runway to build this properly.`);
  }
  
  // Capital match
  if (idea.capitalNeeded.includes('$0')) {
    reasons.push('Zero upfront investment means you can start today.');
  }
  
  // Skills match
  if (profile.hasWritingSkills && idea.requiredSkills.includes('Writing')) {
    reasons.push('Your writing skills are the core asset this business needs.');
  }
  if (profile.hasSalesExperience && idea.category === 'Service') {
    reasons.push('Your sales experience will help you close clients quickly.');
  }
  if (profile.existingAudience.hasAudience) {
    reasons.push(`Your existing audience of ${profile.existingAudience.size?.toLocaleString() || 'followers'} gives you instant distribution.`);
  }
  
  // Risk match
  if (profile.riskTolerance <= 4 && idea.riskLevel === 'low') {
    reasons.push('The low-risk nature matches your preference for stability.');
  }
  
  return reasons.slice(0, 3).join(' ');
}
