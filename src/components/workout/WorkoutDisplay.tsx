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
      
      // Back exercises
     'pull-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif',
      'pull ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif',
      'pullups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif',
      'pull-ups/rows': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif',
      'chin-ups': 'https://burnfit.io/wp-content/uploads/2023/11/CHIN_UP.gif',
      'chin ups': 'https://burnfit.io/wp-content/uploads/2023/11/CHIN_UP.gif',
      'bent-over rows': 'https://burnfit.io/wp-content/uploads/2023/11/DB_LOW.gif',
      'bent over rows': 'https://burnfit.io/wp-content/uploads/2023/11/DB_LOW.gif',
      'wide-grip pull-ups': 'https://newlife.com.cy/wp-content/uploads/2019/08/18661301-Wide-Grip-Pull-Up-on-Dip-Cage_Back_720.gif',
      'wide grip pull-ups': 'https://newlife.com.cy/wp-content/uploads/2019/08/18661301-Wide-Grip-Pull-Up-on-Dip-Cage_Back_720.gif',
      'single-arm rows': 'https://burnfit.io/wp-content/uploads/2023/11/OA_DB_ROW.gif',
      'single arm rows': 'https://burnfit.io/wp-content/uploads/2023/11/OA_DB_ROW.gif',
      'lat pulldowns': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lat-Pulldown.gif',
      'lat pulldown': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lat-Pulldown.gif',
      'reverse flyes': 'https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-rear-delt-fly.gif',
      'reverse flys': 'https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-rear-delt-fly.gif',
      'face pulls': 'https://burnfit.io/wp-content/uploads/2023/11/FACE_PULL.gif',
      'face pull': 'https://burnfit.io/wp-content/uploads/2023/11/FACE_PULL.gif',
      'superman': 'https://newlife.com.cy/wp-content/uploads/2019/11/08041301-Superman_Waist_360.gif',
      'supermans': 'https://newlife.com.cy/wp-content/uploads/2019/11/08041301-Superman_Waist_360.gif',
      
      
      // Shoulder exercises
        'overhead press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif',
      'shoulder press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif',
      'dumbbell shoulder press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif',
      'lateral raises': 'https://fitnessprogramer.com/wp-content/uploads/2021/04/Seated-Dumbbell-Lateral-Raise.gif',
      'lateral raise': 'https://fitnessprogramer.com/wp-content/uploads/2021/04/Seated-Dumbbell-Lateral-Raise.gif',
      'side raises': 'https://fitnessprogramer.com/wp-content/uploads/2021/04/Seated-Dumbbell-Lateral-Raise.gif',
      'front raises': 'https://homeworkouts.org/wp-content/uploads/anim-dumbbell-front-raises.gif',
      'front raise': 'https://homeworkouts.org/wp-content/uploads/anim-dumbbell-front-raises.gif',
      'rear delt flyes': 'https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-rear-delt-fly.gif',
      'pike push-ups': 'https://cdn-cccio.nitrocdn.com/sQAAylIpwgMYZgBLSXcMgCkUIbfIzHvb/assets/images/optimized/rev-586a700/www.aleanlife.com/wp-content/uploads/2023/03/performing-pike-push-ups.gif',
      'pike push ups': 'https://cdn-cccio.nitrocdn.com/sQAAylIpwgMYZgBLSXcMgCkUIbfIzHvb/assets/images/optimized/rev-586a700/www.aleanlife.com/wp-content/uploads/2023/03/performing-pike-push-ups.gif',
      'handstand push-ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/02/handstand-pushup.gif',
      'handstand push ups': 'https://www.inspireusafoundation.org/wp-content/uploads/2023/02/handstand-pushup.gif',
      
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
      
      // Bicep exercises
      'dumbbell bicep curl': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Curl.gif',
      'dumbbell bicep curls': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Curl.gif',
      'bicep curls': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Curl.gif',
      'biceps curls': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Curl.gif',
      'dumbbell curls': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Curl.gif',
      'hammer curl': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hammer-Curl.gif',
      'hammer curls': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hammer-Curl.gif',
      'resistance band curl': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Resistance-Band-Bicep-Curl.gif',
      'resistance band curls': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Resistance-Band-Bicep-Curl.gif',
      'barbell curl': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Curl.gif',
      'barbell curls': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Curl.gif',
      'concentration curls': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Concentration-Curl.gif',
      'concentration curl': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Concentration-Curl.gif',
      
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
      
      // Core exercises
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
      
      
      // Cardio exercises
      'burpees': 'https://www.shutterstock.com/image-vector/woman-doing-burpee-push-step-600nw-1358162885.jpg',
      'burpee': 'https://www.shutterstock.com/image-vector/woman-doing-burpee-push-step-600nw-1358162885.jpg',
      'jump jacks': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/08/jumping-jacks.gif',
      'jumping jacks': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/08/jumping-jacks.gif',
      'jumping jack': 'https://www.inspireusafoundation.org/wp-content/uploads/2021/08/jumping-jacks.gif',
      'high knees': 'https://i.pinimg.com/originals/55/50/03/555003596e97967eb5f2568403bbc742.gif',
      'high knee': 'https://i.pinimg.com/originals/55/50/03/555003596e97967eb5f2568403bbc742.gif',
      'jump rope': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Jump-Rope.gif',
      'jumping rope': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Jump-Rope.gif',
      'kettlebell swing': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Kettlebell-Swing.gif',
      'kettlebell swings': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Kettlebell-Swing.gif',
      'dumbbell thruster': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Thruster.gif',
      'dumbbell thrusters': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Thruster.gif',
      'turkish get-up': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Turkish-Get-Up.gif',
      'turkish get-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Turkish-Get-Up.gif',
      'plank jacks': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Plank-Jack.gif',
      'plank jack': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Plank-Jack.gif',
      'butt kickers': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Butt-Kickers.gif',
      'butt kicker': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Butt-Kickers.gif',
      
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
