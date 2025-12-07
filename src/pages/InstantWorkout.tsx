import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import WorkoutForm from '../components/workout/WorkoutForm';
import WorkoutDisplay from '../components/workout/WorkoutDisplay';
import ExcludedExercisesDialog from '../components/workout/ExcludedExercisesDialog';
import { Workout, WorkoutFormData, BodyPain } from '../types';
import { useWorkoutHistory } from '../hooks/useWorkoutHistory';
import { generateWorkout, ExcludedExerciseInfo } from '../data/workoutGenerator';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/contexts/TranslationContext';
import { activityTracker } from '@/utils/activityTracker';

const InstantWorkout = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [excludedExercises, setExcludedExercises] = useState<ExcludedExerciseInfo[]>([]);
  const [selectedPains, setSelectedPains] = useState<BodyPain[]>([]);
  const [showExcludedDialog, setShowExcludedDialog] = useState(false);
  const { addWorkoutToHistory, markWorkoutCompleted } = useWorkoutHistory();

  const handleCreateWorkout = (formData: WorkoutFormData) => {
    activityTracker.trackWorkoutAction('create', { 
      time: formData.time, 
      intensity: formData.intensity, 
      muscleGroups: formData.muscleGroups,
      equipment: formData.equipment 
    });
    try {
      const result = generateWorkout(
        formData.time,
        formData.intensity,
        formData.muscleGroups,
        formData.equipment,
        formData.bodyPains
      );
      
      setCurrentWorkout(result.workout);
      setExcludedExercises(result.excludedExercises);
      setSelectedPains(formData.bodyPains || []);
      
      // Show dialog if exercises were excluded due to pain
      if (formData.bodyPains && formData.bodyPains.length > 0 && result.excludedExercises.length > 0) {
        setShowExcludedDialog(true);
      }
      
      toast({
        title: "Workout generated",
        description: `Your ${result.workout.duration} minute workout is ready with 5-min warmup and cooldown!`,
      });
      
      addWorkoutToHistory(result.workout);
    } catch (error) {
      console.error("Failed to generate workout:", error);
      toast({
        title: "Error",
        description: "Failed to generate workout. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleCompleteWorkout = (workout: Workout) => {
    activityTracker.trackWorkoutAction('complete', { workoutId: workout.id, title: workout.title });
    markWorkoutCompleted(workout.id);
  };

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-3">
            {t('Custom Workout Generator')}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('Generate instant custom workouts based on your available time, equipment, and target muscle groups.')}
            {' '}{t('Perfect for quick sessions when you need a workout right now.')}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {currentWorkout ? (
            <WorkoutDisplay
              workout={currentWorkout}
              onBack={() => { 
                setCurrentWorkout(null);
                setExcludedExercises([]);
                setSelectedPains([]);
                activityTracker.trackButtonClick('back_from_workout', 'instant-workout');
              }}
              onComplete={handleCompleteWorkout}
            />
          ) : (
            <WorkoutForm 
              onSubmit={handleCreateWorkout}
            />
          )}
        </div>
      </div>
      
      <ExcludedExercisesDialog
        open={showExcludedDialog}
        onClose={() => setShowExcludedDialog(false)}
        excludedExercises={excludedExercises}
        selectedPains={selectedPains}
      />
    </PageContainer>
  );
};

export default InstantWorkout;
