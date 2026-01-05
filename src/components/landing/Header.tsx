import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
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
              <Link to="/" className="flex items-center gap-3">
                <img 
                  src={hustlingLabsLogo} 
                  alt="Hustling Labs" 
                  className="h-8 w-auto"
                />
              </Link>

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-8">
                <Link 
                  to="/idea-engine" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Idea Engine
                </Link>
                <Link 
                  to="/blueprints" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Blueprints
                </Link>
                <Link 
                  to="/tools" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Tools
                </Link>
                <Link 
                  to="/lab" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Lab
                </Link>
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