
-- Remove the premium workout and purchase tables since we're going fully free
DROP TABLE IF EXISTS public.purchases CASCADE;
DROP TABLE IF EXISTS public.premium_workouts CASCADE;

-- Create a new table for user fitness profiles
CREATE TABLE public.fitness_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  height DECIMAL(5,2) NOT NULL, -- in cm
  weight DECIMAL(5,2) NOT NULL, -- in kg
  fitness_goal TEXT NOT NULL CHECK (fitness_goal IN ('muscle_gain', 'fat_loss', 'athlete_training')),
  body_type TEXT NOT NULL CHECK (body_type IN ('ectomorph', 'mesomorph', 'endomorph')),
  workout_days_per_week INTEGER NOT NULL CHECK (workout_days_per_week >= 1 AND workout_days_per_week <= 7),
  available_equipment TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for generated 30-day workout plans
CREATE TABLE public.workout_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  profile_id UUID REFERENCES public.fitness_profiles NOT NULL,
  plan_name TEXT NOT NULL,
  fitness_goal TEXT NOT NULL,
  total_days INTEGER NOT NULL DEFAULT 30,
  daily_workouts JSONB NOT NULL, -- Array of 30 daily workout plans
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Add Row Level Security (RLS) 
ALTER TABLE public.fitness_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;

-- Create policies for fitness_profiles
CREATE POLICY "Users can view their own fitness profiles" 
  ON public.fitness_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own fitness profiles" 
  ON public.fitness_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fitness profiles" 
  ON public.fitness_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own fitness profiles" 
  ON public.fitness_profiles 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policies for workout_plans
CREATE POLICY "Users can view their own workout plans" 
  ON public.workout_plans 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workout plans" 
  ON public.workout_plans 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout plans" 
  ON public.workout_plans 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout plans" 
  ON public.workout_plans 
  FOR DELETE 
  USING (auth.uid() = user_id);
