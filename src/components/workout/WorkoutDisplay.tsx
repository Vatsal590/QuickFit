import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Workout } from '@/types';
import { Clock, Dumbbell, Activity, Heart, CheckCircle, ArrowLeft, Timer, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import ExerciseTimer from './ExerciseTimer';
import { useTranslation } from '@/contexts/TranslationContext';
interface WorkoutDisplayProps {
  workout: Workout;
  onBack: () => void;
  onComplete: (workout: Workout) => void;
}

interface CompletedExercise {
  exerciseId: string;
  setsCompleted: number;
  restTimersCompleted: number;
}

const WorkoutDisplay = ({ workout, onBack, onComplete }: WorkoutDisplayProps) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<'main' | 'warmup' | 'cooldown'>('main');
  const [completedExercises, setCompletedExercises] = useState<CompletedExercise[]>([]);
  
  // Get exercise animation URL based on exercise name
  const getExerciseAnimationUrl = (exerciseName: string): string => {
    // Normalize the exercise name for matching
    const normalizedName = exerciseName.toLowerCase().trim();
    
    const exerciseMap: { [key: string]: string } = {
     // Chest exercises - various naming patterns
      'neutral grip hand rows': 'https://gymvisual.com/img/p/2/1/7/7/5/21775.gif',
      'cable pulldown': 'https://gymvisual.com/img/p/2/8/3/3/5/28335.gif',
      'cable bicep curl': 'https://www.inspireusafoundation.org/file/2023/04/cable-bicep-curl.gif',
      'cable hammer curl': 'https://fitnessprogramer.com/wp-content/uploads/2021/06/rope-bicep-curls.gif',
      'push-ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/11/push-up.gif',
      'hindu push up': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pike-to-Cobra.gif',
      'hindu push-up': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pike-to-Cobra.gif',
      'hindu push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pike-to-Cobra.gif',
      'hindu pushup': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pike-to-Cobra.gif',
      'hindu pushups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pike-to-Cobra.gif',
      'push ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/11/push-up.gif',
      'pushups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/11/push-up.gif',
      'standard push-ups': 'https://www.inspireusafoundation.org/file/2023/04/incline-push-up-bench.gif',
      'incline push-ups': 'https://www.inspireusafoundation.org/file/2023/04/incline-push-up-bench.gif',
      'incline push ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Incline-Push-Up.gif',
      'diamond push-ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/08/diamond-pushup.gif',
      'diamond push ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/08/diamond-pushup.gif',
      'wide push-ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/11/wide-arm-push-ups.gif',
      'wide push ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/11/wide-arm-push-ups.gif',
      'decline push-ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/07/decline-push-up.gif',
      'decline push ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/07/decline-push-up.gif',
      'decline-push-ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/07/decline-push-up.gif',
      'close-grip push-ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/08/diamond-pushup.gif',
      'close grip push-ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/08/diamond-pushup.gif',
      'archer push-ups': 'https://www.inspireusafoundation.org/file/2022/08/archer-push-up.gif',
      'archer push ups': 'https://www.inspireusafoundation.org/file/2022/08/archer-push-up.gif',
      'chest flyes': 'https://newlife.com.cy/wp-content/uploads/2019/11/03081301-Dumbbell-Fly_Chest-FIX_360.gif',
      'chest flys': 'https://newlife.com.cy/wp-content/uploads/2019/11/03081301-Dumbbell-Fly_Chest-FIX_360.gif',
      'dumbbell flyes': 'https://newlife.com.cy/wp-content/uploads/2019/11/03081301-Dumbbell-Fly_Chest-FIX_360.gif',
      'dumbbell chest press': 'https://www.inspireusafoundation.org/file/2022/09/dumbbell-chest-press.gif',
      'dumbbell bench press': 'https://www.inspireusafoundation.org/file/2022/09/dumbbell-chest-press.gif',
      'chest dips': 'https://www.inspireusafoundation.org/file/2022/01/chest-dip-movement.gif',
      'dips': 'https://www.inspireusafoundation.org/file/2022/01/chest-dip-movement.gif',
      'incline dumbbell press': 'https://www.inspireusafoundation.org/file/2022/01/dumbbell-incline-reverse-grip-bench.gif',
      'cable chest fly': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/08/high-cable-fly.gif',
      'pec deck flyes': 'https://www.inspireusafoundation.org/file/2022/07/pec-deck.gif',
      'barbell bench press': 'https://media.tenor.com/kpJH4zjuPF8AAAAM/supino.gif',
      'barbell bench-press': 'https://media.tenor.com/kpJH4zjuPF8AAAAM/supino.gif',
      'incline barbell bench press': 'https://newlife.com.cy/wp-content/uploads/2019/11/00471301-Barbell-Incline-Bench-Press_Chest_360.gif',
      'incline barbell bench-press': 'https://newlife.com.cy/wp-content/uploads/2019/11/00471301-Barbell-Incline-Bench-Press_Chest_360.gif',
      'dumbbell chest fly': 'https://newlife.com.cy/wp-content/uploads/2019/11/03081301-Dumbbell-Fly_Chest-FIX_360.gif',
      'incline barbell press': 'https://newlife.com.cy/wp-content/uploads/2019/11/00471301-Barbell-Incline-Bench-Press_Chest_360.gif',
      'close grip barbell press': 'https://www.inspireusafoundation.org/file/2022/01/close-grip-bench-press-movement.gif',

      
      // Back exercises
      'pull-ups': 'https://www.inspireusafoundation.org/file/2022/11/pull-up.gif',
      'pull ups': 'https://www.inspireusafoundation.org/file/2022/11/pull-up.gif',
      'pullups': 'https://www.inspireusafoundation.org/file/2022/11/pull-up.gif',
      'pull-ups/rows': 'https://www.inspireusafoundation.org/file/2022/11/pull-up.gif',
      'chin-ups': 'https://www.inspireusafoundation.org/file/2022/09/chin-ups.gif',
      'chin ups': 'https://www.inspireusafoundation.org/file/2022/09/chin-ups.gif',
      'bent-over rows': 'https://www.inspireusafoundation.org/file/2022/11/dumbbell-row.gif',
      'bent over rows': 'https://www.inspireusafoundation.org/file/2022/11/dumbbell-row.gif',
      'bent over dumbbell rows': 'https://www.inspireusafoundation.org/file/2022/11/dumbbell-row.gif',
      'bent-over dumbbell row': 'https://www.inspireusafoundation.org/file/2022/11/dumbbell-row.gif',
      'wide-grip pull-ups': 'https://newlife.com.cy/wp-content/uploads/2019/08/18661301-Wide-Grip-Pull-Up-on-Dip-Cage_Back_720.gif',
      'wide grip pull-ups': 'https://newlife.com.cy/wp-content/uploads/2019/08/18661301-Wide-Grip-Pull-Up-on-Dip-Cage_Back_720.gif',
      'single-arm rows': 'https://www.inspireusafoundation.org/file/2021/10/single-arm-dumbbell-row.gif',
      'single arm rows': 'https://www.inspireusafoundation.org/file/2021/10/single-arm-dumbbell-row.gif',
      'single-arm dumbbell row': 'https://www.inspireusafoundation.org/file/2021/10/single-arm-dumbbell-row.gif',
      'lat pulldowns': 'https://www.inspireusafoundation.org/file/2022/08/wide-grip-lat-pulldown.gif',
      'lat pulldown': 'https://www.inspireusafoundation.org/file/2022/08/wide-grip-lat-pulldown.gif',
      'reverse flyes': 'https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-rear-delt-fly.gif',
      'reverse flys': 'https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-rear-delt-fly.gif',
      'face pulls': 'https://www.inspireusafoundation.org/file/2023/01/banded-face-pull.gif',
      'face pull': 'https://www.inspireusafoundation.org/file/2023/01/banded-face-pull.gif',
      'superman': 'https://newlife.com.cy/wp-content/uploads/2019/11/08041301-Superman_Waist_360.gif',
      'supermans': 'https://newlife.com.cy/wp-content/uploads/2019/11/08041301-Superman_Waist_360.gif',
      'barbell row': 'https://media.tenor.com/AYJ_bNXDvoUAAAAM/workout-muscles.gif',
      'barbell-row': 'https://media.tenor.com/AYJ_bNXDvoUAAAAM/workout-muscles.gif',
      'barbell rows': 'https://media.tenor.com/AYJ_bNXDvoUAAAAM/workout-muscles.gif',
      'barbell-rows': 'https://media.tenor.com/AYJ_bNXDvoUAAAAM/workout-muscles.gif',
      't bar row': 'https://www.inspireusafoundation.org/file/2021/10/t-bar-row-muscles.gif',
      't-bar row': 'https://www.inspireusafoundation.org/file/2021/10/t-bar-row-muscles.gif',
      'resistance band face pull': 'https://www.inspireusafoundation.org/file/2023/01/banded-face-pull.gif',
      'cable face-pull': 'https://www.inspireusafoundation.org/file/2022/03/cable-face-pull.gif',
      'lower back extension': 'https://www.inspireusafoundation.org/file/2022/05/back-extension.gif',
      'lower-back extension': 'https://www.inspireusafoundation.org/file/2022/05/back-extension.gif',
      'cable crossover': 'https://www.inspireusafoundation.org/file/2024/02/cable-standing-crossover.gif',
      'cable wood chop': 'https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2025/03/cable-high-to-low-woodchop.gif?fit=600%2C600&ssl=1',

      // Shoulder exercises
      'overhead press': 'https://www.inspireusafoundation.org/file/2022/10/dumbbell-shoulder-press.gif',
      'shoulder press': 'https://www.inspireusafoundation.org/file/2022/10/dumbbell-shoulder-press.gif',
      'dumbbell shoulder press': 'https://www.inspireusafoundation.org/file/2022/10/dumbbell-shoulder-press.gif',
      'lateral raises': 'https://www.inspireusafoundation.org/file/2022/03/dumbbell-lateral-raise.gif',
      'lateral raise': 'https://www.inspireusafoundation.org/file/2022/03/dumbbell-lateral-raise.gif',
      'side raises': 'https://www.inspireusafoundation.org/file/2022/03/dumbbell-lateral-raise.gif',
      'front raises': 'https://www.inspireusafoundation.org/file/2022/11/dumbbell-front-raise.gif',
      'front raise': 'https://www.inspireusafoundation.org/file/2022/11/dumbbell-front-raise.gif',
      'rear delt flyes': 'https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-rear-delt-fly.gif',
      'pike push-up': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/pikepushup-1456956895.gif',
      'pike push-ups': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/pikepushup-1456956895.gif',
      'pike push ups': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/pikepushup-1456956895.gif',
      'pike pushup': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/pikepushup-1456956895.gif',
      'pike-pushup': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/pikepushup-1456956895.gif',
      'pike-pushups': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/pikepushup-1456956895.gif',
      'pike pushups': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/pikepushup-1456956895.gif',
      'handstand push-ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/02/handstand-pushup.gif',
      'handstand push ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/02/handstand-pushup.gif',
      'barbell shoulder press': 'https://media.tenor.com/CV1FfGVNpdcAAAAM/desenvolvimento-militar.gif',
      'barbell overhead press': 'https://media.tenor.com/CV1FfGVNpdcAAAAM/desenvolvimento-militar.gif',
      'barbell press': 'https://media.tenor.com/CV1FfGVNpdcAAAAM/desenvolvimento-militar.gif',
      'barbell upright row': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/10/barbell-upright-row-standing.gif',

      // Tricep exercises
      'tricep dips': 'https://miro.medium.com/v2/resize:fit:840/0*xpvWu3s9ZmFHPhLb.gif',
      'triceps dips': 'https://miro.medium.com/v2/resize:fit:840/0*xpvWu3s9ZmFHPhLb.gif',
      'tricep extensions': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/11/overhead-cable-tricep-extension.gif',
      'triceps extensions': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/11/overhead-cable-tricep-extension.gif',
      'overhead tricep extension': 'https://media.tenor.com/GRMSvKqfksMAAAAM/triceps.gif',
      'overhead triceps extension': 'https://media.tenor.com/GRMSvKqfksMAAAAM/triceps.gif',
      'tricep pushdown': 'https://www.inspireusafoundation.org/file/2023/03/ez-bar-tricep-pushdown.gif',
      'triceps pushdown': 'https://www.inspireusafoundation.org/file/2023/03/ez-bar-tricep-pushdown.gif',
      'close-grip bench press': 'https://www.inspireusafoundation.org/file/2022/04/pin-press.gif',
      'close grip bench press': 'https://www.inspireusafoundation.org/file/2022/04/pin-press.gif',
      'barbell close-grip press': 'https://www.inspireusafoundation.org/file/2022/04/pin-press.gif',
      'barbell close grip press': 'https://www.inspireusafoundation.org/file/2022/04/pin-press.gif',

      
      // Bicep exercises
      'bicep curls': 'https://www.inspireusafoundation.org/file/2022/03/dumbbell-bicep-curl.gif',
      'biceps curls': 'https://www.inspireusafoundation.org/file/2022/03/dumbbell-bicep-curl.gif',
      'dumbbell curls': 'https://www.inspireusafoundation.org/file/2022/03/dumbbell-bicep-curl.gif',
      'dumbbell bicep curl': 'https://www.inspireusafoundation.org/file/2022/03/dumbbell-bicep-curl.gif',
      'hammer curls': 'https://www.inspireusafoundation.org/file/2022/04/dumbbell-hammer-curl.gif',
      'hammer curl': 'https://www.inspireusafoundation.org/file/2022/04/dumbbell-hammer-curl.gif',
      'concentration curls': 'https://www.inspireusafoundation.org/file/2022/03/dumbbell-concentration-curl.gif',
      'concentration curl': 'https://www.inspireusafoundation.org/file/2022/03/dumbbell-concentration-curl.gif',
      'barbell curls': 'https://www.inspireusafoundation.org/file/2023/02/barbell-cheat-curl.gif',
      'barbell curl': 'https://www.inspireusafoundation.org/file/2023/02/barbell-cheat-curl.gif',
      'resistance band curl': 'https://gymvisual.com/img/p/2/1/8/2/5/21825.gif',
      'resistance band curls': 'https://gymvisual.com/img/p/2/1/8/2/5/21825.gif',
      'barbell reverse curl' : 'https://burnfit.io/wp-content/uploads/2023/11/REV_BB_CURL.gif',
      'bodyweight bicep curls': 'https://www.inspireusafoundation.org/file/2024/02/bodyweight-bicep-curl.gif',
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
      'jump squats': 'https://www.inspireusafoundation.org/file/2022/07/squat-jump.gif',
      'jumping squats': 'https://www.inspireusafoundation.org/file/2022/07/squat-jump.gif',
      'jumping squat': 'https://www.inspireusafoundation.org/file/2022/07/squat-jump.gif',
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
      'barbell split squat': 'https://www.inspireusafoundation.org/file/2023/08/barbell-split-squat.gif',
      'lateral squats': 'https://www.inspireusafoundation.org/file/2023/08/cossack-squat.gif',
      'jump lunges': 'https://media.tenor.com/r6-pyTNtT_UAAAAM/afundo.gif',


      // Abs/Core exercises
      'plank': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/01/plank.gif',
      'planks': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/01/plank.gif',
      'bicycle crunches': 'https://www.inspireusafoundation.org/file/2023/08/bicycle-crunch-movement.gif',
      'bicycle crunch': 'https://www.inspireusafoundation.org/file/2023/08/bicycle-crunch-movement.gif',
      'russian twists': 'https://gymvisual.com/img/p/1/0/7/1/1/10711.gif',
      'russian twist': 'https://gymvisual.com/img/p/1/0/7/1/1/10711.gif',
      'mountain climbers': 'https://i.pinimg.com/originals/fb/fa/09/fbfa0902f381a5735972c21255935aff.gif',
      'mountain climber': 'https://i.pinimg.com/originals/fb/fa/09/fbfa0902f381a5735972c21255935aff.gif',
      'dead bug': 'https://gymvisual.com/img/p/2/0/8/3/6/20836.gif',
      'dead bugs': 'https://gymvisual.com/img/p/2/0/8/3/6/20836.gif',
      'leg raises': 'https://www.inspireusafoundation.org/file/2022/06/lying-leg-raise.gif',
      'leg raise': 'https://www.inspireusafoundation.org/file/2022/06/lying-leg-raise.gif',
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
      'reverse crunches': 'https://www.inspireusafoundation.org/file/2022/01/reverse-crunch.gif',
      'reverse crunch': 'https://www.inspireusafoundation.org/file/2022/01/reverse-crunch.gif',
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
      'kettlebell swings': 'https://www.inspireusafoundation.org/file/2022/10/russian-kettlebell-swing.gif',
      'kettlebell swings primary': 'https://www.inspireusafoundation.org/file/2022/10/russian-kettlebell-swing.gif',
      'dumbbell thrusters': 'https://gymvisual.com/img/p/1/2/2/9/6/12296.gif',
      'dumbbell thruster': 'https://gymvisual.com/img/p/1/2/2/9/6/12296.gif',
      'turkish get-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/04/Turkish-Get-Up-Squat-style.gif',
      'turkish get up': 'https://fitnessprogramer.com/wp-content/uploads/2021/04/Turkish-Get-Up-Squat-style.gif',
      'dumbbell clean and press': 'https://gymvisual.com/img/p/2/2/6/2/0/22620.gif',
      'dumbbell renegade row': 'https://www.inspireusafoundation.org/file/2022/08/renegade-row.gif',
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
      'jump rope': 'https://burnfit.io/wp-content/uploads/2023/11/JUMP_ROPE.gif',
      
      
      
      'deep breathing': 'https://dailyburn.com/life/wp-content/uploads/2016/04/circle-gif-2.gif',
      'quad stretch': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/07/quadriceps-stretch.gif',
      'quad stretches': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/07/quadriceps-stretch.gif',
      'hamstring stretch': 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Seated-Toe-Touches.gif',
      'hamstring stretches': 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Seated-Toe-Touches.gif',
      "child's pose": 'https://fitnessprogramer.com/wp-content/uploads/2022/05/Balasana-Child-Pose.gif',
      'childs pose': 'https://fitnessprogramer.com/wp-content/uploads/2022/05/Balasana-Child-Pose.gif',
      'chest stretch': 'https://lyfta.app/images/exercises/17871101.png',
      'chest stretches': 'https://lyfta.app/images/exercises/17871101.png',

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
      'dumbbell rows': 'https://www.inspireusafoundation.org/file/2022/11/dumbbell-row.gif',
      'kettleball deadlift': 'https://www.inspireusafoundation.org/file/2021/12/the-kettlebell-deadlift-1024x634.png',
      'kettleball deadlifts': 'https://www.inspireusafoundation.org/file/2021/12/the-kettlebell-deadlift-1024x634.png',
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
      'dumbbell squat': 'https://www.inspireusafoundation.org/file/2022/11/dumbbell-squat.gif',
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
      'kettlebell russian twist': 'https://www.inspireusafoundation.org/file/2021/12/how-to-do-a-kettlebell-russian-twist.gif',
      'kettlebell plank pull-through': 'https://149874912.v2.pressablecdn.com/wp-content/uploads/2025/03/kettlebell-plank-pull-through.gif',
      'kettlebell snatch': 'https://burnfit.io/wp-content/uploads/2023/11/KB_SNATCH.gif',
      'kettlebell clean and press': 'https://i.pinimg.com/originals/ff/2a/fc/ff2afcbcb6cea55b0fb737a7169764ab.gif',
      'kettlebell thruster' :'https://i.pinimg.com/originals/60/51/3f/60513f6478926895606a2354dd7efd83.gif',
      'kettlebell figure-8': 'https://www.inspireusafoundation.org/file/2021/12/how-to-do-a-kettlebell-figure-8.gif',
      'kettlebell swings alt': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/10/russian-kettlebell-swing.gif',
      
      //Pain exercises
      'clamshells': 'https://www.strengthlog.com/wp-content/uploads/2024/01/clamshell.gif',
      'deadbugs': 'https://gymvisual.com/img/p/2/0/8/3/6/20836.gif',
      'seated upper body press': 'https://www.inspireusafoundation.org/file/2022/10/dumbbell-shoulder-press.gif',
      'supported bicep curl':'https://www.inspireusafoundation.org/file/2021/10/dumbbell-preacher-curl.gif',
      'supported bicep curls':'https://www.inspireusafoundation.org/file/2021/10/dumbbell-preacher-curl.gif',
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
      'resistance band tricep pushdown': 'https://www.inspireusafoundation.org/file/2023/03/band-pushdown.gif.gif',
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
      title: t('Workout completed!'),
      description: t('Great job! Your progress has been saved.'),
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
                          ? (typeof exercise.reps === 'number' && exercise.reps > 30)
                              ? `${exercise.reps} secs`
                              : (typeof exercise.reps === 'string' && exercise.reps.includes('seconds'))
                                ? exercise.reps
                                : `${exercise.reps} reps`
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
                     <p><strong>{isWarmupOrCooldown ? 'Time:' : 'Sets:'}</strong> {isWarmupOrCooldown ? 'As shown' : exercise.sets}</p>
                     <p><strong>{isWarmupOrCooldown && (typeof exercise.reps === 'number' && exercise.reps > 30) ? 'Duration:' : 'Reps:'}</strong> {exercise.reps}</p>
                     {exercise.restTime && !isWarmupOrCooldown && <p><strong>Rest:</strong> {exercise.restTime}s</p>}
                     {exercise.description && <p><strong>Description:</strong> {exercise.description}</p>}
                   </div>
                   
                   {/* Timer for time-based exercises */}
                   {isWarmupOrCooldown && typeof exercise.reps === 'number' && exercise.reps > 10 && (
                     <ExerciseTimer 
                       duration={exercise.reps} 
                       className="mt-4"
                     />
                   )}
                   
                   {/* Rest timer for main exercises */}
                   {!isWarmupOrCooldown && exercise.restTime && (
                     <div className="mt-4">
                       <h4 className="font-medium mb-2">Rest Timer</h4>
                       <ExerciseTimer 
                         duration={exercise.restTime} 
                         className="mt-2"
                       />
                     </div>
                   )}
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
          
          <div className="grid grid-cols-3 gap-4 mt-4">
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
          <div className="flex flex-col sm:flex-row mb-4 border-b gap-1 sm:gap-0">
            <Button
              variant={activeSection === 'warmup' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('warmup')}
              className={`text-xs sm:text-sm flex-1 sm:flex-none ${activeSection === 'warmup' ? 'bg-fitness-primary text-white' : ''}`}
            >
              <Timer className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              5-Min Warmup
            </Button>
            <Button
              variant={activeSection === 'main' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('main')}
              className={`text-xs sm:text-sm flex-1 sm:flex-none ${activeSection === 'main' ? 'bg-fitness-primary text-white' : ''}`}
            >
              Main Workout
            </Button>
            <Button
              variant={activeSection === 'cooldown' ? 'default' : 'ghost'}
              onClick={() => setActiveSection('cooldown')}
              className={`text-xs sm:text-sm flex-1 sm:flex-none ${activeSection === 'cooldown' ? 'bg-fitness-primary text-white' : ''}`}
            >
              <Timer className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
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
