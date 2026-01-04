import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { QuestionStep, FounderProfile } from '@/types/founder';
import { cn } from '@/lib/utils';

const questionSteps: QuestionStep[] = [
  // Background
  {
    id: 'employment',
    category: 'background',
    type: 'choice',
    question: "What's your current work situation?",
    subtext: "This helps us understand your time and financial flexibility.",
    options: [
      { value: 'employed', label: 'Employed full-time', icon: '💼' },
      { value: 'self-employed', label: 'Self-employed / Freelance', icon: '🏠' },
      { value: 'unemployed', label: 'Between jobs', icon: '🔄' },
      { value: 'student', label: 'Student', icon: '📚' },
      { value: 'retired', label: 'Retired', icon: '🌴' },
    ],
    required: true,
  },
  {
    id: 'day-job',
    category: 'background',
    type: 'text',
    question: "What's your day job?",
    subtext: "What do you do for work? This helps us find ideas that leverage your existing expertise.",
    textConfig: { placeholder: "e.g., Marketing manager at a SaaS company" },
    required: false,
  },
  {
    id: 'location',
    category: 'background',
    type: 'text',
    question: "Where are you located?",
    subtext: "Some ideas work better in certain markets or time zones.",
    textConfig: { placeholder: "e.g., Austin, TX or Remote" },
    required: false,
  },
  {
    id: 'hours',
    category: 'background',
    type: 'hours-slider',
    question: "How many hours per week can you dedicate?",
    subtext: "Be realistic—consistency beats intensity.",
    sliderConfig: { min: 1, max: 50, step: 1, minLabel: '1 hr', maxLabel: '50+ hrs', showValue: true },
    required: true,
  },
  {
    id: 'income-goal',
    category: 'background',
    type: 'choice',
    question: "What's your monthly income goal from this venture?",
    subtext: "Dream big, but let's start with what matters to you now.",
    options: [
      { value: '1000', label: '$1,000/mo', description: 'Side income' },
      { value: '3000', label: '$3,000/mo', description: 'Meaningful revenue' },
      { value: '5000', label: '$5,000/mo', description: 'Could quit my job' },
      { value: '10000', label: '$10,000+/mo', description: 'Full business' },
    ],
    required: true,
  },
  {
    id: 'risk',
    category: 'background',
    type: 'slider',
    question: "How much risk are you comfortable with?",
    subtext: "There's no wrong answer. Some great businesses are low-risk.",
    sliderConfig: { 
      min: 1, 
      max: 10, 
      step: 1, 
      minLabel: 'Play it safe', 
      maxLabel: 'Swing big',
      showValue: false,
      labels: [
        { position: 0, label: 'Safe bets only' },
        { position: 50, label: 'Balanced approach' },
        { position: 100, label: 'High risk, high reward' },
      ]
    },
    required: true,
  },
  {
    id: 'capital',
    category: 'background',
    type: 'choice',
    question: "How much capital can you invest upfront?",
    subtext: "Many great businesses start with $0. Be honest.",
    options: [
      { value: '$0', label: '$0', description: 'Sweat equity only' },
      { value: '<$1k', label: 'Under $1,000', description: 'Minimal tools' },
      { value: '$1k-$5k', label: '$1,000 - $5,000', description: 'Some runway' },
      { value: '$5k+', label: '$5,000+', description: 'Real investment' },
    ],
    required: true,
  },
  
  // Skills
  {
    id: 'technical',
    category: 'skills',
    type: 'choice',
    question: "What's your technical ability?",
    subtext: "AI tools and no-code count! Knowing your tools matters.",
    options: [
      { value: 'none', label: 'Not technical', description: "I hire for tech work", icon: '📝' },
      { value: 'no-code', label: 'No-code proficient', description: 'Bubble, Webflow, Zapier', icon: '⚡' },
      { value: 'ai-tools', label: 'AI coding tools', description: 'Lovable, Bolt, Replit, Cursor', icon: '🤖' },
      { value: 'some-code', label: 'Some coding', description: 'Can modify code, not build from scratch', icon: '🔧' },
      { value: 'developer', label: 'Developer', description: 'Can build software independently', icon: '💻' },
    ],
    required: true,
  },
  {
    id: 'tools-confident',
    category: 'skills',
    type: 'text',
    question: "What tools do you already use confidently?",
    subtext: "No-code tools, CRM, email, automation, AI tools, etc.",
    textConfig: { placeholder: "e.g., Notion, Airtable, Zapier, ChatGPT, Figma...", multiline: true },
    required: false,
  },
  {
    id: 'paid-skills',
    category: 'skills',
    type: 'text',
    question: "What have you gotten paid to do?",
    subtext: "These are your proven skills that others value.",
    textConfig: { placeholder: "e.g., Writing, project management, design, sales calls...", multiline: true },
    required: false,
  },
  {
    id: 'expertise',
    category: 'skills',
    type: 'text',
    question: "What do people ask you for help with?",
    subtext: "What comes naturally to you that others find difficult?",
    textConfig: { placeholder: "e.g., Explaining complex topics, organizing events, fixing tech issues...", multiline: true },
    required: false,
  },
  {
    id: 'marketing',
    category: 'skills',
    type: 'slider',
    question: "How comfortable are you with marketing?",
    subtext: "Can you get the word out about your product?",
    sliderConfig: { 
      min: 1, 
      max: 10, 
      step: 1, 
      minLabel: 'Hate it', 
      maxLabel: 'Love it',
      showValue: false,
      labels: [
        { position: 0, label: 'Avoid at all costs' },
        { position: 50, label: 'Can do it if needed' },
        { position: 100, label: 'Natural at it' },
      ]
    },
    required: true,
  },
  {
    id: 'content-skills',
    category: 'skills',
    type: 'multi-select',
    question: "What content can you create?",
    subtext: "Select all that apply. These are distribution assets.",
    options: [
      { value: 'writing', label: 'Writing', description: 'Articles, newsletters, tweets' },
      { value: 'video', label: 'Video', description: 'YouTube, TikTok, Loom' },
      { value: 'sales', label: 'Sales', description: 'Calls, demos, closing' },
      { value: 'none', label: "None of these", description: "I'll figure it out" },
    ],
    required: true,
  },
  {
    id: 'audience',
    category: 'skills',
    type: 'choice',
    question: "Do you have an existing audience?",
    subtext: "Social followers, email list, community—anything counts.",
    options: [
      { value: 'none', label: 'No audience yet', description: 'Starting from zero' },
      { value: 'small', label: 'Small (100-1K)', description: 'Some followers/subscribers' },
      { value: 'medium', label: 'Medium (1K-10K)', description: 'Real engagement' },
      { value: 'large', label: 'Large (10K+)', description: 'Established presence' },
    ],
    required: true,
  },
  
  // Interests & Market
  {
    id: 'interests',
    category: 'market',
    type: 'text',
    question: "What do you enjoy outside of work?",
    subtext: "If money were no object, how would you spend your time?",
    textConfig: { placeholder: "e.g., Photography, fitness, gaming, cooking, travel...", multiline: true },
    required: false,
  },
  {
    id: 'accessible-industries',
    category: 'market',
    type: 'text',
    question: "What industries do you already have access to?",
    subtext: "Through work, friends, family, past jobs, or hobbies.",
    textConfig: { placeholder: "e.g., Healthcare through my spouse, real estate from a past job...", multiline: true },
    required: false,
  },
  {
    id: 'business-connections',
    category: 'market',
    type: 'text',
    question: "Who do you talk to weekly that runs a business?",
    subtext: "Personal connections to potential customers are gold.",
    textConfig: { placeholder: "e.g., My neighbor runs a gym, my friend owns a restaurant...", multiline: true },
    required: false,
  },
  {
    id: 'automation-insight',
    category: 'market',
    type: 'text',
    question: 'Have you ever thought "This should be automated"?',
    subtext: "At work or in life—those moments often hide business ideas.",
    textConfig: { placeholder: "e.g., Scheduling patient follow-ups, tracking inventory, expense reports...", multiline: true },
    required: false,
  },
  
  // Constraints
  {
    id: 'obligations',
    category: 'constraints',
    type: 'binary',
    question: "Do you have family obligations that limit your time?",
    subtext: "Kids, caregiving, etc. No judgment—just helps us match better.",
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
    required: true,
  },
  {
    id: 'predictability',
    category: 'constraints',
    type: 'trade-off',
    question: "What matters more to you?",
    tradeOffConfig: {
      optionA: { value: 'predictable', label: 'Predictable income', description: 'Stable, slower growth' },
      optionB: { value: 'upside', label: 'High upside', description: 'Variable, bigger wins' },
    },
    required: true,
  },
  {
    id: 'stress',
    category: 'constraints',
    type: 'slider',
    question: "What's your stress tolerance?",
    subtext: "Some businesses are calmer than others.",
    sliderConfig: { 
      min: 1, 
      max: 10, 
      step: 1, 
      minLabel: 'Keep it calm', 
      maxLabel: 'Bring the chaos',
      showValue: false,
      labels: [
        { position: 0, label: 'Low stress only' },
        { position: 50, label: 'Moderate is fine' },
        { position: 100, label: 'Thrive under pressure' },
      ]
    },
    required: true,
  },
  
  // Preferences
  {
    id: 'selling-preference',
    category: 'preferences',
    type: 'choice',
    question: "Which sounds more tolerable to you?",
    subtext: "There's no wrong answer—just different paths.",
    options: [
      { value: 'b2b', label: 'Selling to businesses', description: 'Bigger deals, longer sales cycles' },
      { value: 'b2c', label: 'Selling to consumers', description: 'More customers, smaller tickets' },
      { value: 'teaching', label: 'Teaching / educating', description: 'Courses, content, coaching' },
      { value: 'mixed', label: 'Mix of everything', description: "I'm flexible" },
    ],
    required: true,
  },
  {
    id: 'business-model',
    category: 'preferences',
    type: 'multi-select',
    question: "What type of business appeals to you?",
    subtext: "Select all that interest you.",
    options: [
      { value: 'saas', label: 'SaaS / Software', description: 'Recurring revenue' },
      { value: 'service', label: 'Service business', description: 'Trade time for money' },
      { value: 'content', label: 'Content / Media', description: 'Audience-based' },
      { value: 'product', label: 'Digital products', description: 'Create once, sell forever' },
      { value: 'marketplace', label: 'Marketplace', description: 'Connect buyers & sellers' },
    ],
    required: true,
  },
  {
    id: 'open-to-service',
    category: 'preferences',
    type: 'binary',
    question: 'Are you open to starting as a "done-for-you" service?',
    subtext: "Many successful products started as services first.",
    options: [
      { value: 'yes', label: 'Yes, good way to learn' },
      { value: 'no', label: 'No, want to skip that' },
    ],
    required: true,
  },
  {
    id: 'build-in-public',
    category: 'preferences',
    type: 'binary',
    question: "Do you want to build in public or quietly?",
    subtext: "Building in public can help with marketing but isn't for everyone.",
    options: [
      { value: 'yes', label: 'Build in public' },
      { value: 'no', label: 'Build quietly' },
    ],
    required: true,
  },
  {
    id: 'time-horizon',
    category: 'preferences',
    type: 'choice',
    question: "What's your timeline?",
    options: [
      { value: 'quick-cash', label: 'Quick wins', description: 'Revenue in weeks, not months' },
      { value: 'long-term', label: 'Long-term asset', description: 'Build something lasting' },
      { value: 'flexible', label: 'Flexible', description: 'Show me both' },
    ],
    required: true,
  },
  
  // Personality
  {
    id: 'builder-operator',
    category: 'personality',
    type: 'slider',
    question: "Are you a builder or an operator?",
    subtext: "Builders create from scratch. Operators optimize and scale.",
    sliderConfig: { 
      min: 1, 
      max: 10, 
      step: 1, 
      minLabel: 'Builder', 
      maxLabel: 'Operator',
      showValue: false,
      labels: [
        { position: 0, label: 'Love creating new things' },
        { position: 50, label: 'Both equally' },
        { position: 100, label: 'Love optimizing systems' },
      ]
    },
    required: true,
  },
  {
    id: 'solo-team',
    category: 'personality',
    type: 'choice',
    question: "How do you prefer to work?",
    options: [
      { value: 'solo', label: 'Solo', description: 'Full control, all responsibility' },
      { value: 'team', label: 'With a team', description: 'Delegate, collaborate' },
      { value: 'either', label: 'Either works', description: 'Depends on the opportunity' },
    ],
    required: true,
  },
];

