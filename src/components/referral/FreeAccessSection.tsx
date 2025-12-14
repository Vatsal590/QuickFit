import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, Zap, Users, Crown, Sparkles } from 'lucide-react';
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
import { useTranslation } from '@/contexts/TranslationContext';

export function FreeAccessSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [referralCode, setReferralCode] = useState<string>('');
  const [referralCount, setReferralCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [inputReferralCode, setInputReferralCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referrerName, setReferrerName] = useState<string>('');
  const [pendingReferrer, setPendingReferrer] = useState<{ id: string; name: string } | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'refer' | 'instant'>('instant');

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
        title: t('Copied!'),
        description: t('Referral code copied to clipboard.'),
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: t('Error'),
        description: t('Failed to copy referral code.'),
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
          title: t('Invalid Code'),
          description: t('The referral code you entered is not valid.'),
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
          title: t('Already Used'),
          description: t('You have already used a referral code.'),
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      setPendingReferrer({ id: referrerData.id, name: referrerData.full_name || 'Unknown' });
      setShowConfirmDialog(true);
    } catch {
      toast({
        title: t('Error'),
        description: t('Failed to validate referral code.'),
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
        title: t('Success'),
        description: t('Referral code applied successfully.'),
      });
      setReferrerName(pendingReferrer.name);
      setInputReferralCode('');
      setShowConfirmDialog(false);
      setPendingReferrer(null);
    } catch {
      toast({
        title: t('Error'),
        description: t('Failed to apply referral code.'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Path to Access</h2>
        <p className="text-muted-foreground">Select one of the two options below</p>
      </div>

      {/* Option Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Refer Option */}
        <button
          onClick={() => setActiveTab('refer')}
          className={`relative p-6 rounded-xl border-2 text-left transition-all ${
            activeTab === 'refer'
              ? 'border-muted-foreground/50 bg-muted/30'
              : 'border-border hover:border-muted-foreground/30 hover:bg-muted/10'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-muted">
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
            <span className="font-semibold text-lg">Refer Friends</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Refer 3 friends to unlock access for free
          </p>
        </button>

        {/* Instant Access Option - HIGHLIGHTED */}
        <button
          onClick={() => setActiveTab('instant')}
          className={`relative p-6 rounded-xl border-2 text-left transition-all ${
            activeTab === 'instant'
              ? 'border-amber-500 bg-gradient-to-br from-amber-500/20 to-orange-500/20 shadow-lg shadow-amber-500/20'
              : 'border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-orange-500/10 hover:from-amber-500/15 hover:to-orange-500/15'
          }`}
        >
          <div className="absolute -top-3 right-4">
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              RECOMMENDED
            </span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-lg">Instant Access</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Get immediate access with what you would pay a sandwich
          </p>
        </button>
      </div>

      {/* Content Based on Selection */}
      {activeTab === 'instant' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* QuickFit Lite */}
            <Card className="relative overflow-hidden border-2 border-border">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  QuickFit Lite
                </CardTitle>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-bold">€4.99</span>
                  <span className="text-muted-foreground text-sm">/mo</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Vatsal's complete workout plan
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Vatsal's complete diet plan
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Lifetime access
                  </li>
                </ul>
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 shadow-lg"
                >
                  <a
                    href="https://buy.stripe.com/5kQfZi4pD2LH8ay94Zds403"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Instant Access
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* QuickFit Pro - MOST POPULAR */}
            <Card className="relative overflow-hidden border-2 border-amber-500 shadow-lg shadow-amber-500/10">
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center text-xs font-bold py-1">
                <Crown className="h-3 w-3 inline mr-1" />
                MOST POPULAR
              </div>
              <CardHeader className="pb-4 pt-8">
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-500" />
                  QuickFit Pro
                </CardTitle>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-bold">€6.99</span>
                  <span className="text-muted-foreground text-sm">/mo</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Everything in Lite
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    1-on-1 call with Vatsal
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Personalized plan review
                  </li>
                </ul>
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 shadow-lg"
                >
                  <a
                    href="https://buy.stripe.com/cNidRa8FTdql0I694Zds402"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Pro Access
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'refer' && (
        <Card>
          <CardHeader>
            <CardTitle>Referral Program</CardTitle>
            <CardDescription>Share your code with friends to unlock free access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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

            <div className="text-center text-sm text-muted-foreground space-y-1 pt-4 border-t">
              {referralCount >= 3 ? (
                <p>
                  Congratulations! Contact{' '}
                  <span className="font-semibold">quickfit06@gmail.com</span> to receive your reward!
                </p>
              ) : (
                <>
                  <p>Refer <span className="font-semibold text-primary">3 people</span> to see Vatsal's workout and diet plan.</p>
                  <p>Refer <span className="font-semibold text-primary">6 people</span> for access AND a call with him!</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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
    </div>
  );
}