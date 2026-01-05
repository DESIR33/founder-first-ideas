import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Target, Sparkles, Clock, Shield, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/LandingSections';
import { useAuth } from '@/hooks/useAuth';

const features = [
  {
    icon: Target,
    title: 'Personalized Matching',
    description: 'Ideas are scored based on your unique skills, experience, capital, and time availability.',
  },
  {
    icon: Sparkles,
    title: 'Transparent Scoring',
    description: 'See exactly why each idea fits you with detailed breakdowns of boosts and penalties.',
  },
  {
    icon: Clock,
    title: 'Weekly Delivery',
    description: 'One high-quality idea per week, eliminating decision fatigue and endless browsing.',
  },
  {
    icon: Shield,
    title: 'Actionable Plans',
    description: 'Every idea includes a concrete first step and 7-day execution roadmap.',
  },
];

const process = [
  {
    step: '01',
    title: 'Complete Your Profile',
    description: 'A 5-minute questionnaire captures your background, skills, and constraints.',
  },
  {
    step: '02',
    title: 'AI Analyzes Your Fit',
    description: 'Our engine evaluates hundreds of business models against your unique profile.',
  },
  {
    step: '03',
    title: 'Receive Matched Ideas',
    description: 'Get personalized ideas with fit scores and detailed explanations.',
  },
  {
    step: '04',
    title: 'Take Action',
    description: 'Each idea includes a concrete first step to validate within 7 days.',
  },
];

export default function IdeaEngine() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleGetStarted = () => {
    if (!user) {
      navigate('/auth');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onGetStarted={handleGetStarted} />
      
      {/* Hero */}
      <section className="pt-32 pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-12 h-12 bg-secondary flex items-center justify-center">
                <Brain className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium tracking-[0.15em] uppercase text-muted-foreground">
                The Idea Engine
              </p>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.1] mb-6"
            >
              Startup ideas
              <br />
              <span className="text-muted-foreground">built around you</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-xl mb-10"
            >
              Stop browsing generic idea lists. Our engine learns who you are and delivers business concepts you can actually execute.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button 
                variant="default" 
                size="lg"
                onClick={handleGetStarted}
                className="group bg-foreground text-background hover:bg-foreground/90 px-8 py-6 text-base font-medium"
              >
                Find My Business Idea
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p className="text-sm font-medium tracking-[0.15em] uppercase text-muted-foreground mb-4">
              How It Works
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold">
              Founder-first matching
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <feature.icon className="w-6 h-6 mb-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p className="text-sm font-medium tracking-[0.15em] uppercase text-muted-foreground mb-4">
              The Process
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold">
              From profile to action
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <p className="text-4xl font-semibold text-muted/30 mb-4">{item.step}</p>
                <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                {index < process.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-px bg-border -translate-x-4" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
                Ready to find your idea?
              </h2>
              <p className="text-muted-foreground mb-10">
                Take our 5-minute questionnaire and get your first personalized idea today.
              </p>
              <Button 
                variant="default"
                size="lg"
                onClick={handleGetStarted}
                className="group bg-foreground text-background hover:bg-foreground/90 px-8 py-6 text-base font-medium"
              >
                Start the Questionnaire
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}