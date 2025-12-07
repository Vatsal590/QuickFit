import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Info } from 'lucide-react';
import { ExcludedExerciseInfo } from '@/data/workoutGenerator';
import { BodyPain } from '@/types';

interface ExcludedExercisesDialogProps {
  open: boolean;
  onClose: () => void;
  excludedExercises: ExcludedExerciseInfo[];
  selectedPains: BodyPain[];
}

const ExcludedExercisesDialog = ({ 
  open, 
  onClose, 
  excludedExercises,
  selectedPains 
}: ExcludedExercisesDialogProps) => {
  // Group excluded exercises by pain type
  const groupedByPain = excludedExercises.reduce((acc, ex) => {
    if (!acc[ex.painType]) {
      acc[ex.painType] = [];
    }
    acc[ex.painType].push(ex);
    return acc;
  }, {} as Record<BodyPain, ExcludedExerciseInfo[]>);

  const painDisplayNames: Record<BodyPain, string> = {
    "knee pain": "Knee Pain",
    "shoulder pain": "Shoulder Pain",
    "hip pain": "Hip Pain",
    "lower back pain": "Lower Back Pain",
    "wrist pain": "Wrist Pain",
    "ankle pain": "Ankle Pain"
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Workout Customized for Your Safety
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4 text-left">
              <p className="text-sm text-muted-foreground">
                Based on your selected body pains, we've modified your workout to help prevent further injury. 
                Here's what we've adjusted:
              </p>
              
              {Object.entries(groupedByPain).map(([pain, exercises]) => (
                <div key={pain} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span className="font-medium text-foreground">
                      {painDisplayNames[pain as BodyPain]}
                    </span>
                  </div>
                  <div className="pl-6 space-y-1">
                    <p className="text-xs text-muted-foreground">
                      {exercises[0].reason}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {exercises.slice(0, 5).map((ex, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground"
                        >
                          {ex.exerciseName}
                        </span>
                      ))}
                      {exercises.length > 5 && (
                        <span className="text-xs text-muted-foreground">
                          +{exercises.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <p className="text-xs text-muted-foreground border-t pt-3">
                We've added gentle pain relief stretches to help with your recovery. 
                Always listen to your body and stop if you experience increased pain.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="bg-fitness-primary hover:bg-fitness-primary/90">
            Got it, start workout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ExcludedExercisesDialog;