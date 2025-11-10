// src/data/workoutGenerator.ts
import { Exercise, MuscleGroup, Equipment } from "./types";
import { exercises } from "./exercises";

// Utility: Shuffle array
const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

// Main function to generate workout
export const generateWorkout = (
  targetMuscleGroups: MuscleGroup[],
  availableEquipment: Equipment[],
  intensity: string // could be "low", "medium", "high" for future use
): Exercise[] => {
  const selectedEquipment = availableEquipment.filter(eq => eq.toLowerCase() !== "none");
  const isAllEquipmentSelected = selectedEquipment.length >= 5;

  // --- MAIN FILTER ---
  let filtered = exercises.filter(ex => {
    const muscles = Array.isArray(ex.muscleGroup) ? ex.muscleGroup : [ex.muscleGroup];
    const matchesMuscle = targetMuscleGroups.includes("full body") || muscles.some(mg => targetMuscleGroups.includes(mg));

    if (!matchesMuscle) return false;
    if (isAllEquipmentSelected && ex.equipment.includes("resistance bands")) return false;

    const eqs = Array.isArray(ex.equipment) ? ex.equipment : [ex.equipment];
    const hasEquipment = eqs.some(eq =>
      eq.toLowerCase() === "none" ||
      selectedEquipment.includes(eq) ||
      (["dumbbells","barbell","kettlebell"].includes(eq) &&
       selectedEquipment.some(se => ["dumbbells","barbell","kettlebell"].includes(se))) ||
      (eq === "bench" && selectedEquipment.some(se => ["bench","barbell","dumbbells"].includes(se)))
    );

    return hasEquipment;
  });

  // --- FALLBACK: if empty, include bodyweight exercises for same muscles ---
  if (filtered.length === 0) {
    filtered = exercises.filter(ex =>
      (Array.isArray(ex.muscleGroup) ? ex.muscleGroup.some(mg => targetMuscleGroups.includes(mg)) : targetMuscleGroups.includes(ex.muscleGroup)) &&
      (Array.isArray(ex.equipment) ? ex.equipment.includes("none") : ex.equipment === "none")
    );
  }

  // --- HANDLE BICEPS/TRICEPS SPLIT ---
  if (targetMuscleGroups.includes("biceps") && targetMuscleGroups.includes("triceps")) {
    const bicepsEx = filtered.filter(ex => (Array.isArray(ex.muscleGroup) ? ex.muscleGroup.includes("biceps") : ex.muscleGroup === "biceps"));
    const tricepsEx = filtered.filter(ex => (Array.isArray(ex.muscleGroup) ? ex.muscleGroup.includes("triceps") : ex.muscleGroup === "triceps"));

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
      exercisesByEquipment[eq] = filtered.filter(ex => (Array.isArray(ex.equipment) ? ex.equipment : [ex.equipment]).includes(eq));
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

    // Fill remaining slots if any
    if (balanced.length < totalSlots) {
      const remaining = filtered.filter(ex => !balanced.includes(ex));
      balanced.push(...shuffle(remaining).slice(0, totalSlots - balanced.length));
    }

    return shuffle(balanced);
  }

  // --- DEFAULT: single equipment or fallback ---
  return shuffle(filtered).slice(0, 15);
};
