
import { useState, useEffect } from 'react';
import { Workout, WorkoutHistoryItem, TimeFrame } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useWorkoutHistory = () => {
  const [history, setHistory] = useState<WorkoutHistoryItem[]>([]);
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load history from Supabase
  useEffect(() => {
    if (user) {
      loadWorkoutHistory();
    } else {
      setHistory([]);
      setRecentWorkouts([]);
      setLoading(false);
    }
  }, [user]);

  const loadWorkoutHistory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Convert Supabase data to our format
        const workoutHistory: WorkoutHistoryItem[] = data.map(workout => ({
          id: workout.id,
          date: workout.created_at,
          workoutId: workout.id,
          completed: workout.completed || false
        }));

        const workouts: Workout[] = data.map(workout => ({
          id: workout.id,
          title: workout.title,
          duration: workout.duration as TimeFrame,
          intensity: workout.intensity as any,
          targetMuscleGroups: workout.target_muscle_groups,
          equipment: workout.equipment,
          exercises: workout.exercises,
          warmupExercises: workout.warmup_exercises,
          cooldownExercises: workout.cooldown_exercises
        }));

        setHistory(workoutHistory);
        setRecentWorkouts(workouts.slice(0, 5));
      }
    } catch (error) {
      console.error('Error loading workout history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add a workout to history
  const addWorkoutToHistory = async (workout: Workout) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('workouts')
        .insert({
          user_id: user.id,
          title: workout.title,
          duration: workout.duration,
          intensity: workout.intensity,
          target_muscle_groups: workout.targetMuscleGroups,
          equipment: workout.equipment,
          exercises: workout.exercises,
          warmup_exercises: workout.warmupExercises,
          cooldown_exercises: workout.cooldownExercises,
          completed: false
        });

      if (error) throw error;

      // Reload history to get the latest data
      await loadWorkoutHistory();
    } catch (error) {
      console.error('Error adding workout to history:', error);
    }
  };

  // Mark a workout as completed
  const markWorkoutCompleted = async (historyItemId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('workouts')
        .update({ 
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', historyItemId);

      if (error) throw error;

      // Update local state
      setHistory(prev =>
        prev.map(item =>
          item.id === historyItemId
            ? { ...item, completed: true }
            : item
        )
      );
    } catch (error) {
      console.error('Error marking workout as completed:', error);
    }
  };

  return {
    history,
    recentWorkouts,
    loading,
    addWorkoutToHistory,
    markWorkoutCompleted
  };
};
