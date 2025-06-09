
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Crown, Flame, Snowflake, Dumbbell } from 'lucide-react';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  description: string;
  muscles_targeted?: string[];
  equipment?: string[];
  tips?: string[];
}

interface PurchasedWorkoutDetailProps {
  isOpen: boolean;
  onClose: () => void;
  workout: {
    id: string;
    name: string;
    category: string;
    level: string;
    description: string;
    duration: number;
    exercises: Exercise[];
    warmup_exercises: Exercise[];
    cooldown_exercises: Exercise[];
  } | null;
}

const PurchasedWorkoutDetail = ({ isOpen, onClose, workout }: PurchasedWorkoutDetailProps) => {
  if (!workout) return null;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderExerciseCard = (exercise: Exercise, index: number) => (
    <div key={index} className="border rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-lg">{exercise.name}</h4>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">
            {exercise.sets} sets × {exercise.reps}
          </div>
        </div>
      </div>
      
      <p className="text-gray-700">{exercise.description}</p>
      
      {exercise.muscles_targeted && exercise.muscles_targeted.length > 0 && (
        <div>
          <h5 className="font-medium text-sm text-gray-900 mb-1">Muscles Targeted:</h5>
          <div className="flex flex-wrap gap-1">
            {exercise.muscles_targeted.map((muscle, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {muscle}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {exercise.equipment && exercise.equipment.length > 0 && (
        <div>
          <h5 className="font-medium text-sm text-gray-900 mb-1">Equipment:</h5>
          <div className="flex flex-wrap gap-1">
            {exercise.equipment.map((item, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                <Dumbbell className="h-3 w-3 mr-1" />
                {item}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {exercise.tips && exercise.tips.length > 0 && (
        <div>
          <h5 className="font-medium text-sm text-gray-900 mb-1">Pro Tips:</h5>
          <ul className="text-sm text-gray-600 space-y-1">
            {exercise.tips.map((tip, i) => (
              <li key={i} className="flex items-start">
                <span className="text-fitness-primary mr-2">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-yellow-500" />
            {workout.name}
          </DialogTitle>
          <DialogDescription>
            Complete workout details with exercise instructions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Badge className={getLevelColor(workout.level)}>
              {workout.level}
            </Badge>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              {workout.duration} minutes
            </div>
          </div>

          <p className="text-gray-700">{workout.description}</p>

          <Tabs defaultValue="warmup" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="warmup" className="flex items-center gap-2">
                <Snowflake className="h-4 w-4" />
                Warmup ({workout.warmup_exercises?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="main" className="flex items-center gap-2">
                <Flame className="h-4 w-4" />
                Main Workout ({workout.exercises?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="cooldown" className="flex items-center gap-2">
                <Snowflake className="h-4 w-4" />
                Cooldown ({workout.cooldown_exercises?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="warmup" className="space-y-4 mt-6">
              {workout.warmup_exercises && workout.warmup_exercises.length > 0 ? (
                workout.warmup_exercises.map((exercise, index) => renderExerciseCard(exercise, index))
              ) : (
                <p className="text-gray-500 text-center py-8">No warmup exercises available</p>
              )}
            </TabsContent>

            <TabsContent value="main" className="space-y-4 mt-6">
              {workout.exercises && workout.exercises.length > 0 ? (
                workout.exercises.map((exercise, index) => renderExerciseCard(exercise, index))
              ) : (
                <p className="text-gray-500 text-center py-8">No main exercises available</p>
              )}
            </TabsContent>

            <TabsContent value="cooldown" className="space-y-4 mt-6">
              {workout.cooldown_exercises && workout.cooldown_exercises.length > 0 ? (
                workout.cooldown_exercises.map((exercise, index) => renderExerciseCard(exercise, index))
              ) : (
                <p className="text-gray-500 text-center py-8">No cooldown exercises available</p>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchasedWorkoutDetail;
