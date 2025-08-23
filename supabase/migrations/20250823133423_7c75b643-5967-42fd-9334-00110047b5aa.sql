-- Add new columns to fitness_profiles table for goal weight and diet preferences
ALTER TABLE public.fitness_profiles 
ADD COLUMN goal_weight numeric,
ADD COLUMN diet_preferences text[] DEFAULT '{}',
ADD COLUMN food_allergies text[] DEFAULT '{}',
ADD COLUMN taste_preferences text[] DEFAULT '{}';

-- Create weight_entries table to track daily weights
CREATE TABLE public.weight_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  weight numeric NOT NULL,
  recorded_date date NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, recorded_date)
);

-- Enable Row Level Security for weight_entries
ALTER TABLE public.weight_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for weight_entries
CREATE POLICY "Users can view their own weight entries" 
ON public.weight_entries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own weight entries" 
ON public.weight_entries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weight entries" 
ON public.weight_entries 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weight entries" 
ON public.weight_entries 
FOR DELETE 
USING (auth.uid() = user_id);