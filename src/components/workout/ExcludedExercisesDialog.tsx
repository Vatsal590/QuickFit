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
import { useTranslation } from '@/contexts/TranslationContext';

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
  const { t } = useTranslation();
  
  // Group excluded exercises by pain type
  const groupedByPain = excludedExercises.reduce((acc, ex) => {
    if (!acc[ex.painType]) {
      acc[ex.painType] = [];
    }
    acc[ex.painType].push(ex);
    return acc;
  }, {} as Record<BodyPain, ExcludedExerciseInfo[]>);

  const painDisplayNames: Record<BodyPain, string> = {
    "knee pain": t("Knee Pain"),
    "shoulder pain": t("Shoulder Pain"),
    "hip pain": t("Hip Pain"),
    "lower back pain": t("Lower Back Pain"),
    "wrist pain": t("Wrist Pain"),
    "ankle pain": t("Ankle Pain")
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            {t('Workout Customized for Your Safety')}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4 text-left">
              <p className="text-sm text-muted-foreground">
                {t("Based on your selected body pains, we've modified your workout to help prevent further injury. Here's what we've adjusted:")}
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
                      {t(exercises[0].reason)}
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
                          +{exercises.length - 5} {t('more')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <p className="text-xs text-muted-foreground border-t pt-3">
                {t("We've added gentle pain relief stretches to help with your recovery. Always listen to your body and stop if you experience increased pain.")}
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="bg-fitness-primary hover:bg-fitness-primary/90">
            {t('Got it, start workout')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ExcludedExercisesDialog;