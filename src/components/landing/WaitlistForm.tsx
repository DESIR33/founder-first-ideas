import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';

const emailSchema = z.string().trim().email({ message: "Please enter a valid email address" });

interface WaitlistFormProps {
  source?: string;
}

export function WaitlistForm({ source = 'homepage' }: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate email
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: supabaseError } = await supabase
        .from('waitlist')
        .insert({ email: result.data, source });

      if (supabaseError) {
        if (supabaseError.code === '23505') {
          // Unique violation - email already exists
          setError("You're already on the list!");
          toast({
            title: "Already registered",
            description: "This email is already on our waitlist.",
          });
        } else {
          throw supabaseError;
        }
      } else {
        setIsSuccess(true);
        setEmail('');
        toast({
          title: "You're on the list!",
          description: "We'll be in touch soon.",
        });
      }
    } catch (err) {
      console.error('Waitlist signup error:', err);
      setError("Something went wrong. Please try again.");
      toast({
        title: "Error",
        description: "Failed to join waitlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center gap-3 py-4"
      >
        <CheckCircle2 className="w-5 h-5 text-accent" />
        <span className="text-foreground font-medium">You're on the list!</span>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            className="h-12 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            disabled={isSubmitting}
          />
        </div>
        <Button
          type="submit"
          disabled={isSubmitting || !email}
          className="h-12 px-6 bg-foreground text-background hover:bg-foreground/90 font-medium"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Join Waitlist
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-destructive mt-2 text-center"
        >
          {error}
        </motion.p>
      )}
    </form>
  );
}