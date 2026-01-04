import { motion } from 'framer-motion';
import { ArrowRight, Target, Clock, Sparkles, Shield, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center gradient-hero overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-[20%] w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-[10%] w-96 h-96 bg-accent/3 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="accent" className="mb-6 px-4 py-1.5 text-sm">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Founder-first idea matching
            </Badge>
          </motion.div>
          
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-semibold leading-tight mb-6"
          >
            Stop browsing ideas.
            <br />
            <span className="text-accent">Get ideas that fit you.</span>
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            We learn who you are, what you can execute, and what you actually want—then deliver one high-quality business idea per week with a clear path to action.
          </motion.p>
          
          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button variant="hero" size="xl" onClick={onGetStarted}>
              Find My Business Idea
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
            <p className="text-sm text-muted-foreground">
              5 minutes • Free forever • No credit card
            </p>
          </motion.div>
          
          {/* Value props */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            <ValueProp
              icon={<Target className="w-5 h-5" />}
              title="Personalized to you"
              description="Filtered by your skills, constraints, and goals"
            />
            <ValueProp
              icon={<Clock className="w-5 h-5" />}
              title="One idea per week"
              description="Quality over quantity. No doom-scrolling."
            />
            <ValueProp
              icon={<Shield className="w-5 h-5" />}
              title="Actionable plans"
              description="7-day execution roadmap with every idea"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ValueProp({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-3">
        {icon}
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Tell us about you',
      description: 'A friendly 5-minute questionnaire about your background, skills, and goals.',
    },
    {
      number: '02',
      title: 'Get your founder profile',
      description: 'We generate a profile that captures your unique strengths and constraints.',
    },
    {
      number: '03',
      title: 'Receive matched ideas',
      description: 'One high-quality idea per week, tailored to what you can actually execute.',
    },
    {
      number: '04',
      title: 'Start building',
      description: 'Each idea comes with a 7-day action plan to get you moving.',
    },
  ];
  
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="muted" className="mb-4">How it works</Badge>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold mb-4">
            From overwhelmed to focused in minutes
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            No more browsing endless idea lists. We do the matching so you can focus on execution.
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="text-5xl font-serif font-bold text-accent/20 mb-4">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-px bg-border -translate-x-8" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DifferentiatorSection() {
  const comparisons = [
    { them: 'Trend-first recommendations', us: 'Founder-first matching' },
    { them: 'Endless idea lists to browse', us: 'One curated idea per week' },
    { them: 'Generic "hot" opportunities', us: 'Filtered by your capabilities' },
    { them: 'Hype-driven suggestions', us: 'Realistic execution plans' },
  ];
  
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Why different</Badge>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold mb-4">
              Other platforms tell you what's trending.
              <br />
              <span className="text-accent">We tell you what you should build.</span>
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-muted/50 rounded-xl p-6">
              <p className="text-sm font-medium text-muted-foreground mb-4">Others</p>
              {comparisons.map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-2">
                  <div className="w-4 h-4 rounded-full border border-muted-foreground/30 mt-0.5" />
                  <span className="text-muted-foreground">{item.them}</span>
                </div>
              ))}
            </div>
            
            <div className="bg-accent/5 border border-accent/20 rounded-xl p-6">
              <p className="text-sm font-medium text-accent mb-4">FounderFit</p>
              {comparisons.map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-2">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-0.5" />
                  <span className="font-medium">{item.us}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TargetAudienceSection() {
  const audiences = [
    { emoji: '🛠️', label: 'Builders & indie hackers' },
    { emoji: '👔', label: 'Busy professionals' },
    { emoji: '🎖️', label: 'Military & parents' },
    { emoji: '🎨', label: 'Content creators' },
    { emoji: '⚡', label: 'No-code founders' },
    { emoji: '🚀', label: 'First-time entrepreneurs' },
  ];
  
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="muted" className="mb-4">Who it's for</Badge>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold mb-4">
            Built for people with real constraints
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Not everyone has 80 hours a week and $100K to burn. We get it.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {audiences.map((audience) => (
            <div
              key={audience.label}
              className="flex items-center gap-2 bg-card px-4 py-2.5 rounded-full border shadow-card"
            >
              <span className="text-lg">{audience.emoji}</span>
              <span className="text-sm font-medium">{audience.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface CTASectionProps {
  onGetStarted: () => void;
}

export function CTASection({ onGetStarted }: CTASectionProps) {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-primary text-primary-foreground rounded-2xl p-12 shadow-elevated relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-serif font-semibold mb-4">
                Ready to find your business idea?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
                Take our 5-minute questionnaire and get your first personalized idea today—with a clear path to action.
              </p>
              <Button 
                variant="accent" 
                size="xl" 
                onClick={onGetStarted}
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Start the Questionnaire
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
