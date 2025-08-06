
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Crown, CheckCircle } from 'lucide-react';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  description: string;
}

interface WorkoutPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  workout: {
    id: string;
    name: string;
    category: string;
    level: string;
    price: number;
    description: string;
    duration: number;
  } | null;
  onPurchase: () => void;
  isPurchasing: boolean;
}

const getPreviewExercises = (category: string, level: string): Exercise[] => {
  const exerciseData: Record<string, Record<string, Exercise[]>> = {
    dance: {
      beginner: [
        { name: "Basic Step Touch", sets: 3, reps: "16 counts", description: "Simple side steps with arm movements" },
        { name: "Grapevine", sets: 3, reps: "8 each side", description: "Step to the side, cross behind, step, touch" },
        { name: "Marching in Place", sets: 2, reps: "32 counts", description: "High knees with rhythm" },
        { name: "Shoulder Rolls", sets: 2, reps: "16 each direction", description: "Gentle shoulder mobility" },
        { name: "Hip Circles", sets: 2, reps: "8 each direction", description: "Hip joint mobility exercise" },
        { name: "Basic Pivot Turn", sets: 3, reps: "4 each side", description: "180-degree turn on ball of foot" }
      ],
      intermediate: [
        { name: "Cha-Cha Slides", sets: 4, reps: "12 each side", description: "Triple step with hip movement" },
        { name: "Jazz Squares", sets: 3, reps: "8 squares", description: "Cross, back, side, front pattern" },
        { name: "Body Rolls", sets: 3, reps: "8 rolls", description: "Smooth wave motion through the body" },
        { name: "Chassé Steps", sets: 3, reps: "10 each side", description: "Galloping sideways movement" },
        { name: "Kick Ball Change", sets: 3, reps: "16 counts", description: "Kick, step back, weight transfer" },
        { name: "Spiral Turns", sets: 2, reps: "6 each direction", description: "Continuous turning with control" }
      ],
      advanced: [
        { name: "Pirouette Combinations", sets: 4, reps: "4 each side", description: "Multiple turns with balance" },
        { name: "Leap Sequences", sets: 3, reps: "6 leaps", description: "Dynamic jumps across the floor" },
        { name: "Complex Choreo", sets: 1, reps: "Full routine", description: "8-count combination with spins" },
        { name: "Grand Jetés", sets: 3, reps: "8 each leg", description: "Large traveling jumps with split" },
        { name: "Fouetté Turns", sets: 3, reps: "8 turns", description: "Whipping leg turns" },
        { name: "Floor Work Sequence", sets: 2, reps: "Full combo", description: "Low-level movement patterns" }
      ]
    },
    athlete: {
      beginner: [
        { name: "Bodyweight Squats", sets: 3, reps: "12-15", description: "Basic squatting movement" },
        { name: "Push-ups (Modified)", sets: 3, reps: "8-12", description: "From knees or incline" },
        { name: "Plank Hold", sets: 3, reps: "20-30 sec", description: "Core stability exercise" },
        { name: "Walking Lunges", sets: 3, reps: "10 each leg", description: "Forward stepping lunges" },
        { name: "Wall Sits", sets: 3, reps: "30 sec", description: "Isometric leg strengthening" },
        { name: "Arm Circles", sets: 2, reps: "20 each direction", description: "Shoulder mobility warmup" }
      ],
      intermediate: [
        { name: "Jump Squats", sets: 4, reps: "15", description: "Explosive squat with jump" },
        { name: "Burpees", sets: 3, reps: "10", description: "Full body explosive movement" },
        { name: "Mountain Climbers", sets: 3, reps: "20 each leg", description: "Running plank position" },
        { name: "Single-Leg Deadlifts", sets: 3, reps: "8 each leg", description: "Balance and posterior chain" },
        { name: "Pike Push-ups", sets: 3, reps: "10", description: "Shoulder-focused push variation" },
        { name: "Lateral Bounds", sets: 3, reps: "12 each side", description: "Side-to-side explosive jumps" }
      ],
      advanced: [
        { name: "Plyometric Box Jumps", sets: 4, reps: "12", description: "Explosive jumps onto platform" },
        { name: "Single Arm Burpees", sets: 3, reps: "8 each arm", description: "Unilateral explosive movement" },
        { name: "Sprint Intervals", sets: 6, reps: "30 sec", description: "Maximum effort running" },
        { name: "Pistol Squats", sets: 3, reps: "5 each leg", description: "Single-leg squat to depth" },
        { name: "Handstand Push-ups", sets: 3, reps: "5-8", description: "Inverted pressing movement" },
        { name: "Broad Jumps", sets: 4, reps: "8", description: "Horizontal explosive power" }
      ]
    },
    calisthenics: {
      beginner: [
        { name: "Wall Push-ups", sets: 3, reps: "10-15", description: "Standing push against wall" },
        { name: "Assisted Squats", sets: 3, reps: "12", description: "Using chair for support" },
        { name: "Dead Hang", sets: 3, reps: "10-15 sec", description: "Hanging from pull-up bar" },
        { name: "Incline Push-ups", sets: 3, reps: "8-12", description: "Hands elevated push-ups" },
        { name: "Hollow Body Hold", sets: 3, reps: "15 sec", description: "Core strengthening position" },
        { name: "Glute Bridges", sets: 3, reps: "15", description: "Hip extension exercise" }
      ],
      intermediate: [
        { name: "Regular Push-ups", sets: 3, reps: "15-20", description: "Full push-up movement" },
        { name: "Pistol Squat Progression", sets: 3, reps: "5 each leg", description: "Single leg squat assistance" },
        { name: "L-Sit Hold", sets: 3, reps: "10-15 sec", description: "Core and arm strength" },
        { name: "Pull-up Negatives", sets: 3, reps: "5", description: "Controlled lowering from pull-up" },
        { name: "Archer Push-ups", sets: 3, reps: "6 each side", description: "Unilateral push-up progression" },
        { name: "Tuck Front Lever", sets: 3, reps: "8 sec", description: "Core and pulling strength" }
      ],
      advanced: [
        { name: "One-Arm Push-ups", sets: 3, reps: "5 each arm", description: "Unilateral push-up strength" },
        { name: "Muscle-ups", sets: 3, reps: "5", description: "Pull-up to dip transition" },
        { name: "Human Flag", sets: 3, reps: "5-10 sec", description: "Side lever on vertical pole" },
        { name: "Planche Progression", sets: 3, reps: "5 sec", description: "Advanced pushing strength hold" },
        { name: "Front Lever", sets: 3, reps: "5 sec", description: "Horizontal pulling strength hold" },
        { name: "Handstand Walk", sets: 3, reps: "10 steps", description: "Moving handstand balance" }
      ]
    },
    boxing: {
      beginner: [
        { name: "Basic Jab", sets: 3, reps: "20 each hand", description: "Straight punch technique" },
        { name: "Shadow Boxing", sets: 3, reps: "1 min", description: "Practice combinations in air" },
        { name: "Basic Footwork", sets: 3, reps: "30 sec", description: "Forward, back, side steps" },
        { name: "Guard Position", sets: 3, reps: "30 sec holds", description: "Defensive stance practice" },
        { name: "Cross Punches", sets: 3, reps: "15 each hand", description: "Power punch from rear hand" },
        { name: "Bob and Weave", sets: 3, reps: "10 reps", description: "Head movement drill" }
      ],
      intermediate: [
        { name: "Jab-Cross Combo", sets: 4, reps: "15 combos", description: "Two punch combination" },
        { name: "Heavy Bag Work", sets: 3, reps: "2 min", description: "Power punches on bag" },
        { name: "Slip and Counter", sets: 3, reps: "10 each side", description: "Defensive movement drill" },
        { name: "Hook Punches", sets: 3, reps: "12 each hand", description: "Circular punch technique" },
        { name: "Uppercuts", sets: 3, reps: "10 each hand", description: "Upward punch movement" },
        { name: "Combo Drills", sets: 4, reps: "3-punch combos", description: "Multiple punch sequences" }
      ],
      advanced: [
        { name: "5-Punch Combinations", sets: 4, reps: "10 combos", description: "Complex punch sequences" },
        { name: "Sparring Drills", sets: 3, reps: "3 min", description: "Controlled fighting practice" },
        { name: "Pad Work", sets: 4, reps: "2 min", description: "Partner focus mitt training" },
        { name: "Counter-Attack Drills", sets: 3, reps: "15 each", description: "Defensive to offensive transitions" },
        { name: "Speed Bag Training", sets: 3, reps: "2 min", description: "Hand-eye coordination drill" },
        { name: "Advanced Footwork", sets: 3, reps: "2 min", description: "Complex movement patterns" }
      ]
    },
    yoga: {
      beginner: [
        { name: "Child's Pose", sets: 1, reps: "1 min", description: "Restorative resting position" },
        { name: "Cat-Cow Stretch", sets: 3, reps: "10", description: "Spinal mobility movement" },
        { name: "Downward Dog", sets: 3, reps: "30 sec", description: "Inverted V-shape pose" },
        { name: "Mountain Pose", sets: 2, reps: "30 sec", description: "Standing foundational pose" },
        { name: "Forward Fold", sets: 2, reps: "30 sec", description: "Standing forward bend" },
        { name: "Cobra Pose", sets: 3, reps: "20 sec", description: "Gentle backbend stretch" }
      ],
      intermediate: [
        { name: "Warrior II", sets: 2, reps: "45 sec each side", description: "Standing strength pose" },
        { name: "Tree Pose", sets: 2, reps: "30 sec each leg", description: "Balance and focus pose" },
        { name: "Vinyasa Flow", sets: 3, reps: "5 flows", description: "Chaturanga to upward dog" },
        { name: "Triangle Pose", sets: 2, reps: "30 sec each side", description: "Standing side stretch" },
        { name: "Warrior III", sets: 2, reps: "20 sec each leg", description: "Single-leg balance pose" },
        { name: "Bridge Pose", sets: 3, reps: "30 sec", description: "Backbend strengthening" }
      ],
      advanced: [
        { name: "Crow Pose", sets: 3, reps: "30 sec", description: "Arm balance pose" },
        { name: "Handstand", sets: 3, reps: "15-30 sec", description: "Inverted balance pose" },
        { name: "Scorpion Pose", sets: 2, reps: "15 sec", description: "Advanced backbend inversion" },
        { name: "Eight-Angle Pose", sets: 2, reps: "20 sec each side", description: "Complex arm balance" },
        { name: "Firefly Pose", sets: 3, reps: "15 sec", description: "Advanced arm balance" },
        { name: "King Pigeon", sets: 2, reps: "30 sec each side", description: "Deep backbend and hip opener" }
      ]
    },
    hiit: {
      beginner: [
        { name: "Jumping Jacks", sets: 3, reps: "30 sec", description: "Cardio warm-up movement" },
        { name: "Modified Burpees", sets: 3, reps: "20 sec", description: "Step back instead of jump" },
        { name: "High Knees", sets: 3, reps: "20 sec", description: "Running in place" },
        { name: "Bodyweight Squats", sets: 3, reps: "30 sec", description: "Lower body cardio" },
        { name: "Arm Circles", sets: 2, reps: "30 sec", description: "Upper body warm-up" },
        { name: "Step-ups", sets: 3, reps: "30 sec", description: "Cardio leg exercise" }
      ],
      intermediate: [
        { name: "Tabata Squats", sets: 4, reps: "20 sec on/10 sec off", description: "High intensity squats" },
        { name: "Push-up Burpees", sets: 3, reps: "30 sec", description: "Full burpee with push-up" },
        { name: "Bicycle Crunches", sets: 3, reps: "45 sec", description: "Core rotation exercise" },
        { name: "Jump Lunges", sets: 3, reps: "40 sec", description: "Explosive alternating lunges" },
        { name: "Plank Jacks", sets: 3, reps: "30 sec", description: "Plank with jumping feet" },
        { name: "Russian Twists", sets: 3, reps: "45 sec", description: "Core rotation with speed" }
      ],
      advanced: [
        { name: "Plyometric Circuit", sets: 4, reps: "45 sec", description: "Explosive movement combo" },
        { name: "Double Unders", sets: 3, reps: "30 sec", description: "Jump rope two rotations" },
        { name: "Thruster Complex", sets: 4, reps: "40 sec", description: "Squat to overhead press" },
        { name: "Box Jump Burpees", sets: 3, reps: "45 sec", description: "Burpee with box jump" },
        { name: "Battle Ropes", sets: 4, reps: "30 sec", description: "High-intensity rope training" },
        { name: "Kettlebell Swings", sets: 4, reps: "45 sec", description: "Hip-hinge explosive movement" }
      ]
    }
  };

  return exerciseData[category]?.[level] || [];
};

