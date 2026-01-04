import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { QuestionStep, FounderProfile } from '@/types/founder';
import { cn } from '@/lib/utils';

// Tool options for multi-select
const toolOptions = [
  { value: 'notion', label: 'Notion' },
  { value: 'airtable', label: 'Airtable' },
  { value: 'zapier', label: 'Zapier' },
  { value: 'make', label: 'Make' },
  { value: 'chatgpt', label: 'ChatGPT' },
  { value: 'claude', label: 'Claude' },
  { value: 'figma', label: 'Figma' },
  { value: 'canva', label: 'Canva' },
  { value: 'slack', label: 'Slack' },
  { value: 'hubspot', label: 'HubSpot' },
  { value: 'mailchimp', label: 'Mailchimp' },
  { value: 'stripe', label: 'Stripe' },
  { value: 'shopify', label: 'Shopify' },
  { value: 'wordpress', label: 'WordPress' },
  { value: 'webflow', label: 'Webflow' },
  { value: 'google-sheets', label: 'Google Sheets' },
  { value: 'excel', label: 'Excel' },
  { value: 'trello', label: 'Trello' },
];

// Suggestion chips for text inputs
const paidSkillsSuggestions = [
  'Writing', 'Design', 'Marketing', 'Sales', 'Project Management',
  'Data Analysis', 'Consulting', 'Teaching', 'Customer Support', 'Accounting'
];

const expertiseSuggestions = [
  'Explaining complex topics', 'Organizing events', 'Fixing tech issues',
  'Giving advice', 'Problem solving', 'Negotiating', 'Public speaking', 'Networking'
];

