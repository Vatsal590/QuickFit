import { Exercise, MuscleGroup, Equipment } from "./types";
import { exercises } from "./exercises";

const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

export const generateWorkout = (
  targetMuscleGroups: MuscleGroup[],
  availableEquipment: Equipment[],
  intensity: string
): Exercise[] => {
  const selectedEquipment = availableEquipment
    .filter(eq => eq !== "none")
    .map(eq => eq.toLowerCase());

  // normalize function
  const normalizeEquipment = (eqs: string | string[]) => {
    const arr = Array.isArray(eqs) ? eqs : [eqs];
    return arr.map(e => e.toLowerCase()).filter(e => e !== "bench");
  };

  const isWeightsSelected = selectedEquipment.some(se =>
    ["dumbbells", "barbell", "kettlebell"].includes(se)
  );

  let filtered = exercises.filter(ex => {
    const muscles = Array.isArray(ex.muscleGroup) ? ex.muscleGroup : [ex.muscleGroup];
    const matchesMuscle =
      targetMuscleGroups.includes("full body") || muscles.some(mg => targetMuscleGroups.includes(mg));
    if (!matchesMuscle) return false;

    const eqs = normalizeEquipment(ex.equipment);
    if (eqs.includes("none")) return true; // bodyweight exercises always allowed

    // weights substitution
    if (eqs.every(eq => ["dumbbells","barbell","kettlebell"].includes(eq))) {
      return isWeightsSelected;
    }

    return eqs.every(eq => selectedEquipment.includes(eq));
  });

  // fallback to bodyweight if empty
  if (filtered.length === 0) {
    filtered = exercises.filter(ex => {
      const muscles = Array.isArray(ex.muscleGroup) ? ex.muscleGroup : [ex.muscleGroup];
      const matchesMuscle = muscles.some(mg => targetMuscleGroups.includes(mg));
      const eqs = normalizeEquipment(ex.equipment);
      return matchesMuscle && eqs.includes("none");
    });
  }

  // biceps/triceps split
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

  // equipment balancing for multiple equipment
  if (selectedEquipment.length > 1) {
    const exercisesByEquipment: { [key: string]: Exercise[] } = {};
    selectedEquipment.forEach(eq => {
      exercisesByEquipment[eq] = filtered.filter(ex => {
        const eqs = normalizeEquipment(ex.equipment);
        if (eqs.includes("none")) return true;
        if (["dumbbells","barbell","kettlebell"].includes(eq)) {
          return eqs.every(e => ["dumbbells","barbell","kettlebell"].includes(e));
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

    // fill remaining
    if (balanced.length < totalSlots) {
      const remaining = filtered.filter(ex => !balanced.includes(ex));
      balanced.push(...shuffle(remaining).slice(0, totalSlots - balanced.length));
    }

    return shuffle(balanced);
  }

  return shuffle(filtered).slice(0, 15);
};
