import { getFilteredExercises } from "./exercises";
import { MuscleGroup, Equipment, Exercise } from "./types";

/**
 * Generates a workout based on selected muscle groups, available equipment, intensity, and pain areas.
 * @param targetMuscleGroups - Array of muscle groups user wants to target (e.g., ["chest", "legs"])
 * @param availableEquipment - Array of available equipment (e.g., ["dumbbells", "barbell"])
 * @param intensity - Workout intensity (e.g., "low", "medium", "high")
 * @param painAreas - Optional array of user's pain areas (e.g., ["lower back", "shoulder"])
 * @returns Array of Exercise objects, with a pain-relief exercise at the start if applicable
 */
export const generateWorkout = (
  targetMuscleGroups: MuscleGroup[],
  availableEquipment: Equipment[],
  intensity: string,
  painAreas: string[] = []
): Exercise[] => {
  // 1. Get all filtered exercises based on muscle groups, equipment, and intensity
  const filteredExercises = getFilteredExercises(targetMuscleGroups, availableEquipment, intensity);

  // 2. Get a single pain-relief exercise (equipment-free) if any pain areas are selected
  let painReliefExercise: Exercise | null = null;
  if (painAreas.length > 0) {
    const painExercises = filteredExercises.filter(
      (ex) => ex.isPainRelief && ex.equipment.includes("none") && !painAreas.includes(ex.muscleGroup as string)
    );

    if (painExercises.length > 0) {
      // Pick a random one
      painReliefExercise = painExercises[Math.floor(Math.random() * painExercises.length)];
    }
  }

  // 3. Remove the selected pain-relief exercise from the main list to avoid duplicates
  const finalExercises = painReliefExercise
    ? filteredExercises.filter((ex) => ex.id !== painReliefExercise!.id)
    : filteredExercises;

  // 4. Add the pain-relief exercise at the start if it exists
  if (painReliefExercise) {
    finalExercises.unshift(painReliefExercise);
  }

  return finalExercises;
};
