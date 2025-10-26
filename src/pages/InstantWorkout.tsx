import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import WorkoutForm from '../components/workout/WorkoutForm';
import WorkoutDisplay from '../components/workout/WorkoutDisplay';
import { Workout, WorkoutFormData, Exercise } from '../types';
import { useWorkoutHistory } from '../hooks/useWorkoutHistory';
import { generateWorkout } from '../data/workoutGenerator';
import { getFilteredExercises } from '../data/exercises';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/contexts/TranslationContext';
import { activityTracker } from '@/utils/activityTracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

const InstantWorkout = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [recommendedExercises, setRecommendedExercises] = useState<Exercise[]>([]);
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
      
      // Get functional exercises to recommend
      const functionalExercises = getFilteredExercises(["functional"], formData.equipment, formData.intensity);
      const numToRecommend = formData.time <= 20 ? 1 : 2;
      setRecommendedExercises(functionalExercises.slice(0, numToRecommend));
      
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
            <>
              <WorkoutDisplay
                workout={currentWorkout}
                onBack={() => { 
                  setCurrentWorkout(null);
                  setRecommendedExercises([]);
                  activityTracker.trackButtonClick('back_from_workout', 'instant-workout');
                }}
                onComplete={handleCompleteWorkout}
              />
              
              {recommendedExercises.length > 0 && (
                <Card className="bg-accent/10 border-accent">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Lightbulb className="w-5 h-5 text-accent" />
                      Good to Add
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recommendedExercises.map((exercise) => (
                      <div key={exercise.id} className="p-4 bg-background rounded-lg border">
                        <h4 className="font-semibold mb-1">{exercise.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{exercise.description}</p>
                        <div className="flex gap-4 text-sm">
                          <span>{exercise.sets} sets</span>
                          <span>•</span>
                          <span>{exercise.reps} reps</span>
                          <span>•</span>
                          <span>{exercise.restTime}s rest</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </>
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
