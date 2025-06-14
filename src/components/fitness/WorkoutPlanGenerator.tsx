
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useWorkoutPlans } from '@/hooks/useWorkoutPlans';
import { Loader2, Dumbbell, Calendar, Target } from 'lucide-react';
import { FitnessProfile } from '@/hooks/useFitnessProfile';

interface WorkoutPlanGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  profile: FitnessProfile;
  onPlanGenerated?: (plan: any) => void;
}

const WorkoutPlanGenerator = ({ isOpen, onClose, profile, onPlanGenerated }: WorkoutPlanGeneratorProps) => {
  const { toast } = useToast();
  const { saveWorkoutPlan } = useWorkoutPlans();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);

  const generateMockWorkoutPlan = (profile: FitnessProfile) => {
    console.log('Generating workout plan for profile:', profile);
    
    const planName = `${profile.fitness_goal.replace('_', ' ').toUpperCase()} - 30 Day Plan`;
    
    // Generate 30 days of workouts based on profile
    const dailyWorkouts = [];
    for (let day = 1; day <= 30; day++) {
      const isRestDay = day % 7 === 0; // Every 7th day is a rest day
      
      if (isRestDay) {
        dailyWorkouts.push({
          day,
          title: 'Rest Day',
          type: 'rest',
          description: 'Take a well-deserved rest to let your muscles recover.',
          completed: false
        });
      } else {
        const workoutTypes = profile.fitness_goal === 'muscle_gain' 
          ? ['Upper Body Strength', 'Lower Body Strength', 'Core & Abs', 'Full Body Circuit']
          : profile.fitness_goal === 'fat_loss'
          ? ['HIIT Cardio', 'Strength Training', 'Metabolic Circuit', 'Active Recovery']
          : ['Athletic Performance', 'Agility Training', 'Power Development', 'Endurance'];
        
        const workoutType = workoutTypes[day % workoutTypes.length];
        
        dailyWorkouts.push({
          day,
          title: `Day ${day}: ${workoutType}`,
          type: 'workout',
          description: `Targeted ${workoutType.toLowerCase()} session designed for ${profile.fitness_goal.replace('_', ' ')}.`,
          exercises: generateExercisesForDay(profile, workoutType),
          duration: 45,
          completed: false
        });
      }
    }

    return {
      id: crypto.randomUUID(),
      plan_name: planName,
      fitness_goal: profile.fitness_goal,
      profile_id: profile.id,
      daily_workouts: dailyWorkouts,
      total_days: 30
    };
  };

  const generateExercisesForDay = (profile: FitnessProfile, workoutType: string) => {
    const hasEquipment = !profile.available_equipment.includes('none');
    
    const exercisesByType: Record<string, string[]> = {
      'Upper Body Strength': hasEquipment 
        ? ['Bench Press', 'Rows', 'Shoulder Press', 'Pull-ups', 'Bicep Curls']
        : ['Push-ups', 'Pike Push-ups', 'Tricep Dips', 'Plank to Push-up', 'Wall Handstand'],
      'Lower Body Strength': hasEquipment
        ? ['Squats', 'Deadlifts', 'Lunges', 'Leg Press', 'Calf Raises']
        : ['Bodyweight Squats', 'Single Leg Deadlifts', 'Jumping Lunges', 'Glute Bridges', 'Wall Sits'],
      'HIIT Cardio': ['Mountain Climbers', 'Burpees', 'High Knees', 'Jumping Jacks', 'Sprint Intervals'],
      'Core & Abs': ['Plank', 'Russian Twists', 'Dead Bug', 'Bicycle Crunches', 'Leg Raises'],
      'Athletic Performance': ['Box Jumps', 'Agility Ladder', 'Medicine Ball Slams', 'Sprint Drills', 'Plyometric Push-ups']
    };

    const exercises = exercisesByType[workoutType] || exercisesByType['Upper Body Strength'];
    return exercises.slice(0, 5).map(exercise => ({
      name: exercise,
      sets: 3,
      reps: workoutType.includes('Strength') ? '8-12' : '30 seconds',
      rest: '60 seconds'
    }));
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      console.log('Starting plan generation...');
      
      // Simulate some generation time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const plan = generateMockWorkoutPlan(profile);
      console.log('Generated plan:', plan);
      
      setGeneratedPlan(plan);
      
      toast({
        title: "Plan Generated!",
        description: "Your personalized 30-day workout plan has been created."
      });
    } catch (error) {
      console.error('Error generating plan:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate your workout plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePlan = async () => {
    if (!generatedPlan) return;
    
    try {
      console.log('Saving generated plan...');
      
      await saveWorkoutPlan({
        plan_name: generatedPlan.plan_name,
        fitness_goal: generatedPlan.fitness_goal,
        profile_id: generatedPlan.profile_id,
        daily_workouts: generatedPlan.daily_workouts,
        total_days: generatedPlan.total_days
      });

      toast({
        title: "Plan Saved!",
        description: "Your 30-day workout plan has been saved successfully."
      });

      if (onPlanGenerated) {
        onPlanGenerated(generatedPlan);
      }

      onClose();
    } catch (error) {
      console.error('Error saving plan:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save your workout plan. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Your 30-Day Workout Plan</DialogTitle>
          <DialogDescription>
            Based on your fitness profile, we'll create a personalized workout plan
          </DialogDescription>
        </DialogHeader>

        {!generatedPlan ? (
          <div className="space-y-6">
            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Profile Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Goal:</span> {profile.fitness_goal.replace('_', ' ')}
                  </div>
                  <div>
                    <span className="font-medium">Body Type:</span> {profile.body_type}
                  </div>
                  <div>
                    <span className="font-medium">Workout Days:</span> {profile.workout_days_per_week}/week
                  </div>
                  <div>
                    <span className="font-medium">Equipment:</span> {profile.available_equipment.join(', ')}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generate Plan Button */}
            <div className="text-center">
              <Button 
                onClick={handleGeneratePlan} 
                disabled={isGenerating}
                className="bg-fitness-primary hover:bg-fitness-primary/90"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Your Plan...
                  </>
                ) : (
                  <>
                    <Target className="mr-2 h-5 w-5" />
                    Generate My 30-Day Plan
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Generated Plan Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5" />
                  {generatedPlan.plan_name}
                </CardTitle>
                <CardDescription>
                  30-day personalized workout plan for {profile.fitness_goal.replace('_', ' ')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-fitness-primary">{generatedPlan.total_days}</div>
                    <div className="text-sm text-gray-600">Total Days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-fitness-primary">
                      {generatedPlan.daily_workouts.filter((d: any) => d.type === 'workout').length}
                    </div>
                    <div className="text-sm text-gray-600">Workout Days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-fitness-primary">
                      {generatedPlan.daily_workouts.filter((d: any) => d.type === 'rest').length}
                    </div>
                    <div className="text-sm text-gray-600">Rest Days</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Sample Week:</h4>
                  {generatedPlan.daily_workouts.slice(0, 7).map((day: any) => (
                    <div key={day.day} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">Day {day.day}</span>
                      <span className="text-sm text-gray-600">{day.title}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setGeneratedPlan(null)} className="flex-1">
                Generate New Plan
              </Button>
              <Button onClick={handleSavePlan} className="flex-1 bg-fitness-primary hover:bg-fitness-primary/90">
                <Calendar className="mr-2 h-4 w-4" />
                Save Plan
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutPlanGenerator;
