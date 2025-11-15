import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useRewardPoints = () => {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCongrats, setShowCongrats] = useState(false);

  const checkAndResetPoints = async (lastWorkoutDate: string | null, currentPoints: number) => {
    if (!lastWorkoutDate || !user) return currentPoints;

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastWorkout = new Date(lastWorkoutDate);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const lastWorkoutStr = lastWorkout.toISOString().split('T')[0];

    // If last workout was not yesterday or today, reset points
    const todayStr = today.toISOString().split('T')[0];
    if (lastWorkoutStr !== yesterdayStr && lastWorkoutStr !== todayStr) {
      // Reset points to 0
      const { error } = await supabase
        .from('user_points')
        .update({ total_points: 0 })
        .eq('user_id', user.id);

      if (!error) {
        return 0;
      }
    }

    return currentPoints;
  };

  const loadPoints = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading points:', error);
        return;
      }

      if (data) {
        // Check if points should be reset due to missed day
        const checkedPoints = await checkAndResetPoints(data.last_workout_date, data.total_points);
        setPoints(checkedPoints);
      } else {
        // Create initial points record
        const { data: newData, error: insertError } = await supabase
          .from('user_points')
          .insert({ user_id: user.id, total_points: 0 })
          .select()
          .single();

        if (!insertError && newData) {
          setPoints(newData.total_points);
        }
      }
    } catch (error) {
      console.error('Error in loadPoints:', error);
    } finally {
      setLoading(false);
    }
  };

  const awardPoints = async () => {
    if (!user) return false;

    try {
      const today = new Date().toISOString().split('T')[0];

      // Get current points record
      const { data: currentData, error: fetchError } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching points:', fetchError);
        return false;
      }

      // Check if already earned points today
      if (currentData?.last_workout_date === today) {
        return false;
      }

      const newPoints = (currentData?.total_points || 0) + 10;

      if (currentData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('user_points')
          .update({
            total_points: newPoints,
            last_workout_date: today
          })
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Error updating points:', updateError);
          return false;
        }
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('user_points')
          .insert({
            user_id: user.id,
            total_points: newPoints,
            last_workout_date: today
          });

        if (insertError) {
          console.error('Error inserting points:', insertError);
          return false;
        }
      }

      setPoints(newPoints);

      // Check if reached 500 points
      if (currentData && currentData.total_points < 500 && newPoints >= 500) {
        setShowCongrats(true);
      }

      return true;
    } catch (error) {
      console.error('Error awarding points:', error);
      return false;
    }
  };

  useEffect(() => {
    loadPoints();
  }, [user]);

  return {
    points,
    loading,
    showCongrats,
    setShowCongrats,
    awardPoints,
    loadPoints
  };
};
