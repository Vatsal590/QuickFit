import { useState, useEffect } from 'react';
import { Workout, WorkoutHistoryItem } from '../types';

const STORAGE_KEY = 'quickfit-workout-history';

export const useWorkoutHistory = () => {
  const [history, setHistory] = useState<WorkoutHistoryItem[]>([]);
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  // Load history from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading workout history:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      if (!loading) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      }
    } catch (error) {
      console.error('Error saving workout history:', error);
    }
  }, [history, loading]);

  // Load recent workouts from localStorage
  useEffect(() => {
    try {
      const savedWorkouts = localStorage.getItem('quickfit-recent-workouts');
      if (savedWorkouts) {
        setRecentWorkouts(JSON.parse(savedWorkouts));
      }
    } catch (error) {
      console.error('Error loading recent workouts:', error);
    }
  }, []);

  // Add a workout to history
  const addWorkoutToHistory = (workout: Workout) => {
    // Add to workout history
    const newHistoryItem: WorkoutHistoryItem = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      workoutId: workout.id,
      completed: false
    };
    setHistory(prev => [newHistoryItem, ...prev]);

    // Save to recent workouts (keep only the latest 5)
    const updatedRecentWorkouts = [workout, ...recentWorkouts.filter(w => w.id !== workout.id)].slice(0, 5);
    setRecentWorkouts(updatedRecentWorkouts);
    localStorage.setItem('quickfit-recent-workouts', JSON.stringify(updatedRecentWorkouts));
  };

  // Mark a workout as completed
  const markWorkoutCompleted = (historyItemId: string) => {
    setHistory(prev =>
      prev.map(item =>
        item.id === historyItemId
          ? { ...item, completed: true }
          : item
      )
    );
  };

  return {
    history,
    recentWorkouts,
    loading,
    addWorkoutToHistory,
    markWorkoutCompleted
  };
};
