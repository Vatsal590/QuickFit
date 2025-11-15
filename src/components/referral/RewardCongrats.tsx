import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Trophy, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RewardCongratsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RewardCongrats = ({ open, onOpenChange }: RewardCongratsProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 animate-ping opacity-75">
                <Trophy className="h-16 w-16 text-primary" />
              </div>
              <Trophy className="h-16 w-16 text-primary relative" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">
            Congratulations! 🎉
          </DialogTitle>
          <DialogDescription className="text-center space-y-4 pt-4">
            <p className="text-base">
              You've reached <span className="font-bold text-primary">500 points</span>!
            </p>
            <p className="text-base">
              You're absolutely crushing your fitness goals! 💪
            </p>
            <div className="glass rounded-xl p-4 space-y-2 mt-4">
              <p className="text-sm font-semibold text-foreground">
                Want to share your achievement?
              </p>
              <p className="text-sm text-muted-foreground">
                Contact Vatsal at:
              </p>
              <a
                href="mailto:vatsal.agarwala123@gmail.com"
                className="flex items-center justify-center gap-2 text-primary hover:underline"
              >
                <Mail className="h-4 w-4" />
                vatsal.agarwala123@gmail.com
              </a>
            </div>
          </DialogDescription>
        </DialogHeader>
        <Button
          onClick={() => onOpenChange(false)}
          variant="glass"
          className="w-full"
        >
          Keep Going!
        </Button>
      </DialogContent>
    </Dialog>
  );
};
