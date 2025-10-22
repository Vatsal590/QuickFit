-- Create function to update timestamps if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create food_logs table to store meal entries
CREATE TABLE IF NOT EXISTS public.food_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT,
  foods JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_calories DECIMAL(10,2) DEFAULT 0,
  total_protein DECIMAL(10,2) DEFAULT 0,
  total_carbs DECIMAL(10,2) DEFAULT 0,
  total_fats DECIMAL(10,2) DEFAULT 0,
  meal_type TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_nutrition_goals table for personalized targets
CREATE TABLE IF NOT EXISTS public.user_nutrition_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  daily_calories DECIMAL(10,2) DEFAULT 2000,
  daily_protein DECIMAL(10,2) DEFAULT 150,
  daily_carbs DECIMAL(10,2) DEFAULT 250,
  daily_fats DECIMAL(10,2) DEFAULT 65,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_nutrition_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for food_logs
CREATE POLICY "Users can view their own food logs"
  ON public.food_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own food logs"
  ON public.food_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own food logs"
  ON public.food_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own food logs"
  ON public.food_logs FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for user_nutrition_goals
CREATE POLICY "Users can view their own nutrition goals"
  ON public.user_nutrition_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own nutrition goals"
  ON public.user_nutrition_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own nutrition goals"
  ON public.user_nutrition_goals FOR UPDATE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_food_logs_user_id_created_at ON public.food_logs(user_id, created_at DESC);

-- Create trigger for updating updated_at
CREATE TRIGGER update_user_nutrition_goals_updated_at
  BEFORE UPDATE ON public.user_nutrition_goals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();