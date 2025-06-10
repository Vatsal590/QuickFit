
import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import WorkoutForm from '../components/workout/WorkoutForm';
import WorkoutDisplay from '../components/workout/WorkoutDisplay';
import FitnessProfileForm from '../components/fitness/FitnessProfileForm';
import UserWorkoutPlans from '../components/fitness/UserWorkoutPlans';
import { Workout, WorkoutFormData } from '../types';
import { useWorkoutHistory } from '../hooks/useWorkoutHistory';
import { generateWorkout } from '../data/workoutGenerator';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { History, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFitnessProfile } from '../hooks/useFitnessProfile';

const Home = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
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
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Free Personalized <span className="text-fitness-primary">Fitness Plans</span>
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Get custom 30-day workout plans based on your goals, body type, and available equipment.
                Perfect for muscle gain, fat loss, or athletic training.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowProfileForm(true)}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Profile
              </Button>
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
        </div>

        {/* User's 30-Day Plans Section */}
        {profile && <UserWorkoutPlans />}

        {/* Fitness Profile Form */}
        <FitnessProfileForm 
          isOpen={showProfileForm}
          onClose={() => setShowProfileForm(false)}
        />

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
