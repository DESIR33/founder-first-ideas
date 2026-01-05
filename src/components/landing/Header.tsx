import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import hustlingLabsLogo from '@/assets/hustling-labs-logo.png';

interface HeaderProps {
  onGetStarted: () => void;
}

export function Header({ onGetStarted }: HeaderProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border"
        >
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <a href="/" className="flex items-center gap-3">
                <img 
                  src={hustlingLabsLogo} 
                  alt="Hustling Labs" 
                  className="h-8 w-auto"
                />
              </a>

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-8">
                <a 
                  href="#tools" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Tools
                </a>
                <a 
                  href="#blueprints" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Blueprints
                </a>
                <a 
                  href="#experiments" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Lab
                </a>
                <a 
                  href="#about" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </a>
              </nav>

              {/* CTA */}
              <Button 
                variant="default"
                size="sm"
                onClick={onGetStarted}
                className="group bg-foreground text-background hover:bg-foreground/90 text-sm font-medium"
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}