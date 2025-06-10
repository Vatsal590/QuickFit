
import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import WorkoutForm from '../components/workout/WorkoutForm';
import WorkoutDisplay from '../components/workout/WorkoutDisplay';
import UserWorkoutPlans from '../components/fitness/UserWorkoutPlans';
import { Workout, WorkoutFormData } from '../types';
import { useWorkoutHistory } from '../hooks/useWorkoutHistory';
import { generateWorkout } from '../data/workoutGenerator';
import { useToast } from '@/hooks/use-toast';
import { useFitnessProfile } from '../hooks/useFitnessProfile';

const Home = () => {
  const { toast } = useToast();
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const { addWorkoutToHistory, markWorkoutCompleted } = useWorkoutHistory();
  const { profile, isLoading: profileLoading } = useFitnessProfile();

  const handleCreateWorkout = (formData: WorkoutFormData) => {
    try {
      const newWorkout = generateWorkout(formData);
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
    markWorkoutCompleted(workout.id);
  };

  if (profileLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fitness-primary"></div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Free Personalized <span className="text-fitness-primary">Fitness Plans</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get custom 30-day workout plans based on your goals, body type, and available equipment.
            Perfect for muscle gain, fat loss, or athletic training.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - 30-Day Plans */}
          <div>
            {profile && <UserWorkoutPlans />}
          </div>

          {/* Right Column - Quick Workout Generator */}
          <div>
            {currentWorkout ? (
              <WorkoutDisplay
                workout={currentWorkout}
                onBack={() => setCurrentWorkout(null)}
                onComplete={handleCompleteWorkout}
              />
            ) : (
              <WorkoutForm 
                onSubmit={handleCreateWorkout}
              />
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Home;
