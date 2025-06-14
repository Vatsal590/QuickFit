
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import UserWorkoutPlans from '@/components/fitness/UserWorkoutPlans';
import SubscriptionSuccess from '@/components/subscription/SubscriptionSuccess';
import WorkoutForm from '@/components/workout/WorkoutForm';
import WorkoutDisplay from '@/components/workout/WorkoutDisplay';
import WorkoutPlanViewer from '@/components/fitness/WorkoutPlanViewer';
import { Workout, WorkoutFormData, WorkoutPlan } from '@/types';
import { useWorkoutHistory } from '@/hooks/useWorkoutHistory';
import { useWorkoutPlans } from '@/hooks/useWorkoutPlans';
import { generateWorkout } from '@/data/workoutGenerator';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successPlan, setSuccessPlan] = useState('');
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const { addWorkoutToHistory, markWorkoutCompleted } = useWorkoutHistory();
  const { workoutPlans, deleteWorkoutPlan, loadWorkoutPlans, markDayComplete } = useWorkoutPlans();

  useEffect(() => {
    const success = searchParams.get('success');
    const plan = searchParams.get('plan');
    
    if (success === 'true' && plan) {
      setShowSuccess(true);
      setSuccessPlan(plan);
      // Clean up URL
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setSuccessPlan('');
  };

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

  const handleSelectPlan = (plan: WorkoutPlan) => {
    console.log("Selected plan:", plan);
    setSelectedPlan(plan);
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      await deleteWorkoutPlan(planId);
      toast({
        title: "Plan deleted",
        description: "Your workout plan has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast({
        title: "Error",
        description: "Failed to delete workout plan. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleMarkDayComplete = async (planId: string, dayNumber: number) => {
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

  const handlePlanGenerated = (plan: any) => {
    console.log('Plan generated and saved:', plan);
    // Reload workout plans to show the new plan
    loadWorkoutPlans();
    toast({
      title: "Success!",
      description: "Your 30-day workout plan has been created and saved.",
    });
  };

  if (showSuccess) {
    return (
      <PageContainer>
        <SubscriptionSuccess plan={successPlan} onClose={handleCloseSuccess} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to QuickFit
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your personal fitness journey starts here. Generate custom workouts or follow our expert-designed athlete plans.
          </p>
        </div>
        
        {/* Show Plan Viewer if a plan is selected */}
        {selectedPlan ? (
          <div className="mb-8">
            <button
              onClick={() => setSelectedPlan(null)}
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
            <UserWorkoutPlans 
              workoutPlans={workoutPlans}
              onSelectPlan={handleSelectPlan}
              onDeletePlan={handleDeletePlan}
              onPlanGenerated={handlePlanGenerated}
            />

            {/* Custom Workout Generator Section */}
            <div className="max-w-3xl mx-auto">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold mb-3">
                  Custom <span className="text-fitness-primary">Workout Generator</span>
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Generate instant custom workouts based on your available time, equipment, and target muscle groups.
                  Perfect for quick sessions when you need a workout right now.
                </p>
              </div>

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
          </>
        )}
      </div>
    </PageContainer>
  );
};

export default Index;
