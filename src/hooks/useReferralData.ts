import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useReferralData = () => {
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState<string>('');
  const [referralCount, setReferralCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchReferralData = async () => {
      try {
        // Fetch user's referral code
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('referral_code')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        
        if (profile?.referral_code) {
          setReferralCode(profile.referral_code);
        }

        // Fetch referral count
        const { data: referrals, error: referralsError } = await supabase
          .from('referrals')
          .select('id')
          .eq('referrer_id', user.id);

        if (referralsError) throw referralsError;
        
        setReferralCount(referrals?.length || 0);
      } catch (error) {
        console.error('Error fetching referral data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, [user]);

  return { referralCode, referralCount, loading };
};
