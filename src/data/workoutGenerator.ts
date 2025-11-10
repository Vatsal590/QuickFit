// src/data/workoutGenerator.ts
import { Exercise, MuscleGroup, Equipment } from "./types";
import { exercises } from "./exercises";

// Utility: shuffle an array
const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

// Main workout generator
export const generateWorkout = (
  targetMuscleGroups: MuscleGroup[],
  availableEquipment: Equipment[],
  intensity: string // can be used later for exercise selection
): Exercise[] => {
  const selectedEquipment = availableEquipment.filter(eq => eq !== "none");

  // --- FILTER EXERCISES ---
  let filtered = exercises.filter(ex => {
    const muscles = Array.isArray(ex.muscleGroup) ? ex.muscleGroup : [ex.muscleGroup];
    const matchesMuscle = targetMuscleGroups.includes("full body") || muscles.some(mg => targetMuscleGroups.includes(mg));
    if (!matchesMuscle) return false;

    const eqs = Array.isArray(ex.equipment) ? ex.equipment : [ex.equipment];
    const relevantEquipment = eqs.filter(eq => eq !== "bench"); // bench ignored

    const hasEquipment = relevantEquipment.some(eq => {
      if (eq === "none") return true;

      // weights substitution
      if (["dumbbells", "barbell", "kettlebell"].includes(eq)) {
        return selectedEquipment.some(se => ["dumbbells", "barbell", "kettlebell"].includes(se));
      }

      return selectedEquipment.includes(eq);
    });

    return hasEquipment;
  });

  // --- FALLBACK TO BODYWEIGHT ---
  if (filtered.length === 0) {
    filtered = exercises.filter(ex =>
      (Array.isArray(ex.muscleGroup)
        ? ex.muscleGroup.some(mg => targetMuscleGroups.includes(mg))
        : targetMuscleGroups.includes(ex.muscleGroup)) &&
      (Array.isArray(ex.equipment) ? ex.equipment.includes("none") : ex.equipment === "none")
    );
  }

  // --- HANDLE BICEPS/TRICEPS SPLIT ---
  if (targetMuscleGroups.includes("biceps") && targetMuscleGroups.includes("triceps")) {
    const bicepsEx = filtered.filter(ex =>
      (Array.isArray(ex.muscleGroup) ? ex.muscleGroup.includes("biceps") : ex.muscleGroup === "biceps")
    );
    const tricepsEx = filtered.filter(ex =>
      (Array.isArray(ex.muscleGroup) ? ex.muscleGroup.includes("triceps") : ex.muscleGroup === "triceps")
    );

    const half = Math.floor(15 / 2);
    return shuffle([
      ...shuffle(bicepsEx).slice(0, half),
      ...shuffle(tricepsEx).slice(0, 15 - half)
    ]);
  }

  // --- EQUIPMENT BALANCING ---
  if (selectedEquipment.length > 1) {
    const exercisesByEquipment: { [key: string]: Exercise[] } = {};
    selectedEquipment.forEach(eq => {
      exercisesByEquipment[eq] = filtered.filter(ex => {
        const eqs = Array.isArray(ex.equipment) ? ex.equipment : [ex.equipment];
        const relevantEq = eqs.filter(e => e !== "bench");
        return relevantEq.includes(eq) ||
          (["dumbbells","barbell","kettlebell"].includes(eq) &&
           relevantEq.some(e => ["dumbbells","barbell","kettlebell"].includes(e)));
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

    // Fill remaining slots
    if (balanced.length < totalSlots) {
      const remaining = filtered.filter(ex => !balanced.includes(ex));
      balanced.push(...shuffle(remaining).slice(0, totalSlots - balanced.length));
    }

    return shuffle(balanced);
  }

  // --- DEFAULT: single equipment or fallback ---
  return shuffle(filtered).slice(0, 15);
};