const questionSteps: QuestionStep[] = [
  // Essential questions only - 10 total
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
    type: 'multi-select',
    question: "What tools do you already use confidently?",
    subtext: "Select all that apply.",
    options: toolOptions.map(t => ({ value: t.value, label: t.label })),
    required: false,
  },
  {
    id: 'paid-skills',
    category: 'skills',
    type: 'text-with-chips',
    question: "What have you gotten paid to do?",
    subtext: "These are your proven skills that others value.",
    textConfig: { placeholder: "e.g., Writing, project management, design...", multiline: true },
    required: false,
  },
  {
    id: 'expertise',
    category: 'skills',
    type: 'text-with-chips',
    question: "What do people ask you for help with?",
    subtext: "What comes naturally to you that others find difficult?",
    textConfig: { placeholder: "e.g., Explaining complex topics, organizing events...", multiline: true },
    required: false,
  },
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
    ? answers[currentQuestion.id] !== undefined && answers[currentQuestion.id] !== '' && (Array.isArray(answers[currentQuestion.id]) ? answers[currentQuestion.id].length > 0 : true)
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 flex flex-col relative overflow-hidden">
      {/* Premium ambient glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-radial from-accent/8 via-accent/4 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-gradient-radial from-muted/30 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <header className="px-6 pt-8 pb-4 relative z-10">
        <div className="container mx-auto flex items-center justify-between max-w-2xl">
          <span className="text-lg font-semibold tracking-tight">FounderFit</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground bg-secondary/60 px-3 py-1.5 rounded-full">
              {currentStep + 1} / {questionSteps.length}
            </span>
          </div>
        </div>
      </header>
      
      {/* Progress - pill style */}
      <div className="container mx-auto px-6 max-w-2xl relative z-10">
        <div className="h-1.5 bg-secondary/60 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-accent/80 to-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>
      
      {/* Question */}
      <main className="flex-1 flex items-center justify-center px-6 py-8 relative z-10">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
      
      {/* Navigation - floating pill style */}
      <footer className="p-6 relative z-10">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-card/80 backdrop-blur-xl border border-border/30 rounded-2xl p-4 shadow-soft flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="rounded-xl text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            
            <div className="flex items-center gap-3">
              {!currentQuestion.required && !answers[currentQuestion.id] && (
                <Button
                  variant="ghost"
                  onClick={handleNext}
                  className="text-muted-foreground hover:text-foreground rounded-xl"
                >
                  Skip
                </Button>
              )}
              
              <Button
                variant="wizard"
                onClick={handleNext}
                disabled={!canProceed}
                className="min-w-[140px] rounded-xl bg-foreground text-background hover:bg-foreground/90 shadow-sm"
              >
                {isLastStep ? 'See My Results' : 'Continue'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
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
      <motion.h2 
        className="text-2xl sm:text-3xl font-semibold mb-3 tracking-tight"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        {question.question}
      </motion.h2>
      {question.subtext && (
        <motion.p 
          className="text-muted-foreground mb-10 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          {question.subtext}
        </motion.p>
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.35 }}
      >
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
        
        {question.type === 'text-with-chips' && (
          <TextInputWithChips
            config={question.textConfig!}
            value={value}
            onChange={onChange}
            suggestions={question.id === 'paid-skills' ? paidSkillsSuggestions : expertiseSuggestions}
          />
        )}
      </motion.div>
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
      {options?.map((option, index) => (
        <motion.button
          key={option.value}
          onClick={() => onChange(option.value)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          className={cn(
            "p-4 rounded-2xl border text-left transition-all duration-300 group",
            "hover:scale-[1.02] hover:shadow-soft",
            value === option.value
              ? "border-foreground/20 bg-foreground/5 shadow-soft"
              : "border-border/40 bg-card/60 backdrop-blur-sm hover:border-border/60 hover:bg-card/80"
          )}
        >
          <div className="flex items-center gap-4">
            {option.icon && (
              <span className="text-2xl w-10 h-10 flex items-center justify-center bg-secondary/60 rounded-xl">
                {option.icon}
              </span>
            )}
            <div className="flex-1">
              <p className="font-medium text-foreground">{option.label}</p>
              {option.description && (
                <p className="text-sm text-muted-foreground mt-0.5">{option.description}</p>
              )}
            </div>
            <div className={cn(
              "w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center",
              value === option.value
                ? "border-foreground bg-foreground"
                : "border-border/60 group-hover:border-muted-foreground/50"
            )}>
              {value === option.value && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 bg-background rounded-full"
                />
              )}
            </div>
          </div>
        </motion.button>
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
      <div className="bg-card/60 backdrop-blur-sm border border-border/30 rounded-3xl p-8 shadow-soft">
        {/* Number input - large pill style */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="relative">
            <Input
              type="number"
              value={displayValue}
              onChange={handleInputChange}
              min={config.min}
              max={config.max}
              className="w-28 text-center text-4xl font-semibold h-20 bg-secondary/50 border-border/30 rounded-2xl focus:ring-accent/30"
            />
          </div>
          <span className="text-lg text-muted-foreground font-medium">hours/week</span>
        </div>
        
        <div className="px-2">
          <Slider
            value={[displayValue]}
            onValueChange={([v]) => onChange(v)}
            min={config.min}
            max={config.max}
            step={config.step}
            className="mb-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground font-medium mt-2">
            <span className="bg-secondary/40 px-2 py-1 rounded-full">{config.minLabel}</span>
            <span className="bg-secondary/40 px-2 py-1 rounded-full">{config.maxLabel}</span>
          </div>
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
      <div className="bg-card/60 backdrop-blur-sm border border-border/30 rounded-3xl p-8 shadow-soft">
        {/* Current state label - pill style */}
        {currentLabel && (
          <motion.div 
            key={currentLabel}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="inline-block text-lg font-medium text-foreground mb-8 bg-secondary/50 px-5 py-2.5 rounded-full"
          >
            {currentLabel}
          </motion.div>
        )}
        
        <div className="px-2">
          <Slider
            value={[displayValue]}
            onValueChange={([v]) => onChange(v)}
            min={config.min}
            max={config.max}
            step={config.step}
            className="mb-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground font-medium mt-2">
            <span className="bg-secondary/40 px-2 py-1 rounded-full">{config.minLabel}</span>
            <span className="bg-secondary/40 px-2 py-1 rounded-full">{config.maxLabel}</span>
          </div>
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
    <div className="flex flex-wrap gap-2 max-w-xl mx-auto justify-center">
      {options?.map((option, index) => (
        <motion.button
          key={option.value}
          onClick={() => toggleOption(option.value)}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.02, duration: 0.2 }}
          className={cn(
            "px-4 py-2.5 rounded-full border text-sm font-medium transition-all duration-200",
            "hover:scale-105",
            value.includes(option.value)
              ? "border-foreground/30 bg-foreground text-background"
              : "border-border/40 bg-card/60 backdrop-blur-sm hover:border-border/60 hover:bg-card/80 text-foreground"
          )}
        >
          {option.label}
        </motion.button>
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
      {options?.map((option, index) => (
        <motion.button
          key={option.value}
          onClick={() => onChange(option.value)}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          className={cn(
            "px-8 py-4 rounded-2xl border text-lg font-medium transition-all duration-300",
            "hover:scale-[1.03] shadow-soft",
            value === option.value
              ? "border-foreground/20 bg-foreground text-background"
              : "border-border/40 bg-card/60 backdrop-blur-sm hover:border-border/60 hover:bg-card/80"
          )}
        >
          {option.label}
        </motion.button>
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
      {[config!.optionA, config!.optionB].map((option, index) => (
        <motion.button
          key={option.value}
          onClick={() => onChange(option.value)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          className={cn(
            "flex-1 p-6 rounded-2xl border text-center transition-all duration-300",
            "hover:scale-[1.02] shadow-soft",
            value === option.value
              ? "border-foreground/20 bg-foreground/5"
              : "border-border/40 bg-card/60 backdrop-blur-sm hover:border-border/60 hover:bg-card/80"
          )}
        >
          <p className="font-semibold mb-1 text-foreground">{option.label}</p>
          <p className="text-sm text-muted-foreground">{option.description}</p>
        </motion.button>
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
          className="min-h-[140px] bg-card/60 backdrop-blur-sm border-border/30 text-base rounded-2xl p-4 shadow-soft focus:ring-accent/30 resize-none"
        />
      ) : (
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={config.placeholder}
          className="bg-card/60 backdrop-blur-sm border-border/30 text-base h-14 rounded-2xl px-5 shadow-soft focus:ring-accent/30"
        />
      )}
    </div>
  );
}

function TextInputWithChips({ 
  config, 
  value, 
  onChange,
  suggestions
}: { 
  config: NonNullable<QuestionStep['textConfig']>; 
  value: string; 
  onChange: (v: string) => void;
  suggestions: string[];
}) {
  const handleChipClick = (chip: string) => {
    const currentValue = value || '';
    if (currentValue.toLowerCase().includes(chip.toLowerCase())) return;
    
    const separator = currentValue.trim() ? ', ' : '';
    onChange(currentValue + separator + chip);
  };
  
  return (
    <div className="max-w-md mx-auto space-y-4">
      <Textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={config.placeholder}
        className="min-h-[100px] bg-card/60 backdrop-blur-sm border-border/30 text-base rounded-2xl p-4 shadow-soft focus:ring-accent/30 resize-none"
      />
      
      <div className="flex flex-wrap gap-2 justify-center">
        {suggestions.map((chip, index) => (
          <motion.button
            key={chip}
            type="button"
            onClick={() => handleChipClick(chip)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03, duration: 0.2 }}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
              "border border-border/40 bg-secondary/40 text-muted-foreground",
              "hover:bg-secondary/60 hover:text-foreground hover:border-border/60",
              value?.toLowerCase().includes(chip.toLowerCase()) && "opacity-50 cursor-default"
            )}
          >
            + {chip}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function mapAnswersToProfile(answers: Record<string, any>): FounderProfile {
  return {
    employmentStatus: answers['employment'],
    hoursPerWeek: answers['hours'] || 10,
    monthlyIncomeGoal: parseInt(answers['income-goal']) || 3000,
    riskTolerance: 5,
    capitalAvailable: answers['capital'],
    location: undefined,
    dayJob: undefined,
    technicalAbility: answers['technical'],
    marketingComfort: 5,
    hasWritingSkills: false,
    hasVideoSkills: false,
    hasSalesExperience: false,
    existingAudience: {
      hasAudience: false,
      size: 0,
    },
    industryExperience: [],
    paidSkills: answers['paid-skills'] ? [answers['paid-skills']] : [],
    interests: [],
    expertise: answers['expertise'] ? [answers['expertise']] : [],
    toolsConfident: answers['tools-confident'] || [],
    hasFamilyObligations: false,
    geographicLimits: false,
    hasLegalRestrictions: false,
    stressTolerance: 5,
    needsPredictability: false,
    preferredBusinessType: answers['selling-preference'] === 'mixed' ? 'both' : (answers['selling-preference'] || 'both'),
    preferredModel: [],
    timeHorizon: answers['time-horizon'],
    teamPreference: 'either',
    rolePreference: 'both',
    sellingPreference: answers['selling-preference'],
    buildInPublic: false,
    openToService: true,
    accessibleIndustries: [],
    businessConnections: undefined,
    automationInsight: undefined,
    personalityType: {
      builderVsOptimizer: 5,
      visionaryVsExecutor: 5,
      structureVsAmbiguity: 5,
    },
  };
}
