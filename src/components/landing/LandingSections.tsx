import { motion } from 'framer-motion';
import { ArrowRight, Brain, Package, Wrench, FlaskConical, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center">
      <div className="container mx-auto px-6 py-32">
        <div className="max-w-4xl">
          {/* Brand */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-sm font-medium tracking-[0.2em] uppercase text-muted-foreground mb-8"
          >
            Hustling Labs
          </motion.p>
          
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.05] mb-6"
          >
            Designing the Edge
            <br />
            <span className="text-muted-foreground">for Modern Founders</span>
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-xl mb-12"
          >
            Tools, insights, and frameworks built for founders who move with clarity — not chaos.
          </motion.p>
          
          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button 
              variant="default" 
              size="lg" 
              onClick={onGetStarted}
              className="group bg-foreground text-background hover:bg-foreground/90 px-8 py-6 text-base font-medium"
            >
              Explore the Tools
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const tools = [
  {
    icon: Brain,
    title: 'The Idea Engine',
    description: 'Get startup ideas personalized to your skills, experience, and assets.',
    href: '/idea-engine',
  },
  {
    icon: Package,
    title: 'Startup Blueprints',
    description: 'Execution-ready playbooks: MVP features, tech stack, pricing, positioning.',
    href: '/blueprints',
  },
  {
    icon: Wrench,
    title: 'Founder Tools',
    description: 'Exclusive templates, funding decks, outreach frameworks, and more.',
    href: '/tools',
  },
  {
    icon: FlaskConical,
    title: 'Lab Experiments',
    description: "Try early prototypes, microtools, and Hustling Labs' internal projects.",
    href: '/lab',
  },
];

export function ToolSuiteSection() {
  return (
    <section className="py-32 border-t border-border">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-sm font-medium tracking-[0.15em] uppercase text-muted-foreground mb-4">
            Tool Suite
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold">
            Everything you need to build smarter
          </h2>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-px bg-border">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                to={tool.href}
                className="group block bg-background p-10 hover:bg-secondary transition-colors duration-300"
              >
                <tool.icon className="w-6 h-6 mb-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                <h3 className="text-xl font-medium mb-3">{tool.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{tool.description}</p>
                <div className="mt-6 flex items-center text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ManifestoSection() {
  return (
    <section className="py-32 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-8 leading-tight"
          >
            We Don't Build Noise.
            <br />
            <span className="text-muted-foreground">We Build Leverage.</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            Most founders waste time building the wrong thing. Hustling Labs exists to eliminate that guesswork. We give you the clarity to build what works — and the tools to move fast.
          </motion.p>
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
    <section className="py-32 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
              Ready to Build Smarter?
            </h2>
            <p className="text-muted-foreground mb-10">
              We're quietly opening the doors. Get early access.
            </p>
            <Button 
              variant="default"
              size="lg"
              onClick={onGetStarted}
              className="group bg-foreground text-background hover:bg-foreground/90 px-8 py-6 text-base font-medium"
            >
              Join the Waitlist
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="py-16 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Navigation */}
          <nav className="flex flex-wrap gap-8 text-sm">
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <a href="#tools" className="text-muted-foreground hover:text-foreground transition-colors">
              Tools
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
            <a href="#terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </a>
          </nav>
          
          {/* Social */}
          <div className="flex items-center gap-6">
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        {/* Bottom line */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Quietly building the future.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Legacy exports for compatibility
export function HowItWorksSection() {
  return null;
}

export function DifferentiatorSection() {
  return null;
}

export function TargetAudienceSection() {
  return null;
}