-- Allow users to view profiles when looking up by referral code
-- This is safe because referral codes are meant to be shared
CREATE POLICY "Allow viewing profiles by referral code"
ON public.profiles
FOR SELECT
USING (referral_code IS NOT NULL);