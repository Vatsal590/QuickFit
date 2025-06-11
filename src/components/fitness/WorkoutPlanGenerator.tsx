
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { FitnessProfile } from '../../hooks/useFitnessProfile';
import { Loader2, Sparkles } from 'lucide-react';

interface WorkoutPlanGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  profile: FitnessProfile;
}

const WorkoutPlanGenerator = ({ isOpen, onClose, profile }: WorkoutPlanGeneratorProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateWorkoutPlan = async () => {
    if (!user || !profile) return;

    setIsGenerating(true);
    try {
      // Generate a comprehensive 30-day workout plan based on user's profile
      const dailyWorkouts = generatePersonalizedPlan(profile);
      
      const planName = `${profile.fitness_goal.replace('_', ' ')} Plan - ${new Date().toLocaleDateString()}`;
      
      const { data, error } = await supabase
        .from('workout_plans')
        .insert({
          user_id: user.id,
          profile_id: profile.id,
          plan_name: planName,
          fitness_goal: profile.fitness_goal,
          total_days: 30,
          daily_workouts: dailyWorkouts
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Plan generated successfully!",
        description: "Your personalized 30-day workout plan is ready to use."
      });

      queryClient.invalidateQueries({ queryKey: ['workout-plans', user.id] });
      onClose();
    } catch (error) {
      console.error('Error generating workout plan:', error);
      toast({
        title: "Error",
        description: "Failed to generate workout plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-fitness-primary" />
            Generate Workout Plan
          </DialogTitle>
          <DialogDescription>
            Create a personalized 30-day workout plan based on your fitness profile
          </DialogDescription>
        </DialogHeader>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Profile Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><strong>Goal:</strong> {profile.fitness_goal.replace('_', ' ')}</div>
            <div><strong>Body Type:</strong> {profile.body_type}</div>
            <div><strong>Workout Days:</strong> {profile.workout_days_per_week} per week</div>
            <div><strong>Equipment:</strong> {profile.available_equipment.join(', ')}</div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={generateWorkoutPlan}
            disabled={isGenerating}
            className="flex-1 bg-fitness-primary hover:bg-fitness-primary/90"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Plan'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper function to generate personalized workout plan
const generatePersonalizedPlan = (profile: FitnessProfile) => {
  const { fitness_goal, body_type, workout_days_per_week, available_equipment } = profile;
  
  const dailyWorkouts = [];
  
  // Create a pattern of 2 workout days, 1 rest day
  const workoutPattern = [true, true, false]; // 2 workout, 1 rest
  
  for (let day = 1; day <= 30; day++) {
    const patternIndex = (day - 1) % 3;
    const isWorkoutDay = workoutPattern[patternIndex];
    
    if (isWorkoutDay) {
      const workout = generateDayWorkout(day, fitness_goal, body_type, available_equipment);
      dailyWorkouts.push({
        day,
        isRestDay: false,
        workout
      });
    } else {
      dailyWorkouts.push({
        day,
        isRestDay: true,
        restType: getRestDayActivity(fitness_goal)
      });
    }
  }
  
  return dailyWorkouts;
};

const generateDayWorkout = (day: number, goal: string, bodyType: string, equipment: string[]) => {
  const week = Math.ceil(day / 7);
  const dayInWeek = ((day - 1) % 7) + 1;
  
  // Progressive difficulty based on week
  const intensity = week === 1 ? 'beginner' : week <= 2 ? 'intermediate' : 'advanced';
  
  // Focus areas based on goal and day
  let focusArea = '';
  if (goal === 'muscle_gain') {
    const focusAreas = ['chest_triceps', 'back_biceps', 'legs', 'shoulders', 'full_body'];
    focusArea = focusAreas[(dayInWeek - 1) % focusAreas.length];
  } else if (goal === 'fat_loss') {
    const focusAreas = ['hiit_cardio', 'full_body_strength', 'cardio_core', 'circuit_training'];
    focusArea = focusAreas[(dayInWeek - 1) % focusAreas.length];
  } else if (goal === 'athlete_training') {
    const focusAreas = ['power', 'agility', 'strength', 'endurance', 'speed'];
    focusArea = focusAreas[(dayInWeek - 1) % focusAreas.length];
  }
  
  return {
    title: `Day ${day} - ${focusArea.replace('_', ' ')}`,
    focus: focusArea,
    intensity,
    duration: getDuration(goal, bodyType),
    exercises: generateExercises(focusArea, equipment, intensity),
    notes: getWorkoutNotes(goal, bodyType, week)
  };
};

const getDuration = (goal: string, bodyType: string) => {
  if (goal === 'fat_loss') return 45;
  if (goal === 'athlete_training') return 60;
  return bodyType === 'ectomorph' ? 45 : 50;
};

const generateExercises = (focusArea: string, equipment: string[], intensity: string) => {
  // This would normally call an AI API, but for now we'll generate structured exercises
  const baseExercises = {
    chest_triceps: [
      { name: 'Push-ups', sets: 3, reps: '12-15', rest: '60s' },
      { name: 'Tricep Dips', sets: 3, reps: '10-12', rest: '60s' },
      { name: 'Chest Press', sets: 3, reps: '10-12', rest: '90s' }
    ],
    back_biceps: [
      { name: 'Pull-ups/Rows', sets: 3, reps: '8-12', rest: '90s' },
      { name: 'Bicep Curls', sets: 3, reps: '12-15', rest: '60s' },
      { name: 'Lat Pulldowns', sets: 3, reps: '10-12', rest: '90s' }
    ],
    legs: [
      { name: 'Squats', sets: 4, reps: '12-15', rest: '90s' },
      { name: 'Lunges', sets: 3, reps: '10 each leg', rest: '60s' },
      { name: 'Calf Raises', sets: 3, reps: '15-20', rest: '45s' }
    ],
    hiit_cardio: [
      { name: 'Burpees', sets: 4, reps: '30s on/30s off', rest: '60s' },
      { name: 'Mountain Climbers', sets: 4, reps: '30s on/30s off', rest: '60s' },
      { name: 'Jump Squats', sets: 4, reps: '30s on/30s off', rest: '60s' }
    ]
  };
  
  return baseExercises[focusArea as keyof typeof baseExercises] || baseExercises.chest_triceps;
};

const getRestDayActivity = (goal: string) => {
  if (goal === 'fat_loss') return 'Light cardio (walking, stretching)';
  if (goal === 'athlete_training') return 'Active recovery (mobility, light movement)';
  return 'Complete rest or gentle stretching';
};

const getWorkoutNotes = (goal: string, bodyType: string, week: number) => {
  const baseNotes = {
    muscle_gain: 'Focus on progressive overload. Increase weight when you can complete all reps easily.',
    fat_loss: 'Maintain high intensity. Focus on form over speed.',
    athlete_training: 'Explosive movements. Focus on power and technique.'
  };
  
  const weekNotes = week === 1 ? ' Start conservatively to learn proper form.' : 
                   week <= 2 ? ' Increase intensity gradually.' : 
                   ' Push your limits while maintaining good form.';
  
  return baseNotes[goal as keyof typeof baseNotes] + weekNotes;
};

export default WorkoutPlanGenerator;
