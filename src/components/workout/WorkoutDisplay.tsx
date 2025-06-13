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
      // Chest exercises - various naming patterns
      'push-up': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-up.gif',
      'push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-up.gif',
      'push ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-up.gif',
      'pushups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-up.gif',
      'standard push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-up.gif',
      'incline push-up': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Push-Up.gif',
      'incline push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Push-Up.gif',
      'incline push ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Push-Up.gif',
      'diamond push-up': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Diamond-Push-Up.gif',
      'diamond push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Diamond-Push-Up.gif',
      'diamond push ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Diamond-Push-Up.gif',
      'wide push-up': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Wide-Grip-Push-Up.gif',
      'wide push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Wide-Grip-Push-Up.gif',
      'wide push ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Wide-Grip-Push-Up.gif',
      'wide-grip push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Wide-Grip-Push-Up.gif',
      'decline push-up': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Decline-Push-up.gif',
      'decline push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Decline-Push-up.gif',
      'decline push ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Decline-Push-up.gif',
      'close-grip push-up': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Close-Grip-Push-Up.gif',
      'close-grip push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Close-Grip-Push-Up.gif',
      'close grip push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Close-Grip-Push-Up.gif',
      'archer push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Archer-Push-Up.gif',
      'archer push-up': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Archer-Push-Up.gif',
      'dumbbell chest press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Bench-Press.gif',
      'dumbbell bench press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Bench-Press.gif',
      'incline dumbbell press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Dumbbell-Press.gif',
      'cable chest fly': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Fly.gif',
      'chest flyes': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Flyes.gif',
      'chest flys': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Flyes.gif',
      'dumbbell flyes': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Flyes.gif',
      'chest dips': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Chest-Dips.gif',
      'pec deck flyes': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pec-Deck-Fly.gif',
      
      // Back exercises
      'pull-up': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif',
      'pull-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif',
      'pull ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif',
      'pullups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif',
      'bent-over row': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bent-Over-Row.gif',
      'bent-over rows': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bent-Over-Row.gif',
      'bent over rows': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bent-Over-Row.gif',
      'lat pulldown': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lat-Pulldown.gif',
      'lat pulldowns': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lat-Pulldown.gif',
      'single-arm dumbbell row': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/One-Arm-Dumbbell-Row.gif',
      'single arm dumbbell row': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/One-Arm-Dumbbell-Row.gif',
      'single-arm rows': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/One-Arm-Dumbbell-Row.gif',
      'single arm rows': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/One-Arm-Dumbbell-Row.gif',
      'wide-grip pull-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Wide-Grip-Pull-Up.gif',
      'wide grip pull-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Wide-Grip-Pull-Up.gif',
      'chin-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Chin-Up.gif',
      'chin ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Chin-Up.gif',
      'face pulls': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Face-Pull.gif',
      'face pull': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Face-Pull.gif',
      'superman': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Superman-Exercise.gif',
      'supermans': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Superman-Exercise.gif',
      'reverse flyes': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Reverse-Fly.gif',
      'reverse flys': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Reverse-Fly.gif',
      
      // Shoulder exercises
      'dumbbell shoulder press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif',
      'shoulder press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif',
      'overhead press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif',
      'lateral raise': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lateral-Raise.gif',
      'lateral raises': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lateral-Raise.gif',
      'side raises': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lateral-Raise.gif',
      'front raise': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Front-Raise.gif',
      'front raises': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Front-Raise.gif',
      'resistance band face pull': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Face-Pull.gif',
      'pike push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pike-Push-up.gif',
      'pike push ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pike-Push-up.gif',
      'rear delt flyes': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Reverse-Fly.gif',
      'handstand push-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Handstand-Push-Up.gif',
      'handstand push ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Handstand-Push-Up.gif',
      
      // Leg exercises
      'bodyweight squat': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bodyweight-Squat.gif',
      'bodyweight squats': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bodyweight-Squat.gif',
      'squats': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bodyweight-Squat.gif',
      'dumbbell lunge': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lunge.gif',
      'dumbbell lunges': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lunge.gif',
      'lunges': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lunge.gif',
      'goblet squat': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Goblet-Squat.gif',
      'goblet squats': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Goblet-Squat.gif',
      'romanian deadlift': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Romanian-Deadlift.gif',
      'romanian deadlifts': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Romanian-Deadlift.gif',
      'jumping squat': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Jump-Squat.gif',
      'jumping squats': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Jump-Squat.gif',
      'jump squats': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Jump-Squat.gif',
      'bulgarian split squats': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bulgarian-Split-Squat.gif',
      'bulgarian split squat': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bulgarian-Split-Squat.gif',
      'calf raises': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Calf-Raise.gif',
      'calf raise': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Calf-Raise.gif',
      'glute bridges': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Glute-Bridge.gif',
      'glute bridge': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Glute-Bridge.gif',
      'single-leg deadlifts': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Single-Leg-Deadlift.gif',
      'single leg deadlifts': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Single-Leg-Deadlift.gif',
      'pistol squats': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pistol-Squat.gif',
      'pistol squat': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pistol-Squat.gif',
      'wall sit': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Wall-Sit.gif',
      'wall sits': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Wall-Sit.gif',
      
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
      'tricep dips': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Tricep-Dips.gif',
      'triceps dips': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Tricep-Dips.gif',
      'dips': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Tricep-Dips.gif',
      'overhead tricep extension': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Overhead-Triceps-Extension.gif',
      'overhead tricep extension': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Overhead-Triceps-Extension.gif',
      'tricep extensions': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Overhead-Triceps-Extension.gif',
      'triceps extensions': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Overhead-Triceps-Extension.gif',
      'tricep pushdown': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Triceps-Pushdown.gif',
      'triceps pushdown': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Triceps-Pushdown.gif',
      'close-grip bench press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Close-Grip-Bench-Press.gif',
      'close grip bench press': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Close-Grip-Bench-Press.gif',
      
      // Core exercises
      'plank': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Plank.gif',
      'planks': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Plank.gif',
      'bicycle crunch': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bicycle-Crunch.gif',
      'bicycle crunches': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bicycle-Crunch.gif',
      'russian twist': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Russian-Twist.gif',
      'russian twists': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Russian-Twist.gif',
      'mountain climber': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Mountain-Climber.gif',
      'mountain climbers': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Mountain-Climber.gif',
      'leg raises': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Leg-Raise.gif',
      'leg raise': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Leg-Raise.gif',
      'crunches': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Crunch.gif',
      'crunch': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Crunch.gif',
      'sit-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Sit-Up.gif',
      'sit ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Sit-Up.gif',
      'situps': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Sit-Up.gif',
      'dead bug': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dead-Bug.gif',
      'dead bugs': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dead-Bug.gif',
      'v-ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/V-Up.gif',
      'v ups': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/V-Up.gif',
      'side plank': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Side-Plank.gif',
      'side planks': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Side-Plank.gif',
      'hanging knee raises': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hanging-Knee-Raise.gif',
      'hanging knee raise': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hanging-Knee-Raise.gif',
      'reverse crunches': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Reverse-Crunch.gif',
      'reverse crunch': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Reverse-Crunch.gif',
      'flutter kicks': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Flutter-Kicks.gif',
      'flutter kick': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Flutter-Kicks.gif',
      'plank to downward dog': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Plank-to-Downward-Dog.gif',
      
      // Cardio exercises
      'jumping jacks': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Jumping-Jacks.gif',
      'jumping jack': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Jumping-Jacks.gif',
      'jump jacks': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Jumping-Jacks.gif',
      'high knees': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/High-Knees.gif',
      'high knee': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/High-Knees.gif',
      'jump rope': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Jump-Rope.gif',
      'jumping rope': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Jump-Rope.gif',
      'burpee': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Burpee.gif',
      'burpees': 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Burpee.gif',
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
