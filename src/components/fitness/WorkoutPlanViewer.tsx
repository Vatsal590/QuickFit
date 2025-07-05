import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Dumbbell, Target, Trophy, Play } from 'lucide-react';
import { WorkoutPlan } from '@/types';

interface WorkoutPlanViewerProps {
  plan: WorkoutPlan;
  onMarkComplete: (planId: string, dayNumber: number) => void;
}

const WorkoutPlanViewer = ({ plan, onMarkComplete }: WorkoutPlanViewerProps) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());

  // Calculate progress
  const completedCount = completedDays.size;
  const progressPercentage = (completedCount / plan.totalDays) * 100;

  const handleDayComplete = (dayNumber: number) => {
    const newCompletedDays = new Set(completedDays);
    newCompletedDays.add(dayNumber);
    setCompletedDays(newCompletedDays);
    onMarkComplete(plan.id, dayNumber);
  };

  const handleViewDay = (dayNumber: number) => {
    setSelectedDay(selectedDay === dayNumber ? null : dayNumber);
  };

  const getDayWorkout = (dayNumber: number) => {
    const workoutData = Array.isArray(plan.dailyWorkouts) 
      ? plan.dailyWorkouts[dayNumber - 1]
      : plan.dailyWorkouts[`day${dayNumber}`];
    
    return workoutData || null;
  };

  const renderExercise = (exercise: any, index: number) => {
    // Simple exercise map with unique keys
    const exerciseMap: { [key: string]: string } = {
      // Upper Body
      'Push-ups': 'https://i.pinimg.com/originals/5a/cf/47/5acf47f7c5b3b3b3b3b3b3b3b3b3b3b3.gif',
      'Incline Push-ups': 'https://example.com/incline-pushups.gif',
      'Diamond Push-ups': 'https://example.com/diamond-pushups.gif',
      'Wide-Grip Push-ups': 'https://example.com/wide-grip-pushups.gif',
      'Tricep Dips': 'https://example.com/tricep-dips.gif',
      'Pike Push-ups': 'https://example.com/pike-pushups.gif',
      'Chest Dips': 'https://example.com/chest-dips.gif',
      'Wall Handstand Push-ups': 'https://example.com/wall-handstand-pushups.gif',
      
      // Lower Body
      'Squats': 'https://example.com/squats.gif',
      'Jump Squats': 'https://example.com/jump-squats.gif',
      'Bulgarian Split Squats': 'https://example.com/bulgarian-split-squats.gif',
      'Single-Leg Squats': 'https://example.com/single-leg-squats.gif',
      'Lunges': 'https://example.com/lunges.gif',
      'Reverse Lunges': 'https://example.com/reverse-lunges.gif',
      'Walking Lunges': 'https://example.com/walking-lunges.gif',
      'Lateral Lunges': 'https://example.com/lateral-lunges.gif',
      'Calf Raises': 'https://example.com/calf-raises.gif',
      'Single-Leg Calf Raises': 'https://example.com/single-leg-calf-raises.gif',
      'Wall Sit': 'https://example.com/wall-sit.gif',
      'Glute Bridges': 'https://example.com/glute-bridges.gif',
      'Single-Leg Glute Bridges': 'https://example.com/single-leg-glute-bridges.gif',
      'Hip Thrusts': 'https://example.com/hip-thrusts.gif',
      'Step-ups': 'https://example.com/step-ups.gif',
      
      // Core
      'Plank': 'https://example.com/plank.gif',
      'Side Plank': 'https://example.com/side-plank.gif',
      'Plank Up-Downs': 'https://example.com/plank-up-downs.gif',
      'Mountain Climbers': 'https://example.com/mountain-climbers.gif',
      'Russian Twisters': 'https://example.com/russian-twisters.gif',
      'Bicycle Crunches': 'https://example.com/bicycle-crunches.gif',
      'Leg Raises': 'https://example.com/leg-raises.gif',
      'Dead Bug': 'https://example.com/dead-bug.gif',
      'Bird Dog': 'https://example.com/bird-dog.gif',
      'Hollow Body Hold': 'https://example.com/hollow-body-hold.gif',
      'V-Ups': 'https://example.com/v-ups.gif',
      'Reverse Crunches': 'https://example.com/reverse-crunches.gif',
      
      // Full Body / Cardio
      'Burpees': 'https://example.com/burpees.gif',
      'Jumping Jacks': 'https://example.com/jumping-jacks.gif',
      'High Knees': 'https://example.com/high-knees.gif',
      'Butt Kickers': 'https://example.com/butt-kickers.gif',
      'Bear Crawl': 'https://example.com/bear-crawl.gif',
      'Crab Walk': 'https://example.com/crab-walk.gif',
      'Inchworms': 'https://example.com/inchworms.gif',
      'Sprawls': 'https://example.com/sprawls.gif',
      'Squat Thrusts': 'https://example.com/squat-thrusts.gif',
      'Star Jumps': 'https://example.com/star-jumps.gif',
      
      // Flexibility / Mobility
      'Arm Circles': 'https://example.com/arm-circles.gif',
      'Leg Swings': 'https://example.com/leg-swings.gif',
      'Hip Circles': 'https://example.com/hip-circles.gif',
      'Torso Twists': 'https://example.com/torso-twists.gif',
      'Shoulder Rolls': 'https://example.com/shoulder-rolls.gif',
      'Neck Rolls': 'https://example.com/neck-rolls.gif',
      'Cat-Cow Stretch': 'https://example.com/cat-cow-stretch.gif',
      'Child Pose': 'https://example.com/child-pose.gif',
      'Downward Dog': 'https://example.com/downward-dog.gif',
      'Cobra Stretch': 'https://example.com/cobra-stretch.gif',
      'Pigeon Pose': 'https://example.com/pigeon-pose.gif',
      'Figure Four Stretch': 'https://example.com/figure-four-stretch.gif',
      'Hamstring Stretch': 'https://example.com/hamstring-stretch.gif',
      'Quad Stretch': 'https://example.com/quad-stretch.gif',
      'Calf Stretch': 'https://example.com/calf-stretch.gif',
      'Chest Stretch': 'https://example.com/chest-stretch.gif',
      'Shoulder Stretch': 'https://example.com/shoulder-stretch.gif',
      'Tricep Stretch': 'https://example.com/tricep-stretch.gif',
      'Hip Flexor Stretch': 'https://example.com/hip-flexor-stretch.gif',
      'IT Band Stretch': 'https://example.com/it-band-stretch.gif',
      'Spinal Twist': 'https://example.com/spinal-twist.gif'
    };

    const exerciseName = exercise.name || exercise.exercise || 'Unknown Exercise';
    const animationUrl = exerciseMap[exerciseName] || 'https://via.placeholder.com/300x200?text=Exercise';

    return (
      <div key={`${exerciseName}-${index}`} className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <img
              src={animationUrl}
              alt={exerciseName}
              className="w-16 h-16 object-cover rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/64x64?text=Ex';
              }}
            />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{exerciseName}</h4>
            {exercise.sets && exercise.reps && (
              <p className="text-sm text-gray-600">
                {exercise.sets} sets × {exercise.reps} reps
              </p>
            )}
            {exercise.duration && (
              <p className="text-sm text-gray-600">
                Duration: {exercise.duration}
              </p>
            )}
            {exercise.instructions && (
              <p className="text-sm text-gray-500 mt-1">
                {exercise.instructions}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderDayView = (dayNumber: number) => {
    const workout = getDayWorkout(dayNumber);
    const isCompleted = completedDays.has(dayNumber);

    if (!workout) {
      return (
        <Card className="mb-4">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Rest Day</p>
              <p className="text-sm text-gray-400 mt-2">Take a well-deserved break!</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5" />
                Day {dayNumber} - {workout.title || 'Workout'}
                {isCompleted && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </CardTitle>
              <CardDescription className="flex items-center gap-4 mt-2">
                {workout.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {workout.duration} min
                  </span>
                )}
                {workout.targetMuscleGroups && workout.targetMuscleGroups.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    {workout.targetMuscleGroups.join(', ')}
                  </span>
                )}
              </CardDescription>
            </div>
            {!isCompleted && (
              <Button
                onClick={() => handleDayComplete(dayNumber)}
                className="bg-fitness-primary hover:bg-fitness-primary/90"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {workout.exercises && workout.exercises.length > 0 ? (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Exercises:</h4>
              {workout.exercises.map((exercise: any, index: number) => 
                renderExercise(exercise, index)
              )}
            </div>
          ) : (
            <p className="text-gray-500">No exercises defined for this day.</p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Plan Overview */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-fitness-primary" />
                {plan.planName}
              </CardTitle>
              <CardDescription className="mt-2">
                {plan.fitnessGoal} • {plan.totalDays} Day Plan
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {completedCount}/{plan.totalDays} Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            {progressPercentage === 100 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <Trophy className="h-5 w-5" />
                  <span className="font-semibold">Congratulations! You've completed the plan!</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Day Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Day</CardTitle>
          <CardDescription>Choose a day to view or complete the workout</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: plan.totalDays }, (_, i) => i + 1).map((day) => {
              const isCompleted = completedDays.has(day);
              const isSelected = selectedDay === day;
              
              return (
                <Button
                  key={day}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleViewDay(day)}
                  className={`relative ${
                    isCompleted 
                      ? 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200' 
                      : isSelected 
                        ? 'bg-fitness-primary hover:bg-fitness-primary/90' 
                        : ''
                  }`}
                >
                  {day}
                  {isCompleted && (
                    <CheckCircle className="h-3 w-3 absolute -top-1 -right-1 text-green-600" />
                  )}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Day View */}
      {selectedDay && renderDayView(selectedDay)}

      {/* Quick Start - Show first incomplete day */}
      {!selectedDay && completedCount < plan.totalDays && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Continue Your Journey
            </CardTitle>
            <CardDescription>
              Ready for your next workout? Here's what's up next.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => {
                const nextDay = completedCount + 1;
                setSelectedDay(nextDay);
              }}
              className="bg-fitness-primary hover:bg-fitness-primary/90"
            >
              Start Day {completedCount + 1}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkoutPlanViewer;
