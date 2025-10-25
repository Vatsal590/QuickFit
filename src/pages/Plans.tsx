import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import UserWorkoutPlans from '../components/fitness/UserWorkoutPlans';
import WorkoutPlanViewer from '../components/fitness/WorkoutPlanViewer';
import WorkoutPlanGenerator from '../components/fitness/WorkoutPlanGenerator';
import { WorkoutPlan } from '../types';
import { useWorkoutPlans } from '../hooks/useWorkoutPlans';
import { useToast } from '@/hooks/use-toast';
import { useFitnessProfile } from '../hooks/useFitnessProfile';
import { useTranslation } from '@/contexts/TranslationContext';
import { activityTracker } from '@/utils/activityTracker';

const Plans = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [showPlanGenerator, setShowPlanGenerator] = useState(false);
  const { profile, isLoading: profileLoading } = useFitnessProfile();
  const { workoutPlans, loading: plansLoading, deleteWorkoutPlan, markDayComplete, loadWorkoutPlans, addWorkoutPlan } = useWorkoutPlans();

  const handleSelectPlan = (plan: WorkoutPlan) => {
    activityTracker.trackButtonClick('select_plan', 'plans', { planId: plan.id, planName: plan.title });
    setSelectedPlan(plan);
  };

  const handleDeletePlan = async (planId: string) => {
    activityTracker.trackButtonClick('delete_plan', 'plans', { planId });
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
    activityTracker.trackButtonClick('mark_day_complete', 'plans', { planId, dayNumber });
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
    activityTracker.trackWorkoutAction('plan_generated', { planId: newPlan.id, planName: newPlan.title });
    addWorkoutPlan(newPlan);
  };

  React.useEffect(() => {
    const handlePlanGeneratedEvent = () => {
      loadWorkoutPlans();
    };

    window.addEventListener('planGenerated', handlePlanGeneratedEvent);
    return () => {
      window.removeEventListener('planGenerated', handlePlanGeneratedEvent);
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
            {t('Your Workout Plan')}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('Create your 30-day workout plans and track your progress.')}
          </p>
        </div>

        {selectedPlan ? (
          <div className="mb-8">
            <button
              onClick={() => { 
                setSelectedPlan(null); 
                activityTracker.trackButtonClick('back_to_plans', 'plans');
              }}
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
          <UserWorkoutPlans 
            workoutPlans={workoutPlans}
            onSelectPlan={handleSelectPlan}
            onDeletePlan={handleDeletePlan}
          />
        )}

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

export default Plans;
