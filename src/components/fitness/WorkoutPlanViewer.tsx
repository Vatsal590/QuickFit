import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, Target, Calendar, CheckCircle, Play, Lock, Timer } from 'lucide-react';
import { WorkoutPlan } from '@/types';
import ExerciseTimer from '@/components/workout/ExerciseTimer';
import { setCoachContext, compactContext } from '@/lib/coachContext';
import { setLiveWorkout } from '@/lib/workoutContext';

interface WorkoutPlanViewerProps {
  plan: WorkoutPlan;
  onMarkComplete: (planId: string, dayNumber: number) => void;
}

const WorkoutPlanViewer: React.FC<WorkoutPlanViewerProps> = ({ plan, onMarkComplete }) => {
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [showTimer, setShowTimer] = useState<{ exerciseIndex: number; show: boolean } | null>(null);

  const capitalizedPlanType = plan.goal
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  const dailyWorkouts = plan.dailyWorkouts || [];
  
  // Check if a day is accessible (completed or currently available)
  const isDayAccessible = (dayNumber: number) => {
    if (dayNumber === 1) return true; // First day is always accessible
    
    // Check if previous day is completed
    const previousDay = dailyWorkouts.find((day: any) => day.day === dayNumber - 1);
    return previousDay?.completed || false;
  };
  
  // Get the current accessible day
  const getCurrentAccessibleDay = () => {
    for (let i = 1; i <= dailyWorkouts.length; i++) {
      const day = dailyWorkouts.find((d: any) => d.day === i);
      if (!day?.completed) {
        return i;
      }
    }
    return dailyWorkouts.length; // All completed, show last day
  };
  
  // Set initial selected day to current accessible day
  React.useEffect(() => {
    const currentDay = getCurrentAccessibleDay();
    setSelectedDay(currentDay);
  }, [dailyWorkouts]);
  
  const selectedDayData = dailyWorkouts.find((day: any) => day.day === selectedDay);
  const coachContext = { source: 'plan', planId: plan.id, title: plan.title, goal: plan.goal, equipment: plan.equipment, selectedDay, day: compactContext(selectedDayData) };
  React.useEffect(() => {
    setCoachContext('plan', coachContext);
    setLiveWorkout({ title: plan.title, context: coachContext });
    return () => { setCoachContext('plan', null); setLiveWorkout(null); };
  }, [plan, selectedDay]);
  const focusExercise = (exercise: any) => {
    const context = { ...coachContext, currentExercise: compactContext(exercise) };
    setCoachContext('plan', context);
    setLiveWorkout({ title: plan.title, context, exercise: { name: exercise.name, detail: `${exercise.sets} sets × ${exercise.reps}; rest ${exercise.rest ?? exercise.restTime}` } });
  };

  // Get exercise animation URL based on exercise name
  const getExerciseAnimationUrl = (exerciseName: string): string => {
    // Normalize the exercise name for matching
    const normalizedName = exerciseName.toLowerCase().trim();
    
    const exerciseMap: { [key: string]: string } = {
      // Chest exercises - various naming patterns
      'neutral grip hand rows': 'https://gymvisual.com/img/p/2/1/7/7/5/21775.gif',
      'cable pulldown': 'https://gymvisual.com/img/p/2/8/3/3/5/28335.gif',
      'cable bicep curl': 'https://hips.hearstapps.com/hmg-prod/images/766/fitgif10-13-1508511602.gif?crop=0.636xw:1xh;center,top&resize=1200:*',
      'cable hammer curl': 'https://fitnessprogramer.com/wp-content/uploads/2021/06/rope-bicep-curls.gif',
      'push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-Up.gif',
      'hindu push up': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pike-to-Cobra.gif',
      'hindu push-up': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pike-to-Cobra.gif',
      'hindu push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pike-to-Cobra.gif',
      'hindu pushup': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pike-to-Cobra.gif',
      'hindu pushups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pike-to-Cobra.gif',
      'push ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-Up.gif',
      'pushups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-Up.gif',
      'standard push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-Up.gif',
      'incline push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Incline-Push-Up.gif',
      'incline push ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Incline-Push-Up.gif',
      'diamond push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Diamond-Push-up.gif',
      'diamond push ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Diamond-Push-up.gif',
      'wide push-ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/11/wide-arm-push-ups.gif',
      'wide push ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/11/wide-arm-push-ups.gif',
      'decline push-ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/07/decline-push-up.gif',
      'decline push ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/07/decline-push-up.gif',
      'decline-push-ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/07/decline-push-up.gif',
      'close-grip push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Diamond-Push-up.gif',
      'close grip push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Diamond-Push-up.gif',
      'archer push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2022/07/Archer-Push-Up.gif',
      'archer push ups': 'https://fitnessprogramer.com/wp-content/uploads/2022/07/Archer-Push-Up.gif',
      'chest flyes': 'https://newlife.com.cy/wp-content/uploads/2019/11/03081301-Dumbbell-Fly_Chest-FIX_360.gif',
      'chest flys': 'https://newlife.com.cy/wp-content/uploads/2019/11/03081301-Dumbbell-Fly_Chest-FIX_360.gif',
      'dumbbell flyes': 'https://newlife.com.cy/wp-content/uploads/2019/11/03081301-Dumbbell-Fly_Chest-FIX_360.gif',
      'dumbbell chest press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Press.gif',
      'dumbbell bench press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Press.gif',
      'chest dips': 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Chest-Dips.gif',
      'dips': 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Chest-Dips.gif',
      'incline dumbbell press': 'https://cdn.shopify.com/s/files/1/0618/9462/3460/files/inclinedumbbellbenchpress-1492108229.gif',
      'cable chest fly': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/08/high-cable-fly.gif',
      'pec deck flyes': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pec-Deck-Fly.gif',
      'barbell bench press': 'https://media.tenor.com/kpJH4zjuPF8AAAAM/supino.gif',
      'barbell bench-press': 'https://media.tenor.com/kpJH4zjuPF8AAAAM/supino.gif',
      'incline barbell bench press': 'https://newlife.com.cy/wp-content/uploads/2019/11/00471301-Barbell-Incline-Bench-Press_Chest_360.gif',
      'incline barbell bench-press': 'https://newlife.com.cy/wp-content/uploads/2019/11/00471301-Barbell-Incline-Bench-Press_Chest_360.gif',
      'dumbbell chest fly': 'https://newlife.com.cy/wp-content/uploads/2019/11/03081301-Dumbbell-Fly_Chest-FIX_360.gif',
      'incline barbell press': 'https://newlife.com.cy/wp-content/uploads/2019/11/00471301-Barbell-Incline-Bench-Press_Chest_360.gif',
      'close grip barbell press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Close-Grip-Bench-Press.gif',

      
      // Back exercises
      'pull-ups': 'https://hips.hearstapps.com/hmg-prod/images/pull-up-647dd51506791.gif?resize=980:*',
      'pull ups': 'https://hips.hearstapps.com/hmg-prod/images/pull-up-647dd51506791.gif?resize=980:*',
      'pullups': 'https://hips.hearstapps.com/hmg-prod/images/pull-up-647dd51506791.gif?resize=980:*',
      'pull-ups/rows': 'https://hips.hearstapps.com/hmg-prod/images/pull-up-647dd51506791.gif?resize=980:*',
      'chin-ups': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/chinup-1457101678.gif?crop=1xw:1xh;center,top&resize=980:*',
      'chin ups': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/chinup-1457101678.gif?crop=1xw:1xh;center,top&resize=980:*',
      'bent-over rows': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bent-Over-Dumbbell-Row.gif',
      'bent over rows': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bent-Over-Dumbbell-Row.gif',
      'bent over dumbbell rows': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bent-Over-Dumbbell-Row.gif',
      'bent-over dumbbell row': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bent-Over-Dumbbell-Row.gif',
      'wide-grip pull-ups': 'https://newlife.com.cy/wp-content/uploads/2019/08/18661301-Wide-Grip-Pull-Up-on-Dip-Cage_Back_720.gif',
      'wide grip pull-ups': 'https://newlife.com.cy/wp-content/uploads/2019/08/18661301-Wide-Grip-Pull-Up-on-Dip-Cage_Back_720.gif',
      'single-arm rows': 'https://homeworkouts.org/wp-content/uploads/anim-dumbbell-bentover-rows.gif',
      'single arm rows': 'https://homeworkouts.org/wp-content/uploads/anim-dumbbell-bentover-rows.gif',
      'single-arm dumbbell row': 'https://homeworkouts.org/wp-content/uploads/anim-dumbbell-bentover-rows.gif',
      'lat pulldowns': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lat-Pulldown.gif',
      'lat pulldown': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lat-Pulldown.gif',
      'reverse flyes': 'https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-rear-delt-fly.gif',
      'reverse flys': 'https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-rear-delt-fly.gif',
      'face pulls': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Face-Pull.gif',
      'face pull': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Face-Pull.gif',
      'superman': 'https://newlife.com.cy/wp-content/uploads/2019/11/08041301-Superman_Waist_360.gif',
      'supermans': 'https://newlife.com.cy/wp-content/uploads/2019/11/08041301-Superman_Waist_360.gif',
      'barbell row': 'https://media.tenor.com/AYJ_bNXDvoUAAAAM/workout-muscles.gif',
      'barbell-row': 'https://media.tenor.com/AYJ_bNXDvoUAAAAM/workout-muscles.gif',
      'barbell rows': 'https://media.tenor.com/AYJ_bNXDvoUAAAAM/workout-muscles.gif',
      'barbell-rows': 'https://media.tenor.com/AYJ_bNXDvoUAAAAM/workout-muscles.gif',
      't bar row': 'https://fitnessprogramer.com/wp-content/uploads/2021/04/t-bar-rows.gif',
      't-bar row': 'https://fitnessprogramer.com/wp-content/uploads/2021/04/t-bar-rows.gif',
      'resistance band face pull': 'https://media.tenor.com/appGngmuNHAAAAAM/face-pulls.gif',
      'cable face-pull': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Face-Pull.gif',
      'lower back extension': 'https://www.happiesthealth.com/wp-content/uploads/2024/02/Back-Extension-GIF-02.gif',
      'lower-back extension': 'https://www.happiesthealth.com/wp-content/uploads/2024/02/Back-Extension-GIF-02.gif',
      'cable crossover': 'https://i.pinimg.com/originals/06/bc/08/06bc08f20343ec7179604d52c4e0e054.gif',
      'cable wood chop': 'https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2025/03/cable-high-to-low-woodchop.gif?fit=600%2C600&ssl=1',

      // Shoulder exercises
      'overhead press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif',
      'shoulder press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif',
      'dumbbell shoulder press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif',
      'lateral raises': 'https://pelank.com/wp-content/uploads/2025/12/Dumbbell-Lateral-Raise.gif',
      'lateral raise': 'https://pelank.com/wp-content/uploads/2025/12/Dumbbell-Lateral-Raise.gif',
      'side raises': 'https://pelank.com/wp-content/uploads/2025/12/Dumbbell-Lateral-Raise.gif',
      'front raises': 'https://gymvisual.com/img/p/2/4/9/4/0/24940.gif',
      'front raise': 'https://gymvisual.com/img/p/2/4/9/4/0/24940.gif',
      'rear delt flyes': 'https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-rear-delt-fly.gif',
      'pike push-up': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/pikepushup-1456956895.gif',
      'pike push-ups': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/pikepushup-1456956895.gif',
      'pike push ups': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/pikepushup-1456956895.gif',
      'pike pushup': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/pikepushup-1456956895.gif',
      'pike-pushup': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/pikepushup-1456956895.gif',
      'pike-pushups': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/pikepushup-1456956895.gif',
      'pike pushups': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/pikepushup-1456956895.gif',
      'handstand push-ups': 'https://images.squarespace-cdn.com/content/v1/5d31ed671abe780001b2964d/1615344688514-D85LSNYQ0MIDKBJNH2A2/Dylan+Werner+performing+handstand+push-ups',
      'handstand push ups': 'https://images.squarespace-cdn.com/content/v1/5d31ed671abe780001b2964d/1615344688514-D85LSNYQ0MIDKBJNH2A2/Dylan+Werner+performing+handstand+push-ups',
      'barbell shoulder press': 'https://media.tenor.com/CV1FfGVNpdcAAAAM/desenvolvimento-militar.gif',
      'barbell overhead press': 'https://media.tenor.com/CV1FfGVNpdcAAAAM/desenvolvimento-militar.gif',
      'barbell press': 'https://media.tenor.com/CV1FfGVNpdcAAAAM/desenvolvimento-militar.gif',
      'barbell upright row': 'https://miro.medium.com/v2/resize:fit:864/1*b65d0PhFVK-JQsCqXG2K9g.gif',

      // Tricep exercises
      'tricep dips': 'https://miro.medium.com/v2/resize:fit:840/0*xpvWu3s9ZmFHPhLb.gif',
      'triceps dips': 'https://miro.medium.com/v2/resize:fit:840/0*xpvWu3s9ZmFHPhLb.gif',
      'tricep extensions': 'https://media.tenor.com/Vq6LrVGUAKIAAAAM/tríceps-fraces-na-polia.gif',
      'triceps extensions': 'https://media.tenor.com/Vq6LrVGUAKIAAAAM/tríceps-fraces-na-polia.gif',
      'overhead tricep extension': 'https://media.tenor.com/GRMSvKqfksMAAAAM/triceps.gif',
      'overhead triceps extension': 'https://media.tenor.com/GRMSvKqfksMAAAAM/triceps.gif',
      'tricep pushdown': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pushdown.gif',
      'triceps pushdown': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pushdown.gif',
      'close-grip bench press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Close-Grip-Bench-Press.gif',
      'close grip bench press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Close-Grip-Bench-Press.gif',
      'barbell close-grip press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Close-Grip-Bench-Press.gif',
      'barbell close grip press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Close-Grip-Bench-Press.gif',

      
      // Bicep exercises
      'bicep curls': 'https://cdn.shopify.com/s/files/1/0618/9462/3460/files/8c532774e4e1c524576bf1fb829ad895.gif',
      'biceps curls': 'https://cdn.shopify.com/s/files/1/0618/9462/3460/files/8c532774e4e1c524576bf1fb829ad895.gif',
      'dumbbell curls': 'https://cdn.shopify.com/s/files/1/0618/9462/3460/files/8c532774e4e1c524576bf1fb829ad895.gif',
      'dumbbell bicep curl': 'https://cdn.shopify.com/s/files/1/0618/9462/3460/files/8c532774e4e1c524576bf1fb829ad895.gif',
      'hammer curls': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/hammercurl-1456956209.gif',
      'hammer curl': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/hammercurl-1456956209.gif',
      'concentration curls': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Concentration-Curl.gif',
      'concentration curl': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Concentration-Curl.gif',
      'barbell curls': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Curl.gif',
      'barbell curl': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Curl.gif',
      'resistance band curl': 'https://gymvisual.com/img/p/2/1/8/2/5/21825.gif',
      'resistance band curls': 'https://gymvisual.com/img/p/2/1/8/2/5/21825.gif',
      'barbell reverse curl' : 'https://gymvisual.com/img/p/2/4/7/5/8/24758.gif',
      'bodyweight bicep curls': 'https://gymvisual.com/img/p/2/1/6/3/3/21633.gif',
      'sitting bicep curls': 'https://fitliferegime.com/wp-content/uploads/2023/06/Bodyweight-Bicep-Curl.gif',
      'sitting bicep curl': 'https://fitliferegime.com/wp-content/uploads/2023/06/Bodyweight-Bicep-Curl.gif',
      'sitting-bicep-curls': 'https://fitliferegime.com/wp-content/uploads/2023/06/Bodyweight-Bicep-Curl.gif',
      'sitting-bicep-curl': 'https://fitliferegime.com/wp-content/uploads/2023/06/Bodyweight-Bicep-Curl.gif',
      'bag curls': 'https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/07/400x400_Biceps_Workouts_At_Home_Backpack_Curls.gif?h=840',
      'bag curl': 'https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/07/400x400_Biceps_Workouts_At_Home_Backpack_Curls.gif?h=840',
      'backpack curls': 'https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/07/400x400_Biceps_Workouts_At_Home_Backpack_Curls.gif?h=840',
      'backpack curl': 'https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/07/400x400_Biceps_Workouts_At_Home_Backpack_Curls.gif?h=840',

      
      // Leg exercises
      'squats': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/06/bodyweight-squat.gif',
      'bodyweight squats': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/06/bodyweight-squat.gif',
      'bodyweight squat': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/06/bodyweight-squat.gif',
      'lunges': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/01/dumbbell-lunges.gif',
      'dumbbell lunges': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/01/dumbbell-lunges.gif',
      'dumbbell lunge': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/01/dumbbell-lunges.gif',
      'jump squats': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Jump-Squat.gif',
      'jumping squats': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Jump-Squat.gif',
      'jumping squat': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Jump-Squat.gif',
      'bulgarian split squats': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/03/bulgarian-split-spuat.gif',
      'bulgarian split squat': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/03/bulgarian-split-spuat.gif',
      'pistol squats': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/09/pistol-squat-muscles.gif',
      'pistol squat': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/09/pistol-squat-muscles.gif',
      'calf raises': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/01/standing-calf-raise.gif',
      'calf raise': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/01/standing-calf-raise.gif',
      'wall sit': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/08/wall-sit.gif',
      'wall sits': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/08/wall-sit.gif',
      'glute bridges': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/12/glute-bridge.gif',
      'glute bridge': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/12/glute-bridge.gif',
      'goblet squats': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/08/dumbbell-goblet-squat-muscles.gif',
      'goblet squat': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/08/dumbbell-goblet-squat-muscles.gif',
      'romanian deadlifts': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/06/barbell-romanian-deadlift-movement.gif',
      'romanian deadlift': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/06/barbell-romanian-deadlift-movement.gif',
      'single-leg deadlifts': 'https://fitnessprogramer.com/wp-content/uploads/2022/09/Dumbbell-Single-Leg-Deadlift.gif',
      'single leg deadlifts': 'https://fitnessprogramer.com/wp-content/uploads/2022/09/Dumbbell-Single-Leg-Deadlift.gif',
      'single leg deadlift': 'https://fitnessprogramer.com/wp-content/uploads/2022/09/Dumbbell-Single-Leg-Deadlift.gif',
      'dumbbell step up': 'https://www.kettlebellkings.com/cdn/shop/articles/weighted-step-up.gif?v=1731311898',
      'dumbbell step-up': 'https://www.kettlebellkings.com/cdn/shop/articles/weighted-step-up.gif?v=1731311898',
      'barbell squats': 'https://media.tenor.com/Re3T3B66V9UAAAAM/barbellsquats-gymexercisesmen.gif',
      'barbell squat': 'https://media.tenor.com/Re3T3B66V9UAAAAM/barbellsquats-gymexercisesmen.gif',
      'barbell deadlift': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/02/barbell-deadlift-movement.gif',
      'barbell front squat': 'https://www.kettlebellkings.com/cdn/shop/articles/Front_Squats.gif?v=1694617488',
      'barbell front-squat': 'https://www.kettlebellkings.com/cdn/shop/articles/Front_Squats.gif?v=1694617488',
      'barbell split squat': 'https://fitnessprogramer.com/wp-content/uploads/2022/04/Barbell-Split-Squat.gif',
      'lateral squats': 'https://i.pinimg.com/originals/56/35/40/563540bbc24b25d30986579a87026019.gif',
      'jump lunges': 'https://media.tenor.com/r6-pyTNtT_UAAAAM/afundo.gif',


      // Abs/Core exercises
      'plank': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/01/plank.gif',
      'planks': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/01/plank.gif',
      'bicycle crunches': 'https://media.tenor.com/Jopm0JiwtdsAAAAM/egsersiz.gif',
      'bicycle crunch': 'https://media.tenor.com/Jopm0JiwtdsAAAAM/egsersiz.gif',
      'russian twists': 'https://gymvisual.com/img/p/1/0/7/1/1/10711.gif',
      'russian twist': 'https://gymvisual.com/img/p/1/0/7/1/1/10711.gif',
      'mountain climbers': 'https://i.pinimg.com/originals/fb/fa/09/fbfa0902f381a5735972c21255935aff.gif',
      'mountain climber': 'https://i.pinimg.com/originals/fb/fa/09/fbfa0902f381a5735972c21255935aff.gif',
      'dead bug': 'https://gymvisual.com/img/p/2/0/8/3/6/20836.gif',
      'dead bugs': 'https://gymvisual.com/img/p/2/0/8/3/6/20836.gif',
      'leg raises': 'https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2020/10/lying-leg-raises.gif?fit=600%2C600&ssl=1',
      'leg raise': 'https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2020/10/lying-leg-raises.gif?fit=600%2C600&ssl=1',
      'crunches': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/08/crunch-floor.gif',
      'crunch': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/08/crunch-floor.gif',
      'sit-ups': 'https://newlife.com.cy/wp-content/uploads/2019/11/07351301-Sit-Up-II_waist_360.gif',
      'sit ups': 'https://newlife.com.cy/wp-content/uploads/2019/11/07351301-Sit-Up-II_waist_360.gif',
      'situps': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Sit-Up.gif',
      'hanging knee raises': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/06/hanging-leg-raise-movement.gif',
      'hanging knee raise': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/06/hanging-leg-raise-movement.gif',
      'v-ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/05/v-sit-ups.gif',
      'v ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/05/v-sit-ups.gif',
      'side plank': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/08/side-plank-1024x593.png',
      'side planks': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/08/side-plank-1024x593.png',
      'modified planks': 'https://bunny-wp-pullzone-wwrvnwx855.b-cdn.net/wp-content/uploads/2023/10/Knee-Plank.jpg',
      'plank to downward dog': 'https://gymvisual.com/img/p/2/4/6/9/7/24697.gif',
      'reverse crunches': 'https://images.ctfassets.net/6ilvqec50fal/60HBk95X0A7Yh2xfHBkIGE/bbf8f4c8cf49827a7e91836351419792/reverse-crunch-andy-speer.gif',
      'reverse crunch': 'https://images.ctfassets.net/6ilvqec50fal/60HBk95X0A7Yh2xfHBkIGE/bbf8f4c8cf49827a7e91836351419792/reverse-crunch-andy-speer.gif',
      'flutter kicks': 'https://newlife.com.cy/wp-content/uploads/2019/11/28911301-Flutter-Kicks-hands-under-hips-head-up-female_Waist_360.gif',
      'flutter kick': 'https://newlife.com.cy/wp-content/uploads/2019/11/28911301-Flutter-Kicks-hands-under-hips-head-up-female_Waist_360.gif',
      'bird-dogs': 'https://i.pinimg.com/originals/99/38/1d/99381d5561abd19223679f7c157d47a8.gif',
      // HIIT/Cardio exercises
      'burpees': 'https://gymvisual.com/img/p/1/7/3/3/8/17338.gif',
      'burpee': 'https://gymvisual.com/img/p/1/7/3/3/8/17338.gif',
      'jump jacks': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/08/jumping-jacks.gif',
      'jumping jacks': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/08/jumping-jacks.gif',
      'jumping jack': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/08/jumping-jacks.gif',
      'high knees': 'https://i.pinimg.com/originals/55/50/03/555003596e97967eb5f2568403bbc742.gif',
      'high knee': 'https://i.pinimg.com/originals/55/50/03/555003596e97967eb5f2568403bbc742.gif',
      'butt kickers': 'https://gymvisual.com/img/p/1/4/8/8/2/14882.gif',
      'butt kicker': 'https://gymvisual.com/img/p/1/4/8/8/2/14882.gif',
      'plank jacks': 'https://media.post.rvohealth.io/wp-content/uploads/2023/08/GrimInferiorAustraliansilkyterrier-size_restricted.gif',
      'plank jack': 'https://media.post.rvohealth.io/wp-content/uploads/2023/08/GrimInferiorAustraliansilkyterrier-size_restricted.gif',
      'kettlebell swings': 'https://gymvisual.com/img/p/3/2/2/5/8/32258.gif',
      'kettlebell swings primary': 'https://gymvisual.com/img/p/3/2/2/5/8/32258.gif',
      'dumbbell thrusters': 'https://gymvisual.com/img/p/1/2/2/9/6/12296.gif',
      'dumbbell thruster': 'https://gymvisual.com/img/p/1/2/2/9/6/12296.gif',
      'turkish get-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/04/Turkish-Get-Up-Squat-style.gif',
      'turkish get up': 'https://fitnessprogramer.com/wp-content/uploads/2021/04/Turkish-Get-Up-Squat-style.gif',
      'dumbbell clean and press': 'https://gymvisual.com/img/p/2/2/6/2/0/22620.gif',
      'dumbbell renegade row': 'https://gymvisual.com/img/p/3/6/6/7/3/36673.gif',
      'dumbbell man maker': 'https://media1.popsugar-assets.com/files/thumbor/9hd7jPDs0zLFNJXSfB0BqQCd3oE/fit-in/2048xorig/filters:format_auto-!!-:strip_icc-!!-/2017/03/23/639/n/1922729/0e2f955776cc42bd_bd51f8d4e48d69d7_ManMakerBurpee1/i/Man-Maker-Burpee.gif',

      
      // Warmup exercises
      'light jogging in place': 'https://i.pinimg.com/originals/6a/9f/d7/6a9fd7d253602e4821c9a3017fd274eb.gif',
      'jogging in place': 'https://i.pinimg.com/originals/6a/9f/d7/6a9fd7d253602e4821c9a3017fd274eb.gif',
      'arm circles': 'https://spotebi.com/wp-content/uploads/2014/10/big-arm-circles-exercise-illustration.gif',
      'arm circle': 'https://spotebi.com/wp-content/uploads/2014/10/big-arm-circles-exercise-illustration.gif',
      'hip rotations': 'https://i.pinimg.com/originals/12/31/e2/1231e24fc3d7944e38b180c51067689d.gif',
      'hip rotation': 'https://i.pinimg.com/originals/12/31/e2/1231e24fc3d7944e38b180c51067689d.gif',
      'shoulder stretches': 'https://www.vissco.com/wp-content/uploads/animation/sub/shoulder-posterior-capsule-stretch.gif',
      'shoulder stretch': 'https://www.vissco.com/wp-content/uploads/animation/sub/shoulder-posterior-capsule-stretch.gif',
      'jump rope': 'https://gymvisual.com/img/p/1/0/7/5/9/10759.gif',
      
      
      
      'deep breathing': 'https://dailyburn.com/life/wp-content/uploads/2016/04/circle-gif-2.gif',
      'quad stretch': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/07/quadriceps-stretch.gif',
      'quad stretches': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/07/quadriceps-stretch.gif',
      'hamstring stretch': 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Seated-Toe-Touches.gif',
      'hamstring stretches': 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Seated-Toe-Touches.gif',
      "child's pose": 'https://fitnessprogramer.com/wp-content/uploads/2022/05/Balasana-Child-Pose.gif',
      'childs pose': 'https://fitnessprogramer.com/wp-content/uploads/2022/05/Balasana-Child-Pose.gif',
      'chest stretch': 'https://lyfta.app/images/exercises/17871101.png',
      'chest stretches': 'https://lyfta.app/images/exercises/17871101.png',
      'knee mobility stretch': 'https://cdn.jefit.com/assets/img/exercises/gifs/298.gif',
      'shoulder mobility stretch': 'https://gymvisual.com/img/p/1/2/5/2/4/12524.gif',
      'hip mobility stretch': 'https://assets.myworkouts.io/exercises-media/BFYqdDcxdHQjb2sRB/hip_circles_(prone)_male_v14_gif_capoff.gif',
      'lower back stretch': 'https://www.doyou.com/wp-content/uploads/2017/02/Spinal_twist1.gif',
      'wrist mobility stretch': 'https://cdn.jefit.com/assets/img/exercises/gifs/862.gif',
      'ankle mobility stretch': 'https://spotebi.com/wp-content/uploads/2015/03/ankle-circles-exercise-illustration.gif',

       // Athlete exercise
      'medicine ball slams': 'https://pelank.com/wp-content/uploads/2025/06/Medicine-ball-Overhead-Slam-exercise.gif',
      'medicine ball slam': 'https://pelank.com/wp-content/uploads/2025/06/Medicine-ball-Overhead-Slam-exercise.gif',
      'explosive push ups': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/explosivepushup-1457102261.gif',
      'explosive push-ups': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/explosivepushup-1457102261.gif',
      'explosive push up': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/explosivepushup-1457102261.gif',
      'explosive push-up': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/explosivepushup-1457102261.gif',
      'lateral shuffles': 'https://media1.popsugar-assets.com/files/thumbor/1C34XQfL-mf9xZLs4_ilDvX7hrI=/fit-in/792x528/top/filters:format_auto():upscale()/2017/01/30/083/n/1922729/863416dc9c25cc58_LATERAL_SHUFFLE_TOUCH_GIF.gif',
      'lateral-shuffles': 'https://media1.popsugar-assets.com/files/thumbor/1C34XQfL-mf9xZLs4_ilDvX7hrI=/fit-in/792x528/top/filters:format_auto():upscale()/2017/01/30/083/n/1922729/863416dc9c25cc58_LATERAL_SHUFFLE_TOUCH_GIF.gif',
      'lateral shuffle': 'https://media1.popsugar-assets.com/files/thumbor/1C34XQfL-mf9xZLs4_ilDvX7hrI=/fit-in/792x528/top/filters:format_auto():upscale()/2017/01/30/083/n/1922729/863416dc9c25cc58_LATERAL_SHUFFLE_TOUCH_GIF.gif',
      'sprint in place': 'https://media.tenor.com/-Rk4PkNwhmoAAAAM/running-spot-jog.gif',
      'dumbbell rows': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bent-Over-Dumbbell-Row.gif',
      'kettleball deadlift': 'https://fitnessprogramer.com/wp-content/uploads/2021/06/kettlebell-deadlift.gif',
      'kettleball deadlifts': 'https://fitnessprogramer.com/wp-content/uploads/2021/06/kettlebell-deadlift.gif',
      'bear crawl':'https://i.pinimg.com/originals/a1/14/29/a11429b50bcc977452c2a841e8f40b2d.gif',
      'bear crawls':'https://i.pinimg.com/originals/a1/14/29/a11429b50bcc977452c2a841e8f40b2d.gif',
      'resistance band pulls':'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/12/bandpullapart-1480689234.gif',
      'resistance band pull':'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/12/bandpullapart-1480689234.gif',
      'band pulls':'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/12/bandpullapart-1480689234.gif',
      'band pull':'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/12/bandpullapart-1480689234.gif',
      'hip circles': 'https://i.pinimg.com/originals/12/31/e2/1231e24fc3d7944e38b180c51067689d.gif',
      'hip circle': 'https://i.pinimg.com/originals/12/31/e2/1231e24fc3d7944e38b180c51067689d.gif',
      'leg swings':'https://spotebi.com/wp-content/uploads/2015/03/forward-leg-swings-exercise-illustration.gif',
      'leg swing':'https://spotebi.com/wp-content/uploads/2015/03/forward-leg-swings-exercise-illustration.gif',
      'cat cow stretch': 'https://homeworkouts.org/wp-content/uploads/anim-cat-cow-pose.gif',
      'cat cow': 'https://homeworkouts.org/wp-content/uploads/anim-cat-cow-pose.gif',
      'tuck jumps':'https://liftmanual.com/wp-content/uploads/2023/04/knee-tuck-jump.gif',
      'tuck jump':'https://liftmanual.com/wp-content/uploads/2023/04/knee-tuck-jump.gif',
      'lateral bounds':'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/skaterhop-1456956292.gif?crop=1xw:0.75xh;center,top&resize=1200:*',
      'lateral bound':'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/skaterhop-1456956292.gif?crop=1xw:0.75xh;center,top&resize=1200:*',
      'medicine ball throws': 'https://gymvisual.com/img/p/2/1/6/4/7/21647.gif',
      'resistance band core rotation':'https://cdn.shopify.com/s/files/1/1633/7705/files/rotational_exercises_480x480.png?v=1616171474',
      'box jumps':'https://www.docteur-fitness.com/wp-content/uploads/2022/09/jump-box.gif',

      //kettleball exercises
      'dumbbell squat': 'https://fitnessprogramer.com/wp-content/uploads/2023/09/Dumbbell-Squat.gif',
      'cat cow stretch v2': 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2020/05/400x400_The_Best_Postpartum_Exercises_to_do_Right_Now_Cat_Cow_in_Tabletop.gif',
      'bird dog': 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2021/02/NarrowVibrantHawk-size_restricted.gif',
      'bird dogs': 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2021/02/NarrowVibrantHawk-size_restricted.gif',

      'kettlebell deadlift' :'https://www.inspireusafoundation.org/file/2021/12/the-kettlebell-deadlift-1024x634.png',
      'kettlebell press': 'https://i.pinimg.com/originals/56/54/ca/5654ca13e5e33cf34e685a8030e2d398.gif',
      'kettlebell windmill': 'https://i.pinimg.com/originals/10/b3/78/10b378afe3e7f411013f571f7b59e5c4.gif',
      'kettlebell goblet squat':'https://i.pinimg.com/originals/64/60/eb/6460ebf7e602d9e640f0d758e4cee332.gif',
      'kettlebell sumo deadlift': 'https://gymvisual.com/img/p/1/8/5/4/2/18542.gif',
      'kettlebell lunge': 'https://gymvisual.com/img/p/2/2/9/9/5/22995.gif',
      'kettlebell cossack squat': 'https://gymvisual.com/img/p/3/8/2/3/2/38232.gif',
      'kettlebell curl': 'https://gymvisual.com/img/p/2/6/2/2/1/26221.gif',
      'kettlebell bottoms-up press': 'https://gymvisual.com/img/p/1/6/9/4/9/16949.gif',
      'kettlebell floor press': 'https://cdn.shopify.com/s/files/1/0645/8762/8770/files/Kettlebell-Chest-Press-on-the-Floor_480x480.gif?v=1732870373',
      'kettlebell russian twist': 'https://www.kettlebellkings.com/cdn/shop/articles/russian-twist_cf5b5524-a334-4364-9cb9-54b5a04962d9_1200x1200_crop_center.gif?v=1739267488',
      'kettlebell plank pull-through': 'https://149874912.v2.pressablecdn.com/wp-content/uploads/2025/03/kettlebell-plank-pull-through.gif',
      'kettlebell snatch': 'https://i.pinimg.com/originals/50/a4/f5/50a4f5f7110b01228a1717eb89b6bde3.gif',
      'kettlebell clean and press': 'https://i.pinimg.com/originals/ff/2a/fc/ff2afcbcb6cea55b0fb737a7169764ab.gif',
      'kettlebell thruster' :'https://i.pinimg.com/originals/60/51/3f/60513f6478926895606a2354dd7efd83.gif',
      'kettlebell figure-8': 'https://gymvisual.com/img/p/1/0/7/0/8/10708.gif',
      'kettlebell swings alt': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/10/russian-kettlebell-swing.gif',
      
      //Pain exercises
      'clamshells': 'https://www.strengthlog.com/wp-content/uploads/2024/01/clamshell.gif',
      'deadbugs': 'https://gymvisual.com/img/p/2/0/8/3/6/20836.gif',
      'seated upper body press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif',
      'supported bicep curl':'https://newlife.com.cy/wp-content/uploads/2019/11/04021301-Dumbbell-Seated-Preacher-Curl_Upper-Arms_360.gif',
      'supported bicep curls':'https://newlife.com.cy/wp-content/uploads/2019/11/04021301-Dumbbell-Seated-Preacher-Curl_Upper-Arms_360.gif',
      'knee plank': 'https://cdn.mos.cms.futurecdn.net/pR4NPNU6n2S9wknA5uALhL-1200-80.jpg.webp',
      'knee planks': 'https://cdn.mos.cms.futurecdn.net/pR4NPNU6n2S9wknA5uALhL-1200-80.jpg.webp',
      'straight arm band pulls': 'https://gymvisual.com/img/p/2/1/7/8/0/21780.gif',
      'straight arm band pull': 'https://gymvisual.com/img/p/2/1/7/8/0/21780.gif',
      'standing core twists': 'https://gymvisual.com/img/p/2/0/4/5/1/20451.gif',
      'neutral grip band work': 'https://gymvisual.com/img/p/1/2/6/5/0/12650.gif',
    

      //resistance band
      'resistance band chest press': 'https://gymbeam.cz/blog/wp-content/uploads/2020/12/bench-press.gif',
      'resistance band chest fly': 'https://gymvisual.com/img/p/2/1/5/2/3/21523.gif',
      'resistance band row': 'https://gymvisual.com/img/p/1/8/4/1/2/18412.gif',
      'resistance band lat pulldown': 'https://www.inspireusafoundation.org/file/2022/10/band-lat-pulldown.gif',
      'resistance band reverse fly': 'https://pelank.com/wp-content/uploads/2025/01/cable-rear-delt-fly.gif',
      'resistance band face pulls': 'https://www.inspireusafoundation.org/file/2023/01/banded-face-pull.gif',
      'resistance band shoulder press': 'https://gymvisual.com/img/p/1/2/5/1/7/12517.gif',
      'resistance band lateral raise': 'https://gymvisual.com/img/p/6/9/7/5/6975.gif',
      'resistance band front raise': 'https://gymvisual.com/img/p/5/6/9/1/5691.gif',
      'resistance band squat': 'https://www.inspireusafoundation.org/file/2022/10/band-squat.gif',
      'resistance band lateral walk': 'https://gymvisual.com/img/p/2/9/5/4/7/29547.gif',
      'resistance band glute bridge': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/01/resistance-band-glute-bridge.gif',
      'resistance band hammer curl': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/12/bandhammercurl-1480630337.gif?crop=1xw:1xh;center,top&resize=1200:*',
      'resistance band tricep extension': 'https://gymvisual.com/img/p/2/1/6/2/5/21625.gif',
      'resistance band tricep pushdown': 'https://gymvisual.com/img/p/2/1/8/2/6/21826.gif',
      'resistance band wood chop': 'https://gymvisual.com/img/p/1/9/8/4/4/19844.gif',
      'resistance band pallof press': 'https://gymvisual.com/img/p/5/6/9/2/5692.gif',
      'resistance band squat to press': 'https://gymvisual.com/img/p/1/8/6/4/7/18647.gif',
      'lying hamstring curls': 'https://spotebi.com/wp-content/uploads/2015/05/lying-hamstring-curls-exercise-illustration-spotebi.gif',
      'resistance band jumping jacks': 'https://gymvisual.com/img/p/1/0/6/3/9/10639.gif',

      'scapular retractions': 'https://gymvisual.com/img/p/1/2/5/2/4/12524.gif',
      'wall angels': 'https://media.post.rvohealth.io/wp-content/uploads/sites/2/2021/04/GRT-1.7.Wall-Angels.gif',
      'wall march': 'https://gymvisual.com/img/p/5/3/6/0/5360.gif',
      'box jump': 'https://www.docteur-fitness.com/wp-content/uploads/2022/09/jump-box.gif',
      'farmer walk': 'https://barbend.com/wp-content/uploads/2024/02/farmers-carry-with-dumbbells-barbend-movement-gif-masters.gif',
      'farmers walk': 'https://barbend.com/wp-content/uploads/2024/02/farmers-carry-with-dumbbells-barbend-movement-gif-masters.gif',
      'agility ladder': 'https://s.yimg.com/cd/diminuendo/1.0/original/2840051dd03b58ed4d3214b015c01d4b22e75a25.gif',
      'agility ladder drills': 'https://s.yimg.com/cd/diminuendo/1.0/original/2840051dd03b58ed4d3214b015c01d4b22e75a25.gif',
      'agility ladder drill': 'https://s.yimg.com/cd/diminuendo/1.0/original/2840051dd03b58ed4d3214b015c01d4b22e75a25.gif',
      'wall ball': 'https://gymvisual.com/img/p/2/4/5/0/9/24509.gif',
      'rotation throw': 'https://gymvisual.com/img/p/7/4/1/5/7415.gif',
      
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
    <div className="space-y-6 max-w-3xl mx-auto w-full">
      {/* Header Card */}
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
          
          {/* Day Navigation */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const prevDay = selectedDay - 1;
                  if (prevDay >= 1 && isDayAccessible(prevDay)) {
                    setSelectedDay(prevDay);
                  }
                }}
                disabled={selectedDay === 1}
                className="px-3"
              >
                Previous
              </Button>
              
              <div className="text-center">
                <div className="text-sm text-gray-500">Day</div>
                <div className="text-2xl font-bold text-fitness-primary">{selectedDay}</div>
                <div className="text-xs text-gray-500">of {dailyWorkouts.length}</div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const nextDay = selectedDay + 1;
                  if (nextDay <= dailyWorkouts.length && isDayAccessible(nextDay)) {
                    setSelectedDay(nextDay);
                  }
                }}
                disabled={selectedDay === dailyWorkouts.length || !isDayAccessible(selectedDay + 1)}
                className="px-3"
              >
                Next
              </Button>
            </div>
            
            {/* Progress Bar */}
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute h-full bg-fitness-primary transition-all duration-300"
                style={{ width: `${(selectedDay / dailyWorkouts.length) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>{dailyWorkouts.filter((d: any) => d.completed).length} completed</span>
              <span>{dailyWorkouts.length - dailyWorkouts.filter((d: any) => d.completed).length} remaining</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Day Content */}
      {selectedDayData && (
        <Card className={`shadow-lg ${selectedDayData.completed ? 'bg-green-50 border-green-200' : ''}`}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  selectedDayData.completed 
                    ? 'bg-green-500 text-white' 
                    : selectedDayData.isRestDay 
                      ? 'bg-gray-200 text-gray-600' 
                      : 'bg-fitness-primary text-white'
                }`}>
                  {selectedDayData.completed ? <CheckCircle className="h-5 w-5" /> : selectedDayData.day}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Day {selectedDayData.day}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedDayData.isRestDay ? 'Rest Day' : (() => {
                      const focus = selectedDayData?.workout?.focus?.replace('_', ' ') || '';
                      return focus.toLowerCase().includes('training') ? focus : `${focus} training`;
                    })()}
                  </p>
                </div>
              </div>
              {!selectedDayData.completed && isDayAccessible(selectedDayData.day) && (
                <Button
                  onClick={() => onMarkComplete(plan.id, selectedDayData.day)}
                  className="bg-fitness-secondary hover:bg-fitness-secondary/90"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete
                </Button>
              )}
              {selectedDayData.completed && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    Completed ✓
                  </Badge>
                  {selectedDayData.day < dailyWorkouts.length && (
                    <Button
                      onClick={() => setSelectedDay(selectedDayData.day + 1)}
                      size="sm"
                      className="bg-fitness-primary hover:bg-fitness-primary/90"
                    >
                      Next Day
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardHeader>

          {!selectedDayData.isRestDay && selectedDayData.workout?.exercises && (
            <CardContent>
              <h3 className="font-medium mb-3 text-lg">Exercises ({selectedDayData.workout.exercises.length})</h3>
              <div className="space-y-3">
                {selectedDayData.workout.exercises.map((exercise: any, index: number) => (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <button onClick={() => focusExercise(exercise)} className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
                        <div className="flex items-center gap-3">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-fitness-primary text-white flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <div>
                            <h4 className="font-medium flex items-center gap-2">
                              {exercise.name}
                              <Play className="h-3 w-3 text-fitness-primary" />
                            </h4>
                            <p className="text-sm text-gray-600">
                              {exercise.sets} sets × {exercise.reps} • {exercise.rest} rest
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
                          <p><strong>Rest:</strong> {exercise.rest}</p>
                        </div>
                        
                        {/* Rest Timer */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Rest Timer</span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setShowTimer(
                                showTimer?.exerciseIndex === index && showTimer?.show 
                                  ? null 
                                  : { exerciseIndex: index, show: true }
                              )}
                            >
                              <Timer className="h-4 w-4 mr-1" />
                              {showTimer?.exerciseIndex === index && showTimer?.show ? 'Hide' : 'Start'} Timer
                            </Button>
                          </div>
                          
                          {showTimer?.exerciseIndex === index && showTimer?.show && (
                            <ExerciseTimer
                              duration={parseInt(exercise.rest) || 60}
                              onComplete={() => {
                                setShowTimer(null);
                              }}
                              autoStart={true}
                              className="mt-2"
                            />
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </CardContent>
          )}

          {selectedDayData.isRestDay && (
            <CardContent>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  <h4 className="font-medium text-blue-900">Rest Day</h4>
                </div>
                <p className="text-sm text-blue-700 leading-relaxed">
                  {selectedDayData.restType || 'Rest and recovery day. Stay hydrated, get good sleep, and let your muscles recover. Light stretching or walking is encouraged!'}
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
};

export default WorkoutPlanViewer;
