
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
        { name: "Marching in Place", sets: 2, reps: "32 counts", description: "High knees with rhythm" }
      ],
      intermediate: [
        { name: "Cha-Cha Slides", sets: 4, reps: "12 each side", description: "Triple step with hip movement" },
        { name: "Jazz Squares", sets: 3, reps: "8 squares", description: "Cross, back, side, front pattern" },
        { name: "Body Rolls", sets: 3, reps: "8 rolls", description: "Smooth wave motion through the body" }
      ],
      advanced: [
        { name: "Pirouette Combinations", sets: 4, reps: "4 each side", description: "Multiple turns with balance" },
        { name: "Leap Sequences", sets: 3, reps: "6 leaps", description: "Dynamic jumps across the floor" },
        { name: "Complex Choreo", sets: 1, reps: "Full routine", description: "8-count combination with spins" }
      ]
    },
    athlete: {
      beginner: [
        { name: "Bodyweight Squats", sets: 3, reps: "12-15", description: "Basic squatting movement" },
        { name: "Push-ups (Modified)", sets: 3, reps: "8-12", description: "From knees or incline" },
        { name: "Plank Hold", sets: 3, reps: "20-30 sec", description: "Core stability exercise" }
      ],
      intermediate: [
        { name: "Jump Squats", sets: 4, reps: "15", description: "Explosive squat with jump" },
        { name: "Burpees", sets: 3, reps: "10", description: "Full body explosive movement" },
        { name: "Mountain Climbers", sets: 3, reps: "20 each leg", description: "Running plank position" }
      ],
      advanced: [
        { name: "Plyometric Box Jumps", sets: 4, reps: "12", description: "Explosive jumps onto platform" },
        { name: "Single Arm Burpees", sets: 3, reps: "8 each arm", description: "Unilateral explosive movement" },
        { name: "Sprint Intervals", sets: 6, reps: "30 sec", description: "Maximum effort running" }
      ]
    },
    calisthenics: {
      beginner: [
        { name: "Wall Push-ups", sets: 3, reps: "10-15", description: "Standing push against wall" },
        { name: "Assisted Squats", sets: 3, reps: "12", description: "Using chair for support" },
        { name: "Dead Hang", sets: 3, reps: "10-15 sec", description: "Hanging from pull-up bar" }
      ],
      intermediate: [
        { name: "Regular Push-ups", sets: 3, reps: "15-20", description: "Full push-up movement" },
        { name: "Pistol Squat Progression", sets: 3, reps: "5 each leg", description: "Single leg squat assistance" },
        { name: "L-Sit Hold", sets: 3, reps: "10-15 sec", description: "Core and arm strength" }
      ],
      advanced: [
        { name: "One-Arm Push-ups", sets: 3, reps: "5 each arm", description: "Unilateral push-up strength" },
        { name: "Muscle-ups", sets: 3, reps: "5", description: "Pull-up to dip transition" },
        { name: "Human Flag", sets: 3, reps: "5-10 sec", description: "Side lever on vertical pole" }
      ]
    },
    boxing: {
      beginner: [
        { name: "Basic Jab", sets: 3, reps: "20 each hand", description: "Straight punch technique" },
        { name: "Shadow Boxing", sets: 3, reps: "1 min", description: "Practice combinations in air" },
        { name: "Basic Footwork", sets: 3, reps: "30 sec", description: "Forward, back, side steps" }
      ],
      intermediate: [
        { name: "Jab-Cross Combo", sets: 4, reps: "15 combos", description: "Two punch combination" },
        { name: "Heavy Bag Work", sets: 3, reps: "2 min", description: "Power punches on bag" },
        { name: "Slip and Counter", sets: 3, reps: "10 each side", description: "Defensive movement drill" }
      ],
      advanced: [
        { name: "5-Punch Combinations", sets: 4, reps: "10 combos", description: "Complex punch sequences" },
        { name: "Sparring Drills", sets: 3, reps: "3 min", description: "Controlled fighting practice" },
        { name: "Pad Work", sets: 4, reps: "2 min", description: "Partner focus mitt training" }
      ]
    },
    yoga: {
      beginner: [
        { name: "Child's Pose", sets: 1, reps: "1 min", description: "Restorative resting position" },
        { name: "Cat-Cow Stretch", sets: 3, reps: "10", description: "Spinal mobility movement" },
        { name: "Downward Dog", sets: 3, reps: "30 sec", description: "Inverted V-shape pose" }
      ],
      intermediate: [
        { name: "Warrior II", sets: 2, reps: "45 sec each side", description: "Standing strength pose" },
        { name: "Tree Pose", sets: 2, reps: "30 sec each leg", description: "Balance and focus pose" },
        { name: "Vinyasa Flow", sets: 3, reps: "5 flows", description: "Chaturanga to upward dog" }
      ],
      advanced: [
        { name: "Crow Pose", sets: 3, reps: "30 sec", description: "Arm balance pose" },
        { name: "Handstand", sets: 3, reps: "15-30 sec", description: "Inverted balance pose" },
        { name: "Scorpion Pose", sets: 2, reps: "15 sec", description: "Advanced backbend inversion" }
      ]
    },
    hiit: {
      beginner: [
        { name: "Jumping Jacks", sets: 3, reps: "30 sec", description: "Cardio warm-up movement" },
        { name: "Modified Burpees", sets: 3, reps: "20 sec", description: "Step back instead of jump" },
        { name: "High Knees", sets: 3, reps: "20 sec", description: "Running in place" }
      ],
      intermediate: [
        { name: "Tabata Squats", sets: 4, reps: "20 sec on/10 sec off", description: "High intensity squats" },
        { name: "Push-up Burpees", sets: 3, reps: "30 sec", description: "Full burpee with push-up" },
        { name: "Bicycle Crunches", sets: 3, reps: "45 sec", description: "Core rotation exercise" }
      ],
      advanced: [
        { name: "Plyometric Circuit", sets: 4, reps: "45 sec", description: "Explosive movement combo" },
        { name: "Double Unders", sets: 3, reps: "30 sec", description: "Jump rope two rotations" },
        { name: "Thruster Complex", sets: 4, reps: "40 sec", description: "Squat to overhead press" }
      ]
    }
  };

  return exerciseData[category]?.[level] || [];
};

const WorkoutPreview = ({ isOpen, onClose, workout, onPurchase, isPurchasing }: WorkoutPreviewProps) => {
  if (!workout) return null;

  const previewExercises = getPreviewExercises(workout.category, workout.level);
  const displayExercises = previewExercises.slice(0, 3); // Show only first 3 exercises

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
                + {previewExercises.length - 3} more exercises in the full workout
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
