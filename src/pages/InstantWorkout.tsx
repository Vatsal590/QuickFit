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
import { adaptWorkout, rememberFact } from '@/lib/memory';
import { exercises as allExercises } from '../data/exercises';

const InstantWorkout = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [workoutPreferences, setWorkoutPreferences] = useState<WorkoutFormData | null>(null);
  const [excludedExercises, setExcludedExercises] = useState<ExcludedExerciseInfo[]>([]);
  const [selectedPains, setSelectedPains] = useState<BodyPain[]>([]);
  const [showExcludedDialog, setShowExcludedDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [adaptationReason, setAdaptationReason] = useState<string | null>(null);
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
    const selectedPreferences = { ...formData };
    activityTracker.trackWorkoutAction('create', { 
      time: formData.time, 
      intensity: formData.intensity, 
      muscleGroups: formData.muscleGroups,
      equipment: formData.equipment,
      customEquipment: formData.customEquipment
    });
    
    setIsGenerating(true);
    
    try {
      // Adapt to what the user really did (memory). Falls back to the generic plan if memory is off/unavailable.
      const adaptation = await adaptWorkout(formData.intensity, formData.muscleGroups);
      if (adaptation) {
        formData = {
          ...formData,
          intensity: adaptation.intensity,
          bodyPains: Array.from(new Set([...(formData.bodyPains || []), ...(adaptation.extraPains as BodyPain[])])),
        };
      }
      setAdaptationReason(adaptation?.reason ?? null);
      if (selectedPreferences.bodyPains && selectedPreferences.bodyPains.length > 0) {
        rememberFact('pain', `Reported ${selectedPreferences.bodyPains.join(', ')} before a workout`);
      }

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
      let combined = [...result.workout.exercises, ...uniqueCustomExercises];
      // Repeat a movement the user struggled with (if it exists and is not excluded by pain)
      const excludedNames = new Set(result.excludedExercises.map(e => e.exerciseName.toLowerCase()));
      const hasEquipment = (ex: Exercise) => ex.equipment.every(eq => eq === 'none' || formData.equipment.includes(eq));
      for (const name of adaptation?.repeat ?? []) {
        const n = name.toLowerCase();
        if (combined.some(ex => ex.name.toLowerCase().includes(n) || n.includes(ex.name.toLowerCase()))) continue;
        const match = allExercises.find(ex => (ex.name.toLowerCase().includes(n) || n.includes(ex.name.toLowerCase())) && !excludedNames.has(ex.name.toLowerCase()) && hasEquipment(ex) && !(formData.bodyPains || []).length);
        if (match && combined.length > 0) combined = [match, ...combined.slice(0, -1)];
      }
      const finalWorkout = {
        ...result.workout,
        exercises: combined
      };
      
      setCurrentWorkout(finalWorkout);
      setWorkoutPreferences(selectedPreferences);
      rememberFact('preference', `Instant workout selections: equipment ${selectedPreferences.equipment.join(', ') || 'none'}; custom equipment ${selectedPreferences.customEquipment || 'none'}; ${selectedPreferences.time} minutes; ${selectedPreferences.intensity}; focus ${selectedPreferences.muscleGroups.join(', ')}. User-reported pain: ${selectedPreferences.bodyPains?.join(', ') || 'none selected'}.`);
      setExcludedExercises(result.excludedExercises);
      setSelectedPains(formData.bodyPains || []);
      
      // Show dialog if exercises were excluded due to pain
      if (formData.bodyPains && formData.bodyPains.length > 0 && result.excludedExercises.length > 0) {
        setShowExcludedDialog(true);
      }
      
      const customMsg = uniqueCustomExercises.length > 0 
        ? ` ${t('Including')} ${uniqueCustomExercises.length} ${t('AI-suggested exercise')}${uniqueCustomExercises.length > 1 ? 's' : ''} ${t('for your custom equipment')}!`
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
  
  const handleCompleteWorkout = (workout: Workout, feel?: 'easy' | 'just right' | 'hard') => {
    activityTracker.trackWorkoutAction('complete', { workoutId: workout.id, title: workout.title });
    markWorkoutCompleted(workout.id);
    const list = workout.exercises.map(ex => `${ex.sets}x${ex.reps} ${ex.name}`).join(', ');
    rememberFact('workout', `Completed ${workout.intensity} workout "${workout.title}": ${list}${feel ? `. Felt ${feel}` : ''}`.slice(0, 1000));
    if (feel === 'hard') rememberFact('difficulty', `Found the workout "${workout.title}" hard`);
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
              preferences={workoutPreferences}
              onBack={() => { 
                setCurrentWorkout(null);
                setExcludedExercises([]);
                setSelectedPains([]);
                activityTracker.trackButtonClick('back_from_workout', 'instant-workout');
              }}
              onComplete={handleCompleteWorkout}
              adaptationReason={adaptationReason}
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
