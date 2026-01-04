-- Add Decision Mode columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN is_decision_mode_active boolean NOT NULL DEFAULT false,
ADD COLUMN active_idea_id text DEFAULT NULL;