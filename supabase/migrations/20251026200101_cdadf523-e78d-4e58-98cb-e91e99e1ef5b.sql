-- Create diet_plans table for persistent diet plans
CREATE TABLE public.diet_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_name TEXT NOT NULL,
  target_calories NUMERIC NOT NULL,
  target_protein NUMERIC NOT NULL,
  target_carbs NUMERIC NOT NULL,
  target_fats NUMERIC NOT NULL,
  daily_meals JSONB NOT NULL DEFAULT '[]'::jsonb,
  cuisine_preferences TEXT[] NOT NULL DEFAULT '{}'::text[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own diet plans" 
ON public.diet_plans 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own diet plans" 
ON public.diet_plans 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diet plans" 
ON public.diet_plans 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diet plans" 
ON public.diet_plans 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_diet_plans_updated_at
BEFORE UPDATE ON public.diet_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();