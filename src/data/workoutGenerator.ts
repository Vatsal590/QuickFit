import { Exercise, MuscleGroup, Equipment, Workout, TimeFrame, IntensityLevel, BodyPain } from "../types";
import { getFilteredExercises } from "./exercises";

const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

const getExerciseCount = (time: TimeFrame): number => {
  const counts = { 10: 2, 20: 2, 30: 3, 45: 4, 60: 5 };
  return counts[time] || 3;
};

const isCompoundExercise = (exercise: Exercise): boolean => {
  const compoundKeywords = [
    'squat', 'deadlift', 'press', 'row', 'pull-up', 'chin-up', 'dip',
    'lunge', 'push-up', 'clean', 'snatch', 'thruster', 'burpee'
  ];
  
  const exerciseName = exercise.name.toLowerCase();
  return compoundKeywords.some(keyword => exerciseName.includes(keyword)) ||
         Array.isArray(exercise.muscleGroup) && exercise.muscleGroup.length > 1;
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
    const painReliefExercises = filtered.filter(ex => 
      ex.name.toLowerCase().includes("stretch") || 
      ex.name.toLowerCase().includes("mobility") ||
      ex.description.toLowerCase().includes("relief")
    );
    if (painReliefExercises.length > 0) {
      painExercise = painReliefExercises[0];
    }
  }

  // Select main exercises - prioritize compound exercises first
  const compoundExercises = filtered.filter(isCompoundExercise);
  const isolationExercises = filtered.filter(ex => !isCompoundExercise(ex));
  
  const exerciseCount = painExercise ? maxExercises - 1 : maxExercises;
  
  // Get compound exercises first, then isolation to fill remaining slots
  const selectedCompound = shuffle(compoundExercises).slice(0, exerciseCount);
  const remainingSlots = exerciseCount - selectedCompound.length;
  const selectedIsolation = remainingSlots > 0 
    ? shuffle(isolationExercises).slice(0, remainingSlots) 
    : [];
  
  const selectedExercises = [...selectedCompound, ...selectedIsolation];
  
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
