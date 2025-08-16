
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
  body_type: string[];
  workout_days_per_week: number;
  available_equipment: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateFitnessProfileData {
  height: number;
  weight: number;
  fitness_goal: string;
  body_type: string[];
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
      
      if (!data) return null;
      
      // Handle both string and array formats for body_type
      let bodyType: string[] = [];
      if (typeof data.body_type === 'string') {
        try {
          // Try to parse as JSON array first
          bodyType = JSON.parse(data.body_type);
        } catch {
          // If parsing fails, treat as single string and convert to array
          bodyType = [data.body_type];
        }
      } else if (Array.isArray(data.body_type)) {
        bodyType = data.body_type;
      }
      
      return {
        ...data,
        body_type: bodyType
      } as FitnessProfile;
    },
    enabled: !!user
  });

  const createProfileMutation = useMutation({
    mutationFn: async (profileData: CreateFitnessProfileData) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('fitness_profiles')
        .insert({
          user_id: user.id,
          ...profileData,
          body_type: JSON.stringify(profileData.body_type)
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fitness-profile', user?.id] });
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: Partial<CreateFitnessProfileData>) => {
      if (!user || !profile) throw new Error('User not authenticated or profile not found');
      
      const updateData: any = {
        ...profileData,
        updated_at: new Date().toISOString()
      };
      
      // Convert body_type array to JSON string for database storage
      if (updateData.body_type) {
        updateData.body_type = JSON.stringify(updateData.body_type);
      }
      
      const { data, error } = await supabase
        .from('fitness_profiles')
        .update(updateData)
        .eq('id', profile.id)
        .select()
        .single();
      
      if (error) throw error;
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
