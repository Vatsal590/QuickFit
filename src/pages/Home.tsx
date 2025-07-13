
import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import WorkoutForm from '../components/workout/WorkoutForm';
import WorkoutDisplay from '../components/workout/WorkoutDisplay';
import UserWorkoutPlans from '../components/fitness/UserWorkoutPlans';
import WorkoutPlanViewer from '../components/fitness/WorkoutPlanViewer';
import WorkoutPlanGenerator from '../components/fitness/WorkoutPlanGenerator';
import { Workout, WorkoutFormData, WorkoutPlan } from '../types';
import { useWorkoutHistory } from '../hooks/useWorkoutHistory';
import { useWorkoutPlans } from '../hooks/useWorkoutPlans';
import { generateWorkout } from '../data/workoutGenerator';
import { useToast } from '@/hooks/use-toast';
import { useFitnessProfile } from '../hooks/useFitnessProfile';
import { supabase } from '@/integrations/supabase/client';

// Update user activity in profiles table
const updateUserActivity = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ 
          last_used: new Date().toISOString(),
          last_active: new Date().toISOString() 
        })
        .eq('id', user.id);
      console.log('User activity tracked');
    }
  } catch (error) {
    console.error('Failed to track user activity:', error);
  }
};

const Home = () => {
  const { toast } = useToast();
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [showPlanGenerator, setShowPlanGenerator] = useState(false);
  const { addWorkoutToHistory, markWorkoutCompleted } = useWorkoutHistory();
  const { profile, isLoading: profileLoading } = useFitnessProfile();
  const { workoutPlans, loading: plansLoading, deleteWorkoutPlan, markDayComplete, loadWorkoutPlans, addWorkoutPlan } = useWorkoutPlans();

  // Track user activity
  const trackUserActivity = async () => {
    await updateUserActivity();
  };

  const handleCreateWorkout = (formData: WorkoutFormData) => {
    trackUserActivity();
    try {
      const newWorkout = generateWorkout(
        formData.time,
        formData.intensity,
        formData.muscleGroups,
        formData.equipment
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
    trackUserActivity();
    markWorkoutCompleted(workout.id);
  };

  const handleSelectPlan = (plan: WorkoutPlan) => {
    trackUserActivity();
    console.log("Selected plan:", plan);
    setSelectedPlan(plan);
  };

  const handleDeletePlan = async (planId: string) => {
    trackUserActivity();
    try {
      await deleteWorkoutPlan(planId);
      toast({
        title: "Plan deleted",
        description: "Your workout plan has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete workout plan. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleMarkDayComplete = async (planId: string, dayNumber: number) => {
    trackUserActivity();
    try {
      await markDayComplete(planId, dayNumber);
      toast({
        title: "Day completed!",
        description: "Great job! Your progress has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark day as complete. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePlanGenerated = (newPlan: WorkoutPlan) => {
    trackUserActivity();
    addWorkoutPlan(newPlan);
  };

  // Listen for plan generation events to refresh the plans
  React.useEffect(() => {
    const handlePlanGeneratedEvent = () => {
      loadWorkoutPlans();
    };

    const handleOpenCustomize = () => {
      console.log('Opening customization dialog');
      setShowPlanGenerator(true);
    };

    const handleOpenFitnessProfile = () => {
      console.log('Opening fitness profile form');
      // We need to trigger the fitness profile form instead
      const event = new CustomEvent('openFitnessProfileForm');
      window.dispatchEvent(event);
    };

    window.addEventListener('planGenerated', handlePlanGeneratedEvent);
    window.addEventListener('openCustomize', handleOpenCustomize);
    window.addEventListener('openFitnessProfile', handleOpenFitnessProfile);
    return () => {
      window.removeEventListener('planGenerated', handlePlanGeneratedEvent);
      window.removeEventListener('openCustomize', handleOpenCustomize);
      window.removeEventListener('openFitnessProfile', handleOpenFitnessProfile);
    };
  }, [loadWorkoutPlans]);

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
          <h1 className="text-4xl md:text-6xl font-bold mb-3">
            Custom <span className="text-fitness-primary">Workout Generator</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Generate instant custom workouts based on your available time, equipment, and target muscle groups.
            Perfect for quick sessions when you need a workout right now.
          </p>
        </div>

        {/* Show Plan Viewer if a plan is selected */}
        {selectedPlan ? (
          <div className="mb-8">
            <button
              onClick={() => { setSelectedPlan(null); trackUserActivity(); }}
              className="mb-4 text-fitness-primary hover:text-fitness-primary/80 flex items-center gap-2"
            >
              ← Back to Plans
            </button>
            <WorkoutPlanViewer
              plan={selectedPlan}
              onMarkComplete={handleMarkDayComplete}
            />
          </div>
        ) : (
          <>
            {/* 30-Day Plans Section */}
            <div className="mb-8">
              <UserWorkoutPlans 
                workoutPlans={workoutPlans}
                onSelectPlan={handleSelectPlan}
                onDeletePlan={handleDeletePlan}
              />
            </div>

            {/* Custom Workout Generator Section */}
            <div className="max-w-3xl mx-auto">
              {currentWorkout ? (
                <WorkoutDisplay
                  workout={currentWorkout}
                  onBack={() => { setCurrentWorkout(null); trackUserActivity(); }}
                  onComplete={handleCompleteWorkout}
                />
              ) : (
                <WorkoutForm 
                  onSubmit={handleCreateWorkout}
                />
              )}
            </div>
          </>
        )}

        {/* Workout Plan Generator Dialog */}
        <WorkoutPlanGenerator
          isOpen={showPlanGenerator}
          onClose={() => setShowPlanGenerator(false)}
          profile={profile}
          onPlanGenerated={handlePlanGenerated}
        />
      </div>
    </PageContainer>
  );
};

export default Home;
