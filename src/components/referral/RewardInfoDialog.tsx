import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Trophy, Zap, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RewardInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPoints: number;
}

export const RewardInfoDialog = ({ open, onOpenChange, currentPoints }: RewardInfoDialogProps) => {
  const progress = (currentPoints / 500) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Trophy className="h-16 w-16 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">
            Rewards Program
          </DialogTitle>
          <DialogDescription className="text-center space-y-4 pt-4">
            <div className="space-y-2">
              <p className="text-lg font-semibold text-foreground">
                Your Progress: {currentPoints} / 500 points
              </p>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="glass rounded-xl p-4 space-y-3 mt-4">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">
                    Reach 500 Points & Get:
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Access to Vatsal's exclusive workout plans! He'll create a personalized plan just for you.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card bg-destructive/10 border-destructive/20 p-4 space-y-2 mt-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-destructive">
                    Warning: Points Reset!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    If you miss a day of working out, your points will reset to 0. Stay consistent to reach your goal!
                  </p>
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground mt-4">
              Earn 10 points per day by completing any workout
            </div>
          </DialogDescription>
        </DialogHeader>
        <Button
          onClick={() => onOpenChange(false)}
          variant="glass"
          className="w-full"
        >
          Got it!
        </Button>
      </DialogContent>
    </Dialog>
  );
};
