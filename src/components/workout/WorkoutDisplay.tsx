
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Workout } from '@/types';
import { Clock, Dumbbell, Activity, Heart, CheckCircle, ArrowLeft, Timer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface WorkoutDisplayProps {
  workout: Workout;
  onBack: () => void;
  onComplete: (workout: Workout) => void;
}

const WorkoutDisplay = ({ workout, onBack, onComplete }: WorkoutDisplayProps) => {
  const { toast } = useToast();
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<'main' | 'warmup' | 'cooldown'>('main');
  
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
            <button
              onClick={() => toggleExerciseDetails(index)}
              className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <span className="bg-fitness-primary/10 text-fitness-primary w-7 h-7 rounded-full flex items-center justify-center text-sm mr-3">
                  {index + 1}
                </span>
                <div>
                  <h4 className="font-medium">{exercise.name}</h4>
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
                {activeExerciseIndex === index ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                )}
              </div>
            </button>
            
            {activeExerciseIndex === index && (
              <div className="px-4 pb-4 border-t bg-gray-50">
                {exercise.imageUrl && (
                  <div className="mb-3 mt-3 border rounded overflow-hidden">
                    <AspectRatio ratio={16/9} className="bg-muted">
                      <img 
                        src={exercise.imageUrl} 
                        alt={exercise.name}
                        className="object-cover w-full h-full rounded"
                      />
                    </AspectRatio>
                  </div>
                )}
                <div className="text-sm mb-3">
                  {exercise.description}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Muscle Group:</span>{' '}
                    {exercise.muscleGroup.charAt(0).toUpperCase() + exercise.muscleGroup.slice(1)}
                  </div>
                  <div>
                    <span className="text-gray-500">Equipment:</span>{' '}
                    {formatEquipmentList(exercise.equipment)}
                  </div>
                </div>
              </div>
            )}
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
