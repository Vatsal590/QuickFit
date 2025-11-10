// src/data/workoutGenerator.ts
import { Exercise, MuscleGroup, Equipment } from "./types";
import { exercises } from "./exercises";
import { getFilteredExercises } from "./exercises";

// Main function to generate a workout
export const generateWorkout = (
  targetMuscleGroups: MuscleGroup[], 
  availableEquipment: Equipment[], 
  intensity: string, 
  painAreas: string[] = [] // optional array of pain areas
): Exercise[] => {
  
  const workout: Exercise[] = [];

  // 1️⃣ Select ONE pain-relief exercise if user has any pain areas
  if (painAreas.length > 0) {
    const painExercises = exercises.filter(ex => 
      ex.isPainRelief && ex.painArea && painAreas.includes(ex.painArea)
    );

    if (painExercises.length > 0) {
      const selectedPainExercise = painExercises[
        Math.floor(Math.random() * painExercises.length)
      ];
      workout.push(selectedPainExercise);
    }
  }

  // 2️⃣ Get normal exercises filtered by muscle group, equipment, intensity
  const filteredExercises = getFilteredExercises(
    targetMuscleGroups, 
    availableEquipment, 
    intensity
  );

  // 3️⃣ Remove any exercises that are pain-relief from the normal list
  const normalExercises = filteredExercises.filter(ex => !ex.isPainRelief);

  // 4️⃣ Shuffle and add exercises to workout
  const remainingSlots = 15 - workout.length; // total target = 15
  const shuffledNormal = [...normalExercises].sort(() => 0.5 - Math.random());
  workout.push(...shuffledNormal.slice(0, remainingSlots));

  // 5️⃣ Final safety: if workout is empty, fallback to any exercise
  if (workout.length === 0) {
    const fallback = exercises.filter(ex => !ex.isPainRelief);
    if (fallback.length > 0) {
      workout.push(fallback[Math.floor(Math.random() * fallback.length)]);
    }
  }

  return workout;
};
