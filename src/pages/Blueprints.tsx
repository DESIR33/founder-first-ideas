import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Package, Layers, Code, DollarSign, Megaphone, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/LandingSections';
import { useAuth } from '@/hooks/useAuth';

const blueprintSections = [
  {
    icon: Layers,
    title: 'MVP Feature Set',
    description: 'The exact features you need for launch. Nothing more, nothing less.',
  },
  {
    icon: Code,
    title: 'Tech Stack',
    description: 'Recommended tools and technologies matched to your technical ability.',
  },
  {
    icon: DollarSign,
    title: 'Pricing Strategy',
    description: 'Validated pricing models with competitor analysis and positioning.',
  },
  {
    icon: Megaphone,
    title: 'Go-to-Market',
    description: 'Launch playbook with channels, messaging, and timeline.',
  },
  {
    icon: Users,
    title: 'Target Audience',
    description: 'Detailed customer personas with pain points and acquisition strategies.',
  },
];

const examples = [
  {
    title: 'SaaS Micro-Product',
    subtitle: 'Solo founder, technical',
    items: ['React + Supabase stack', '$19/mo pricing', 'ProductHunt launch strategy'],
  },
  {
    title: 'Content Business',
    subtitle: 'Creator with audience',
    items: ['Newsletter + community model', 'Tiered membership', 'Platform migration playbook'],
  },
  {
    title: 'Service Productization',
    subtitle: 'Consultant going scalable',
    items: ['Template-first approach', 'Value-based pricing', 'Referral engine setup'],
  },
];

export default function Blueprints() {
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
                <Package className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium tracking-[0.15em] uppercase text-muted-foreground">
                Startup Blueprints
              </p>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.1] mb-6"
            >
              Execution-ready
              <br />
              <span className="text-muted-foreground">playbooks</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-xl mb-10"
            >
              Skip months of research. Each blueprint contains the complete strategy: MVP features, tech stack, pricing, and positioning.
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
                Explore Blueprints
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What's Included */}
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
              What's Included
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold">
              Everything you need to execute
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blueprintSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 border border-border hover:bg-secondary transition-colors"
              >
                <section.icon className="w-6 h-6 mb-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <h3 className="text-lg font-medium mb-2">{section.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{section.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples */}
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
              Example Blueprints
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold">
              Tailored to your situation
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-px bg-border">
            {examples.map((example, index) => (
              <motion.div
                key={example.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-background p-8"
              >
                <p className="text-sm text-muted-foreground mb-2">{example.subtitle}</p>
                <h3 className="text-xl font-medium mb-6">{example.title}</h3>
                <ul className="space-y-3">
                  {example.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
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
                Get your blueprint
              </h2>
              <p className="text-muted-foreground mb-10">
                Complete the questionnaire to receive a personalized execution playbook.
              </p>
              <Button 
                variant="default"
                size="lg"
                onClick={handleGetStarted}
                className="group bg-foreground text-background hover:bg-foreground/90 px-8 py-6 text-base font-medium"
              >
                Start Now
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