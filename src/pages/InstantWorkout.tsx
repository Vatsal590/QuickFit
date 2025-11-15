import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import WorkoutForm from '../components/workout/WorkoutForm';
import WorkoutDisplay from '../components/workout/WorkoutDisplay';
import { Workout, WorkoutFormData } from '../types';
import { useWorkoutHistory } from '../hooks/useWorkoutHistory';
import { generateWorkout } from '../data/workoutGenerator';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/contexts/TranslationContext';
import { activityTracker } from '@/utils/activityTracker';

const InstantWorkout = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const { addWorkoutToHistory, markWorkoutCompleted } = useWorkoutHistory();

  const handleCreateWorkout = (formData: WorkoutFormData) => {
    activityTracker.trackWorkoutAction('create', { 
      time: formData.time, 
      intensity: formData.intensity, 
      muscleGroups: formData.muscleGroups,
      equipment: formData.equipment 
    });
    try {
      const newWorkout = generateWorkout(
        formData.time,
        formData.intensity,
        formData.muscleGroups,
        formData.equipment,
        formData.bodyPains
      );
      setCurrentWorkout(newWorkout);
      
      toast({
        title: "Workout generated",
        description: `Your ${newWorkout.duration} minute workout is ready with 5-min warmup and cooldown!`,
      });
      
      addWorkoutToHistory(newWorkout);
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
    </PageContainer>
  );
};

export default InstantWorkout;
