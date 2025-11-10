// src/data/workoutGenerator.ts
import { Exercise, MuscleGroup, Equipment } from "./types";
import { exercises } from "./exercises";
import { getFilteredExercises } from "./getFilteredExercises";

// Utility: shuffle array
const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

// Main function to generate workout
export const generateWorkout = (
  targetMuscleGroups: MuscleGroup[],
  availableEquipment: Equipment[],
  intensity: string // could be "low", "medium", "high"
): Exercise[] => {
  // Step 1: filter exercises using centralized function
  let filtered = getFilteredExercises(targetMuscleGroups, availableEquipment, intensity);

  if (filtered.length === 0) {
    // fallback: bodyweight exercises for selected muscles
    filtered = exercises.filter(ex => {
      const muscles = Array.isArray(ex.muscleGroup) ? ex.muscleGroup : [ex.muscleGroup];
      const matchesMuscle = muscles.some(mg => targetMuscleGroups.includes(mg));
      const eqs = Array.isArray(ex.equipment) ? ex.equipment : [ex.equipment];
      return matchesMuscle && eqs.includes("none");
    });
  }

  // Step 2: handle biceps/triceps split (50/50)
  if (targetMuscleGroups.includes("biceps") && targetMuscleGroups.includes("triceps")) {
    const bicepsEx = filtered.filter(ex =>
      Array.isArray(ex.muscleGroup) ? ex.muscleGroup.includes("biceps") : ex.muscleGroup === "biceps"
    );
    const tricepsEx = filtered.filter(ex =>
      Array.isArray(ex.muscleGroup) ? ex.muscleGroup.includes("triceps") : ex.muscleGroup === "triceps"
    );
    const half = Math.floor(15 / 2);
    return shuffle([
      ...shuffle(bicepsEx).slice(0, half),
      ...shuffle(tricepsEx).slice(0, 15 - half)
    ]);
  }

  // Step 3: handle multiple equipment balance
  const selectedEquipment = availableEquipment.filter(eq => eq !== "none");
  if (selectedEquipment.length > 1) {
    const exercisesByEquipment: { [key: string]: Exercise[] } = {};
    selectedEquipment.forEach(eq => {
      exercisesByEquipment[eq] = filtered.filter(ex => {
        const eqs = Array.isArray(ex.equipment) ? ex.equipment : [ex.equipment];
        if (eqs.includes("none")) return true;
        if (["dumbbells", "barbell", "kettlebell"].includes(eq)) {
          return eqs.some(e => ["dumbbells", "barbell", "kettlebell"].includes(e));
        }
        return eqs.includes(eq);
      });
    });

    const totalSlots = 15;
    const slotsPerEquipment = Math.floor(totalSlots / selectedEquipment.length);
    const remainder = totalSlots % selectedEquipment.length;
    const balanced: Exercise[] = [];

    selectedEquipment.forEach((eq, idx) => {
      const group = exercisesByEquipment[eq] || [];
      const slots = slotsPerEquipment + (idx < remainder ? 1 : 0);
      balanced.push(...shuffle(group).slice(0, slots));
    });

    if (balanced.length < totalSlots) {
      const remaining = filtered.filter(ex => !balanced.includes(ex));
      balanced.push(...shuffle(remaining).slice(0, totalSlots - balanced.length));
    }

    return shuffle(balanced);
  }

  // Step 4: default case
  return shuffle(filtered).slice(0, 15);
};
