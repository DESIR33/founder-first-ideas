import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FlaskConical, Zap, Eye, Clock, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/LandingSections';
import { useAuth } from '@/hooks/useAuth';

const experiments = [
  {
    status: 'Live',
    title: 'Idea Validator',
    description: 'Instant market validation using AI-powered competitor and demand analysis.',
    tag: 'AI Tool',
  },
  {
    status: 'Live',
    title: 'Name Generator',
    description: 'Generate brandable business names with domain availability checking.',
    tag: 'Micro Tool',
  },
  {
    status: 'Beta',
    title: 'Launch Checklist',
    description: 'Interactive pre-launch checklist with progress tracking.',
    tag: 'Productivity',
  },
  {
    status: 'Coming Soon',
    title: 'Revenue Calculator',
    description: 'Model different pricing strategies and project annual revenue.',
    tag: 'Finance',
  },
  {
    status: 'Coming Soon',
    title: 'Competitor Mapper',
    description: 'Visual competitive landscape analysis for any market.',
    tag: 'Research',
  },
  {
    status: 'Concept',
    title: 'Co-Founder Match',
    description: 'Find complementary co-founders based on skills and working style.',
    tag: 'Network',
  },
];

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'Live':
      return 'bg-accent/20 text-accent';
    case 'Beta':
      return 'bg-secondary text-foreground';
    case 'Coming Soon':
      return 'bg-secondary text-muted-foreground';
    default:
      return 'bg-secondary text-muted-foreground';
  }
};

export default function LabExperiments() {
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
                <FlaskConical className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium tracking-[0.15em] uppercase text-muted-foreground">
                Lab Experiments
              </p>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.1] mb-6"
            >
              Where ideas
              <br />
              <span className="text-muted-foreground">become tools</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-xl mb-10"
            >
              Early prototypes, micro-tools, and internal projects from the Hustling Labs team. Try them before anyone else.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center gap-6"
            >
              <Button 
                variant="default" 
                size="lg"
                onClick={handleGetStarted}
                className="group bg-foreground text-background hover:bg-foreground/90 px-8 py-6 text-base font-medium"
              >
                Explore the Lab
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Zap className="w-6 h-6 mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Ship Fast</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We build and release tools quickly, iterating based on real founder feedback.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Eye className="w-6 h-6 mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Early Access</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Be the first to try new tools and shape their development.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Lightbulb className="w-6 h-6 mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Request Features</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Got an idea? Tell us what to build next.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experiments Grid */}
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
              Current Experiments
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold">
              What we're working on
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {experiments.map((experiment, index) => (
              <motion.div
                key={experiment.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-background p-8 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-medium px-2 py-1 ${getStatusStyles(experiment.status)}`}>
                    {experiment.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {experiment.tag}
                  </span>
                </div>
                <h3 className="text-lg font-medium mb-2">{experiment.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{experiment.description}</p>
                {(experiment.status === 'Live' || experiment.status === 'Beta') && (
                  <button className="mt-6 flex items-center text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    Try it
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </button>
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
                Want early access?
              </h2>
              <p className="text-muted-foreground mb-10">
                Join the lab to get notified when new experiments launch.
              </p>
              <Button 
                variant="default"
                size="lg"
                onClick={handleGetStarted}
                className="group bg-foreground text-background hover:bg-foreground/90 px-8 py-6 text-base font-medium"
              >
                Join the Lab
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