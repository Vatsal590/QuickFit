import { v4 as uuidv4 } from "uuid";
import { Exercise, Equipment, MuscleGroup, IntensityLevel, TimeFrame, Workout } from "../types";
import { exercises, getFilteredExercises } from "./getFilteredExercises";

// Helper: capitalize first letter
const capitalizeFirstLetter = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

// Generate workout title
const generateWorkoutTitle = (muscleGroups: MuscleGroup[], intensity: IntensityLevel): string => {
  const intensityWords = {
    light: ["Quick", "Gentle", "Basic", "Starter", "Light"],
    moderate: ["Solid", "Standard", "Balanced", "Core"],
    intense: ["Power", "Extreme", "Ultimate", "Beast"]
  };

  const word = intensityWords[intensity][Math.floor(Math.random() * intensityWords[intensity].length)];
  if (muscleGroups.length === 1) return `${word} ${capitalizeFirstLetter(muscleGroups[0])} Workout`;
  if (muscleGroups.includes("full body")) return `${word} Full Body Session`;
  if (muscleGroups.length > 1) return `${word} ${capitalizeFirstLetter(muscleGroups[0])} & More Combo`;
  return `${word} Workout`;
};

// Adjust reps/sets/rest based on intensity and time
const adjustExerciseForIntensity = (exercise: Exercise, intensity: IntensityLevel, timeAvailable: TimeFrame): Exercise => {
  const adjusted = { ...exercise };

  if (intensity === "light") {
    adjusted.sets = Math.max(2, exercise.sets - 1);
    adjusted.restTime = Math.max(60, exercise.restTime + 15);
  } else if (intensity === "intense") {
    adjusted.sets = exercise.sets + 1;
    adjusted.reps = Math.min(20, exercise.reps + 2);
    adjusted.restTime = Math.max(30, exercise.restTime - 15);
  }

  if (timeAvailable <= 20) {
    adjusted.sets = Math.min(adjusted.sets, 3);
    adjusted.restTime = Math.min(adjusted.restTime, 45);
  }

  return adjusted;
};

// Warmup & cooldown
const generateWarmupExercises = (equipment: Equipment[]): Exercise[] =>
  exercises.filter(ex => ex.tags?.includes("warmup") && ex.equipment.includes("none")).slice(0, 3);

const generateCooldownExercises = (muscles: MuscleGroup[]): Exercise[] =>
  exercises.filter(ex => ex.tags?.includes("cooldown") && ex.equipment.includes("none")).slice(0, 3);

// ✅ Get one pain-relief exercise from database only
const getPainReliefExercise = (pains: import("@/types").BodyPain[]): Exercise | null => {
  if (!pains || pains.length === 0) return null;

  // Pick the first matching pain tag from DB
  for (const pain of pains) {
    const painTag = pain.replace(/\s+/g, "-");
    const match = exercises.find(
      ex => ex.tags?.includes("pain-relief") && ex.tags?.includes(painTag) && ex.equipment.includes("none")
    );
    if (match) return match;
  }

  // fallback general pain-relief if nothing matches
  const fallback = exercises.find(
    ex => ex.tags?.includes("pain-relief") && ex.tags?.includes("general") && ex.equipment.includes("none")
  );
  return fallback || null;
};

// ✅ Main generator
export const generateWorkout = (
  time: TimeFrame,
  intensity: IntensityLevel,
  muscleGroups: MuscleGroup[],
  equipment: Equipment[],
  bodyPains?: import("@/types").BodyPain[]
): Workout => {
  console.log("Generating workout with:", { time, intensity, muscleGroups, equipment, bodyPains });

  // Number of main exercises
  const timeMap: Record<number, number> = { 10: 2, 20: 2, 30: 3, 45: 4, 60: 5 };
  const maxExercises = timeMap[time] ?? 3;

  // Get filtered pool
  let selected = getFilteredExercises(muscleGroups, equipment, intensity);

  // Remove exercises conflicting with pain
  if (bodyPains && bodyPains.length) {
    const painWords: Record<string, string[]> = {
      "knee pain": ["squat", "lunge", "jump", "step-up"],
      "ankle pain": ["jump", "run", "lunge", "calf raise"],
      "hip pain": ["deep squat", "hip thrust", "lunge"],
      "shoulder pain": ["overhead", "push-up", "press", "dip"],
      "lower back pain": ["deadlift", "crunch", "bend"],
      "elbow pain": ["curl", "extension", "push-up"],
      "wrist pain": ["plank", "push-up", "press"]
    };
    selected = selected.filter(
      ex =>
        !bodyPains.some(pain =>
          (painWords[pain] || []).some(w => ex.name.toLowerCase().includes(w))
        )
    );
  }

  // ✅ Get one pain-relief exercise
  const painExercise = getPainReliefExercise(bodyPains || []);

  // Select exercises for major → smaller muscles
  const ordered: Exercise[] = [];
  const added = new Set<string>();

  muscleGroups.forEach(mg => {
    if (ordered.length >= maxExercises) return;
    const groupEx = selected.filter(ex => {
      const groups = Array.isArray(ex.muscleGroup) ? ex.muscleGroup : [ex.muscleGroup];
      return groups.includes(mg) && !added.has(ex.name);
    });
    if (groupEx.length > 0) {
      ordered.push(groupEx[0]);
      added.add(groupEx[0].name);
    }
  });

  // Fill remaining slots
  selected.forEach(ex => {
    if (ordered.length >= maxExercises) return;
    if (!added.has(ex.name)) {
      const exGroups = Array.isArray(ex.muscleGroup) ? ex.muscleGroup : [ex.muscleGroup];
      if (exGroups.some(g => muscleGroups.includes(g))) {
        ordered.push(ex);
        added.add(ex.name);
      }
    }
  });

  // Build exercise list
  const exercisesFinal: Exercise[] = [];
  if (painExercise) exercisesFinal.push(painExercise);
  const remaining = painExercise ? maxExercises - 1 : maxExercises;
  exercisesFinal.push(...ordered.slice(0, remaining));

  const adjusted = exercisesFinal.map(ex => adjustExerciseForIntensity(ex, intensity, time));
  const warmup = generateWarmupExercises(equipment);
  const cooldown = generateCooldownExercises(muscleGroups);
  const title = generateWorkoutTitle(muscleGroups, intensity);

  return {
    id: uuidv4(),
    title,
    duration: time,
    intensity,
    targetMuscleGroups: muscleGroups,
    equipment,
    warmupExercises: warmup,
    exercises: adjusted,
    cooldownExercises: cooldown
  };
};
