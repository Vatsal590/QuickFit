-- Drop the single cooking_time_preference column and add separate ones for each meal type
ALTER TABLE public.fitness_profiles 
DROP COLUMN IF EXISTS cooking_time_preference;

ALTER TABLE public.fitness_profiles 
ADD COLUMN breakfast_cook_time text DEFAULT '20' CHECK (breakfast_cook_time IN ('5', '10', '20', '30', '60')),
ADD COLUMN lunch_cook_time text DEFAULT '30' CHECK (lunch_cook_time IN ('5', '10', '20', '30', '60')),
ADD COLUMN dinner_cook_time text DEFAULT '30' CHECK (dinner_cook_time IN ('5', '10', '20', '30', '60'));