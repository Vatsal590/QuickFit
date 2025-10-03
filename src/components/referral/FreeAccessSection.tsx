import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function FreeAccessSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState<string>('');
  const [referralCount, setReferralCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [inputReferralCode, setInputReferralCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchReferralData = async () => {
      // Get user's referral code
      const { data: profile } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', user.id)
        .single();

      if (profile?.referral_code) {
        setReferralCode(profile.referral_code);
      }

      // Get referral count
      const { data: referrals } = await supabase
        .from('referrals')
        .select('id')
        .eq('referrer_id', user.id);

      setReferralCount(referrals?.length || 0);
    };

    fetchReferralData();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('referral-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'referrals',
          filter: `referrer_id=eq.${user.id}`,
        },
        () => {
          fetchReferralData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy referral code.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitReferralCode = async () => {
    if (!user || !inputReferralCode.trim()) return;
    
    setIsSubmitting(true);
    try {
      // Find the referrer by their referral code
      const { data: referrer, error: referrerError } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', inputReferralCode.trim().toUpperCase())
        .single();

      if (referrerError || !referrer) {
        toast({
          title: "Invalid Code",
          description: "The referral code you entered is not valid.",
          variant: "destructive",
        });
        return;
      }

      // Check if user already used a referral code
      const { data: existingReferral } = await supabase
        .from('referrals')
        .select('id')
        .eq('referred_id', user.id)
        .single();

      if (existingReferral) {
        toast({
          title: "Already Used",
          description: "You have already used a referral code.",
          variant: "destructive",
        });
        return;
      }

      // Insert the referral
      const { error: insertError } = await supabase
        .from('referrals')
        .insert({
          referrer_id: referrer.id,
          referred_id: user.id,
        });

      if (insertError) throw insertError;

      toast({
        title: "Success!",
        description: "Referral code applied successfully.",
      });
      setInputReferralCode('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply referral code.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          <CardTitle>Free Access</CardTitle>
        </div>
        <CardDescription>
          Refer friends and get rewards!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">Your Referral Code</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-muted px-4 py-3 rounded-md text-2xl font-bold tracking-wider text-center">
              {referralCode || 'Loading...'}
            </code>
            <Button
              onClick={handleCopy}
              size="icon"
              variant="outline"
              disabled={!referralCode}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Referrals</p>
          <div className="flex items-center justify-between bg-muted px-4 py-3 rounded-md">
            <span className="text-sm">Total Referrals</span>
            <span className="text-2xl font-bold">{referralCount}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="enter-referral">Enter a Referral Code</Label>
          <div className="flex items-center gap-2">
            <Input
              id="enter-referral"
              placeholder="Enter 5-digit code"
              value={inputReferralCode}
              onChange={(e) => setInputReferralCode(e.target.value.toUpperCase())}
              maxLength={5}
              className="uppercase flex-1"
            />
            <Button
              onClick={handleSubmitReferralCode}
              disabled={!inputReferralCode.trim() || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p className="text-center">Share your referral code with friends!</p>
        </div>
      </CardContent>
    </Card>
  );
}
