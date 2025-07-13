import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { FitnessProfile } from '../../hooks/useFitnessProfile';
import { Loader2, Sparkles } from 'lucide-react';

interface WorkoutPlanGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  profile: FitnessProfile | null;
  onPlanGenerated?: (plan: any) => void;
}

const WorkoutPlanGenerator = ({ isOpen, onClose, profile, onPlanGenerated }: WorkoutPlanGeneratorProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  const capitalizeWords = (str: string) => {
    return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const generateWorkoutPlan = async () => {
    if (!user || !profile) return;

    setIsGenerating(true);
    try {
      const dailyWorkouts = generatePersonalizedPlan(profile);
      
      const planName = `${capitalizeWords(profile.fitness_goal)} Plan - ${new Date().toLocaleDateString()}`;
      
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

      const newPlan = {
        id: data.id,
        title: data.plan_name,
        goal: data.fitness_goal,
        type: 'custom',
        duration: data.total_days,
        daysLeft: data.total_days,
        equipment: profile.available_equipment,
        createdAt: data.created_at,
        dailyWorkouts: data.daily_workouts
      };

      if (onPlanGenerated) {
        onPlanGenerated(newPlan);
      }

      toast({
        title: "Plan generated successfully!",
        description: "Your personalized 30-day workout plan is ready to use."
      });

      window.dispatchEvent(new CustomEvent('planGenerated'));
      
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

        {!profile ? (
          <Card>
            <CardContent className="py-8 text-center">
              <div className="bg-gray-100 rounded-full p-4 mb-4 mx-auto w-fit">
                <Sparkles className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Complete Your Profile First</h3>
              <p className="text-gray-500 mb-4">
                You need to complete your fitness profile before generating a workout plan.
              </p>
              <Button 
                onClick={() => {
                  onClose();
                  // Navigate to profile page - you might need to implement this
                  window.location.href = '/profile';
                }}
                className="bg-fitness-primary hover:bg-fitness-primary/90"
              >
                Complete Profile
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Profile Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div><strong>Goal:</strong> {capitalizeWords(profile.fitness_goal)}</div>
                <div><strong>Body Type:</strong> {Array.isArray(profile.body_type) ? profile.body_type.join(', ') : profile.body_type}</div>
                <div><strong>Height:</strong> {profile.height}cm</div>
                <div><strong>Weight:</strong> {profile.weight}kg</div>
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Helper function to check if exercise can be performed with available equipment
const canPerformExercise = (exercise: any, availableEquipment: string[]) => {
  // If exercise requires no equipment, it can always be performed
  if (!exercise.equipment || exercise.equipment.length === 0 || exercise.equipment.includes('none')) {
    return true;
  }
  
  // Check if user has at least one piece of required equipment
  return exercise.equipment.some((required: string) => 
    availableEquipment.includes(required) || required === 'none'
  );
};

// Helper function to get user-specific exercise modifications
const customizeExerciseForUser = (exercise: any, profile: FitnessProfile) => {
  const { weight, height, body_type, fitness_goal } = profile;
  const bmi = weight / ((height / 100) ** 2);
  
  let modifiedExercise = { ...exercise };
  
  // Adjust based on BMI and body type
  if (bmi > 30 || body_type.includes('endomorph')) {
    // Lower impact modifications for higher BMI
    if (exercise.name.includes('Jump') || exercise.name.includes('Plyometric')) {
      modifiedExercise.sets = Math.max(2, exercise.sets - 1);
      modifiedExercise.reps = typeof exercise.reps === 'string' ? exercise.reps : Math.max(5, exercise.reps - 2);
    }
  }
  
  // Adjust based on fitness goal
  if (fitness_goal === 'muscle_gain') {
    if (typeof exercise.sets === 'number') modifiedExercise.sets = Math.min(5, exercise.sets + 1);
    if (typeof exercise.reps === 'string' && exercise.reps.includes('-')) {
      const [min, max] = exercise.reps.split('-').map(n => parseInt(n));
      modifiedExercise.reps = `${Math.max(6, min)}${max ? `-${Math.min(12, max + 2)}` : ''}`;
    }
  } else if (fitness_goal === 'fat_loss') {
    if (typeof exercise.sets === 'number') modifiedExercise.sets = Math.min(4, exercise.sets);
    modifiedExercise.rest = exercise.rest?.replace(/\d+/, (match: string) => 
      Math.max(30, parseInt(match) - 15).toString()
    );
  }
  
  return modifiedExercise;
};

const generatePersonalizedPlan = (profile: FitnessProfile) => {
  const { fitness_goal, body_type, workout_days_per_week, available_equipment } = profile;
  
  const dailyWorkouts = [];
  
  // Create a pattern of 2 workout days, 1 rest day
  const workoutPattern = [true, true, false];
  
  for (let day = 1; day <= 30; day++) {
    const patternIndex = (day - 1) % 3;
    const isWorkoutDay = workoutPattern[patternIndex];
    
    if (isWorkoutDay) {
      const workout = generateDayWorkout(day, fitness_goal, body_type, available_equipment, profile);
      dailyWorkouts.push({
        day,
        isRestDay: false,
        workout,
        completed: false
      });
    } else {
      dailyWorkouts.push({
        day,
        isRestDay: true,
        restType: getRestDayActivity(fitness_goal),
        completed: false
      });
    }
  }
  
  return dailyWorkouts;
};

const generateDayWorkout = (day: number, goal: string, bodyType: string[], equipment: string[], profile: FitnessProfile) => {
  const week = Math.ceil(day / 7);
  const dayInWeek = ((day - 1) % 7) + 1;
  
  // Progressive difficulty based on week
  const intensity = week === 1 ? 'beginner' : week <= 2 ? 'intermediate' : 'advanced';
  
  // Focus areas based on goal and day
  let focusArea = '';
  if (goal === 'muscle_gain') {
    const focusAreas = ['chest_triceps', 'back_biceps', 'legs', 'shoulders', 'core'];
    focusArea = focusAreas[(dayInWeek - 1) % focusAreas.length];
  } else if (goal === 'fat_loss') {
    const focusAreas = ['hiit_cardio', 'full_body_strength', 'cardio_core', 'circuit_training'];
    focusArea = focusAreas[(dayInWeek - 1) % focusAreas.length];
  } else if (goal === 'athlete_training') {
    const focusAreas = [
      'explosive_power', 
      'agility_speed', 
      'functional_strength', 
      'sport_specific_conditioning', 
      'movement_mobility',
      'plyometric_training',
      'core_stability'
    ];
    focusArea = focusAreas[(dayInWeek - 1) % focusAreas.length];
  }
  
  return {
    title: `Day ${day} - ${focusArea.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
    focus: focusArea,
    intensity,
    duration: getDuration(goal, bodyType),
    exercises: generateExercises(focusArea, equipment, intensity, day, profile),
    notes: getWorkoutNotes(goal, bodyType, week)
  };
};

const getDuration = (goal: string, bodyType: string[]) => {
  if (goal === 'fat_loss') return 45;
  if (goal === 'athlete_training') return 60;
  return bodyType.includes('ectomorph') ? 45 : 50;
};

const generateExercises = (focusArea: string, equipment: string[], intensity: string, day: number, profile: FitnessProfile) => {
  // Enhanced exercise pool with equipment requirements
  const exercisePool = {
    explosive_power: [
      [
        { name: 'Medicine Ball Slams', sets: 4, reps: '8-10', rest: '90s', equipment: ['medicine ball'] },
        { name: 'Jump Squats', sets: 4, reps: '6-8', rest: '90s', equipment: ['none'] },
        { name: 'Explosive Push-ups', sets: 3, reps: '5-8', rest: '60s', equipment: ['none'] },
        { name: 'Box Jumps', sets: 3, reps: '5-8', rest: '120s', equipment: ['box', 'none'] },
        { name: 'Kettlebell Swings', sets: 3, reps: '10-12', rest: '60s', equipment: ['kettlebell'] },
        { name: 'Burpees', sets: 3, reps: '8-10', rest: '90s', equipment: ['none'] },
        { name: 'Dumbbell Thrusters', sets: 3, reps: '6-8', rest: '90s', equipment: ['dumbbells'] }
      ]
    ],
    agility_speed: [
      [
        { name: 'High Knees', sets: 4, reps: '30s each', rest: '45s', equipment: ['none'] },
        { name: 'Lateral Shuffles', sets: 3, reps: '20 each way', rest: '45s', equipment: ['none'] },
        { name: 'Mountain Climbers', sets: 3, reps: '30s', rest: '30s', equipment: ['none'] },
        { name: 'Butt Kickers', sets: 3, reps: '30s', rest: '30s', equipment: ['none'] },
        { name: 'Sprint in Place', sets: 4, reps: '20s', rest: '40s', equipment: ['none'] }
      ]
    ],
    functional_strength: [
      [
        { name: 'Bodyweight Squats', sets: 4, reps: '12-15', rest: '90s', equipment: ['none'] },
        { name: 'Push-ups', sets: 3, reps: '10-12', rest: '60s', equipment: ['none'] },
        { name: 'Lunges', sets: 3, reps: '10 each leg', rest: '60s', equipment: ['none'] },
        { name: 'Plank', sets: 3, reps: '30-45s', rest: '60s', equipment: ['none'] },
        { name: 'Dumbbell Rows', sets: 3, reps: '10-12', rest: '90s', equipment: ['dumbbells'] },
        { name: 'Kettlebell Deadlifts', sets: 3, reps: '8-10', rest: '90s', equipment: ['kettlebell'] }
      ]
    ],
    sport_specific_conditioning: [
      [
        { name: 'Jumping Jacks', sets: 3, reps: '30s', rest: '45s', equipment: ['none'] },
        { name: 'Bear Crawl', sets: 3, reps: '20m', rest: '60s', equipment: ['none'] },
        { name: 'Side Plank', sets: 2, reps: '30s each side', rest: '45s', equipment: ['none'] },
        { name: 'Russian Twists', sets: 3, reps: '20', rest: '30s', equipment: ['none'] },
        { name: 'Resistance Band Pulls', sets: 3, reps: '15', rest: '45s', equipment: ['resistance bands'] }
      ]
    ],
    movement_mobility: [
      [
        { name: 'Hip Circles', sets: 2, reps: '10 each way', rest: '30s', equipment: ['none'] },
        { name: 'Leg Swings', sets: 2, reps: '15 each', rest: '30s', equipment: ['none'] },
        { name: 'Arm Circles', sets: 2, reps: '15 each way', rest: '30s', equipment: ['none'] },
        { name: 'Cat Cow Stretch', sets: 2, reps: '10', rest: '30s', equipment: ['none'] },
        { name: 'Deep Breathing', sets: 2, reps: '1 min', rest: '30s', equipment: ['none'] }
      ]
    ],
    plyometric_training: [
      [
        { name: 'Jump Squats', sets: 3, reps: '8-10', rest: '90s', equipment: ['none'] },
        { name: 'Burpees', sets: 3, reps: '6-8', rest: '90s', equipment: ['none'] },
        { name: 'Tuck Jumps', sets: 3, reps: '5-8', rest: '120s', equipment: ['none'] },
        { name: 'Lateral Bounds', sets: 3, reps: '10 each side', rest: '60s', equipment: ['none'] },
        { name: 'Medicine Ball Throws', sets: 3, reps: '8-10', rest: '90s', equipment: ['medicine ball'] }
      ]
    ],
    core_stability: [
      [
        { name: 'Plank', sets: 3, reps: '30-45s', rest: '60s', equipment: ['none'] },
        { name: 'Side Plank', sets: 3, reps: '30s each side', rest: '45s', equipment: ['none'] },
        { name: 'Dead Bug', sets: 3, reps: '10 each side', rest: '45s', equipment: ['none'] },
        { name: 'Bird Dog', sets: 3, reps: '10 each side', rest: '45s', equipment: ['none'] },
        { name: 'Russian Twists', sets: 3, reps: '20', rest: '30s', equipment: ['none'] },
        { name: 'Resistance Band Core Rotation', sets: 3, reps: '12 each side', rest: '45s', equipment: ['resistance bands'] }
      ]
    ],
    chest_triceps: [
      [
        { name: 'Push-ups', sets: 3, reps: '12-15', rest: '60s', equipment: ['none'] },
        { name: 'Dumbbell Chest Press', sets: 3, reps: '10-12', rest: '90s', equipment: ['dumbbells'] },
        { name: 'Tricep Dips', sets: 3, reps: '8-12', rest: '60s', equipment: ['none'] },
        { name: 'Diamond Push-ups', sets: 2, reps: '8-10', rest: '60s', equipment: ['none'] },
        { name: 'Resistance Band Chest Fly', sets: 3, reps: '12-15', rest: '60s', equipment: ['resistance bands'] }
      ]
    ],
    back_biceps: [
      [
        { name: 'Superman', sets: 3, reps: '15-20', rest: '45s', equipment: ['none'] },
        { name: 'Reverse Snow Angels', sets: 3, reps: '12-15', rest: '60s', equipment: ['none'] },
        { name: 'Wall Handstand Hold', sets: 2, reps: '30s', rest: '60s', equipment: ['none'] },
        { name: 'Dumbbell Rows', sets: 3, reps: '10-12', rest: '90s', equipment: ['dumbbells'] },
        { name: 'Resistance Band Bicep Curls', sets: 3, reps: '12-15', rest: '45s', equipment: ['resistance bands'] }
      ]
    ],
    legs: [
      [
        { name: 'Bodyweight Squats', sets: 4, reps: '12-15', rest: '90s', equipment: ['none'] },
        { name: 'Lunges', sets: 3, reps: '10 each leg', rest: '60s', equipment: ['none'] },
        { name: 'Calf Raises', sets: 3, reps: '15-20', rest: '45s', equipment: ['none'] },
        { name: 'Wall Sit', sets: 2, reps: '30-45s', rest: '60s', equipment: ['none'] },
        { name: 'Goblet Squats', sets: 3, reps: '12-15', rest: '90s', equipment: ['dumbbells', 'kettlebell'] }
      ]
    ],
    hiit_cardio: [
      [
        { name: 'Burpees', sets: 4, reps: '30s on/30s off', rest: '60s', equipment: ['none'] },
        { name: 'Mountain Climbers', sets: 4, reps: '30s on/30s off', rest: '60s', equipment: ['none'] },
        { name: 'Jump Squats', sets: 4, reps: '30s on/30s off', rest: '60s', equipment: ['none'] },
        { name: 'High Knees', sets: 3, reps: '30s on/30s off', rest: '60s', equipment: ['none'] },
        { name: 'Kettlebell Swings', sets: 4, reps: '30s on/30s off', rest: '60s', equipment: ['kettlebell'] }
      ]
    ],
    full_body_strength: [
      [
        { name: 'Squats', sets: 3, reps: '12-15', rest: '90s', equipment: ['none'] },
        { name: 'Push-ups', sets: 3, reps: '10-12', rest: '60s', equipment: ['none'] },
        { name: 'Plank', sets: 3, reps: '30-45s', rest: '60s', equipment: ['none'] },
        { name: 'Lunges', sets: 3, reps: '10 each leg', rest: '60s', equipment: ['none'] },
        { name: 'Dumbbell Thrusters', sets: 3, reps: '8-10', rest: '90s', equipment: ['dumbbells'] }
      ]
    ],
    cardio_core: [
      [
        { name: 'Jumping Jacks', sets: 4, reps: '30s', rest: '30s', equipment: ['none'] },
        { name: 'Bicycle Crunches', sets: 3, reps: '20', rest: '30s', equipment: ['none'] },
        { name: 'Russian Twists', sets: 3, reps: '20', rest: '30s', equipment: ['none'] },
        { name: 'Plank Jacks', sets: 3, reps: '30s', rest: '45s', equipment: ['none'] },
        { name: 'Medicine Ball Slams', sets: 3, reps: '10-12', rest: '60s', equipment: ['medicine ball'] }
      ]
    ],
    circuit_training: [
      [
        { name: 'Burpees', sets: 3, reps: '8-10', rest: '45s', equipment: ['none'] },
        { name: 'Push-ups', sets: 3, reps: '10-12', rest: '45s', equipment: ['none'] },
        { name: 'Squats', sets: 3, reps: '15', rest: '45s', equipment: ['none'] },
        { name: 'Mountain Climbers', sets: 3, reps: '20', rest: '45s', equipment: ['none'] },
        { name: 'Resistance Band Pulls', sets: 3, reps: '12-15', rest: '45s', equipment: ['resistance bands'] }
      ]
    ]
  };
  
  // Get base exercises for the focus area
  const baseExercises = exercisePool[focusArea as keyof typeof exercisePool] || exercisePool.functional_strength;
  const exerciseVariation = baseExercises[0] || [];
  
  // Filter exercises based on available equipment
  const availableExercises = exerciseVariation.filter(exercise => 
    canPerformExercise(exercise, equipment)
  );
  
  // If no exercises match equipment, fall back to bodyweight exercises
  if (availableExercises.length === 0) {
    const bodyweightExercises = [
      { name: 'Push-ups', sets: 3, reps: '10-12', rest: '60s', equipment: ['none'] },
      { name: 'Bodyweight Squats', sets: 3, reps: '15', rest: '60s', equipment: ['none'] },
      { name: 'Plank', sets: 3, reps: '30s', rest: '45s', equipment: ['none'] },
      { name: 'Lunges', sets: 3, reps: '10 each leg', rest: '60s', equipment: ['none'] },
      { name: 'Mountain Climbers', sets: 3, reps: '20', rest: '45s', equipment: ['none'] }
    ];
    return bodyweightExercises.map(ex => customizeExerciseForUser(ex, profile));
  }
  
  // Customize exercises for the user's profile
  return availableExercises.map(exercise => customizeExerciseForUser(exercise, profile));
};

const getRestDayActivity = (goal: string) => {
  if (goal === 'fat_loss') return 'Light cardio (walking, stretching)';
  if (goal === 'athlete_training') return 'Active recovery (mobility, light movement, skill work)';
  return 'Complete rest or gentle stretching';
};

const getWorkoutNotes = (goal: string, bodyType: string[], week: number) => {
  const baseNotes = {
    muscle_gain: 'Focus on progressive overload. Increase weight when you can complete all reps easily.',
    fat_loss: 'Maintain high intensity. Focus on form over speed.',
    athlete_training: 'Focus on explosive movements, proper technique, and sport-specific adaptations. Train like your sport depends on it.'
  };
  
  const weekNotes = week === 1 ? ' Start conservatively to build movement patterns.' : 
                   week <= 2 ? ' Increase intensity and complexity.' : 
                   ' Peak performance training - push your athletic limits.';
  
  return baseNotes[goal as keyof typeof baseNotes] + weekNotes;
};

export default WorkoutPlanGenerator;
