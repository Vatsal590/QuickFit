
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface FitnessProfile {
  id: string;
  user_id: string;
  height: number;
  weight: number;
  fitness_goal: 'muscle_gain' | 'fat_loss' | 'athlete_training';
  body_type: 'ectomorph' | 'mesomorph' | 'endomorph';
  workout_days_per_week: number;
  available_equipment: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateFitnessProfileData {
  height: number;
  weight: number;
  fitness_goal: string;
  body_type: string;
  workout_days_per_week: number;
  available_equipment: string[];
}

export const useFitnessProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['fitness-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('fitness_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data as FitnessProfile | null;
    },
    enabled: !!user
  });

  const createProfileMutation = useMutation({
    mutationFn: async (profileData: CreateFitnessProfileData) => {
      if (!user) throw new Error('User not authenticated');
      
      console.log('Creating profile with data:', profileData);
      
      const { data, error } = await supabase
        .from('fitness_profiles')
        .insert({
          user_id: user.id,
          ...profileData
        })
        .select()
        .maybeSingle();
      
      if (error) {
        console.error('Error creating profile:', error);
        throw error;
      }
      
      console.log('Profile created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fitness-profile', user?.id] });
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: Partial<CreateFitnessProfileData>) => {
      if (!user || !profile) throw new Error('User not authenticated or profile not found');
      
      console.log('Updating profile with data:', profileData);
      
      const { data, error } = await supabase
        .from('fitness_profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id)
        .select()
        .maybeSingle();
      
      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
      
      console.log('Profile updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fitness-profile', user?.id] });
    }
  });

  return {
    profile,
    isLoading,
    error,
    createProfile: createProfileMutation.mutateAsync,
    updateProfile: updateProfileMutation.mutateAsync,
    isCreating: createProfileMutation.isPending,
    isUpdating: updateProfileMutation.isPending
  };
};
