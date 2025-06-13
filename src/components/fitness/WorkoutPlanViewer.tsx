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
    // Normalize the exercise name for matching
    const normalizedName = exerciseName.toLowerCase().trim();
    
    const exerciseMap: { [key: string]: string } = {
      // Chest exercises - various naming patterns
      'push-ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/11/push-up.gif',
      'push ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/11/push-up.gif',
      'pushups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/11/push-up.gif',
      'standard push-ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/11/push-up.gif',
      'incline push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Incline-Push-Up.gif',
      'incline push ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Incline-Push-Up.gif',
      'diamond push-ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/08/diamond-pushup.gif',
      'diamond push ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/08/diamond-pushup.gif',
      'wide push-ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/11/wide-arm-push-ups.gif',
      'wide push ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/11/wide-arm-push-ups.gif',
      'decline push-ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/07/decline-push-up.gif',
      'decline push ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/07/decline-push-up.gif',
      'close-grip push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Close-Grip-Push-Up.gif',
      'close grip push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Close-Grip-Push-Up.gif',
      'archer push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Archer-Push-Up.gif',
      'archer push ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Archer-Push-Up.gif',
      'chest flyes': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Flyes.gif',
      'chest flys': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Flyes.gif',
      'dumbbell flyes': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Flyes.gif',
      'dumbbell chest press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Bench-Press.gif',
      'dumbbell bench press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Bench-Press.gif',
      'chest dips': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Chest-Dips.gif',
      'dips': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Chest-Dips.gif',
      'incline dumbbell press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Dumbbell-Press.gif',
      'cable chest fly': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Fly.gif',
      'pec deck flyes': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pec-Deck-Fly.gif',
      
      // Back exercises
      'pull-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif',
      'pull ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif',
      'pullups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif',
      'pull-ups/rows': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif',
      'chin-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Chin-Up.gif',
      'chin ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Chin-Up.gif',
      'bent-over rows': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bent-Over-Row.gif',
      'bent over rows': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bent-Over-Row.gif',
      'wide-grip pull-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Wide-Grip-Pull-Up.gif',
      'wide grip pull-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Wide-Grip-Pull-Up.gif',
      'single-arm rows': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/One-Arm-Dumbbell-Row.gif',
      'single arm rows': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/One-Arm-Dumbbell-Row.gif',
      'lat pulldowns': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lat-Pulldown.gif',
      'lat pulldown': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lat-Pulldown.gif',
      'reverse flyes': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Reverse-Fly.gif',
      'reverse flys': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Reverse-Fly.gif',
      'face pulls': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Face-Pull.gif',
      'face pull': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Face-Pull.gif',
      'superman': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Superman-Exercise.gif',
      'supermans': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Superman-Exercise.gif',
      
      // Shoulder exercises
      'overhead press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif',
      'shoulder press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif',
      'dumbbell shoulder press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif',
      'lateral raises': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lateral-Raise.gif',
      'lateral raise': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lateral-Raise.gif',
      'side raises': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lateral-Raise.gif',
      'front raises': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Front-Raise.gif',
      'front raise': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Front-Raise.gif',
      'rear delt flyes': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Reverse-Fly.gif',
      'pike push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pike-Push-up.gif',
      'pike push ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pike-Push-up.gif',
      'handstand push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Handstand-Push-Up.gif',
      'handstand push ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Handstand-Push-Up.gif',
      
      // Tricep exercises
      'tricep dips': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Tricep-Dips.gif',
      'triceps dips': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Tricep-Dips.gif',
      'tricep extensions': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Overhead-Triceps-Extension.gif',
      'triceps extensions': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Overhead-Triceps-Extension.gif',
      'overhead tricep extension': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Overhead-Triceps-Extension.gif',
      'overhead triceps extension': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Overhead-Triceps-Extension.gif',
      'tricep pushdown': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Triceps-Pushdown.gif',
      'triceps pushdown': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Triceps-Pushdown.gif',
      'close-grip bench press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Close-Grip-Bench-Press.gif',
      'close grip bench press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Close-Grip-Bench-Press.gif',
      
      // Bicep exercises
      'bicep curls': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Curl.gif',
      'biceps curls': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Curl.gif',
      'dumbbell curls': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Curl.gif',
      'dumbbell bicep curl': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Curl.gif',
      'hammer curls': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hammer-Curl.gif',
      'hammer curl': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hammer-Curl.gif',
      'concentration curls': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Concentration-Curl.gif',
      'concentration curl': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Concentration-Curl.gif',
      'barbell curls': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Curl.gif',
      'barbell curl': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Curl.gif',
      
      // Leg exercises
      'squats': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bodyweight-Squat.gif',
      'bodyweight squats': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bodyweight-Squat.gif',
      'bodyweight squat': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bodyweight-Squat.gif',
      'lunges': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lunge.gif',
      'dumbbell lunges': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lunge.gif',
      'dumbbell lunge': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lunge.gif',
      'jump squats': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Jump-Squat.gif',
      'jumping squats': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Jump-Squat.gif',
      'jumping squat': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Jump-Squat.gif',
      'bulgarian split squats': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bulgarian-Split-Squat.gif',
      'bulgarian split squat': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bulgarian-Split-Squat.gif',
      'pistol squats': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pistol-Squat.gif',
      'pistol squat': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pistol-Squat.gif',
      'calf raises': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Calf-Raise.gif',
      'calf raise': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Calf-Raise.gif',
      'wall sit': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Wall-Sit.gif',
      'wall sits': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Wall-Sit.gif',
      'glute bridges': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Glute-Bridge.gif',
      'glute bridge': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Glute-Bridge.gif',
      'goblet squats': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Goblet-Squat.gif',
      'goblet squat': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Goblet-Squat.gif',
      'romanian deadlifts': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Romanian-Deadlift.gif',
      'romanian deadlift': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Romanian-Deadlift.gif',
      'single-leg deadlifts': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Single-Leg-Deadlift.gif',
      'single leg deadlifts': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Single-Leg-Deadlift.gif',
      
      // Abs/Core exercises
      'plank': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Plank.gif',
      'planks': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Plank.gif',
      'bicycle crunches': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bicycle-Crunch.gif',
      'bicycle crunch': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bicycle-Crunch.gif',
      'russian twists': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Russian-Twist.gif',
      'russian twist': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Russian-Twist.gif',
      'mountain climbers': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Mountain-Climber.gif',
      'mountain climber': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Mountain-Climber.gif',
      'dead bug': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dead-Bug.gif',
      'dead bugs': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dead-Bug.gif',
      'leg raises': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Leg-Raise.gif',
      'leg raise': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Leg-Raise.gif',
      'crunches': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Crunch.gif',
      'crunch': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Crunch.gif',
      'sit-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Sit-Up.gif',
      'sit ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Sit-Up.gif',
      'situps': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Sit-Up.gif',
      'hanging knee raises': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hanging-Knee-Raise.gif',
      'hanging knee raise': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hanging-Knee-Raise.gif',
      'v-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/V-Up.gif',
      'v ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/V-Up.gif',
      'side plank': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Side-Plank.gif',
      'side planks': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Side-Plank.gif',
      'plank to downward dog': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Plank-to-Downward-Dog.gif',
      'reverse crunches': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Reverse-Crunch.gif',
      'reverse crunch': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Reverse-Crunch.gif',
      'flutter kicks': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Flutter-Kicks.gif',
      'flutter kick': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Flutter-Kicks.gif',
      
      // HIIT/Cardio exercises
      'burpees': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Burpee.gif',
      'burpee': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Burpee.gif',
      'jump jacks': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Jumping-Jacks.gif',
      'jumping jacks': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Jumping-Jacks.gif',
      'jumping jack': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Jumping-Jacks.gif',
      'high knees': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/High-Knees.gif',
      'high knee': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/High-Knees.gif',
      'butt kickers': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Butt-Kickers.gif',
      'butt kicker': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Butt-Kickers.gif',
      'plank jacks': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Plank-Jack.gif',
      'plank jack': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Plank-Jack.gif',
      'kettlebell swings': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Kettlebell-Swing.gif',
      'kettlebell swing': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Kettlebell-Swing.gif',
      'dumbbell thrusters': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Thruster.gif',
      'dumbbell thruster': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Thruster.gif',
      'turkish get-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Turkish-Get-Up.gif',
      'turkish get up': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Turkish-Get-Up.gif',
      
      // Warmup exercises
      'light jogging in place': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/High-Knees.gif',
      'jogging in place': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/High-Knees.gif',
      'arm circles': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Arm-Circles.gif',
      'arm circle': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Arm-Circles.gif',
      'hip rotations': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hip-Circles.gif',
      'hip rotation': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hip-Circles.gif',
      'shoulder stretches': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Shoulder-Stretch.gif',
      'shoulder stretch': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Shoulder-Stretch.gif',
      
      // Cooldown exercises
      'deep breathing': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Deep-Breathing.gif',
      'quad stretch': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Standing-Quad-Stretch.gif',
      'quad stretches': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Standing-Quad-Stretch.gif',
      'hamstring stretch': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Seated-Hamstring-Stretch.gif',
      'hamstring stretches': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Seated-Hamstring-Stretch.gif',
      "child's pose": 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Childs-Pose.gif',
      'childs pose': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Childs-Pose.gif',
      'chest stretch': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Chest-Stretch.gif',
      'chest stretches': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Chest-Stretch.gif'
    };

    // Try exact match first
    if (exerciseMap[normalizedName]) {
      return exerciseMap[normalizedName];
    }

    // Try partial matches for more flexible matching
    for (const [key, url] of Object.entries(exerciseMap)) {
      if (normalizedName.includes(key) || key.includes(normalizedName)) {
        return url;
      }
    }

    // Default fallback
    return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bodyweight-Squat.gif';
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
