// src/data/workoutGenerator.ts
import { Exercise, MuscleGroup, Equipment } from "./types";
import { getFilteredExercises } from "./getFilteredExercises"; // NO exercises import here

export const generateWorkout = (
  targetMuscleGroups: MuscleGroup[],
  availableEquipment: Equipment[],
  intensity: string
): Exercise[] => {
  let filtered = getFilteredExercises(targetMuscleGroups, availableEquipment, intensity);

  // --- Handle biceps/triceps split ---
  if (targetMuscleGroups.includes("biceps") && targetMuscleGroups.includes("triceps")) {
    const bicepsEx = filtered.filter(ex => (Array.isArray(ex.muscleGroup) ? ex.muscleGroup.includes("biceps") : ex.muscleGroup === "biceps"));
    const tricepsEx = filtered.filter(ex => (Array.isArray(ex.muscleGroup) ? ex.muscleGroup.includes("triceps") : ex.muscleGroup === "triceps"));

    const half = Math.floor(15 / 2);
    return shuffle([
      ...shuffle(bicepsEx).slice(0, half),
      ...shuffle(tricepsEx).slice(0, 15 - half)
    ]);
  }

  // --- Handle multiple equipment balancing ---
  const selectedEquipment = availableEquipment.filter(eq => eq.toLowerCase() !== "none").map(eq => eq.toLowerCase());
  if (selectedEquipment.length > 1) {
    const exercisesByEquipment: { [key: string]: Exercise[] } = {};
    selectedEquipment.forEach(eq => {
      exercisesByEquipment[eq] = filtered.filter(ex => {
        const eqs = Array.isArray(ex.equipment) ? ex.equipment : [ex.equipment];
        const eqsLower = eqs.map(e => e.toLowerCase());
        return eqsLower.includes(eq) ||
          (["dumbbells","barbell","kettlebell"].includes(eq) &&
           eqsLower.some(e => ["dumbbells","barbell","kettlebell"].includes(e)));
      });
    });

    const balanced: Exercise[] = [];
    const totalSlots = 15;
    const slotsPerEquipment = Math.floor(totalSlots / selectedEquipment.length);
    const remainder = totalSlots % selectedEquipment.length;

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

  return shuffle(filtered).slice(0, 15);
};

// Utility function: shuffle
const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
