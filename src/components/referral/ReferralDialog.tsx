import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ReferralDialogProps {
  open: boolean;
  onSubmit: (code: string | null) => void;
}

export const ReferralDialog = ({ open, onSubmit }: ReferralDialogProps) => {
  const [referralCode, setReferralCode] = useState('');

  const handleSubmit = () => {
    onSubmit(referralCode.trim() || null);
  };

  const handleSkip = () => {
    onSubmit(null);
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Do you have a referral code?</DialogTitle>
          <DialogDescription>
            Enter your referral code below to help support someone who referred you.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="referral">Referral Code</Label>
            <Input
              id="referral"
              placeholder="Enter 5-digit code"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              maxLength={5}
              className="uppercase"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSkip} variant="outline" className="flex-1">
              Skip
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
