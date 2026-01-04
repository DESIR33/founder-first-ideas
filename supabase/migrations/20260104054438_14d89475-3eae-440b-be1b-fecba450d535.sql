-- Create profiles table to store founder profile data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Background
  employment_status TEXT,
  hours_per_week INTEGER DEFAULT 10,
  monthly_income_goal INTEGER DEFAULT 3000,
  risk_tolerance INTEGER DEFAULT 5,
  capital_available TEXT,
  
  -- Skills
  technical_ability TEXT,
  marketing_comfort INTEGER DEFAULT 5,
  has_writing_skills BOOLEAN DEFAULT false,
  has_video_skills BOOLEAN DEFAULT false,
  has_sales_experience BOOLEAN DEFAULT false,
  has_audience BOOLEAN DEFAULT false,
  audience_size INTEGER DEFAULT 0,
  audience_platform TEXT,
  industry_experience TEXT[] DEFAULT '{}',
  
  -- Constraints
  has_family_obligations BOOLEAN DEFAULT false,
  geographic_limits BOOLEAN DEFAULT false,
  has_legal_restrictions BOOLEAN DEFAULT false,
  stress_tolerance INTEGER DEFAULT 5,
  needs_predictability BOOLEAN DEFAULT false,
  
  -- Preferences
  preferred_business_type TEXT,
  preferred_models TEXT[] DEFAULT '{}',
  time_horizon TEXT,
  team_preference TEXT,
  role_preference TEXT DEFAULT 'both',
  
  -- Personality
  builder_vs_optimizer INTEGER DEFAULT 5,
  visionary_vs_executor INTEGER DEFAULT 5,
  structure_vs_ambiguity INTEGER DEFAULT 5,
  
  -- Profile Summary
  founder_type TEXT,
  execution_strengths TEXT[] DEFAULT '{}',
  blind_spots TEXT[] DEFAULT '{}',
  ideal_business_models TEXT[] DEFAULT '{}',
  anti_patterns TEXT[] DEFAULT '{}',
  weekly_capacity_score INTEGER DEFAULT 5,
  
  -- Metadata
  has_completed_onboarding BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- Create saved_ideas table
CREATE TABLE public.saved_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  idea_id TEXT NOT NULL,
  idea_data JSONB NOT NULL,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, idea_id)
);

-- Enable RLS
ALTER TABLE public.saved_ideas ENABLE ROW LEVEL SECURITY;

-- Users can view their own saved ideas
CREATE POLICY "Users can view own saved ideas"
ON public.saved_ideas
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own saved ideas
CREATE POLICY "Users can insert own saved ideas"
ON public.saved_ideas
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own saved ideas
CREATE POLICY "Users can delete own saved ideas"
ON public.saved_ideas
FOR DELETE
USING (auth.uid() = user_id);

-- Create dismissed_ideas table
CREATE TABLE public.dismissed_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  idea_id TEXT NOT NULL,
  dismissed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, idea_id)
);

-- Enable RLS
ALTER TABLE public.dismissed_ideas ENABLE ROW LEVEL SECURITY;

-- Users can view their own dismissed ideas
CREATE POLICY "Users can view own dismissed ideas"
ON public.dismissed_ideas
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own dismissed ideas
CREATE POLICY "Users can insert own dismissed ideas"
ON public.dismissed_ideas
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();