const WorkoutPreview = ({ isOpen, onClose, workout, onPurchase, isPurchasing }: WorkoutPreviewProps) => {
  if (!workout) return null;

  const previewExercises = getPreviewExercises(workout.category, workout.level);
  const displayExercises = previewExercises.slice(0, 2); // Show only 2 exercises
  const remainingCount = previewExercises.length - 2;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            {workout.name}
          </DialogTitle>
          <DialogDescription>
            Preview a few exercises from this premium workout
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Badge className="capitalize">{workout.level}</Badge>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              {workout.duration} minutes
            </div>
          </div>

          <p className="text-gray-600">{workout.description}</p>

          <div className="space-y-3">
            <h4 className="font-semibold text-lg">Exercise Preview:</h4>
            {displayExercises.map((exercise, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium">{exercise.name}</h5>
                  <span className="text-sm text-gray-500">{exercise.sets} sets × {exercise.reps}</span>
                </div>
                <p className="text-sm text-gray-600">{exercise.description}</p>
              </div>
            ))}
            
            <div className="text-center py-4 border rounded-lg bg-gray-50">
              <p className="text-gray-500 mb-2">
                + {remainingCount} more exercises in the full workout
              </p>
              <p className="text-sm text-gray-400">
                Plus warmup and cooldown routines
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center">
              <Crown className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="text-2xl font-bold">${(workout.price / 100).toFixed(2)}</span>
              <span className="text-sm text-gray-500 ml-2">one-time payment</span>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={onPurchase}
                disabled={isPurchasing}
                className="bg-fitness-primary hover:bg-fitness-primary/90"
              >
                {isPurchasing ? 'Processing...' : 'Buy Now'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutPreview;
