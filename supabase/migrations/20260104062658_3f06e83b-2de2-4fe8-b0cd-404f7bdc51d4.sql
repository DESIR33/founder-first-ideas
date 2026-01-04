-- Create table for idea validation checklist items
CREATE TABLE public.idea_validation_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  idea_id TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  category TEXT NOT NULL DEFAULT 'general',
  sort_order INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.idea_validation_items ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own validation items"
ON public.idea_validation_items
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own validation items"
ON public.idea_validation_items
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own validation items"
ON public.idea_validation_items
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own validation items"
ON public.idea_validation_items
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_idea_validation_items_updated_at
BEFORE UPDATE ON public.idea_validation_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();