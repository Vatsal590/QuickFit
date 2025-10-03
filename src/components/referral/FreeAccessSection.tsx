import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function FreeAccessSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState<string>('');
  const [referralCount, setReferralCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [inputReferralCode, setInputReferralCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referrerName, setReferrerName] = useState<string>('');
  const [pendingReferrer, setPendingReferrer] = useState<{ id: string; name: string } | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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

      // Check if user was referred by someone
      const { data: myReferral } = await supabase
        .from('referrals')
        .select('referrer_id')
        .eq('referred_id', user.id)
        .single();

      if (myReferral) {
        // Get referrer's name
        const { data: referrerProfile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', myReferral.referrer_id)
          .single();

        if (referrerProfile?.full_name) {
          setReferrerName(referrerProfile.full_name);
        }
      }
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
        .select('id, full_name')
        .ilike('referral_code', inputReferralCode.trim().toUpperCase())
        .single();

      if (referrerError || !referrer) {
        toast({
          title: "Invalid Code",
          description: "The referral code you entered is not valid.",
          variant: "destructive",
        });
        setIsSubmitting(false);
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
        setIsSubmitting(false);
        return;
      }

      // Show confirmation dialog
      setPendingReferrer({ id: referrer.id, name: referrer.full_name || 'Unknown' });
      setShowConfirmDialog(true);
      setIsSubmitting(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate referral code.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const confirmReferral = async () => {
    if (!pendingReferrer || !user) return;

    setIsSubmitting(true);
    try {
      // Insert the referral
      const { error: insertError } = await supabase
        .from('referrals')
        .insert({
          referrer_id: pendingReferrer.id,
          referred_id: user.id,
        });

      if (insertError) throw insertError;

      toast({
        title: "Success!",
        description: "Referral code applied successfully.",
      });
      setReferrerName(pendingReferrer.name);
      setInputReferralCode('');
      setShowConfirmDialog(false);
      setPendingReferrer(null);
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
              disabled={!!referrerName}
            />
            <Button
              onClick={handleSubmitReferralCode}
              disabled={!inputReferralCode.trim() || isSubmitting || !!referrerName}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
          {referrerName && (
            <p className="text-sm text-muted-foreground">
              Referred by <span className="font-semibold">{referrerName}</span>
            </p>
          )}
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p className="text-center">Share your referral code with friends!</p>
        </div>
      </CardContent>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Referral</AlertDialogTitle>
            <AlertDialogDescription>
              Referred by {pendingReferrer?.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowConfirmDialog(false);
              setPendingReferrer(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmReferral} disabled={isSubmitting}>
              {isSubmitting ? 'Confirming...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
