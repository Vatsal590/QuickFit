-- Create user_activities table to track all user actions
CREATE TABLE public.user_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  page TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX idx_user_activities_created_at ON public.user_activities(created_at DESC);
CREATE INDEX idx_user_activities_action ON public.user_activities(action);

-- Enable RLS
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own activities"
ON public.user_activities
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activities"
ON public.user_activities
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create scanned_foods table to track all food scans (even if not logged)
CREATE TABLE public.scanned_foods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  image_url TEXT,
  foods JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_calories NUMERIC DEFAULT 0,
  total_protein NUMERIC DEFAULT 0,
  total_carbs NUMERIC DEFAULT 0,
  total_fats NUMERIC DEFAULT 0,
  logged BOOLEAN DEFAULT false,
  food_log_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index
CREATE INDEX idx_scanned_foods_user_id ON public.scanned_foods(user_id);
CREATE INDEX idx_scanned_foods_created_at ON public.scanned_foods(created_at DESC);

-- Enable RLS
ALTER TABLE public.scanned_foods ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own scanned foods"
ON public.scanned_foods
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scanned foods"
ON public.scanned_foods
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scanned foods"
ON public.scanned_foods
FOR UPDATE
USING (auth.uid() = user_id);