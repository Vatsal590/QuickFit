import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { FitnessProfile } from '../../hooks/useFitnessProfile';
import { exercises } from '@/data/exercises';
import { Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { BodyPain } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { activityTracker } from '@/utils/activityTracker';

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
  const [selectedPains, setSelectedPains] = useState<BodyPain[]>([]);

  const bodyPainOptions: { value: BodyPain; label: string }[] = [
    { value: "knee pain", label: "Knee Pain" },
    { value: "shoulder pain", label: "Shoulder Pain" },
    { value: "hip pain", label: "Hip Pain" },
    { value: "lower back pain", label: "Lower Back Pain" },
    { value: "wrist pain", label: "Wrist Pain" },
    { value: "ankle pain", label: "Ankle Pain" }
  ];

  const toggleBodyPain = (pain: BodyPain) => {
    setSelectedPains(prev =>
      prev.includes(pain) ? prev.filter(p => p !== pain) : [...prev, pain]
    );
  };

  const capitalizeWords = (str: string) =>
    str.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const generateWorkoutPlan = async () => {
    if (!user) {
      toast({
        title: "You're not signed in",
        description: "Please sign in again and try generating the plan.",
        variant: "destructive"
      });
      return;
    }
    if (!profile) {
      toast({
        title: "Profile not ready",
        description: "Please complete and save your fitness profile first.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const dailyWorkouts = generatePersonalizedPlan(profile, selectedPains);

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

      onPlanGenerated?.(newPlan);

      // Track activity
      await activityTracker.trackActivity('workout_plan_created', 'plans', {
        planName,
        goal: profile.fitness_goal,
        duration: 30,
        painAvoidance: selectedPains
      });

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
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
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
                  const event = new CustomEvent('openFitnessProfileForm');
                  window.dispatchEvent(event);
                }}
                className="bg-fitness-primary hover:bg-fitness-primary/90"
              >
                Complete Profile
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="flex-1 overflow-y-auto min-h-0 pr-2">
            <div className="space-y-4">
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
                  <div><strong>Available Equipment:</strong> {profile.available_equipment.join(', ')}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-fitness-primary" />
                    Any Body Pains?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Select any areas where you experience pain. We'll customize your plan to avoid aggravating these areas.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {bodyPainOptions.map(({ value, label }) => (
                      <Button
                        key={value}
                        type="button"
                        variant={selectedPains.includes(value) ? "default" : "outline"}
                        onClick={() => toggleBodyPain(value)}
                        className={selectedPains.includes(value) ? "bg-fitness-primary hover:bg-fitness-primary/90" : ""}
                        size="sm"
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {profile && (
          <div className="flex gap-3 mt-4 pt-4 border-t flex-shrink-0">
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
        )}
      </DialogContent>
    </Dialog>
  );
};

/* ------------------------------ LOGIC SECTION ------------------------------ */

const generatePersonalizedPlan = (profile: FitnessProfile, bodyPains: BodyPain[] = []) => {
  const { fitness_goal, workout_days_per_week, available_equipment } = profile;
  const dailyWorkouts: any[] = [];

  // Define workout splits based on days per week - ensuring equal muscle group targeting
  const getWorkoutSplit = (days: number) => {
    const splits: Record<number, string[]> = {
      1: ['full_body'],
      2: ['upper_body', 'lower_body'],
      3: ['chest_shoulders', 'back_biceps', 'legs'],
      4: ['chest_shoulders', 'back_biceps', 'legs', 'core'],
      5: ['chest', 'back', 'shoulders', 'legs', 'biceps_triceps'],
      6: ['chest', 'back', 'shoulders', 'legs', 'biceps_triceps', 'core'],
      7: ['chest', 'back', 'shoulders', 'legs', 'biceps', 'triceps', 'core']
    };
    return splits[days] || splits[3];
  };

  const getWorkoutDays = (days: number) => {
    const map: Record<number, number[]> = {
      1: [3], 2: [2, 5], 3: [1, 3, 5], 4: [1, 2, 4, 6],
      5: [1, 2, 3, 4, 5], 6: [1, 2, 3, 4, 5, 6], 7: [1, 2, 3, 4, 5, 6, 7]
    };
    return map[days] || [1, 3, 5];
  };

  const workoutDays = getWorkoutDays(workout_days_per_week);
  const workoutSplit = getWorkoutSplit(workout_days_per_week);

  let workoutIndex = 0;
  for (let day = 1; day <= 30; day++) {
    const dayOfWeek = ((day - 1) % 7) + 1;
    if (workoutDays.includes(dayOfWeek)) {
      const focusArea = workoutSplit[workoutIndex % workoutSplit.length];
      const workout = generateDayWorkout(day, profile, bodyPains, focusArea);
      dailyWorkouts.push({ day, isRestDay: false, workout, completed: false });
      workoutIndex++;
    } else {
      dailyWorkouts.push({ day, isRestDay: true, restType: getRestDayActivity(fitness_goal), completed: false });
    }
  }

  return dailyWorkouts;
};

const generateDayWorkout = (day: number, profile: FitnessProfile, bodyPains: BodyPain[], focusArea: string) => {
  const { fitness_goal, body_type, available_equipment } = profile;
  const week = Math.ceil(day / 7);

  const intensity = week === 1 ? 'beginner' : week <= 2 ? 'intermediate' : 'advanced';
  const duration = getDuration(profile);

  return {
    title: `Day ${day} - ${focusArea.replace(/_/g, ' ')}`,
    focus: focusArea,
    intensity,
    duration,
    exercises: generateExercises(focusArea, available_equipment, intensity, duration, profile, bodyPains),
    notes: getWorkoutNotes(fitness_goal, body_type, week)
  };
};

const getDuration = (profile: FitnessProfile) => {
  if (profile.fitness_goal === 'athlete_training') return 60;
  if (profile.fitness_goal === 'fat_loss') return 45;
  return 50;
};

const generateExercises = (
  focusArea: string,
  equipment: string[],
  intensity: string,
  duration: number,
  profile: FitnessProfile,
  bodyPains: BodyPain[]
) => {
  const normalizedEquipment = equipment.length === 0 ? ['none'] : equipment;

  const focusMap: Record<string, string[]> = {
    chest_shoulders: ['chest', 'shoulders'],
    chest_triceps_shoulders: ['chest', 'triceps', 'shoulders'],
    back_biceps: ['back', 'biceps'],
    legs: ['legs'],
    chest: ['chest'],
    back: ['back'],
    shoulders: ['shoulders'],
    biceps: ['biceps'],
    triceps: ['triceps'],
    biceps_triceps: ['biceps', 'triceps'],
    upper_body: ['chest', 'back', 'shoulders', 'biceps', 'triceps'],
    lower_body: ['legs'],
    full_body: ['full body', 'chest', 'back', 'legs', 'shoulders'],
    core: ['core'],
    hiit_cardio: ['cardio', 'full body'],
    cardio_core: ['cardio', 'core'],
    circuit_training: ['full body', 'cardio'],
    explosive_power: ['legs', 'core', 'full body'],
    agility_speed: ['cardio', 'legs'],
    functional_strength: ['full body', 'chest', 'back'],
    movement_mobility: ['core', 'shoulders']
  };

  const targetGroups = focusMap[focusArea] || ['full body'];
  let pool = exercises.filter(ex => {
    const exerciseMuscleGroups = Array.isArray(ex.muscleGroup) ? ex.muscleGroup : [ex.muscleGroup];
    return exerciseMuscleGroups.some(mg => targetGroups.includes(mg));
  });

  // Map of mobility exercises to their required pain selection
  const mobilityExerciseToPain: Record<string, BodyPain> = {
    "wrist": "wrist pain",
    "knee": "knee pain",
    "ankle": "ankle pain",
    "shoulder": "shoulder pain",
    "hip": "hip pain",
    "back": "lower back pain"
  };

  // Filter out mobility/stretching exercises unless corresponding pain is selected
  const stretchingKeywords = ['stretch', 'mobility', 'relief', 'circles', 'rolls', 'twists'];
  pool = pool.filter(ex => {
    const nameLower = ex.name.toLowerCase();
    const descLower = ex.description.toLowerCase();
    
    const isMobilityExercise = stretchingKeywords.some(keyword => 
      nameLower.includes(keyword) || descLower.includes(keyword)
    );
    
    if (!isMobilityExercise) return true;
    
    // If it's a mobility exercise, only include if the corresponding pain is selected
    for (const [bodyPart, requiredPain] of Object.entries(mobilityExerciseToPain)) {
      if (nameLower.includes(bodyPart) || descLower.includes(bodyPart)) {
        return bodyPains.includes(requiredPain);
      }
    }
    
    // Generic mobility exercise - exclude unless any pain selected
    return bodyPains.length > 0;
  });

  // Exclude pain-related exercises
  const painTriggers: Record<BodyPain, string[]> = {
    "knee pain": ["squat", "lunge", "jump", "step-up", "run"],
    "ankle pain": ["jump", "run", "calf", "lunge"],
    "hip pain": ["lunge", "thrust", "deep squat"],
    "shoulder pain": ["overhead", "press", "dip", "push-up"],
    "lower back pain": ["deadlift", "crunch", "twist", "bend"],
    "wrist pain": ["plank", "push-up", "press"]
  };

  pool = pool.filter(ex => !bodyPains.some(pain => (painTriggers[pain] || []).some(word => ex.name.toLowerCase().includes(word))));

  // Include safe alternatives if needed
  if (pool.length < 3) {
    bodyPains.forEach(p => pool.push(...getPainAlternatives(p, normalizedEquipment)));
  }

  // Filter by equipment
  pool = pool.filter(ex => ex.equipment.some(eq => normalizedEquipment.includes(eq) || eq === 'none'));

  // Adjust count based on duration
  const count = duration <= 20 ? 3 : duration <= 40 ? 4 : duration <= 50 ? 5 : 6;
  const chosen = [...pool].sort(() => 0.5 - Math.random()).slice(0, count);

  // Intensity-based volume adjustments
  const volume = {
    beginner: { sets: 2, reps: '10-12', rest: '60s' },
    intermediate: { sets: 3, reps: '12-15', rest: '45s' },
    advanced: { sets: 4, reps: '15-20', rest: '30s' }
  }[intensity];

  return chosen.map(ex => ({
    name: ex.name,
    sets: volume.sets,
    reps: volume.reps,
    rest: volume.rest,
    equipment: ex.equipment,
    description: ex.description
  }));
};

const getPainAlternatives = (pain: BodyPain, equipment: string[]) => {
  const alt = {
    "knee pain": [{ id: uuidv4(), name: "Glute Bridges", muscleGroup: "legs", equipment: ["none"], description: "Strengthen glutes safely." }],
    "shoulder pain": [{ id: uuidv4(), name: "Resistance Band Rows", muscleGroup: "back", equipment: ["resistance bands"], description: "Rowing motion without strain." }],
    "hip pain": [{ id: uuidv4(), name: "Bird Dogs", muscleGroup: "core", equipment: ["none"], description: "Core control without hip load." }],
    "lower back pain": [{ id: uuidv4(), name: "Modified Plank", muscleGroup: "core", equipment: ["none"], description: "Knee-supported plank." }]
  };
  return alt[pain] || [];
};

const getRestDayActivity = (goal: string) => {
  if (goal === 'fat_loss') return 'Light cardio or walking';
  if (goal === 'athlete_training') return 'Mobility and active recovery';
  return 'Full rest or stretching';
};

const getWorkoutNotes = (goal: string, bodyType: string[], week: number) => {
  const base: Record<string, string> = {
    muscle_gain: 'Focus on progressive overload and form.',
    fat_loss: 'Keep heart rate elevated and move consistently.',
    athlete_training: 'Prioritize explosiveness and controlled power.'
  };
  const phase = week === 1 ? 'Start easy.' : week === 2 ? 'Increase intensity.' : 'Push performance.';
  return `${base[goal] || ''} ${phase}`;
};

export default WorkoutPlanGenerator;
