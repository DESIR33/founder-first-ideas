import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import hustlingLabsLogo from '@/assets/hustling-labs-logo.png';

const navLinks = [
  { to: '/idea-engine', label: 'Idea Engine' },
  { to: '/blueprints', label: 'Blueprints' },
  { to: '/tools', label: 'Tools' },
  { to: '/lab', label: 'Lab' },
];

interface HeaderProps {
  onGetStarted: () => void;
}

export function Header({ onGetStarted }: HeaderProps) {
  const [isVisible, setIsVisible] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link 
                    key={link.to}
                    to={link.to} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Desktop CTA */}
              <Button 
                variant="default"
                size="sm"
                onClick={onGetStarted}
                className="hidden md:inline-flex group bg-foreground text-background hover:bg-foreground/90 text-sm font-medium"
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5" />
              </Button>

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden"
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 bg-background/95 backdrop-blur-xl">
                  <nav className="flex flex-col gap-6 mt-8">
                    {navLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <Button 
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onGetStarted();
                      }}
                      className="mt-4 group bg-foreground text-background hover:bg-foreground/90"
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}