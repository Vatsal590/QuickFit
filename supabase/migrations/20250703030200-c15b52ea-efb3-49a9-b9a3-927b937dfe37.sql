
-- Add last_used column to profiles table to track when users last interacted with the app
ALTER TABLE public.profiles 
ADD COLUMN last_used timestamp with time zone DEFAULT now();

-- Update the last_used timestamp whenever a user interacts with the app
CREATE OR REPLACE FUNCTION update_last_used()
RETURNS trigger AS $$
BEGIN
  UPDATE public.profiles 
  SET last_used = now() 
  WHERE id = auth.uid();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to manually update last_used (for button clicks, etc.)
CREATE OR REPLACE FUNCTION public.update_user_last_used()
RETURNS void AS $$
BEGIN
  UPDATE public.profiles 
  SET last_used = now() 
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
