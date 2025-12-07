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

  // If no body pains selected, filter out all stretching/mobility exercises
  if (!bodyPains || bodyPains.length === 0) {
    const stretchingKeywords = ['stretch', 'mobility', 'relief', 'circles', 'rolls', 'twists'];
    filtered = filtered.filter(ex => 
      !stretchingKeywords.some(keyword => 
        ex.name.toLowerCase().includes(keyword) || 
        ex.description.toLowerCase().includes(keyword)
      )
    );
  }

  // Remove exercises that use affected body parts completely
  if (bodyPains && bodyPains.length > 0) {
    const painBodyParts: { [key: string]: string[] } = {
      "knee pain": ["squat", "lunge", "jump", "leg", "knee", "quad", "hamstring", "calf"],
      "shoulder pain": ["shoulder", "overhead", "press", "raise", "row", "pull", "push"],
      "lower back pain": ["deadlift", "row", "back", "lower back", "good morning"],
      "wrist pain": ["push-up", "plank", "handstand", "wrist", "press", "curl"],
      "hip pain": ["squat", "lunge", "leg", "hip", "glute"],
      "ankle pain": ["calf", "jump", "running", "ankle", "leg"]
    };
    
    bodyPains.forEach(pain => {
      const bodyParts = painBodyParts[pain] || [];
      filtered = filtered.filter(ex => 
        !bodyParts.some(part => 
          ex.name.toLowerCase().includes(part) || 
          ex.description.toLowerCase().includes(part)
        )
      );
    });
  }

  // Add bodyweight pain relief exercises ONLY if pains are selected
  const painExercises: Exercise[] = [];
  if (bodyPains && bodyPains.length > 0) {
    const painReliefMap: { [key: string]: Exercise } = {
      "knee pain": {
        id: "knee-stretch",
        name: "Knee Mobility Stretch",
        muscleGroup: "legs",
        equipment: ["none"],
        sets: 2,
        reps: 10,
        restTime: 30,
        description: "Gentle knee circles and flexion exercises for pain relief"
      },
      "shoulder pain": {
        id: "shoulder-stretch",
        name: "Shoulder Mobility Stretch",
        muscleGroup: "shoulders",
        equipment: ["none"],
        sets: 2,
        reps: 10,
        restTime: 30,
        description: "Arm circles and shoulder rolls for pain relief"
      },
      "lower back pain": {
        id: "back-stretch",
        name: "Lower Back Stretch",
        muscleGroup: "back",
        equipment: ["none"],
        sets: 2,
        reps: 10,
        restTime: 30,
        description: "Cat-cow and gentle spinal twists for lower back relief"
      },
      "wrist pain": {
        id: "wrist-stretch",
        name: "Wrist Mobility Stretch",
        muscleGroup: "full body",
        equipment: ["none"],
        sets: 2,
        reps: 10,
        restTime: 30,
        description: "Wrist circles and gentle flexion/extension movements"
      },
      "hip pain": {
        id: "hip-stretch",
        name: "Hip Mobility Stretch",
        muscleGroup: "legs",
        equipment: ["none"],
        sets: 2,
        reps: 10,
        restTime: 30,
        description: "Hip circles and gentle leg swings for hip relief"
      },
      "ankle pain": {
        id: "ankle-stretch",
        name: "Ankle Mobility Stretch",
        muscleGroup: "legs",
        equipment: ["none"],
        sets: 2,
        reps: 10,
        restTime: 30,
        description: "Ankle circles and gentle flexion/extension movements"
      }
    };
    
    bodyPains.forEach(pain => {
      const painExercise = painReliefMap[pain];
      if (painExercise) {
        painExercises.push(painExercise);
      }
    });
  }

  // Select exercises in the preferred muscle group order
  // Only reduce exercise count if we actually have pain exercises to add
  const exerciseCount = (bodyPains && bodyPains.length > 0) 
    ? maxExercises - painExercises.length 
    : maxExercises;
  const selectedExercises: Exercise[] = [];
  const usedEquipment = new Set<Equipment>();
  const coveredMuscles = new Set<MuscleGroup>();
  
  // Order muscle groups according to preference
  const orderedMuscleGroups = muscleGroups.sort((a, b) => {
    const indexA = MUSCLE_GROUP_ORDER.indexOf(a);
    const indexB = MUSCLE_GROUP_ORDER.indexOf(b);
    return indexA - indexB;
  });

  // PRIORITY: Add pull-up if pull-up bar is selected AND back/biceps/full body is targeted
  const hasPullUpBar = equipment.includes("pull-up bar");
  const targetsPullUpMuscles = muscleGroups.some(mg => 
    mg === "back" || mg === "biceps" || mg === "full body"
  );
  
  if (hasPullUpBar && targetsPullUpMuscles && selectedExercises.length < exerciseCount) {
    const pullUpExercise = filtered.find(ex => ex.id === "pull-up");
    if (pullUpExercise) {
      selectedExercises.push(pullUpExercise);
      usedEquipment.add("pull-up bar");
      coveredMuscles.add("back");
      if (muscleGroups.includes("biceps")) coveredMuscles.add("biceps");
    }
  }

  // FIRST PASS: Ensure each selected muscle group gets ONE exercise with selected equipment
  for (const muscleGroup of orderedMuscleGroups) {
    if (selectedExercises.length >= exerciseCount) break;
    if (coveredMuscles.has(muscleGroup)) continue;
    
    // Find exercises that target this specific muscle group
    const muscleExercises = filtered.filter(ex => {
      const targetsMuscle = ex.muscleGroup === muscleGroup || 
                           (Array.isArray(ex.muscleGroup) && ex.muscleGroup.includes(muscleGroup));
      return targetsMuscle && !selectedExercises.includes(ex);
    });
    
    if (muscleExercises.length === 0) continue;
    
    // Prioritize compound exercises first
    const compounds = muscleExercises.filter(ex => isCompoundExercise(ex));
    const isolations = muscleExercises.filter(ex => !isCompoundExercise(ex));
    const prioritizedExercises = [...compounds, ...isolations];
    
    let selectedExercise: Exercise | null = null;
    
    // Try to find an exercise with unused equipment for variety
    for (const eq of equipment) {
      if (!usedEquipment.has(eq)) {
        const exercisesWithEquipment = prioritizedExercises.filter(ex => usesEquipment(ex, eq));
        if (exercisesWithEquipment.length > 0) {
          selectedExercise = shuffle(exercisesWithEquipment)[0];
          usedEquipment.add(eq);
          break;
        }
      }
    }
    
    // If no unused equipment found, pick any exercise for this muscle
    if (!selectedExercise) {
      selectedExercise = shuffle(prioritizedExercises)[0];
      selectedExercise.equipment.forEach(eq => usedEquipment.add(eq));
    }
    
    selectedExercises.push(selectedExercise);
    coveredMuscles.add(muscleGroup);
  }
  
  // SECOND PASS: Fill remaining slots with additional exercises for covered muscles
  if (selectedExercises.length < exerciseCount) {
    for (const muscleGroup of orderedMuscleGroups) {
      if (selectedExercises.length >= exerciseCount) break;
      
      const additionalExercises = filtered.filter(ex => {
        const targetsMuscle = ex.muscleGroup === muscleGroup || 
                             (Array.isArray(ex.muscleGroup) && ex.muscleGroup.includes(muscleGroup));
        return targetsMuscle && !selectedExercises.includes(ex);
      });
      
      if (additionalExercises.length === 0) continue;
      
      let selectedExercise: Exercise | null = null;
      
      // Try to use different equipment
      for (const eq of equipment) {
        if (!usedEquipment.has(eq)) {
          const exercisesWithEquipment = additionalExercises.filter(ex => usesEquipment(ex, eq));
          if (exercisesWithEquipment.length > 0) {
            selectedExercise = shuffle(exercisesWithEquipment)[0];
            usedEquipment.add(eq);
            break;
          }
        }
      }
      
      if (!selectedExercise) {
        selectedExercise = shuffle(additionalExercises)[0];
      }
      
      selectedExercises.push(selectedExercise);
    }
  }
  
  // THIRD PASS: If still need more, add any remaining exercises
  if (selectedExercises.length < exerciseCount) {
    const remainingExercises = filtered.filter(ex => !selectedExercises.includes(ex));
    const remaining = exerciseCount - selectedExercises.length;
    selectedExercises.push(...shuffle(remainingExercises).slice(0, remaining));
  }
  
  // Build final exercise list - add pain exercises at the end
  const finalExercises = [...selectedExercises, ...painExercises];

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
