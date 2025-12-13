-- Add cooking_time_preference column to fitness_profiles table
ALTER TABLE public.fitness_profiles 
ADD COLUMN cooking_time_preference text DEFAULT '30' CHECK (cooking_time_preference IN ('5', '10', '20', '30', '60'));