import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'refer' | 'skip'>('refer');

  useEffect(() => {
    if (!user) return;

    const fetchReferralData = async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', user.id)
        .single();

      if (profile?.referral_code) {
        setReferralCode(profile.referral_code);
      }

      const { data: referrals } = await supabase
        .from('referrals')
        .select('id')
        .eq('referrer_id', user.id);

      setReferralCount(referrals?.length || 0);

      const { data: myReferral } = await supabase
        .from('referrals')
        .select('referrer_id')
        .eq('referred_id', user.id)
        .maybeSingle();

      if (myReferral) {
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

    const channel = supabase
      .channel('referral-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'referrals',
          filter: `referrer_id=eq.${user?.id}`,
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
        title: 'Copied!',
        description: 'Referral code copied to clipboard.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to copy referral code.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmitReferralCode = async () => {
    if (!user || !inputReferralCode.trim()) return;

    setIsSubmitting(true);
    try {
      const { data: referrer, error: referrerError } = await supabase
        .rpc('validate_referral_code', { code: inputReferralCode.trim() })
        .single();

      if (referrerError || !referrer) {
        toast({
          title: 'Invalid Code',
          description: 'The referral code you entered is not valid.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      const referrerData = { id: referrer.user_id, full_name: referrer.full_name };

      const { data: existingReferral } = await supabase
        .from('referrals')
        .select('id')
        .eq('referred_id', user.id)
        .maybeSingle();

      if (existingReferral) {
        toast({
          title: 'Already Used',
          description: 'You have already used a referral code.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      setPendingReferrer({ id: referrerData.id, name: referrerData.full_name || 'Unknown' });
      setShowConfirmDialog(true);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to validate referral code.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmReferral = async () => {
    if (!pendingReferrer || !user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('referrals').insert({
        referrer_id: pendingReferrer.id,
        referred_id: user.id,
      });

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Referral code applied successfully.',
      });
      setReferrerName(pendingReferrer.name);
      setInputReferralCode('');
      setShowConfirmDialog(false);
      setPendingReferrer(null);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to apply referral code.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unlock Vatsal&apos;s plans! (his physique below)</CardTitle>
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setActiveTab('refer')}
            className={`flex-1 border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 ${
              activeTab === 'refer' ? 'ring-2 ring-orange-400' : ''
            }`}
          >
            Refer
          </Button>
          <Button
            onClick={() => setActiveTab('skip')}
            className={`flex-1 transition-all duration-300 text-white ${
              activeTab === 'skip'
                ? 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 shadow-lg shadow-orange-400/40'
                : 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 opacity-100 hover:opacity-90'
            }`}
          >
            INSTANT ACCESS
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {activeTab === 'refer' && (
          <>
            <div>
              <p className="text-sm font-medium mb-2">Your Referral Code</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-muted px-4 py-3 rounded-md text-2xl font-bold tracking-wider text-center">
                  {referralCode || 'Loading...'}
                </code>
                <Button onClick={handleCopy} size="icon" variant="outline" disabled={!referralCode}>
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
                  onChange={(e) => setInputReferralCode(e.target.value.toUpperCase().trim())}
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

            {/* Referral goal section (only once, at bottom) */}
            <div className="text-center text-sm text-muted-foreground space-y-1 pt-4">
              {referralCount >= 3 ? (
                <p>
                  Congratulations! Kindly contact -{' '}
                  <span className="font-semibold">info@quickfit.dev</span> to receive your award!
                </p>
              ) : (
                <>
                  <p>Refer 3 people to see Vatsal&apos;s workout and diet plan.</p>
                  <p>Refer 6 people for access AND a call with him!</p>
                </>
              )}
            </div>
          </>
        )}

        {activeTab === 'skip' && (
          <div className="flex flex-col md:flex-row gap-6 py-6 justify-center items-stretch">
            {/* QuickFit Lite */}
            <Card className="flex-1 max-w-sm mx-auto md:mx-0">
              <CardHeader>
                <CardTitle>QuickFit Lite</CardTitle>
                <CardDescription>€4.99 — Access to Vatsal&apos;s workout and diet plan</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white hover:opacity-90 shadow-lg shadow-orange-400/40 mt-4 w-full"
                >
                  <a
                    href="https://buy.stripe.com/5kQfZi4pD2LH8ay94Zds403"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Pay & Get Instant Access
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* QuickFit Pro */}
            <Card className="flex-1 max-w-sm mx-auto md:mx-0">
              <CardHeader>
                <CardTitle>QuickFit Pro</CardTitle>
                <CardDescription>
                  €6.99 — Everything in Lite plus a 1-on-1 call and personalized plan from Vatsal
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white hover:opacity-90 shadow-lg shadow-orange-400/40 mt-4 w-full"
                >
                  <a
                    href="https://buy.stripe.com/cNidRa8FTdql0I694Zds402"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Pay & Get Instant Access
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Referral</AlertDialogTitle>
            <AlertDialogDescription>Referred by {pendingReferrer?.name}?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowConfirmDialog(false);
                setPendingReferrer(null);
              }}
            >
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
