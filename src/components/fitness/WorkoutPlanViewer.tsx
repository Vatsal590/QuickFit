
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, Target, Calendar, CheckCircle, Play } from 'lucide-react';
import { WorkoutPlan } from '@/types';

interface WorkoutPlanViewerProps {
  plan: WorkoutPlan;
  onMarkComplete: (planId: string, dayNumber: number) => void;
}

const WorkoutPlanViewer: React.FC<WorkoutPlanViewerProps> = ({ plan, onMarkComplete }) => {
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  const capitalizedPlanType = plan.goal
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  const dailyWorkouts = plan.dailyWorkouts || [];

  // Get exercise animation URL based on exercise name
  const getExerciseAnimationUrl = (exerciseName: string): string => {
    const exerciseMap: { [key: string]: string } = {
      // Chest exercises
      'Push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-up.gif',
      'Incline Push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Push-Up.gif',
      'Diamond Push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Diamond-Push-Up.gif',
      'Wide Push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Wide-Grip-Push-Up.gif',
      'Decline Push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Decline-Push-up.gif',
      'Close-grip Push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Close-Grip-Push-Up.gif',
      'Chest Flyes': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Flyes.gif',
      'Dumbbell Bench Press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Bench-Press.gif',
      'Chest Dips': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Chest-Dips.gif',
      
      // Tricep exercises
      'Tricep Dips': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Tricep-Dips.gif',
      'Overhead Press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif',
      'Tricep Extensions': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Overhead-Triceps-Extension.gif',
      'Pike Push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pike-Push-up.gif',
      
      // Back exercises
      'Pull-ups/Rows': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif',
      'Bent-over Rows': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bent-Over-Row.gif',
      'Wide-grip Pull-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Wide-Grip-Pull-Up.gif',
      'Single-arm Rows': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/One-Arm-Dumbbell-Row.gif',
      'Lat Pulldowns': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lat-Pulldown.gif',
      'Reverse Flyes': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Reverse-Fly.gif',
      'Face Pulls': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Face-Pull.gif',
      'Superman': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Superman-Exercise.gif',
      
      // Bicep exercises
      'Bicep Curls': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Curl.gif',
      'Hammer Curls': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hammer-Curl.gif',
      'Concentration Curls': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Concentration-Curl.gif',
      
      // Leg exercises
      'Squats': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bodyweight-Squat.gif',
      'Lunges': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lunge.gif',
      'Jump Squats': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Jump-Squat.gif',
      'Bulgarian Split Squats': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bulgarian-Split-Squat.gif',
      'Pistol Squats': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pistol-Squat.gif',
      'Calf Raises': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Calf-Raise.gif',
      'Wall Sit': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Wall-Sit.gif',
      'Glute Bridges': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Glute-Bridge.gif',
      
      // Abs/Core exercises
      'Plank': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Plank.gif',
      'Bicycle Crunches': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bicycle-Crunch.gif',
      'Russian Twists': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Russian-Twist.gif',
      'Mountain Climbers': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Mountain-Climber.gif',
      'Dead Bug': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dead-Bug.gif',
      'Leg Raises': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Leg-Raise.gif',
      'Crunches': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Crunch.gif',
      'Sit-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Sit-Up.gif',
      'Hanging Knee Raises': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hanging-Knee-Raise.gif',
      'V-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/V-Up.gif',
      
      // HIIT/Cardio exercises
      'Burpees': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Burpee.gif',
      'Jump Jacks': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Jumping-Jacks.gif',
      'High Knees': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/High-Knees.gif',
      'Butt Kickers': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Butt-Kickers.gif',
      'Plank Jacks': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Plank-Jack.gif'
    };

    return exerciseMap[exerciseName] || 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bodyweight-Squat.gif';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{plan.title}</CardTitle>
              <p className="text-gray-600 mt-2">
                {plan.daysLeft} days remaining of {plan.duration}-day program
              </p>
            </div>
            <Badge variant="secondary" className="bg-fitness-primary/10 text-fitness-primary">
              <Target className="h-3 w-3 mr-1" />
              {capitalizedPlanType}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {dailyWorkouts.map((day: any) => (
          <Card key={day.day} className={`${day.completed ? 'bg-green-50 border-green-200' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    day.completed 
                      ? 'bg-green-500 text-white' 
                      : day.isRestDay 
                        ? 'bg-gray-200 text-gray-600' 
                        : 'bg-fitness-primary text-white'
                  }`}>
                    {day.completed ? <CheckCircle className="h-4 w-4" /> : day.day}
                  </div>
                  <div>
                    <h3 className="font-semibold">Day {day.day}</h3>
                    <p className="text-sm text-gray-600">
                      {day.isRestDay ? 'Rest Day' : `${day.workout?.focus?.replace('_', ' ')} Training`}
                    </p>
                  </div>
                </div>
                {!day.isRestDay && !day.completed && (
                  <Button
                    onClick={() => onMarkComplete(plan.id, day.day)}
                    variant="outline"
                    size="sm"
                    className="border-green-500 text-green-600 hover:bg-green-50"
                  >
                    Mark Complete
                  </Button>
                )}
                {day.completed && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Completed
                  </Badge>
                )}
              </div>
            </CardHeader>

            {!day.isRestDay && day.workout?.exercises && (
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {day.workout.exercises.map((exercise: any, index: number) => (
                    <Dialog key={index}>
                      <DialogTrigger asChild>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                          <div>
                            <h4 className="font-medium flex items-center gap-2">
                              {exercise.name}
                              <Play className="h-3 w-3 text-fitness-primary" />
                            </h4>
                            <p className="text-sm text-gray-600">
                              {exercise.sets} sets × {exercise.reps}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {exercise.rest} rest
                            </div>
                          </div>
                        </div>
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
                            <p><strong>Rest:</strong> {exercise.rest}</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </CardContent>
            )}

            {day.isRestDay && (
              <CardContent className="pt-0">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                    <p className="text-blue-700">{day.restType || 'Rest and recovery day. Stay hydrated and get good sleep!'}</p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WorkoutPlanViewer;
