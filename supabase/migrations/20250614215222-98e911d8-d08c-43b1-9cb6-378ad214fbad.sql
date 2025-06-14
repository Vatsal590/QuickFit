
-- First, let's enable RLS on both tables (this will succeed even if already enabled)
ALTER TABLE public.fitness_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them to ensure they're correct
DROP POLICY IF EXISTS "Users can view their own fitness profiles" ON public.fitness_profiles;
DROP POLICY IF EXISTS "Users can create their own fitness profiles" ON public.fitness_profiles;
DROP POLICY IF EXISTS "Users can update their own fitness profiles" ON public.fitness_profiles;
DROP POLICY IF EXISTS "Users can delete their own fitness profiles" ON public.fitness_profiles;

DROP POLICY IF EXISTS "Users can view their own workout plans" ON public.workout_plans;
DROP POLICY IF EXISTS "Users can create their own workout plans" ON public.workout_plans;
DROP POLICY IF EXISTS "Users can update their own workout plans" ON public.workout_plans;
DROP POLICY IF EXISTS "Users can delete their own workout plans" ON public.workout_plans;

-- Create fresh policies for fitness_profiles
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

-- Create fresh policies for workout_plans
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