interface QuestionnaireWizardProps {
  onComplete: (profile: FounderProfile) => void;
}

export function QuestionnaireWizard({ onComplete }: QuestionnaireWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  
  const currentQuestion = questionSteps[currentStep];
  const progress = ((currentStep + 1) / questionSteps.length) * 100;
  const isLastStep = currentStep === questionSteps.length - 1;
  
  const handleAnswer = (value: any) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
  };
  
  const canProceed = currentQuestion.required 
    ? answers[currentQuestion.id] !== undefined && answers[currentQuestion.id] !== ''
    : true;
  
  const handleNext = () => {
    if (isLastStep) {
      const profile = mapAnswersToProfile(answers);
      onComplete(profile);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Subtle gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-muted/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <header className="p-6 relative z-10">
        <div className="container mx-auto flex items-center justify-between">
          <span className="text-xl font-semibold">FounderFit</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {currentStep + 1} of {questionSteps.length}
            </span>
          </div>
        </div>
      </header>
      
      {/* Progress */}
      <div className="container mx-auto px-6 relative z-10">
        <Progress value={progress} className="h-1" />
      </div>
      
      {/* Question */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <QuestionRenderer
                question={currentQuestion}
                value={answers[currentQuestion.id]}
                onChange={handleAnswer}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      
      {/* Navigation */}
      <footer className="p-6 border-t border-border/50 bg-card/50 backdrop-blur-sm relative z-10">
        <div className="container mx-auto flex items-center justify-between max-w-2xl">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          
          <Button
            variant="wizard"
            onClick={handleNext}
            disabled={!canProceed}
            className="w-40"
          >
            {isLastStep ? 'See My Results' : 'Continue'}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </footer>
    </div>
  );
}

interface QuestionRendererProps {
  question: QuestionStep;
  value: any;
  onChange: (value: any) => void;
}

function QuestionRenderer({ question, value, onChange }: QuestionRendererProps) {
  return (
    <div className="text-center">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
        {question.question}
      </h2>
      {question.subtext && (
        <p className="text-muted-foreground mb-8">{question.subtext}</p>
      )}
      
      {question.type === 'choice' && (
        <ChoiceOptions
          options={question.options!}
          value={value}
          onChange={onChange}
        />
      )}
      
      {question.type === 'slider' && (
        <DescriptiveSlider
          config={question.sliderConfig!}
          value={value}
          onChange={onChange}
        />
      )}
      
      {question.type === 'hours-slider' && (
        <HoursSliderInput
          config={question.sliderConfig!}
          value={value}
          onChange={onChange}
        />
      )}
      
      {question.type === 'multi-select' && (
        <MultiSelectOptions
          options={question.options!}
          value={value || []}
          onChange={onChange}
        />
      )}
      
      {question.type === 'binary' && (
        <BinaryOptions
          options={question.options!}
          value={value}
          onChange={onChange}
        />
      )}
      
      {question.type === 'trade-off' && (
        <TradeOffOptions
          config={question.tradeOffConfig!}
          value={value}
          onChange={onChange}
        />
      )}
      
      {question.type === 'text' && (
        <TextInput
          config={question.textConfig!}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
}

function ChoiceOptions({ 
  options, 
  value, 
  onChange 
}: { 
  options: QuestionStep['options']; 
  value: string; 
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid gap-3 max-w-md mx-auto">
      {options?.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "p-4 rounded-xl border text-left transition-all duration-200",
            "hover:border-muted-foreground/50 hover:bg-secondary",
            value === option.value
              ? "border-foreground bg-secondary"
              : "border-border bg-card"
          )}
        >
          <div className="flex items-center gap-3">
            {option.icon && <span className="text-2xl">{option.icon}</span>}
            <div>
              <p className="font-medium">{option.label}</p>
              {option.description && (
                <p className="text-sm text-muted-foreground">{option.description}</p>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function HoursSliderInput({ 
  config, 
  value, 
  onChange 
}: { 
  config: NonNullable<QuestionStep['sliderConfig']>; 
  value: number; 
  onChange: (v: number) => void;
}) {
  const displayValue = value ?? config.min;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value);
    if (!isNaN(num)) {
      const clampedValue = Math.min(Math.max(num, config.min), config.max);
      onChange(clampedValue);
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-card border border-border/50 rounded-2xl p-8">
        {/* Number input */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Input
            type="number"
            value={displayValue}
            onChange={handleInputChange}
            min={config.min}
            max={config.max}
            className="w-24 text-center text-3xl font-semibold h-16 bg-secondary border-border"
          />
          <span className="text-xl text-muted-foreground">hours</span>
        </div>
        
        <Slider
          value={[displayValue]}
          onValueChange={([v]) => onChange(v)}
          min={config.min}
          max={config.max}
          step={config.step}
          className="mb-4"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{config.minLabel}</span>
          <span>{config.maxLabel}</span>
        </div>
      </div>
    </div>
  );
}

function DescriptiveSlider({ 
  config, 
  value, 
  onChange 
}: { 
  config: NonNullable<QuestionStep['sliderConfig']>; 
  value: number; 
  onChange: (v: number) => void;
}) {
  const displayValue = value ?? Math.round((config.max - config.min) / 2) + config.min;
  
  // Calculate position percentage
  const percentage = ((displayValue - config.min) / (config.max - config.min)) * 100;
  
  // Get the current label based on position
  const getCurrentLabel = () => {
    if (!config.labels || config.labels.length === 0) return null;
    
    // Find the closest label
    let closestLabel = config.labels[0];
    let minDistance = Math.abs(percentage - closestLabel.position);
    
    for (const label of config.labels) {
      const distance = Math.abs(percentage - label.position);
      if (distance < minDistance) {
        minDistance = distance;
        closestLabel = label;
      }
    }
    
    return closestLabel.label;
  };
  
  const currentLabel = getCurrentLabel();
  
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-card border border-border/50 rounded-2xl p-8">
        {/* Current state label */}
        {currentLabel && (
          <motion.div 
            key={currentLabel}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-medium text-foreground mb-6 min-h-[28px]"
          >
            {currentLabel}
          </motion.div>
        )}
        
        <Slider
          value={[displayValue]}
          onValueChange={([v]) => onChange(v)}
          min={config.min}
          max={config.max}
          step={config.step}
          className="mb-4"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{config.minLabel}</span>
          <span>{config.maxLabel}</span>
        </div>
      </div>
    </div>
  );
}

function MultiSelectOptions({ 
  options, 
  value, 
  onChange 
}: { 
  options: QuestionStep['options']; 
  value: string[]; 
  onChange: (v: string[]) => void;
}) {
  const toggleOption = (optionValue: string) => {
    if (optionValue === 'none') {
      onChange(['none']);
    } else {
      const newValue = value.filter(v => v !== 'none');
      if (newValue.includes(optionValue)) {
        onChange(newValue.filter(v => v !== optionValue));
      } else {
        onChange([...newValue, optionValue]);
      }
    }
  };
  
  return (
    <div className="grid sm:grid-cols-2 gap-3 max-w-lg mx-auto">
      {options?.map((option) => (
        <button
          key={option.value}
          onClick={() => toggleOption(option.value)}
          className={cn(
            "p-4 rounded-xl border text-left transition-all duration-200",
            "hover:border-muted-foreground/50 hover:bg-secondary",
            value.includes(option.value)
              ? "border-foreground bg-secondary"
              : "border-border bg-card"
          )}
        >
          <p className="font-medium">{option.label}</p>
          {option.description && (
            <p className="text-sm text-muted-foreground">{option.description}</p>
          )}
        </button>
      ))}
    </div>
  );
}

function BinaryOptions({ 
  options, 
  value, 
  onChange 
}: { 
  options: QuestionStep['options']; 
  value: string; 
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-4 justify-center flex-wrap">
      {options?.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "px-8 py-4 rounded-xl border text-lg font-medium transition-all duration-200",
            "hover:border-muted-foreground/50",
            value === option.value
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-card"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function TradeOffOptions({ 
  config, 
  value, 
  onChange 
}: { 
  config: QuestionStep['tradeOffConfig']; 
  value: string; 
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-4 max-w-lg mx-auto">
      {[config!.optionA, config!.optionB].map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "flex-1 p-6 rounded-xl border text-center transition-all duration-200",
            "hover:border-muted-foreground/50 hover:bg-secondary",
            value === option.value
              ? "border-foreground bg-secondary"
              : "border-border bg-card"
          )}
        >
          <p className="font-semibold mb-1">{option.label}</p>
          <p className="text-sm text-muted-foreground">{option.description}</p>
        </button>
      ))}
    </div>
  );
}

function TextInput({ 
  config, 
  value, 
  onChange 
}: { 
  config: NonNullable<QuestionStep['textConfig']>; 
  value: string; 
  onChange: (v: string) => void;
}) {
  return (
    <div className="max-w-md mx-auto">
      {config.multiline ? (
        <Textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={config.placeholder}
          className="min-h-[120px] bg-card border-border/50 text-base"
        />
      ) : (
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={config.placeholder}
          className="bg-card border-border/50 text-base h-12"
        />
      )}
    </div>
  );
}

function mapAnswersToProfile(answers: Record<string, any>): FounderProfile {
  return {
    employmentStatus: answers['employment'],
    hoursPerWeek: answers['hours'] || 10,
    monthlyIncomeGoal: parseInt(answers['income-goal']) || 3000,
    riskTolerance: answers['risk'] || 5,
    capitalAvailable: answers['capital'],
    location: answers['location'],
    dayJob: answers['day-job'],
    technicalAbility: answers['technical'],
    marketingComfort: answers['marketing'] || 5,
    hasWritingSkills: (answers['content-skills'] || []).includes('writing'),
    hasVideoSkills: (answers['content-skills'] || []).includes('video'),
    hasSalesExperience: (answers['content-skills'] || []).includes('sales'),
    existingAudience: {
      hasAudience: answers['audience'] !== 'none',
      size: answers['audience'] === 'small' ? 500 : answers['audience'] === 'medium' ? 5000 : answers['audience'] === 'large' ? 20000 : 0,
    },
    industryExperience: [],
    paidSkills: answers['paid-skills'] ? [answers['paid-skills']] : [],
    interests: answers['interests'] ? [answers['interests']] : [],
    expertise: answers['expertise'] ? [answers['expertise']] : [],
    toolsConfident: answers['tools-confident'] ? [answers['tools-confident']] : [],
    hasFamilyObligations: answers['obligations'] === 'yes',
    geographicLimits: false,
    hasLegalRestrictions: false,
    stressTolerance: answers['stress'] || 5,
    needsPredictability: answers['predictability'] === 'predictable',
    preferredBusinessType: answers['selling-preference'] === 'mixed' ? 'both' : (answers['selling-preference'] || 'both'),
    preferredModel: answers['business-model'] || [],
    timeHorizon: answers['time-horizon'],
    teamPreference: answers['solo-team'],
    rolePreference: 'both',
    sellingPreference: answers['selling-preference'],
    buildInPublic: answers['build-in-public'] === 'yes',
    openToService: answers['open-to-service'] === 'yes',
    accessibleIndustries: answers['accessible-industries'] ? [answers['accessible-industries']] : [],
    businessConnections: answers['business-connections'],
    automationInsight: answers['automation-insight'],
    personalityType: {
      builderVsOptimizer: answers['builder-operator'] || 5,
      visionaryVsExecutor: 5,
      structureVsAmbiguity: 5,
    },
  };
}
