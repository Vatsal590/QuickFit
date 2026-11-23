
import { useState, useEffect } from 'react';
import { rememberFact } from '@/lib/memory';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { WorkoutPlan } from '@/types';
import { activityTracker } from '@/utils/activityTracker';

export const useWorkoutPlans = () => {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadWorkoutPlans = async () => {
    if (!user) {
      setWorkoutPlans([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading workout plans:', error);
        setWorkoutPlans([]);
      } else {
        const plans: WorkoutPlan[] = (data || []).map(plan => ({
          id: plan.id,
          title: plan.plan_name,
          goal: plan.fitness_goal,
          type: 'custom',
          duration: plan.total_days || 30,
          daysLeft: plan.total_days || 30,
          equipment: [],
          createdAt: plan.created_at,
          dailyWorkouts: Array.isArray(plan.daily_workouts) ? plan.daily_workouts : []
        }));
        setWorkoutPlans(plans);
      }
    } catch (error) {
      console.error('Error loading workout plans:', error);
      setWorkoutPlans([]);
    } finally {
      setLoading(false);
    }
  };

  // Add a function to manually add a workout plan (for immediate UI updates)
  const addWorkoutPlan = (plan: WorkoutPlan) => {
    setWorkoutPlans(prev => [plan, ...prev]);
  };

  const deleteWorkoutPlan = async (planId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('workout_plans')
        .delete()
        .eq('id', planId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting workout plan:', error);
      } else {
        setWorkoutPlans(prev => prev.filter(plan => plan.id !== planId));
      }
    } catch (error) {
      console.error('Error deleting workout plan:', error);
    }
  };

  const markDayComplete = async (planId: string, dayNumber: number) => {
    if (!user) return;

    try {
      // Get the current plan
      const currentPlan = workoutPlans.find(p => p.id === planId);
      if (!currentPlan?.dailyWorkouts) return;

      // Update the specific day as completed
      const updatedDailyWorkouts = currentPlan.dailyWorkouts.map((day: any) => 
        day.day === dayNumber ? { ...day, completed: true } : day
      );

      // Calculate new days left
      const completedDays = updatedDailyWorkouts.filter((day: any) => day.completed).length;
      const newDaysLeft = Math.max(0, currentPlan.duration - completedDays);

      const { error } = await supabase
        .from('workout_plans')
        .update({ 
          daily_workouts: updatedDailyWorkouts 
        })
        .eq('id', planId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating workout plan:', error);
      } else {
        const done: any = currentPlan.dailyWorkouts.find((d: any) => d.day === dayNumber);
        const focus = String(done?.workout?.focus ?? '').replace(/_/g, ' ');
        const names = (done?.workout?.exercises ?? []).map((e: any) => [e.sets && e.reps ? `${e.sets}x${e.reps}` : '', e.name].filter(Boolean).join(' ')).filter(Boolean).join(', ');
        rememberFact('workout', `Completed day ${dayNumber} of the 30-day plan${focus ? ` (${focus})` : ''}${names ? `: ${names}` : ''}`.slice(0, 1000));
        // Track activity
        await activityTracker.trackActivity('workout_plan_day_completed', 'plans', {
          planId,
          dayNumber,
          planName: currentPlan.title,
          daysRemaining: newDaysLeft
        });

        // Update local state
        setWorkoutPlans(prev => prev.map(plan => 
          plan.id === planId 
            ? { 
                ...plan, 
                dailyWorkouts: updatedDailyWorkouts,
                daysLeft: newDaysLeft
              }
            : plan
        ));
      }
    } catch (error) {
      console.error('Error marking day complete:', error);
    }
  };

  useEffect(() => {
    loadWorkoutPlans();
  }, [user]);

  return {
    workoutPlans,
    loading,
    loadWorkoutPlans,
    addWorkoutPlan,
    deleteWorkoutPlan,
    markDayComplete
  };
};
