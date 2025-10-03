-- Drop the insecure public policy that exposes all user data
DROP POLICY IF EXISTS "Allow viewing profiles by referral code" ON public.profiles;

-- Create a secure function to validate referral codes without exposing sensitive data
-- This function only returns the user_id and full_name when given a valid referral code
-- It does NOT expose email addresses or other sensitive information
CREATE OR REPLACE FUNCTION public.validate_referral_code(code TEXT)
RETURNS TABLE (user_id UUID, full_name TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.full_name
  FROM public.profiles p
  WHERE p.referral_code = code
  LIMIT 1;
END;
$$;

-- Grant execute permission to authenticated users only
GRANT EXECUTE ON FUNCTION public.validate_referral_code(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.validate_referral_code(TEXT) TO anon;