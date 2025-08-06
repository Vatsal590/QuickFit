
-- Remove the old check constraint that only allows single body type values
ALTER TABLE fitness_profiles DROP CONSTRAINT IF EXISTS fitness_profiles_body_type_check;

-- Update the body_type column to allow arrays and single values
-- We'll handle this in the application logic instead of database constraints
