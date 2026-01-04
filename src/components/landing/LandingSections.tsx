import { motion } from 'framer-motion';
import { ArrowRight, Target, Clock, Sparkles, Shield, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Subtle gradient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-muted/30 to-transparent rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="accent" className="mb-8">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Founder-first idea matching
            </Badge>
          </motion.div>
          
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.1] mb-6 tracking-tight"
          >
            Stop browsing ideas.
            <br />
            <span className="text-muted-foreground">Get ideas that fit you.</span>
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-xl mx-auto mb-10"
          >
            We learn who you are, what you can execute, and what you actually want—then deliver one high-quality business idea per week.
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
              5 minutes • Free forever
            </p>
          </motion.div>
          
          {/* Value props */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid sm:grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-border/50"
          >
            <ValueProp
              icon={<Target className="w-5 h-5" />}
              title="Personalized"
              description="Filtered by your skills and goals"
            />
            <ValueProp
              icon={<Clock className="w-5 h-5" />}
              title="Weekly delivery"
              description="One curated idea, no scrolling"
            />
            <ValueProp
              icon={<Shield className="w-5 h-5" />}
              title="Actionable"
              description="7-day plan with every idea"
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
    <div className="flex flex-col items-center text-center">
      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground mb-3">
        {icon}
      </div>
      <h3 className="font-medium mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Tell us about you',
      description: 'A friendly 5-minute questionnaire about your background and goals.',
    },
    {
      number: '02',
      title: 'Get your profile',
      description: 'We generate a profile that captures your unique strengths.',
    },
    {
      number: '03',
      title: 'Receive ideas',
      description: 'One high-quality idea per week, tailored to you.',
    },
    {
      number: '04',
      title: 'Start building',
      description: 'Each idea comes with a 7-day action plan.',
    },
  ];
  
  return (
    <section className="py-24 border-t border-border/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="muted" className="mb-4">How it works</Badge>
          <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
            From overwhelmed to focused
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            No more browsing endless idea lists. We do the matching.
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="text-4xl font-semibold text-muted/50 mb-4">
                {step.number}
              </div>
              <h3 className="font-medium mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-5 left-full w-full h-px bg-border -translate-x-4" />
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
    <section className="py-24 border-t border-border/50">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Why different</Badge>
            <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
              Others tell you what's trending.
              <br />
              <span className="text-muted-foreground">We tell you what to build.</span>
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-secondary/50 rounded-2xl p-6 border border-border/30">
              <p className="text-sm font-medium text-muted-foreground mb-4">Others</p>
              {comparisons.map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-2">
                  <div className="w-4 h-4 rounded-full border border-muted-foreground/30 mt-0.5" />
                  <span className="text-muted-foreground">{item.them}</span>
                </div>
              ))}
            </div>
            
            <div className="bg-card rounded-2xl p-6 border border-border">
              <p className="text-sm font-medium text-foreground mb-4">FounderFit</p>
              {comparisons.map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-2">
                  <CheckCircle2 className="w-4 h-4 text-foreground mt-0.5" />
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
    <section className="py-24 border-t border-border/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge variant="muted" className="mb-4">Who it's for</Badge>
          <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
            Built for people with real constraints
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Not everyone has 80 hours a week and $100K to burn.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
          {audiences.map((audience) => (
            <div
              key={audience.label}
              className="flex items-center gap-2 bg-secondary px-4 py-2.5 rounded-full border border-border/50"
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
    <section className="py-24 border-t border-border/50">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-card rounded-3xl p-12 border border-border"
          >
            <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
              Ready to find your idea?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Take our 5-minute questionnaire and get your first personalized idea today.
            </p>
            <Button 
              variant="hero" 
              size="xl" 
              onClick={onGetStarted}
            >
              Start the Questionnaire
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
