import { Exercise, MuscleGroup, Equipment, Workout, TimeFrame, IntensityLevel, BodyPain } from "../types";
import { getFilteredExercises } from "./exercises";

const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

const getExerciseCount = (time: TimeFrame): number => {
  const counts = { 10: 2, 20: 2, 30: 3, 45: 4, 60: 5 };
  return counts[time] || 3;
};

// Preferred order for exercises
const MUSCLE_GROUP_ORDER: MuscleGroup[] = [
  "chest", "back", "legs", "shoulders", "biceps", "triceps", "core", "cardio"
];

const isCompoundExercise = (exercise: Exercise): boolean => {
  const compoundKeywords = [
    'squat', 'deadlift', 'press', 'row', 'pull-up', 'chin-up', 'dip',
    'lunge', 'push-up', 'clean', 'snatch', 'thruster', 'burpee'
  ];
  
  const exerciseName = exercise.name.toLowerCase();
  return compoundKeywords.some(keyword => exerciseName.includes(keyword)) ||
         Array.isArray(exercise.muscleGroup) && exercise.muscleGroup.length > 1;
};

// Check if exercise targets a specific muscle group (not compound)
const targetsSpecificMuscle = (exercise: Exercise, targetMuscle: MuscleGroup): boolean => {
  return exercise.muscleGroup === targetMuscle;
};

// Check if exercise uses specific equipment
const usesEquipment = (exercise: Exercise, equipment: Equipment): boolean => {
  return exercise.equipment.includes(equipment);
};

export const generateWorkout = (
  time: TimeFrame,
  intensity: IntensityLevel,
  muscleGroups: MuscleGroup[],
  equipment: Equipment[],
  bodyPains?: BodyPain[]
): Workout => {
  const maxExercises = getExerciseCount(time);
  
  // Get filtered exercises based on muscle groups, equipment, and intensity
  let filtered = getFilteredExercises(muscleGroups, equipment, intensity);

  // Remove exercises that aggravate body pains
  if (bodyPains && bodyPains.length > 0) {
    const painKeywords: { [key: string]: string[] } = {
      "knee pain": ["squat", "lunge", "jump", "leg press", "leg extension"],
      "shoulder pain": ["overhead press", "shoulder press", "lateral raise", "upright row"],
      "lower back pain": ["deadlift", "bent over row", "good morning"],
      "wrist pain": ["push-up", "plank", "handstand", "wrist curl"],
      "elbow pain": ["tricep extension", "skull crusher", "dip"],
      "hip pain": ["squat", "lunge", "leg press"],
      "ankle pain": ["calf raise", "jump", "running"]
    };
    
    bodyPains.forEach(pain => {
      const keywords = painKeywords[pain] || [];
      filtered = filtered.filter(ex => 
        !keywords.some(keyword => ex.name.toLowerCase().includes(keyword))
      );
    });
  }

  // Add exactly 1 pain relief exercise if bodyPains selected
  let painExercise: Exercise | null = null;
  if (bodyPains && bodyPains.length > 0) {
    // Get all exercises (not just filtered) to find stretch/mobility exercises
    const allExercises = getFilteredExercises(muscleGroups, equipment, intensity);
    const painReliefExercises = allExercises.filter(ex => 
      ex.name.toLowerCase().includes("stretch") || 
      ex.name.toLowerCase().includes("mobility") ||
      ex.description.toLowerCase().includes("relief")
    );
    if (painReliefExercises.length > 0) {
      // Pick a random pain relief exercise
      painExercise = shuffle(painReliefExercises)[0];
    }
  }

  // Select exercises in the preferred muscle group order
  const exerciseCount = painExercise ? maxExercises - 1 : maxExercises;
  const selectedExercises: Exercise[] = [];
  const usedEquipment = new Set<Equipment>();
  
  // Order muscle groups according to preference
  const orderedMuscleGroups = muscleGroups.sort((a, b) => {
    const indexA = MUSCLE_GROUP_ORDER.indexOf(a);
    const indexB = MUSCLE_GROUP_ORDER.indexOf(b);
    return indexA - indexB;
  });
  
  // For each muscle group, find an exercise that specifically targets it
  for (const muscleGroup of orderedMuscleGroups) {
    if (selectedExercises.length >= exerciseCount) break;
    
    // Find exercises that specifically target this muscle group
    const specificExercises = filtered.filter(ex => targetsSpecificMuscle(ex, muscleGroup));
    
    if (specificExercises.length === 0) continue;
    
    // Try to use different equipment for variety
    let selectedExercise: Exercise | null = null;
    
    // First, try to find an exercise with unused equipment
    for (const eq of equipment) {
      if (!usedEquipment.has(eq)) {
        const exercisesWithEquipment = specificExercises.filter(ex => usesEquipment(ex, eq));
        if (exercisesWithEquipment.length > 0) {
          selectedExercise = shuffle(exercisesWithEquipment)[0];
          usedEquipment.add(eq);
          break;
        }
      }
    }
    
    // If no unused equipment found, just pick any exercise for this muscle group
    if (!selectedExercise) {
      selectedExercise = shuffle(specificExercises)[0];
      // Track equipment usage
      selectedExercise.equipment.forEach(eq => usedEquipment.add(eq));
    }
    
    selectedExercises.push(selectedExercise);
  }
  
  // If we still need more exercises, add compound exercises
  if (selectedExercises.length < exerciseCount) {
    const compoundExercises = filtered.filter(ex => 
      isCompoundExercise(ex) && !selectedExercises.includes(ex)
    );
    const remaining = exerciseCount - selectedExercises.length;
    selectedExercises.push(...shuffle(compoundExercises).slice(0, remaining));
  }
  
  // Build final exercise list
  const finalExercises = painExercise 
    ? [...selectedExercises, painExercise]
    : selectedExercises;

  // Generate warmup and cooldown
  const warmupExercises: Exercise[] = [
    {
      id: "warmup-1",
      name: "Dynamic Stretching",
      muscleGroup: "full body",
      equipment: ["none"],
      sets: 1,
      reps: 10,
      restTime: 0,
      description: "Full body dynamic stretches to prepare muscles"
    }
  ];

  const cooldownExercises: Exercise[] = [
    {
      id: "cooldown-1",
      name: "Static Stretching",
      muscleGroup: "full body",
      equipment: ["none"],
      sets: 1,
      reps: 10,
      restTime: 0,
      description: "Hold stretches for 30 seconds each to cool down"
    }
  ];

  return {
    id: `workout-${Date.now()}`,
    title: `${intensity.charAt(0).toUpperCase() + intensity.slice(1)} ${time}min Workout`,
    duration: time,
    intensity,
    targetMuscleGroups: muscleGroups,
    equipment,
    warmupExercises,
    exercises: finalExercises,
    cooldownExercises
  };
};
