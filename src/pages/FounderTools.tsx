import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Wrench, FileText, PresentationIcon, Mail, Calculator, Bookmark, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/LandingSections';
import { useAuth } from '@/hooks/useAuth';

const tools = [
  {
    icon: FileText,
    title: 'Business Plan Templates',
    description: 'Lean canvas, one-pagers, and investor-ready documents.',
    available: true,
  },
  {
    icon: PresentationIcon,
    title: 'Pitch Deck Framework',
    description: 'Proven deck structure with slide-by-slide guidance.',
    available: true,
  },
  {
    icon: Mail,
    title: 'Outreach Templates',
    description: 'Cold email frameworks for investors, partners, and customers.',
    available: true,
  },
  {
    icon: Calculator,
    title: 'Financial Models',
    description: 'Revenue projections, unit economics, and runway calculators.',
    available: true,
  },
  {
    icon: Bookmark,
    title: 'Resource Library',
    description: 'Curated tools, services, and reading lists for founders.',
    available: true,
  },
  {
    icon: Lock,
    title: 'Legal Starter Kit',
    description: 'Essential contracts, terms, and incorporation guides.',
    available: false,
  },
];

const categories = [
  { name: 'Planning', count: 12 },
  { name: 'Fundraising', count: 8 },
  { name: 'Marketing', count: 15 },
  { name: 'Operations', count: 6 },
  { name: 'Legal', count: 4 },
];

export default function FounderTools() {
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
                <Wrench className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium tracking-[0.15em] uppercase text-muted-foreground">
                Founder Tools
              </p>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.1] mb-6"
            >
              The founder's
              <br />
              <span className="text-muted-foreground">toolkit</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-xl mb-10"
            >
              Templates, frameworks, and resources used by successful founders. Stop reinventing the wheel.
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
                Access Tools
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
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
              Available Tools
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold">
              Everything in one place
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-background p-8 hover:bg-secondary transition-colors relative"
              >
                <div className="flex items-start justify-between mb-4">
                  <tool.icon className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                  {!tool.available && (
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-1">
                      Coming Soon
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-medium mb-2">{tool.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{tool.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
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
              Browse by Category
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold">
              Organized for action
            </h2>
          </motion.div>

          <div className="flex flex-wrap gap-4">
            {categories.map((category, index) => (
              <motion.button
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group flex items-center gap-3 px-6 py-4 border border-border hover:bg-secondary transition-colors"
              >
                <span className="font-medium">{category.name}</span>
                <span className="text-sm text-muted-foreground">{category.count}</span>
              </motion.button>
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
                Get instant access
              </h2>
              <p className="text-muted-foreground mb-10">
                Join Hustling Labs to unlock the complete toolkit.
              </p>
              <Button 
                variant="default"
                size="lg"
                onClick={handleGetStarted}
                className="group bg-foreground text-background hover:bg-foreground/90 px-8 py-6 text-base font-medium"
              >
                Join Now
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