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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Lightbulb, Dumbbell, Timer, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ExerciseTimer from '@/components/workout/ExerciseTimer';
import { getExerciseAnimationUrl } from '@/utils/exerciseAnimations';

interface FunctionalExerciseCardProps {
  exercise: Exercise;
  index: number;
}

const FunctionalExerciseCard = ({ exercise, index }: FunctionalExerciseCardProps) => {
  const [showTimer, setShowTimer] = useState(false);
  const animationUrl = getExerciseAnimationUrl(exercise.name);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full p-4 bg-background rounded-lg border hover:border-primary hover:bg-accent/5 transition-all cursor-pointer group text-left">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-semibold">{index + 1}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-base">
                  {exercise.name}
                </h4>
                <Play className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                {exercise.sets} sets × {exercise.reps} reps • {exercise.restTime}s rest
              </p>
            </div>
            <div className="flex-shrink-0">
              <svg 
                className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" 
                fill="none" 
                strokeWidth="2" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {exercise.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg overflow-hidden bg-muted">
            <img
              src={animationUrl}
              alt={exercise.name}
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{exercise.sets}</div>
              <div className="text-sm text-muted-foreground">Sets</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{exercise.reps}</div>
              <div className="text-sm text-muted-foreground">Reps</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{exercise.restTime}s</div>
              <div className="text-sm text-muted-foreground">Rest</div>
            </div>
          </div>

          <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-accent" />
              Description
            </h4>
            <p className="text-sm text-muted-foreground">{exercise.description}</p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setShowTimer(!showTimer)}
              variant="outline"
              className="flex-1"
            >
              <Timer className="w-4 h-4 mr-2" />
              {showTimer ? 'Hide Rest Timer' : 'Start Rest Timer'}
            </Button>
          </div>

          {showTimer && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-3 text-center">
                Rest timer between sets
              </p>
              <ExerciseTimer
                duration={exercise.restTime}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

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
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">
                    Good to add - functional exercises ({recommendedExercises.length})
                  </h2>
                  <div className="space-y-3">
                    {recommendedExercises.map((exercise, index) => (
                      <FunctionalExerciseCard 
                        key={exercise.id} 
                        exercise={exercise} 
                        index={index}
                      />
                    ))}
                  </div>
                </div>
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
