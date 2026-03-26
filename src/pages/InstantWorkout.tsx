import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import WorkoutForm from '../components/workout/WorkoutForm';
import WorkoutDisplay from '../components/workout/WorkoutDisplay';
import ExcludedExercisesDialog from '../components/workout/ExcludedExercisesDialog';
import { Workout, WorkoutFormData, BodyPain, Exercise } from '../types';
import { useWorkoutHistory } from '../hooks/useWorkoutHistory';
import { generateWorkout, getExerciseCount, ExcludedExerciseInfo } from '../data/workoutGenerator';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/contexts/TranslationContext';
import { activityTracker } from '@/utils/activityTracker';
import { supabase } from '@/integrations/supabase/client';

const InstantWorkout = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [excludedExercises, setExcludedExercises] = useState<ExcludedExerciseInfo[]>([]);
  const [selectedPains, setSelectedPains] = useState<BodyPain[]>([]);
  const [showExcludedDialog, setShowExcludedDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { addWorkoutToHistory, markWorkoutCompleted } = useWorkoutHistory();

  const fetchCustomExercises = async (
    customEquipment: string,
    muscleGroups: string[],
    intensity: string
  ): Promise<Exercise[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-custom-exercises', {
        body: { customEquipment, muscleGroups, intensity }
      });

      if (error) {
        console.error('Error fetching custom exercises:', error);
        return [];
      }

      return data?.exercises || [];
    } catch (error) {
      console.error('Failed to fetch custom exercises:', error);
      return [];
    }
  };

  const handleCreateWorkout = async (formData: WorkoutFormData) => {
    activityTracker.trackWorkoutAction('create', { 
      time: formData.time, 
      intensity: formData.intensity, 
      muscleGroups: formData.muscleGroups,
      equipment: formData.equipment,
      customEquipment: formData.customEquipment
    });
    
    setIsGenerating(true);
    
    try {
      // Get target exercise count based on duration
      const targetExerciseCount = getExerciseCount(formData.time);
      
      // Fetch custom equipment exercises first if provided
      let customExercises: Exercise[] = [];
      if (formData.customEquipment && formData.customEquipment.trim()) {
        toast({
          title: t("Analyzing custom equipment..."),
          description: t("AI is finding exercises for your equipment"),
        });
        
        customExercises = await fetchCustomExercises(
          formData.customEquipment,
          formData.muscleGroups,
          formData.intensity
        );
      }
      
      // Calculate how many base exercises we need (target minus AI exercises)
      const baseExerciseCount = Math.max(1, targetExerciseCount - customExercises.length);
      
      const result = generateWorkout(
        formData.time,
        formData.intensity,
        formData.muscleGroups,
        formData.equipment,
        formData.bodyPains,
        baseExerciseCount
      );
      
      // Filter out AI exercises that duplicate base workout exercises
      const baseExerciseNames = new Set(
        result.workout.exercises.map(ex => ex.name.toLowerCase())
      );
      const uniqueCustomExercises = customExercises.filter(
        ex => !baseExerciseNames.has(ex.name.toLowerCase())
      );
      
      // Combine base exercises with unique AI exercises
      const finalWorkout = {
        ...result.workout,
        exercises: [...result.workout.exercises, ...uniqueCustomExercises]
      };
      
      setCurrentWorkout(finalWorkout);
      setExcludedExercises(result.excludedExercises);
      setSelectedPains(formData.bodyPains || []);
      
      // Show dialog if exercises were excluded due to pain
      if (formData.bodyPains && formData.bodyPains.length > 0 && result.excludedExercises.length > 0) {
        setShowExcludedDialog(true);
      }
      
      const customMsg = customExercises.length > 0 
        ? ` ${t('Including')} ${customExercises.length} ${t('AI-suggested exercise')}${customExercises.length > 1 ? 's' : ''} ${t('for your custom equipment')}!`
        : '';
      
      toast({
        title: t("Workout generated"),
        description: `${t('Your')} ${finalWorkout.duration} ${t('minute workout is ready with 5-min warmup and cooldown')}!${customMsg}`,
      });
      
      addWorkoutToHistory(finalWorkout);
    } catch (error) {
      console.error("Failed to generate workout:", error);
      toast({
        title: t("Error"),
        description: t("Failed to generate workout. Please try again."),
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleCompleteWorkout = (workout: Workout) => {
    activityTracker.trackWorkoutAction('complete', { workoutId: workout.id, title: workout.title });
    markWorkoutCompleted(workout.id);
  };

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-3">
            {t('Custom Workout Generator')}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('Generate instant custom workouts based on your available time, equipment, and target muscle groups.')}
            {' '}{t('Perfect for quick sessions when you need a workout right now.')}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {currentWorkout ? (
            <WorkoutDisplay
              workout={currentWorkout}
              onBack={() => { 
                setCurrentWorkout(null);
                setExcludedExercises([]);
                setSelectedPains([]);
                activityTracker.trackButtonClick('back_from_workout', 'instant-workout');
              }}
              onComplete={handleCompleteWorkout}
            />
          ) : (
            <WorkoutForm 
              onSubmit={handleCreateWorkout}
            />
          )}
          {isGenerating && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-fitness-primary border-t-transparent mx-auto mb-3"></div>
                <p className="font-medium">{t('Generating your workout...')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <ExcludedExercisesDialog
        open={showExcludedDialog}
        onClose={() => setShowExcludedDialog(false)}
        excludedExercises={excludedExercises}
        selectedPains={selectedPains}
      />
    </PageContainer>
  );
};

export default InstantWorkout;
