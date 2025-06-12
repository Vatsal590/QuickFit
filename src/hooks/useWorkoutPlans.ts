
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
          createdAt: plan.created_at
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

  useEffect(() => {
    loadWorkoutPlans();
  }, [user]);

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

  return {
    workoutPlans,
    loading,
    loadWorkoutPlans,
    deleteWorkoutPlan
  };
};
