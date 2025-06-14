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

      // Olympic Lifts (Simplified)
      'hang cleans': 'Start with bar at mid-thigh. Explosively extend hips and shrug shoulders. Pull bar up and catch in front rack position. Focus on speed and timing.',
      'push press': 'Start with bar in front rack position. Dip slightly at knees, then drive up explosively while pressing bar overhead. Use leg drive to assist press.',

      // Core & Stability
      'plank variations': 'Hold plank position with proper alignment - straight line from head to heels. Variations include side planks, plank up-downs, or adding arm/leg movements.',
      'russian twists': 'Sit with knees bent, lean back slightly. Rotate torso side to side, touching ground beside hips. Keep chest up and core engaged throughout movement.',
      'dead bugs': 'Lie on back, arms up, knees at 90 degrees. Lower opposite arm and leg while maintaining core stability. Return to start and repeat on other side.',

      // Cardio & Conditioning
      'high knees': 'Run in place bringing knees up toward chest. Pump arms naturally. Focus on quick turnover and maintaining posture.',
      'mountain climbers': 'Start in plank position. Alternately bring knees toward chest in running motion. Keep hips level and core engaged.',
      'battle ropes': 'Hold rope ends with feet shoulder-width apart. Create waves by alternately raising and lowering arms explosively. Maintain athletic stance.',

      // Flexibility & Mobility
      'dynamic stretching': 'Perform controlled movements through full range of motion. Examples include leg swings, arm circles, walking lunges with reach. Prepare muscles for activity.',
      'foam rolling': 'Use foam roller to apply pressure to tight muscles. Roll slowly, pausing on tender spots. Focus on major muscle groups used in training.',

      // Sport-Specific Drills
      'sprint intervals': 'Alternate between high-intensity sprints and recovery periods. Focus on maximum effort during work periods and active recovery between sets.',
      'change of direction': 'Practice quick direction changes using various patterns. Focus on body position, foot placement, and minimizing deceleration time.',
      'reaction drills': 'Respond to visual or auditory cues with quick movements. Improves reaction time and decision-making speed.'
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
      // Athlete-specific exercises
      'medicine ball slams': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Medicine-Ball-Slam.gif',
      'box jumps': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Box-Jump.gif',
      'explosive push-ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/11/explosive-push-ups.gif',
      'power cleans': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/08/barbell-power-clean.gif',
      'broad jumps': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/09/broad-jump.gif',
      'plyometric push-ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/11/explosive-push-ups.gif',
      'single-leg box jumps': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Single-Leg-Box-Jump.gif',
      'battle rope slams': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Battle-Ropes.gif',
      'olympic lifts complex': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/08/barbell-power-clean.gif',
      'depth jumps': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/09/depth-jump.gif',
      'explosive burpees': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Burpee.gif',
      'medicine ball throws': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Medicine-Ball-Slam.gif',
      'sprint starts': 'https://i.pinimg.com/originals/55/50/03/555003596e97967eb5f2568403bbc742.gif',
      
      // Agility exercises
      'ladder drills': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/04/agility-ladder-drills.gif',
      'cone weaving': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/04/cone-drills.gif',
      'lateral shuffles': 'https://fitnessprogramer.com/wp-content/uploads/2021/10/Lateral-Shuffle.gif',
      't-drill': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/04/t-drill.gif',
      '5-10-5 shuttle': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/04/shuttle-run.gif',
      'reactive cuts': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/04/reactive-agility.gif',
      'sprint intervals': 'https://i.pinimg.com/originals/55/50/03/555003596e97967eb5f2568403bbc742.gif',
      'direction changes': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/04/direction-change.gif',
      
      // Functional strength
      'functional squats': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/06/bodyweight-squat.gif',
      "farmer's walk": 'https://www.inspireusafoundation.org/wp-content/uploads/2022/08/farmers-walk.gif',
      'turkish get-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/04/Turkish-Get-Up-Squat-style.gif',
      'bear crawl': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/07/bear-crawl.gif',
      'unilateral deadlifts': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/10/barbell-single-leg-deadlift.gif',
      'overhead carries': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/08/overhead-carry.gif',
      'rotational throws': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Medicine-Ball-Rotational-Throw.gif',
      'suitcase carries': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/08/suitcase-carry.gif',
      'crawling patterns': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/07/bear-crawl.gif',
      
      // Core stability
      'plank progressions': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/01/plank.gif',
      'dead bug': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dead-Bug.gif',
      'bird dog': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/07/bird-dog.gif',
      'pallof press': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/08/pallof-press.gif',
      'stability ball exercises': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/08/stability-ball-plank.gif',
      'anti-rotation training': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/08/pallof-press.gif',
      
      // Movement & Mobility
      'dynamic warm-up': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/04/dynamic-warmup.gif',
      'hip circles': 'https://i.pinimg.com/originals/12/31/e2/1231e24fc3d7944e38b180c51067689d.gif',
      'leg swings': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/04/leg-swings.gif',
      'spinal waves': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/04/spinal-mobility.gif',
      'flow sequences': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/04/movement-flow.gif',
      
      // Plyometric training
      'basic jump training': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Jump-Squat.gif',
      'skipping variations': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/04/skipping.gif',
      'bounding': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/04/bounding.gif',
      'hop progressions': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/04/single-leg-hop.gif',
      'landing mechanics': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/04/landing-mechanics.gif',
      'multi-directional jumps': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/04/multi-directional-jumps.gif',
      'reactive plyometrics': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/04/reactive-jumps.gif',
      
      // Standard exercises from existing pool
      'push-ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/11/push-up.gif',
      'squats': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/06/bodyweight-squat.gif',
      'pull-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif',
      'lunges': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/01/dumbbell-lunges.gif',
      'burpees': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Burpee.gif',
      'mountain climbers': 'https://i.pinimg.com/originals/fb/fa/09/fbfa0902f381a5735972c21255935aff.gif',
      'plank': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/01/plank.gif',
      'high knees': 'https://i.pinimg.com/originals/55/50/03/555003596e97967eb5f2568403bbc742.gif',
      'butt kickers': 'https://fitnessprogramer.com/wp-content/uploads/2021/10/Butt-Kicks.gif',
      'kettlebell swings': 'https://burnfit.io/wp-content/uploads/2023/11/KB_SWING.gif',
      'jump squats': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Jump-Squat.gif',
      'overhead press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif',
      'rows': 'https://burnfit.io/wp-content/uploads/2023/11/DB_LOW.gif',
      'single-arm rows': 'https://burnfit.io/wp-content/uploads/2023/11/OA_DB_ROW.gif',
      'lateral raises': 'https://fitnessprogramer.com/wp-content/uploads/2021/04/Seated-Dumbbell-Lateral-Raise.gif',
      'tricep dips': 'https://miro.medium.com/v2/resize:fit:840/0*xpvWu3s9ZmFHPhLb.gif',
      'bicep curls': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Curl.gif',
      'calf raises': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/01/standing-calf-raise.gif',
      'glute bridges': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/12/glute-bridge.gif',
      'bicycle crunches': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bicycle-Crunch.gif',
      'russian twists': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Russian-Twist.gif',
      'leg raises': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lying-Leg-Raise.gif',
      'jump jacks': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/08/jumping-jacks.gif',
      'arm circles': 'https://spotebi.com/wp-content/uploads/2014/10/big-arm-circles-exercise-illustration.gif'
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
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WorkoutPlanViewer;
