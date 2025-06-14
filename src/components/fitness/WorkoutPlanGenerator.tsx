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
  profile: FitnessProfile;
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

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Profile Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><strong>Goal:</strong> {capitalizeWords(profile.fitness_goal)}</div>
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

// Helper function to generate personalized workout plan with more exercise variety
const generatePersonalizedPlan = (profile: FitnessProfile) => {
  const { fitness_goal, body_type, workout_days_per_week, available_equipment } = profile;
  
  const dailyWorkouts = [];
  
  // Create a pattern of 2 workout days, 1 rest day as requested
  const workoutPattern = [true, true, false]; // 2 workout, 1 rest
  
  for (let day = 1; day <= 30; day++) {
    const patternIndex = (day - 1) % 3;
    const isWorkoutDay = workoutPattern[patternIndex];
    
    if (isWorkoutDay) {
      const workout = generateDayWorkout(day, fitness_goal, body_type, available_equipment);
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

const generateDayWorkout = (day: number, goal: string, bodyType: string, equipment: string[]) => {
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
    // Comprehensive athlete training cycle
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
    exercises: generateExercises(focusArea, equipment, intensity, day),
    notes: getWorkoutNotes(goal, bodyType, week)
  };
};

const getDuration = (goal: string, bodyType: string) => {
  if (goal === 'fat_loss') return 45;
  if (goal === 'athlete_training') return 60;
  return bodyType === 'ectomorph' ? 45 : 50;
};

const generateExercises = (focusArea: string, equipment: string[], intensity: string, day: number) => {
  // Enhanced exercise pool with comprehensive athlete training
  const exercisePool = {
    // Athlete-specific training modules
    explosive_power: [
      [
        { name: 'Medicine Ball Slams', sets: 4, reps: '8-10', rest: '90s' },
        { name: 'Jump Squats', sets: 4, reps: '6-8', rest: '90s' },
        { name: 'Explosive Push-ups', sets: 3, reps: '5-8', rest: '60s' },
        { name: 'Box Jumps', sets: 3, reps: '5-8', rest: '120s' },
        { name: 'Kettlebell Swings', sets: 3, reps: '10-12', rest: '60s' }
      ],
      [
        { name: 'Power Cleans', sets: 4, reps: '5-6', rest: '120s' },
        { name: 'Broad Jumps', sets: 4, reps: '5-6', rest: '90s' },
        { name: 'Plyometric Push-ups', sets: 3, reps: '6-8', rest: '90s' },
        { name: 'Single-leg Box Jumps', sets: 3, reps: '4-6 each', rest: '90s' },
        { name: 'Battle Rope Slams', sets: 3, reps: '30s', rest: '60s' }
      ],
      [
        { name: 'Olympic Lifts Complex', sets: 4, reps: '3-5', rest: '150s' },
        { name: 'Depth Jumps', sets: 3, reps: '3-5', rest: '120s' },
        { name: 'Explosive Burpees', sets: 3, reps: '5-8', rest: '90s' },
        { name: 'Medicine Ball Throws', sets: 4, reps: '6-8', rest: '90s' },
        { name: 'Sprint Starts', sets: 4, reps: '10m x 5', rest: '120s' }
      ]
    ],
    agility_speed: [
      [
        { name: 'Ladder Drills', sets: 4, reps: '30s each', rest: '45s' },
        { name: 'Cone Weaving', sets: 3, reps: '10 rounds', rest: '60s' },
        { name: 'Lateral Shuffles', sets: 3, reps: '20 each way', rest: '45s' },
        { name: 'High Knees', sets: 3, reps: '30s', rest: '30s' },
        { name: 'Butt Kickers', sets: 3, reps: '30s', rest: '30s' }
      ],
      [
        { name: 'T-Drill', sets: 4, reps: '5 rounds', rest: '90s' },
        { name: '5-10-5 Shuttle', sets: 4, reps: '3 rounds', rest: '120s' },
        { name: 'Reactive Cuts', sets: 3, reps: '10 each way', rest: '60s' },
        { name: 'Sprint Intervals', sets: 4, reps: '30s on/60s off', rest: '60s' },
        { name: 'Direction Changes', sets: 3, reps: '15 changes', rest: '90s' }
      ],
      [
        { name: 'Complex Agility Course', sets: 4, reps: '3 rounds', rest: '150s' },
        { name: 'Reactive Agility', sets: 3, reps: '8-10 reactions', rest: '120s' },
        { name: 'Multi-directional Sprints', sets: 4, reps: '20s', rest: '100s' },
        { name: 'Chaos Training', sets: 3, reps: '45s', rest: '90s' },
        { name: 'Sport-specific Movements', sets: 4, reps: '10-12', rest: '90s' }
      ]
    ],
    functional_strength: [
      [
        { name: 'Functional Squats', sets: 4, reps: '12-15', rest: '90s' },
        { name: 'Single-arm Rows', sets: 3, reps: '10-12 each', rest: '60s' },
        { name: 'Farmer\'s Walk', sets: 3, reps: '40m', rest: '90s' },
        { name: 'Turkish Get-ups', sets: 2, reps: '5 each side', rest: '120s' },
        { name: 'Bear Crawl', sets: 3, reps: '20m', rest: '60s' }
      ],
      [
        { name: 'Unilateral Deadlifts', sets: 3, reps: '8-10 each', rest: '90s' },
        { name: 'Overhead Carries', sets: 3, reps: '30m', rest: '90s' },
        { name: 'Rotational Throws', sets: 3, reps: '10 each side', rest: '60s' },
        { name: 'Suitcase Carries', sets: 3, reps: '40m each side', rest: '90s' },
        { name: 'Crawling Patterns', sets: 3, reps: '30s each', rest: '60s' }
      ],
      [
        { name: 'Complex Movement Chains', sets: 3, reps: '6-8', rest: '120s' },
        { name: 'Asymmetrical Loading', sets: 3, reps: '8-10', rest: '90s' },
        { name: 'Multi-planar Movements', sets: 3, reps: '10-12', rest: '90s' },
        { name: 'Unstable Surface Training', sets: 3, reps: '8-10', rest: '90s' },
        { name: 'Functional Integration', sets: 3, reps: '5-8', rest: '120s' }
      ]
    ],
    sport_specific_conditioning: [
      [
        { name: 'Sport Movement Prep', sets: 3, reps: '10-15', rest: '45s' },
        { name: 'Position-specific Drills', sets: 4, reps: '30s', rest: '60s' },
        { name: 'Game-pace Intervals', sets: 3, reps: '45s on/90s off', rest: '60s' },
        { name: 'Competition Simulation', sets: 2, reps: '2 min rounds', rest: '120s' },
        { name: 'Recovery Protocols', sets: 1, reps: '5 min', rest: '0s' }
      ],
      [
        { name: 'Advanced Sport Patterns', sets: 4, reps: '8-12', rest: '90s' },
        { name: 'Tactical Conditioning', sets: 3, reps: '60s work', rest: '90s' },
        { name: 'Pressure Training', sets: 3, reps: '30s max effort', rest: '120s' },
        { name: 'Skill Integration', sets: 3, reps: '10-15', rest: '60s' },
        { name: 'Mental Conditioning', sets: 2, reps: '3 min', rest: '90s' }
      ],
      [
        { name: 'Elite Performance Protocols', sets: 4, reps: 'Variable', rest: '120s' },
        { name: 'Competition Simulation', sets: 3, reps: 'Game time', rest: '180s' },
        { name: 'Peak Performance Training', sets: 3, reps: 'Max effort', rest: '150s' },
        { name: 'Advanced Integration', sets: 2, reps: '5-8', rest: '180s' },
        { name: 'Performance Analysis', sets: 1, reps: '10 min', rest: '0s' }
      ]
    ],
    movement_mobility: [
      [
        { name: 'Dynamic Warm-up', sets: 2, reps: '10 each', rest: '30s' },
        { name: 'Hip Circles', sets: 2, reps: '10 each way', rest: '30s' },
        { name: 'Leg Swings', sets: 2, reps: '15 each', rest: '30s' },
        { name: 'Arm Circles', sets: 2, reps: '15 each way', rest: '30s' },
        { name: 'Spinal Waves', sets: 2, reps: '10', rest: '30s' }
      ],
      [
        { name: 'Flow Sequences', sets: 3, reps: '5-8 transitions', rest: '45s' },
        { name: 'Multi-joint Mobility', sets: 3, reps: '8-12', rest: '45s' },
        { name: 'Movement Chains', sets: 3, reps: '6-10', rest: '60s' },
        { name: 'Corrective Exercises', sets: 2, reps: '12-15', rest: '45s' },
        { name: 'Flexibility Integration', sets: 2, reps: '30s holds', rest: '30s' }
      ],
      [
        { name: 'Advanced Movement Patterns', sets: 3, reps: '5-8', rest: '60s' },
        { name: 'Complex Mobility Flows', sets: 3, reps: '3-5 rounds', rest: '90s' },
        { name: 'Specialized Protocols', sets: 2, reps: '8-12', rest: '60s' },
        { name: 'Performance Mobility', sets: 3, reps: '5-10', rest: '90s' },
        { name: 'Integration Assessment', sets: 1, reps: '10 min', rest: '0s' }
      ]
    ],
    plyometric_training: [
      [
        { name: 'Basic Jump Training', sets: 3, reps: '8-10', rest: '90s' },
        { name: 'Skipping Variations', sets: 3, reps: '20m', rest: '60s' },
        { name: 'Bounding', sets: 3, reps: '15m', rest: '90s' },
        { name: 'Hop Progressions', sets: 3, reps: '10 each leg', rest: '60s' },
        { name: 'Landing Mechanics', sets: 2, reps: '10', rest: '60s' }
      ],
      [
        { name: 'Multi-directional Jumps', sets: 3, reps: '6-8', rest: '120s' },
        { name: 'Reactive Plyometrics', sets: 3, reps: '5-8', rest: '120s' },
        { name: 'Complex Jump Patterns', sets: 3, reps: '5-6', rest: '90s' },
        { name: 'Plyometric Circuits', sets: 3, reps: '45s', rest: '90s' },
        { name: 'Power Endurance', sets: 2, reps: '60s', rest: '120s' }
      ],
      [
        { name: 'Advanced Plyometric Sequences', sets: 3, reps: '4-6', rest: '150s' },
        { name: 'Elite Jump Training', sets: 3, reps: '3-5', rest: '180s' },
        { name: 'Competition Plyometrics', sets: 2, reps: '5-8', rest: '180s' },
        { name: 'Maximal Power Development', sets: 3, reps: '3-5', rest: '180s' },
        { name: 'Performance Testing', sets: 1, reps: '5 attempts', rest: '180s' }
      ]
    ],
    core_stability: [
      [
        { name: 'Plank Progressions', sets: 3, reps: '30-45s', rest: '60s' },
        { name: 'Dead Bug', sets: 3, reps: '10 each side', rest: '45s' },
        { name: 'Bird Dog', sets: 3, reps: '10 each side', rest: '45s' },
        { name: 'Pallof Press', sets: 3, reps: '12 each side', rest: '45s' },
        { name: 'Stability Ball Exercises', sets: 2, reps: '15', rest: '45s' }
      ],
      [
        { name: 'Anti-rotation Training', sets: 3, reps: '45s', rest: '60s' },
        { name: 'Single-arm/leg Challenges', sets: 3, reps: '30s each', rest: '60s' },
        { name: 'Dynamic Stability', sets: 3, reps: '10-12', rest: '60s' },
        { name: 'Core Integration', sets: 3, reps: '8-10', rest: '60s' },
        { name: 'Power Core Training', sets: 2, reps: '6-8', rest: '90s' }
      ],
      [
        { name: 'Advanced Core Protocols', sets: 3, reps: '5-8', rest: '90s' },
        { name: 'Sport-specific Core', sets: 3, reps: '30-60s', rest: '90s' },
        { name: 'Maximal Stability Challenges', sets: 2, reps: '20-45s', rest: '120s' },
        { name: 'Complex Core Integration', sets: 3, reps: '5-8', rest: '90s' },
        { name: 'Performance Core Testing', sets: 1, reps: 'Max time', rest: '0s' }
      ]
    ],
    chest_triceps: [
      [
        { name: 'Push-ups', sets: 3, reps: '12-15', rest: '60s' },
        { name: 'Dumbbell Bench Press', sets: 3, reps: '10-12', rest: '90s' },
        { name: 'Incline Push-ups', sets: 3, reps: '10-12', rest: '60s' },
        { name: 'Tricep Dips', sets: 3, reps: '8-12', rest: '60s' },
        { name: 'Chest Flyes', sets: 2, reps: '12-15', rest: '60s' }
      ],
      [
        { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '90s' },
        { name: 'Wide Push-ups', sets: 3, reps: '10-12', rest: '60s' },
        { name: 'Overhead Tricep Extension', sets: 3, reps: '12-15', rest: '60s' },
        { name: 'Chest Dips', sets: 3, reps: '8-10', rest: '90s' },
        { name: 'Diamond Push-ups', sets: 2, reps: '8-10', rest: '60s' }
      ],
      [
        { name: 'Decline Push-ups', sets: 3, reps: '8-12', rest: '60s' },
        { name: 'Dumbbell Pullovers', sets: 3, reps: '10-12', rest: '90s' },
        { name: 'Close-grip Push-ups', sets: 3, reps: '6-10', rest: '60s' },
        { name: 'Pike Push-ups', sets: 2, reps: '8-10', rest: '90s' },
        { name: 'Single-arm Push-ups', sets: 2, reps: '5-8 each', rest: '90s' }
      ]
    ],
    back_biceps: [
      [
        { name: 'Pull-ups/Rows', sets: 3, reps: '8-12', rest: '90s' },
        { name: 'Bicep Curls', sets: 3, reps: '12-15', rest: '60s' },
        { name: 'Lat Pulldowns', sets: 3, reps: '10-12', rest: '90s' },
        { name: 'Reverse Flyes', sets: 2, reps: '12-15', rest: '60s' }
      ],
      [
        { name: 'Bent-over Rows', sets: 3, reps: '10-12', rest: '90s' },
        { name: 'Hammer Curls', sets: 3, reps: '10-12', rest: '60s' },
        { name: 'Face Pulls', sets: 3, reps: '15-20', rest: '60s' },
        { name: 'Superman', sets: 2, reps: '15-20', rest: '45s' }
      ],
      [
        { name: 'Wide-grip Pull-ups', sets: 3, reps: '6-10', rest: '90s' },
        { name: 'Concentration Curls', sets: 3, reps: '10-12', rest: '60s' },
        { name: 'Single-arm Rows', sets: 3, reps: '8-10 each', rest: '90s' },
        { name: 'Archer Pull-ups', sets: 2, reps: '5-8 each', rest: '120s' }
      ]
    ],
    legs: [
      [
        { name: 'Squats', sets: 4, reps: '12-15', rest: '90s' },
        { name: 'Lunges', sets: 3, reps: '10 each leg', rest: '60s' },
        { name: 'Calf Raises', sets: 3, reps: '15-20', rest: '45s' },
        { name: 'Wall Sit', sets: 2, reps: '30-45s', rest: '60s' }
      ],
      [
        { name: 'Jump Squats', sets: 3, reps: '10-12', rest: '90s' },
        { name: 'Bulgarian Split Squats', sets: 3, reps: '8-10 each', rest: '90s' },
        { name: 'Single-leg Calf Raises', sets: 3, reps: '10-12 each', rest: '45s' },
        { name: 'Glute Bridges', sets: 3, reps: '15-20', rest: '60s' }
      ],
      [
        { name: 'Pistol Squats', sets: 3, reps: '5-8 each', rest: '120s' },
        { name: 'Shrimp Squats', sets: 2, reps: '3-5 each', rest: '120s' },
        { name: 'Dragon Squats', sets: 3, reps: '8-10 each', rest: '90s' },
        { name: 'Single-leg Hip Thrusts', sets: 3, reps: '10-12 each', rest: '90s' }
      ]
    ],
    hiit_cardio: [
      [
        { name: 'Burpees', sets: 4, reps: '30s on/30s off', rest: '60s' },
        { name: 'Mountain Climbers', sets: 4, reps: '30s on/30s off', rest: '60s' },
        { name: 'Jump Squats', sets: 4, reps: '30s on/30s off', rest: '60s' },
        { name: 'High Knees', sets: 3, reps: '30s on/30s off', rest: '60s' }
      ],
      [
        { name: 'Jump Jacks', sets: 4, reps: '45s on/15s off', rest: '60s' },
        { name: 'Plank Jacks', sets: 4, reps: '30s on/30s off', rest: '60s' },
        { name: 'Squat Thrusts', sets: 4, reps: '30s on/30s off', rest: '60s' },
        { name: 'Butt Kickers', sets: 3, reps: '30s on/30s off', rest: '60s' }
      ],
      [
        { name: 'Tabata Burpees', sets: 4, reps: '20s on/10s off', rest: '60s' },
        { name: 'Sprint Intervals', sets: 5, reps: '30s on/30s off', rest: '90s' },
        { name: 'Bear Crawl Sprints', sets: 3, reps: '20s on/40s off', rest: '90s' },
        { name: 'Battle Rope Waves', sets: 4, reps: '30s on/30s off', rest: '60s' }
      ]
    ]
  };
  
  // Use week number to determine exercise variation
  const week = Math.ceil(day / 7);
  const variationIndex = Math.min(week - 1, 2); // Cap at index 2
  const baseExercises = exercisePool[focusArea as keyof typeof exercisePool];
  
  return baseExercises ? baseExercises[variationIndex] : exercisePool.explosive_power[0];
};

const getRestDayActivity = (goal: string) => {
  if (goal === 'fat_loss') return 'Light cardio (walking, stretching)';
  if (goal === 'athlete_training') return 'Active recovery (mobility, light movement, skill work)';
  return 'Complete rest or gentle stretching';
};

const getWorkoutNotes = (goal: string, bodyType: string, week: number) => {
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
