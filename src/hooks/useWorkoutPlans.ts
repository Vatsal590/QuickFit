
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { WorkoutPlan } from '@/types';

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
      console.log('Loading workout plans for user:', user.id);
      
      const { data, error } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading workout plans:', error);
        setWorkoutPlans([]);
      } else {
        console.log('Loaded workout plans:', data);
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
    console.log('Adding workout plan to local state:', plan);
    setWorkoutPlans(prev => [plan, ...prev]);
  };

  // Add a function to save a workout plan to the database
  const saveWorkoutPlan = async (planData: {
    plan_name: string;
    fitness_goal: string;
    profile_id: string;
    daily_workouts: any[];
    total_days?: number;
  }) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    console.log('Saving workout plan:', planData);

    try {
      const { data, error } = await supabase
        .from('workout_plans')
        .insert({
          user_id: user.id,
          profile_id: planData.profile_id,
          plan_name: planData.plan_name,
          fitness_goal: planData.fitness_goal,
          daily_workouts: planData.daily_workouts,
          total_days: planData.total_days || 30,
          is_active: true
        })
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error saving workout plan:', error);
        throw error;
      }

      console.log('Workout plan saved successfully:', data);
      
      // Reload plans to get the latest data
      await loadWorkoutPlans();
      
      return data;
    } catch (error) {
      console.error('Failed to save workout plan:', error);
      throw error;
    }
  };

  const deleteWorkoutPlan = async (planId: string) => {
    if (!user) return;

    try {
      console.log('Deleting workout plan:', planId);
      
      const { error } = await supabase
        .from('workout_plans')
        .delete()
        .eq('id', planId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting workout plan:', error);
        throw error;
      } else {
        console.log('Workout plan deleted successfully');
        setWorkoutPlans(prev => prev.filter(plan => plan.id !== planId));
      }
    } catch (error) {
      console.error('Error deleting workout plan:', error);
      throw error;
    }
  };

  const markDayComplete = async (planId: string, dayNumber: number) => {
    if (!user) return;

    try {
      console.log('Marking day complete:', { planId, dayNumber });
      
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
        throw error;
      } else {
        console.log('Day marked as complete successfully');
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
      throw error;
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
    saveWorkoutPlan,
    deleteWorkoutPlan,
    markDayComplete
  };
};
