import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PartyPopper } from 'lucide-react';

export const ReferralCongrats = () => {
  const { user } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const [referralCount, setReferralCount] = useState(0);
  const [userName, setUserName] = useState('');
  const [shownMilestones, setShownMilestones] = useState<number[]>([]);

  useEffect(() => {
    if (!user) return;

    // Load previously shown milestones from localStorage FIRST
    const stored = localStorage.getItem(`referral_milestone_${user.id}`);
    const previouslyShown = stored ? JSON.parse(stored) : [];
    setShownMilestones(previouslyShown);

    const checkReferrals = async () => {
      try {
        // Get user's full name
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (profile?.full_name) {
          setUserName(profile.full_name);
        }

        // Get referral count
        const { data: referrals } = await supabase
          .from('referrals')
          .select('id')
          .eq('referrer_id', user.id);

        const count = referrals?.length || 0;
        setReferralCount(count);

        // Get the current shown milestones from localStorage
        const currentStored = localStorage.getItem(`referral_milestone_${user.id}`);
        const currentShown = currentStored ? JSON.parse(currentStored) : [];

        // Check if we should show congratulations for 3 or 6 referrals
        const milestones = [3, 6];
        const reachedMilestones = milestones.filter(m => count >= m && !currentShown.includes(m));
        
        if (reachedMilestones.length > 0) {
          // Show the highest reached milestone
          const milestone = Math.max(...reachedMilestones);
          setShowDialog(true);
          
          // Update shown milestones
          const updatedShown = [...currentShown, milestone];
          setShownMilestones(updatedShown);
          localStorage.setItem(`referral_milestone_${user.id}`, JSON.stringify(updatedShown));
        }
      } catch (error) {
        console.error('Error checking referrals:', error);
      }
    };

    checkReferrals();

    // Set up real-time subscription for new referrals
    const channel = supabase
      .channel('referrals-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'referrals',
          filter: `referrer_id=eq.${user.id}`,
        },
        () => {
          checkReferrals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-full p-4">
              <PartyPopper className="h-10 w-10 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            Congratulations {userName}!
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            You've successfully referred {referralCount} people to QuickFit!
          </DialogDescription>
        </DialogHeader>
        <div className="bg-muted p-4 rounded-lg text-center">
          <p className="text-sm font-medium mb-2">
            🎉 Take a screenshot of this message 🎉
          </p>
          <p className="text-sm text-muted-foreground">
            Contact <span className="font-semibold">info@quickfit.dev</span> with your screenshot to claim your reward!
          </p>
        </div>
        <Button onClick={() => setShowDialog(false)} className="w-full">
          Got it!
        </Button>
      </DialogContent>
    </Dialog>
  );
};
