
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

  const handleSelectPlan = (plan: any) => {
    console.log("Selected plan:", plan);
    // TODO: Implement plan selection logic
  };

  const handleDeletePlan = (planId: string) => {
    console.log("Delete plan:", planId);
    // TODO: Implement plan deletion logic
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
            Custom <span className="text-fitness-primary">Workout Generator</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Generate instant custom workouts based on your available time, equipment, and target muscle groups.
            Perfect for quick sessions when you need a workout right now.
          </p>
        </div>

        {/* 30-Day Plans Section */}
        <div className="mb-8">
          {profile && (
            <UserWorkoutPlans 
              workoutPlans={[]}
              onSelectPlan={handleSelectPlan}
              onDeletePlan={handleDeletePlan}
            />
          )}
        </div>

        {/* Custom Workout Generator Section */}
        <div className="max-w-3xl mx-auto">
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
    </PageContainer>
  );
};

export default Home;
