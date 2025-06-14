
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, Target, Calendar, CheckCircle, Play, Info } from 'lucide-react';
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

  // Get proper focus display name
  const getFocusDisplayName = (focus: string) => {
    if (!focus) return 'Training';
    
    const focusMap: { [key: string]: string } = {
      'strength': 'Strength Training',
      'power': 'Power Training',
      'agility': 'Agility Training',
      'endurance': 'Endurance Training',
      'conditioning': 'Conditioning',
      'recovery': 'Recovery',
      'plyometric': 'Plyometric Training',
      'functional': 'Functional Training',
      'core': 'Core Training',
      'movement': 'Movement Training',
      'cardio': 'Cardio Training',
      'muscle_gain': 'Muscle Building',
      'fat_loss': 'Fat Loss Training',
      'athlete_training': 'Athletic Training'
    };
    
    return focusMap[focus] || focus.charAt(0).toUpperCase() + focus.slice(1).replace(/_/g, ' ');
  };

  // Get detailed exercise descriptions
  const getExerciseDescription = (exerciseName: string): string => {
    const descriptions: { [key: string]: string } = {
      // Strength Training
      'deadlifts': 'Stand with feet hip-width apart, bar over mid-foot. Hinge at hips, grab bar with hands just outside legs. Drive through heels, extend hips and knees simultaneously. Keep chest up, shoulders back. Lower with control.',
      'squats': 'Stand with feet shoulder-width apart, toes slightly turned out. Lower by pushing hips back and bending knees. Keep chest up, knees track over toes. Descend until thighs parallel to floor, then drive through heels to stand.',
      'bench press': 'Lie on bench, feet flat on floor. Grip bar slightly wider than shoulders. Lower bar to chest with control, pause briefly. Press bar up explosively, keeping shoulder blades retracted throughout movement.',
      'pull-ups': 'Hang from bar with arms fully extended, hands shoulder-width apart. Pull body up until chin clears bar. Lower with control to full arm extension. Engage core throughout movement.',
      'overhead press': 'Stand with feet hip-width apart, core engaged. Press weight from shoulder height straight up overhead. Keep head neutral, don\'t arch back excessively. Lower with control to starting position.',
      'rows': 'Hinge at hips with slight knee bend. Pull weight to lower chest/upper abdomen. Squeeze shoulder blades together. Keep core tight, don\'t round back. Lower with control.',
      'lunges': 'Step forward into lunge position. Lower back knee toward ground while keeping front knee over ankle. Push through front heel to return to starting position. Alternate legs or complete all reps on one side.',

      // Power & Explosive Training
      'box jumps': 'Stand facing box. Jump explosively onto box, landing softly with both feet. Step down carefully or jump down if height allows. Focus on soft landings and full hip extension.',
      'medicine ball slams': 'Hold medicine ball overhead. Explosively slam ball down while engaging core and extending through entire body. Pick up ball and repeat. Focus on speed and power.',
      'burpees': 'Start standing. Drop to squat, place hands on ground. Jump feet back to plank. Perform push-up. Jump feet back to squat. Explode up with arms overhead.',
      'jump squats': 'Perform regular squat. At bottom, explode up jumping as high as possible. Land softly, immediately descending into next squat. Focus on soft landings and continuous movement.',
      'kettlebell swings': 'Stand with feet wider than shoulders, kettlebell between legs. Hinge at hips, grab kettlebell. Drive hips forward explosively, swinging kettlebell to shoulder height. Control descent.',

      // Agility & Speed Training
      'ladder drills': 'Use agility ladder on ground. Perform various footwork patterns - in-in-out-out, lateral shuffles, high knees. Focus on quick, precise foot placement and maintaining rhythm.',
      'cone sprints': 'Set up cones in various patterns. Sprint between cones using different movement patterns - straight line, zigzag, T-drill. Focus on acceleration, deceleration, and change of direction.',
      'shuttle runs': 'Sprint to designated point, touch ground, return to start. Repeat for specified distance/time. Focus on quick acceleration and efficient turning technique.',
      'lateral bounds': 'Stand on one foot. Bound laterally to opposite foot, sticking landing. Continue bounding side to side. Focus on single-leg stability and controlled landings.',

      // Plyometric Training
      'depth jumps': 'Step off box, land softly, immediately jump vertically as high as possible. Focus on minimal ground contact time and maximum vertical jump height.',
      'broad jumps': 'Stand with feet shoulder-width apart. Jump forward as far as possible, landing on both feet. Swing arms for momentum. Focus on distance and soft landing.',
      'single-leg hops': 'Hop forward, backward, or laterally on one leg. Focus on quick ground contact and maintaining balance. Complete all reps on one leg before switching.',

      // Core & Stability
      'plank variations': 'Hold plank position with proper alignment - straight line from head to heels. Variations include side planks, plank up-downs, or adding arm/leg movements.',
      'russian twists': 'Sit with knees bent, lean back slightly. Rotate torso side to side, touching ground beside hips. Keep chest up and core engaged throughout movement.',
      'dead bugs': 'Lie on back, arms up, knees at 90 degrees. Lower opposite arm and leg while maintaining core stability. Return to start and repeat on other side.',

      // Cardio & Conditioning
      'high knees': 'Run in place bringing knees up toward chest. Pump arms naturally. Focus on quick turnover and maintaining posture.',
      'mountain climbers': 'Start in plank position. Alternately bring knees toward chest in running motion. Keep hips level and core engaged.',
      'battle ropes': 'Hold rope ends with feet shoulder-width apart. Create waves by alternately raising and lowering arms explosively. Maintain athletic stance.',

      // Standard exercises from existing pool
      'push-ups': 'Start in plank position. Lower body until chest nearly touches ground. Push back up to starting position. Keep body in straight line throughout.',
      'bicep curls': 'Stand with weights at sides. Curl weights up by flexing biceps. Lower with control. Keep elbows at sides throughout movement.',
      'tricep dips': 'Sit on edge of bench, hands beside hips. Lower body by bending elbows. Push back up to starting position. Keep body close to bench.',
      'calf raises': 'Stand with feet hip-width apart. Rise up onto toes by contracting calves. Lower with control. Can be done on flat ground or elevated surface.',
      'glute bridges': 'Lie on back, knees bent. Lift hips by squeezing glutes. Hold briefly at top. Lower with control. Focus on glute activation.',
      'bicycle crunches': 'Lie on back, hands behind head. Bring opposite elbow to knee while extending other leg. Alternate in cycling motion.',
      'leg raises': 'Lie on back, legs straight. Lift legs until vertical or as high as possible. Lower with control without touching ground.',
      'jump jacks': 'Start with feet together, arms at sides. Jump feet apart while raising arms overhead. Return to starting position. Maintain rhythm.',
      'arm circles': 'Extend arms to sides. Make small circles, gradually increasing size. Reverse direction. Good for warming up shoulders.'
    };

    // Normalize the exercise name for matching
    const normalizedName = exerciseName.toLowerCase().trim();
    
    // Try exact match first
    if (descriptions[normalizedName]) {
      return descriptions[normalizedName];
    }

    // Try partial matches for more flexible matching
    for (const [key, description] of Object.entries(descriptions)) {
      if (normalizedName.includes(key) || key.includes(normalizedName)) {
        return description;
      }
    }

    // Default description
    return 'Perform this exercise with proper form and control. Focus on quality movement patterns and maintain good posture throughout. If unsure about technique, consult a qualified trainer.';
  };

  // Get exercise animation URL based on exercise name
  const getExerciseAnimationUrl = (exerciseName: string): string => {
    // Normalize the exercise name for matching
    const normalizedName = exerciseName.toLowerCase().trim();
    
    const exerciseMap: { [key: string]: string } = {
      // Standard exercises
      'push-ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/11/push-up.gif',
      'squats': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/06/bodyweight-squat.gif',
      'pull-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif',
      'lunges': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/01/dumbbell-lunges.gif',
      'burpees': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Burpee.gif',
      'mountain climbers': 'https://i.pinimg.com/originals/fb/fa/09/fbfa0902f381a5735972c21255935aff.gif',
      'plank': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/01/plank.gif',
      'high knees': 'https://i.pinimg.com/originals/55/50/03/555003596e97967eb5f2568403bbc742.gif',
      'jump squats': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Jump-Squat.gif',
      'kettlebell swings': 'https://burnfit.io/wp-content/uploads/2023/11/KB_SWING.gif',
      'box jumps': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Box-Jump.gif',
      'medicine ball slams': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Medicine-Ball-Slam.gif',
      'battle ropes': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Battle-Ropes.gif',
      'russian twists': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Russian-Twist.gif',
      'bicycle crunches': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bicycle-Crunch.gif',
      'leg raises': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lying-Leg-Raise.gif',
      'jump jacks': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/08/jumping-jacks.gif',
      'deadlifts': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/09/barbell-deadlift.gif',
      'bench press': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/08/barbell-bench-press.gif',
      'overhead press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif',
      'rows': 'https://burnfit.io/wp-content/uploads/2023/11/DB_LOW.gif',
      'bicep curls': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Curl.gif',
      'tricep dips': 'https://miro.medium.com/v2/resize:fit:840/0*xpvWu3s9ZmFHPhLb.gif',
      'calf raises': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/01/standing-calf-raise.gif',
      'glute bridges': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/12/glute-bridge.gif',
      'broad jumps': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/09/broad-jump.gif',
      'depth jumps': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/09/depth-jump.gif',
      'lateral bounds': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/04/lateral-bounds.gif',
      'shuttle runs': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/04/shuttle-run.gif',
      'ladder drills': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/04/agility-ladder-drills.gif',
      'cone sprints': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/04/cone-drills.gif',
      'dead bugs': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dead-Bug.gif',
      'plank variations': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/01/plank.gif'
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
                      {day.isRestDay ? 'Rest Day' : getFocusDisplayName(day.workout?.focus || day.focus || plan.goal)}
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

            {!day.isRestDay && day.workout?.exercises && day.workout.exercises.length > 0 && (
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {day.workout.exercises.map((exercise: any, index: number) => (
                    <Dialog key={index}>
                      <DialogTrigger asChild>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                          <div>
                            <h4 className="font-medium flex items-center gap-2">
                              {exercise.name}
                              <Info className="h-3 w-3 text-fitness-primary" />
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
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            {exercise.name}
                            <Badge variant="secondary" className="text-xs">
                              {exercise.sets} × {exercise.reps}
                            </Badge>
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {/* Exercise Animation */}
                          <div className="w-full bg-gray-100 rounded-lg overflow-hidden flex justify-center items-center" style={{ minHeight: '300px' }}>
                            <img
                              src={getExerciseAnimationUrl(exercise.name)}
                              alt={`${exercise.name} demonstration`}
                              className="max-w-full max-h-80 object-contain rounded-lg"
                              style={{ width: 'auto', height: 'auto' }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bodyweight-Squat.gif';
                              }}
                            />
                          </div>
                          
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">How to Perform:</h4>
                            <p className="text-sm text-blue-800 leading-relaxed">
                              {getExerciseDescription(exercise.name)}
                            </p>
                          </div>
                          <div className="grid grid-cols-3 gap-3 text-sm">
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <p className="font-medium">Sets</p>
                              <p className="text-fitness-primary">{exercise.sets}</p>
                            </div>
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <p className="font-medium">Reps</p>
                              <p className="text-fitness-primary">{exercise.reps}</p>
                            </div>
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <p className="font-medium">Rest</p>
                              <p className="text-fitness-primary">{exercise.rest}</p>
                            </div>
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

            {!day.isRestDay && (!day.workout?.exercises || day.workout.exercises.length === 0) && (
              <CardContent className="pt-0">
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-600">No exercises available for this day</p>
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
