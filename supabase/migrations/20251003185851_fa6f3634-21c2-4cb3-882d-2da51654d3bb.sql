-- Function to handle email confirmation and create referral records
CREATE OR REPLACE FUNCTION public.handle_email_confirmation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referral_code_used TEXT;
  referrer_user_id UUID;
BEGIN
  -- Only proceed if email was just confirmed (changed from NULL to a timestamp)
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    -- Get referral code from user metadata
    referral_code_used := NEW.raw_user_meta_data->>'referral_code';
    
    IF referral_code_used IS NOT NULL AND referral_code_used != '' THEN
      -- Find the referrer by their referral code
      SELECT id INTO referrer_user_id
      FROM public.profiles
      WHERE referral_code = referral_code_used
      LIMIT 1;
      
      -- If referrer found and no existing referral record, create one
      IF referrer_user_id IS NOT NULL THEN
        INSERT INTO public.referrals (referrer_id, referred_id)
        VALUES (referrer_user_id, NEW.id)
        ON CONFLICT DO NOTHING;
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to handle email confirmation
DROP TRIGGER IF EXISTS on_email_confirmed ON auth.users;
CREATE TRIGGER on_email_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_email_confirmation();