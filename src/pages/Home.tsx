
import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import WorkoutForm from '../components/workout/WorkoutForm';
import WorkoutDisplay from '../components/workout/WorkoutDisplay';
import PurchasedWorkouts from '../components/workout/PurchasedWorkouts';
import { Workout, WorkoutFormData } from '../types';
import { useWorkoutHistory } from '../hooks/useWorkoutHistory';
import { generateWorkout } from '../data/workoutGenerator';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const { addWorkoutToHistory, recentWorkouts, markWorkoutCompleted } = useWorkoutHistory();

  const handleCreateWorkout = (formData: WorkoutFormData) => {
    try {
      const newWorkout = generateWorkout(formData);
      setCurrentWorkout(newWorkout);
      
      toast({
        title: "Workout generated",
        description: `Your ${newWorkout.duration} minute workout is ready with 5-min warmup and cooldown!`,
      });
      
      // Automatically save to history
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
    // Find the workout in history and mark it as completed
    markWorkoutCompleted(workout.id);
  };

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Custom Workouts <span className="text-fitness-primary">On Demand</span>
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Generate personalized workouts based on your available time, equipment, and fitness goals.
                Perfect for busy days when you still want to get a quality workout in.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/history')}
              className="flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              History
            </Button>
          </div>
        </div>

        {/* Premium Workouts Section */}
        <PurchasedWorkouts />

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
    </PageContainer>
  );
};

export default Home;
