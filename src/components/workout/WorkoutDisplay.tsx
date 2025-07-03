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
    // Normalize the exercise name for matching
    const normalizedName = exerciseName.toLowerCase().trim();
    
    const exerciseMap: { [key: string]: string } = {
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
      'decline-push-ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/07/decline-push-up.gif',
      'close-grip push-ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/08/diamond-pushup.gif',
      'close grip push-ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/08/diamond-pushup.gif',
      'archer push-ups': 'https://burnfit.io/wp-content/uploads/2023/11/ARCHER_PUSH_UP.gif',
      'archer push ups': 'https://burnfit.io/wp-content/uploads/2023/11/ARCHER_PUSH_UP.gif',
      'chest flyes': 'https://newlife.com.cy/wp-content/uploads/2019/11/03081301-Dumbbell-Fly_Chest-FIX_360.gif',
      'chest flys': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Flyes.gif',
      'dumbbell flyes': 'https://newlife.com.cy/wp-content/uploads/2019/11/03081301-Dumbbell-Fly_Chest-FIX_360.gif',
      'dumbbell chest press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Press.gif',
      'dumbbell bench press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Press.gif',
      'chest dips': 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Chest-Dips.gif',
      'dips': 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Chest-Dips.gif',
      'incline dumbbell press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Dumbbell-Press.gif',
      'cable chest fly': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/08/high-cable-fly.gif',
      'pec deck flyes': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pec-Deck-Fly.gif',
      'barbell bench press': 'https://media.tenor.com/kpJH4zjuPF8AAAAM/supino.gif',
      'barbell bench-press': 'https://media.tenor.com/kpJH4zjuPF8AAAAM/supino.gif',
      'incline barbell bench press': 'https://newlife.com.cy/wp-content/uploads/2019/11/00471301-Barbell-Incline-Bench-Press_Chest_360.gif',
      'incline barbell bench-press': 'https://newlife.com.cy/wp-content/uploads/2019/11/00471301-Barbell-Incline-Bench-Press_Chest_360.gif',
      

      
      // Back exercises
      'pull-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif',
      'pull ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif',
      'pullups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif',
      'pull-ups/rows': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif',
      'chin-ups': 'https://burnfit.io/wp-content/uploads/2023/11/CHIN_UP.gif',
      'chin ups': 'https://burnfit.io/wp-content/uploads/2023/11/CHIN_UP.gif',
      'bent-over rows': 'https://burnfit.io/wp-content/uploads/2023/11/DB_LOW.gif',
      'bent over rows': 'https://burnfit.io/wp-content/uploads/2023/11/DB_LOW.gif',
      'bent over dumbbell rows': 'https://burnfit.io/wp-content/uploads/2023/11/DB_LOW.gif',
      'bent-over dumbbell row': 'https://burnfit.io/wp-content/uploads/2023/11/DB_LOW.gif',
      'wide-grip pull-ups': 'https://newlife.com.cy/wp-content/uploads/2019/08/18661301-Wide-Grip-Pull-Up-on-Dip-Cage_Back_720.gif',
      'wide grip pull-ups': 'https://newlife.com.cy/wp-content/uploads/2019/08/18661301-Wide-Grip-Pull-Up-on-Dip-Cage_Back_720.gif',
      'single-arm rows': 'https://burnfit.io/wp-content/uploads/2023/11/OA_DB_ROW.gif',
      'single arm rows': 'https://burnfit.io/wp-content/uploads/2023/11/OA_DB_ROW.gif',
      'single-arm dumbbell row': 'https://burnfit.io/wp-content/uploads/2023/11/OA_DB_ROW.gif',
      'lat pulldowns': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lat-Pulldown.gif',
      'lat pulldown': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lat-Pulldown.gif',
      'reverse flyes': 'https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-rear-delt-fly.gif',
      'reverse flys': 'https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-rear-delt-fly.gif',
      'face pulls': 'https://burnfit.io/wp-content/uploads/2023/11/FACE_PULL.gif',
      'face pull': 'https://burnfit.io/wp-content/uploads/2023/11/FACE_PULL.gif',
      'superman': 'https://newlife.com.cy/wp-content/uploads/2019/11/08041301-Superman_Waist_360.gif',
      'supermans': 'https://newlife.com.cy/wp-content/uploads/2019/11/08041301-Superman_Waist_360.gif',
      'barbell row': 'https://media.tenor.com/AYJ_bNXDvoUAAAAM/workout-muscles.gif',
      'barbell-row': 'https://media.tenor.com/AYJ_bNXDvoUAAAAM/workout-muscles.gif',
      'barbell rows': 'https://media.tenor.com/AYJ_bNXDvoUAAAAM/workout-muscles.gif',
      'barbell-rows': 'https://media.tenor.com/AYJ_bNXDvoUAAAAM/workout-muscles.gif',
      't bar row': 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhOqvFL85VD4PBDTBWiCBwIDN8tDzYELNn-nfx6GChi8ABs1C3A2UI8A01md44tYbSvTFl9L517jgqVYf9hlZK-jkq_aoF5djbD3mN_8kDfiel0HaR4RWfll9d4CZu49jfgJiNJTVcywIb4ve3rwjqgSiQTOxrQMFUz-Gp2s1H5CwUFeKYvW07NtVF1CA/s360/T-Bar-Row.gif',
      't-bar row': 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhOqvFL85VD4PBDTBWiCBwIDN8tDzYELNn-nfx6GChi8ABs1C3A2UI8A01md44tYbSvTFl9L517jgqVYf9hlZK-jkq_aoF5djbD3mN_8kDfiel0HaR4RWfll9d4CZu49jfgJiNJTVcywIb4ve3rwjqgSiQTOxrQMFUz-Gp2s1H5CwUFeKYvW07NtVF1CA/s360/T-Bar-Row.gif',
      'resistance band face pull': 'https://i.pinimg.com/originals/c5/3b/8c/c53b8c84f1b8f044d05da7462016c417.gif',
      'cable face-pull': 'https://burnfit.io/wp-content/uploads/2023/11/FACE_PULL.gif',
      'lower back extension': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/hyperextension.gif',
      'lower-back extension': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/hyperextension.gif',

      // Shoulder exercises
      'overhead press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif',
      'shoulder press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif',
      'dumbbell shoulder press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif',
      'lateral raises': 'https://fitnessprogramer.com/wp-content/uploads/2021/04/Seated-Dumbbell-Lateral-Raise.gif',
      'lateral raise': 'https://fitnessprogramer.com/wp-content/uploads/2021/04/Seated-Dumbbell-Lateral-Raise.gif',
      'side raises': 'https://fitnessprogramer.com/wp-content/uploads/2021/04/Seated-Dumbbell-Lateral-Raise.gif',
      'front raises': 'https://burnfit.io/wp-content/uploads/2023/11/DB_F_RAISE.gif',
      'front raise': 'https://burnfit.io/wp-content/uploads/2023/11/DB_F_RAISE.gif',
      'rear delt flyes': 'https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-rear-delt-fly.gif',
      'pike push-ups': 'https://cdn-cccio.nitrocdn.com/sQAAylIpwgMYZgBLSXcMgCkUIbfIzHvb/assets/images/optimized/rev-586a700/www.aleanlife.com/wp-content/uploads/2023/03/performing-pike-push-ups.gif',
      'pike push ups': 'https://cdn-cccio.nitrocdn.com/sQAAylIpwgMYZgBLSXcMgCkUIbfIzHvb/assets/images/optimized/rev-586a700/www.aleanlife.com/wp-content/uploads/2023/03/performing-pike-push-ups.gif',
      'handstand push-ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/02/handstand-pushup.gif',
      'handstand push ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/02/handstand-pushup.gif',
      'barbell shoulder press': 'https://media.tenor.com/CV1FfGVNpdcAAAAM/desenvolvimento-militar.gif',
      'barbell overhead press': 'https://media.tenor.com/CV1FfGVNpdcAAAAM/desenvolvimento-militar.gif',
      'barbell press': 'https://media.tenor.com/CV1FfGVNpdcAAAAM/desenvolvimento-militar.gif',
      'barbell upright row': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/10/barbell-upright-row-standing.gif',

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
      'resistance band curl': 'https://fitnessprogramer.com/wp-content/uploads/2022/02/Band-Biceps-Curl.gif',
      'resistance band curls': 'https://fitnessprogramer.com/wp-content/uploads/2022/02/Band-Biceps-Curl.gif',
      'barbell reverse curl' : 'https://burnfit.io/wp-content/uploads/2023/11/REV_BB_CURL.gif',

      
      // Tricep exercises
      'tricep dips': 'https://miro.medium.com/v2/resize:fit:840/0*xpvWu3s9ZmFHPhLb.gif',
      'triceps dips': 'https://miro.medium.com/v2/resize:fit:840/0*xpvWu3s9ZmFHPhLb.gif',
      'tricep extensions': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/11/overhead-cable-tricep-extension.gif',
      'triceps extensions': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/11/overhead-cable-tricep-extension.gif',
      'overhead tricep extension': 'https://media.tenor.com/GRMSvKqfksMAAAAM/triceps.gif',
      'overhead triceps extension': 'https://media.tenor.com/GRMSvKqfksMAAAAM/triceps.gif',
      'tricep pushdown': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pushdown.gif',
      'triceps pushdown': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pushdown.gif',
      'close-grip bench press': 'https://burnfit.io/wp-content/uploads/2023/11/CG_BB_BP.gif',
      'close grip bench press': 'https://burnfit.io/wp-content/uploads/2023/11/CG_BB_BP.gif',
      'barbell close-grip press': 'https://burnfit.io/wp-content/uploads/2023/11/CG_BB_BP.gif',
      'barbell close grip press': 'https://burnfit.io/wp-content/uploads/2023/11/CG_BB_BP.gif',

      
      
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
      'single-leg deadlifts': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/10/barbell-single-leg-deadlift.gif',
      'single leg deadlifts': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/10/barbell-single-leg-deadlift.gif',
      'dumbbell step up': 'https://www.kettlebellkings.com/cdn/shop/articles/weighted-step-up.gif?v=1731311898',
      'dumbbell step-up': 'https://www.kettlebellkings.com/cdn/shop/articles/weighted-step-up.gif?v=1731311898',
      'barbell squats': 'https://media.tenor.com/Re3T3B66V9UAAAAM/barbellsquats-gymexercisesmen.gif',
      'barbell squat': 'https://media.tenor.com/Re3T3B66V9UAAAAM/barbellsquats-gymexercisesmen.gif',
      'barbell deadlift': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/02/barbell-deadlift-movement.gif',
      'barbell front squat': 'https://www.kettlebellkings.com/cdn/shop/articles/Front_Squats.gif?v=1694617488',
      'barbell front-squat': 'https://www.kettlebellkings.com/cdn/shop/articles/Front_Squats.gif?v=1694617488',
      'barbell split squat': 'https://fitnessprogramer.com/wp-content/uploads/2022/04/Barbell-Split-Squat.gif',


      // Abs/Core exercises
      'plank': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/01/plank.gif',
      'planks': 'https://www.inspireusafoundation.org/wp-content/uploads/2022/01/plank.gif',
      'bicycle crunches': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bicycle-Crunch.gif',
      'bicycle crunch': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bicycle-Crunch.gif',
      'russian twists': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Russian-Twist.gif',
      'russian twist': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Russian-Twist.gif',
      'mountain climbers': 'https://i.pinimg.com/originals/fb/fa/09/fbfa0902f381a5735972c21255935aff.gif',
      'mountain climber': 'https://i.pinimg.com/originals/fb/fa/09/fbfa0902f381a5735972c21255935aff.gif',
      'dead bug': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dead-Bug.gif',
      'dead bugs': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dead-Bug.gif',
      'leg raises': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lying-Leg-Raise.gif',
      'leg raise': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lying-Leg-Raise.gif',
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
      'plank to downward dog': 'https://gymvisual.com/img/p/2/4/6/9/7/24697.gif',
      'reverse crunches': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Reverse-Crunch-1.gif',
      'reverse crunch': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Reverse-Crunch-1.gif',
      'flutter kicks': 'https://newlife.com.cy/wp-content/uploads/2019/11/28911301-Flutter-Kicks-hands-under-hips-head-up-female_Waist_360.gif',
      'flutter kick': 'https://newlife.com.cy/wp-content/uploads/2019/11/28911301-Flutter-Kicks-hands-under-hips-head-up-female_Waist_360.gif',
      
      // HIIT/Cardio exercises
      'burpees': 'https://www.shutterstock.com/image-vector/woman-doing-burpee-push-step-600nw-1358162885.jpg',
      'burpee': 'https://www.shutterstock.com/image-vector/woman-doing-burpee-push-step-600nw-1358162885.jpg',
      'jump jacks': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/08/jumping-jacks.gif',
      'jumping jacks': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/08/jumping-jacks.gif',
      'jumping jack': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/08/jumping-jacks.gif',
      'high knees': 'https://i.pinimg.com/originals/55/50/03/555003596e97967eb5f2568403bbc742.gif',
      'high knee': 'https://i.pinimg.com/originals/55/50/03/555003596e97967eb5f2568403bbc742.gif',
      'butt kickers': 'https://fitnessprogramer.com/wp-content/uploads/2021/10/Butt-Kicks.gif',
      'butt kicker': 'https://fitnessprogramer.com/wp-content/uploads/2021/10/Butt-Kicks.gif',
      'plank jacks': 'https://media.post.rvohealth.io/wp-content/uploads/2023/08/GrimInferiorAustraliansilkyterrier-size_restricted.gif',
      'plank jack': 'https://media.post.rvohealth.io/wp-content/uploads/2023/08/GrimInferiorAustraliansilkyterrier-size_restricted.gif',
      'kettlebell swings': 'https://burnfit.io/wp-content/uploads/2023/11/KB_SWING.gif',
      'kettlebell swing': 'https://burnfit.io/wp-content/uploads/2023/11/KB_SWING.gif',
      'dumbbell thrusters': 'https://burnfit.io/wp-content/uploads/2023/11/DB_THRUSTER.gif',
      'dumbbell thruster': 'https://burnfit.io/wp-content/uploads/2023/11/DB_THRUSTER.gif',
      'turkish get-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/04/Turkish-Get-Up-Squat-style.gif',
      'turkish get up': 'https://fitnessprogramer.com/wp-content/uploads/2021/04/Turkish-Get-Up-Squat-style.gif',
      'dumbbell clean and press': 'https://gymvisual.com/img/p/2/2/6/2/0/22620.gif',
      'dumbbell renegade row': 'https://fitnessprogramer.com/wp-content/uploads/2021/01/dumbbell-renegade-row-1.gif',
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
      'medicine ball slams': 'https://fitnessprogramer.com/wp-content/uploads/2022/06/Medicine-ball-Overhead-Slam-exercise.gif',
      'medicine ball slam': 'https://fitnessprogramer.com/wp-content/uploads/2022/06/Medicine-ball-Overhead-Slam-exercise.gif',
      'explosive push ups': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/explosivepushup-1457102261.gif',
      'explosive push-ups': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/explosivepushup-1457102261.gif',
      'explosive push up': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/explosivepushup-1457102261.gif',
      'explosive push-up': 'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/explosivepushup-1457102261.gif',
      'lateral shuffles': 'https://media1.popsugar-assets.com/files/thumbor/1C34XQfL-mf9xZLs4_ilDvX7hrI=/fit-in/792x528/top/filters:format_auto():upscale()/2017/01/30/083/n/1922729/863416dc9c25cc58_LATERAL_SHUFFLE_TOUCH_GIF.gif',
      'lateral-shuffles': 'https://media1.popsugar-assets.com/files/thumbor/1C34XQfL-mf9xZLs4_ilDvX7hrI=/fit-in/792x528/top/filters:format_auto():upscale()/2017/01/30/083/n/1922729/863416dc9c25cc58_LATERAL_SHUFFLE_TOUCH_GIF.gif',
      'lateral shuffle': 'https://media1.popsugar-assets.com/files/thumbor/1C34XQfL-mf9xZLs4_ilDvX7hrI=/fit-in/792x528/top/filters:format_auto():upscale()/2017/01/30/083/n/1922729/863416dc9c25cc58_LATERAL_SHUFFLE_TOUCH_GIF.gif',
      'sprint in place': 'https://fitnessprogramer.com/wp-content/uploads/2021/07/Run.gif',
      'dumbbell rows': 'https://burnfit.io/wp-content/uploads/2023/11/DB_LOW.gif',
      'kettleball deadlift': 'https://burnfit.io/wp-content/uploads/2023/11/KB_DL.gif',
      'kettleball deadlifts': 'https://burnfit.io/wp-content/uploads/2023/11/KB_DL.gif',
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
      'tuck jumps':'https://liftmanual.com/wp-content/uploads/2023/04/knee-tuck-jump.gif',
      'tuck jump':'https://liftmanual.com/wp-content/uploads/2023/04/knee-tuck-jump.gif',
      'lateral bounds':'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/skaterhop-1456956292.gif?crop=1xw:0.75xh;center,top&resize=1200:*',
      'lateral bound':'https://hips.hearstapps.com/hmg-prod/images/workouts/2016/03/skaterhop-1456956292.gif?crop=1xw:0.75xh;center,top&resize=1200:*',
      'medicine ball throws': 'https://fitnessprogramer.com/wp-content/uploads/2023/09/Medicine-Ball-Overhead-Throw.gif',
      'resistance band core rotation':'https://cdn.shopify.com/s/files/1/1633/7705/files/rotational_exercises_480x480.png?v=1616171474',
      ' box jumps':'https://www.docteur-fitness.com/wp-content/uploads/2022/09/jump-box.gif',
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
