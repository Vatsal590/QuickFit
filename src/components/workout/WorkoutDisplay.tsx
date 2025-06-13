import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Workout } from '@/types';
import { Clock, Dumbbell, Activity, Heart, CheckCircle, ArrowLeft, Timer, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface WorkoutDisplayProps {
  workout: Workout;
  onBack: () => void;
  onComplete: (workout: Workout) => void;
}

const WorkoutDisplay = ({ workout, onBack, onComplete }: WorkoutDisplayProps) => {
  const { toast } = useToast();
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<'main' | 'warmup' | 'cooldown'>('main');
  
  // Get exercise animation URL based on exercise name
  const getExerciseAnimationUrl = (exerciseName: string): string => {
    const exerciseMap: { [key: string]: string } = {
      // Chest exercises
      'Push-up': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-up.gif',
      'Incline Push-up': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Push-Up.gif',
      'Diamond Push-up': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Diamond-Push-Up.gif',
      'Wide Push-up': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Wide-Grip-Push-Up.gif',
      'Decline Push-up': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Decline-Push-up.gif',
      'Close-Grip Push-up': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Close-Grip-Push-Up.gif',
      'Dumbbell Chest Press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Bench-Press.gif',
      'Incline Dumbbell Press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Dumbbell-Press.gif',
      'Cable Chest Fly': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Fly.gif',
      
      // Back exercises
      'Pull-up': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif',
      'Bent-Over Row': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bent-Over-Row.gif',
      'Lat Pulldown': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lat-Pulldown.gif',
      'Single-Arm Dumbbell Row': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/One-Arm-Dumbbell-Row.gif',
      
      // Shoulder exercises
      'Dumbbell Shoulder Press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif',
      'Lateral Raise': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lateral-Raise.gif',
      'Front Raise': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Front-Raise.gif',
      'Resistance Band Face Pull': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Face-Pull.gif',
      
      // Leg exercises
      'Bodyweight Squat': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bodyweight-Squat.gif',
      'Dumbbell Lunge': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lunge.gif',
      'Goblet Squat': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Goblet-Squat.gif',
      'Romanian Deadlift': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Romanian-Deadlift.gif',
      'Jumping Squat': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Jump-Squat.gif',
      
      // Bicep exercises
      'Dumbbell Bicep Curl': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Curl.gif',
      'Hammer Curl': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hammer-Curl.gif',
      'Resistance Band Curl': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Resistance-Band-Bicep-Curl.gif',
      'Barbell Curl': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Curl.gif',
      
      // Tricep exercises
      'Tricep Dips': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Tricep-Dips.gif',
      'Overhead Tricep Extension': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Overhead-Triceps-Extension.gif',
      'Tricep Pushdown': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Triceps-Pushdown.gif',
      
      // Core exercises
      'Plank': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Plank.gif',
      'Bicycle Crunch': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bicycle-Crunch.gif',
      'Russian Twist': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Russian-Twist.gif',
      'Mountain Climber': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Mountain-Climber.gif',
      
      // Cardio exercises
      'Jumping Jacks': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Jumping-Jacks.gif',
      'High Knees': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/High-Knees.gif',
      'Jump Rope': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Jump-Rope.gif',
      'Burpee': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Burpee.gif',
      'Kettlebell Swing': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Kettlebell-Swing.gif',
      'Dumbbell Thruster': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Thruster.gif',
      'Turkish Get-Up': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Turkish-Get-Up.gif',
      
      // Warmup exercises
      'Light Jogging in Place': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/High-Knees.gif',
      'Arm Circles': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Arm-Circles.gif',
      'Hip Rotations': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hip-Circles.gif',
      'Shoulder Stretches': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Shoulder-Stretch.gif',
      
      // Cooldown exercises
      'Deep Breathing': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Deep-Breathing.gif',
      'Quad Stretch': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Standing-Quad-Stretch.gif',
      'Hamstring Stretch': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Seated-Hamstring-Stretch.gif',
      "Child's Pose": 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Childs-Pose.gif',
      'Shoulder Stretch': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Cross-Body-Shoulder-Stretch.gif',
      'Chest Stretch': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Chest-Stretch.gif'
    };

    return exerciseMap[exerciseName] || 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bodyweight-Squat.gif';
  };
  
  // Format equipment names for display
  const formatEquipmentList = (equipment: string[]): string => {
    if (equipment.length === 0) return "None";
    if (equipment.includes("none") && equipment.length === 1) return "No equipment";
    
    return equipment
      .filter(item => item !== "none")
      .map(item => item.charAt(0).toUpperCase() + item.slice(1))
      .join(", ");
  };
  
  // Calculate total workout time
  const calculateTotalTime = (): number => {
    const exerciseTime = workout.exercises.reduce((total, exercise) => {
      // Rough estimate: sets * (time per set + rest time)
      // Assuming 30-45 seconds per set depending on reps
      const timePerSet = exercise.reps <= 12 ? 45 : 30;
      return total + (exercise.sets * (timePerSet + exercise.restTime));
    }, 0);
    
    // Add warmup and cooldown time (5 minutes each)
    const warmupCooldownTime = 10 * 60;
    
    // Convert to minutes and round up
    return Math.ceil((exerciseTime + warmupCooldownTime) / 60);
  };
  
  const handleCompleteWorkout = () => {
    onComplete(workout);
    toast({
      title: "Workout completed!",
      description: "Great job! Your progress has been saved.",
    });
  };
  
  const toggleExerciseDetails = (index: number) => {
    if (activeExerciseIndex === index) {
      setActiveExerciseIndex(null);
    } else {
      setActiveExerciseIndex(index);
    }
  };
  
  const renderExerciseList = (
    exercises: Array<any>, 
    isWarmupOrCooldown: boolean = false
  ) => {
    return (
      <div className="space-y-3">
        {exercises.map((exercise, index) => (
          <div 
            key={exercise.id}
            className="border rounded-lg overflow-hidden"
          >
            <Dialog>
              <DialogTrigger asChild>
                <button
                  className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center">
                    <span className="bg-fitness-primary/10 text-fitness-primary w-7 h-7 rounded-full flex items-center justify-center text-sm mr-3">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        {exercise.name}
                        <Play className="h-3 w-3 text-fitness-primary" />
                      </h4>
                      <p className="text-xs text-gray-500">
                        {isWarmupOrCooldown 
                          ? `${exercise.sets} set × ${typeof exercise.reps === 'number' && exercise.reps > 30 
                              ? `${exercise.reps} seconds` 
                              : `${exercise.reps} reps`}`
                          : `${exercise.sets} sets × ${exercise.reps} reps • ${exercise.restTime}s rest`
                        }
                      </p>
                    </div>
                  </div>
                  <div className="text-fitness-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{exercise.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <img 
                      src={getExerciseAnimationUrl(exercise.name)}
                      alt={`${exercise.name} animation`}
                      className="w-full max-w-sm rounded-lg"
                      style={{ maxHeight: '300px', objectFit: 'contain' }}
                    />
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><strong>Sets:</strong> {exercise.sets}</p>
                    <p><strong>Reps:</strong> {exercise.reps}</p>
                    {exercise.restTime && <p><strong>Rest:</strong> {exercise.restTime}s</p>}
                    <p><strong>Description:</strong> {exercise.description}</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="max-w-3xl mx-auto w-full">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4 pl-0 flex items-center gap-1 text-fitness-primary hover:text-fitness-primary/80"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">{workout.title}</CardTitle>
          <CardDescription>
            Your customized {workout.duration} minute workout
          </CardDescription>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-md">
              <Clock className="h-5 w-5 text-fitness-primary mb-1" />
              <span className="text-sm text-gray-500">Duration</span>
              <span className="font-medium">{calculateTotalTime()} min</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-md">
              <Dumbbell className="h-5 w-5 text-fitness-primary mb-1" />
              <span className="text-sm text-gray-500">Equipment</span>
              <span className="font-medium text-center text-sm">
                {workout.equipment.length === 1 && workout.equipment[0] === "none" 
                  ? "No equipment" 
                  : workout.equipment.length > 2 
                    ? "Multiple" 
                    : formatEquipmentList(workout.equipment)}
              </span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-md">
              <Activity className="h-5 w-5 text-fitness-primary mb-1" />
              <span className="text-sm text-gray-500">Focus</span>
              <span className="font-medium text-center text-sm">
                {workout.targetMuscleGroups.length === 1 
                  ? workout.targetMuscleGroups[0].charAt(0).toUpperCase() + workout.targetMuscleGroups[0].slice(1)
                  : workout.targetMuscleGroups.includes("full body") 
                    ? "Full Body" 
                    : "Multiple"}
              </span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-md">
              <Heart className="h-5 w-5 text-fitness-primary mb-1" />
              <span className="text-sm text-gray-500">Intensity</span>
              <span className="font-medium">{workout.intensity.charAt(0).toUpperCase() + workout.intensity.slice(1)}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex mb-4 border-b">
            <Button
              variant={activeSection === 'warmup' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('warmup')}
              className={activeSection === 'warmup' ? 'bg-fitness-primary text-white' : ''}
            >
              <Timer className="h-4 w-4 mr-2" />
              5-Min Warmup
            </Button>
            <Button
              variant={activeSection === 'main' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('main')}
              className={activeSection === 'main' ? 'bg-fitness-primary text-white' : ''}
            >
              Main Workout
            </Button>
            <Button
              variant={activeSection === 'cooldown' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('cooldown')}
              className={activeSection === 'cooldown' ? 'bg-fitness-primary text-white' : ''}
            >
              <Timer className="h-4 w-4 mr-2" />
              5-Min Cooldown
            </Button>
          </div>
          
          {activeSection === 'warmup' && (
            <>
              <div className="flex items-center mb-4">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 mr-2">Warmup</Badge>
                <h3 className="font-medium text-lg">5-Minute Warmup ({workout.warmupExercises.length})</h3>
              </div>
              {renderExerciseList(workout.warmupExercises, true)}
            </>
          )}
          
          {activeSection === 'main' && (
            <>
              <h3 className="font-medium mb-3 text-lg">Main Exercises ({workout.exercises.length})</h3>
              {renderExerciseList(workout.exercises)}
            </>
          )}
          
          {activeSection === 'cooldown' && (
            <>
              <div className="flex items-center mb-4">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 mr-2">Cooldown</Badge>
                <h3 className="font-medium text-lg">5-Minute Cooldown ({workout.cooldownExercises.length})</h3>
              </div>
              {renderExerciseList(workout.cooldownExercises, true)}
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col">
          <Button 
            onClick={handleCompleteWorkout}
            className="w-full bg-fitness-secondary hover:bg-fitness-secondary/90 mb-2 flex items-center gap-2"
          >
            <CheckCircle className="h-5 w-5" />
            Mark as Completed
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WorkoutDisplay;
