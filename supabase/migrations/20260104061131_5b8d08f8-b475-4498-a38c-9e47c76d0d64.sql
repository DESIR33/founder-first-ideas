-- Create a table for idea collections/folders
CREATE TABLE public.idea_collections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT 'gray',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.idea_collections ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own collections" 
ON public.idea_collections 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own collections" 
ON public.idea_collections 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections" 
ON public.idea_collections 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections" 
ON public.idea_collections 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_idea_collections_updated_at
BEFORE UPDATE ON public.idea_collections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create junction table to link ideas to collections
CREATE TABLE public.idea_collection_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  collection_id UUID NOT NULL REFERENCES public.idea_collections(id) ON DELETE CASCADE,
  idea_id TEXT NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(collection_id, idea_id)
);

-- Enable Row Level Security
ALTER TABLE public.idea_collection_items ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own collection items" 
ON public.idea_collection_items 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add items to their collections" 
ON public.idea_collection_items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove items from their collections" 
ON public.idea_collection_items 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add indexes for faster lookups
CREATE INDEX idx_idea_collections_user ON public.idea_collections(user_id);
CREATE INDEX idx_idea_collection_items_user ON public.idea_collection_items(user_id);
CREATE INDEX idx_idea_collection_items_idea ON public.idea_collection_items(idea_id);