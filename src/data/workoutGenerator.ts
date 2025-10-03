
import { v4 as uuidv4 } from 'uuid';
import { Exercise, Equipment, MuscleGroup, IntensityLevel, TimeFrame, Workout, WorkoutFormData } from "../types";
import { exercises, getFilteredExercises } from "./exercises";

// Workout title generator
const generateWorkoutTitle = (muscleGroups: MuscleGroup[], intensity: IntensityLevel): string => {
  const intensityWords = {
    light: ["Quick", "Gentle", "Basic", "Starter", "Light"],
    moderate: ["Solid", "Standard", "Classic", "Balanced", "Core"],
    intense: ["Ultimate", "Power", "Intense", "Extreme", "Crusher"]
  };
  
  const randomIntensityWord = intensityWords[intensity][Math.floor(Math.random() * intensityWords[intensity].length)];
  
  if (muscleGroups.length === 1) {
    return `${randomIntensityWord} ${capitalizeFirstLetter(muscleGroups[0])} Workout`;
  } else if (muscleGroups.includes("full body")) {
    return `${randomIntensityWord} Full Body Experience`;
  } else if (muscleGroups.length > 1) {
    const primaryMuscle = muscleGroups[0];
    return `${randomIntensityWord} ${capitalizeFirstLetter(primaryMuscle)} & More Combo`;
  }
  
  return `${randomIntensityWord} Fitness Session`;
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Adjust sets, reps and rest time based on intensity
const adjustExerciseForIntensity = (
  exercise: Exercise, 
  intensity: IntensityLevel, 
  timeAvailable: TimeFrame
): Exercise => {
  const adjustedExercise = { ...exercise };
  
  // Adjust based on intensity
  switch (intensity) {
    case "light":
      adjustedExercise.sets = Math.max(2, exercise.sets - 1);
      adjustedExercise.restTime = Math.max(60, exercise.restTime + 15);
      break;
    case "moderate":
      // Keep default values
      break;
    case "intense":
      adjustedExercise.sets = exercise.sets + 1;
      adjustedExercise.reps = Math.min(20, exercise.reps + 2);
      adjustedExercise.restTime = Math.max(30, exercise.restTime - 15);
      break;
  }
  
  // Further adjust based on available time
  if (timeAvailable <= 20) {
    adjustedExercise.sets = Math.min(adjustedExercise.sets, 3);
    adjustedExercise.restTime = Math.min(adjustedExercise.restTime, 45);
  } else if (timeAvailable >= 45) {
    adjustedExercise.sets = Math.max(adjustedExercise.sets, 3);
  }
  
  return adjustedExercise;
};

// Generate warmup exercises
const generateWarmupExercises = (equipment: Equipment[]): Exercise[] => {
  const warmupExercises: Exercise[] = [
    {
      id: uuidv4(),
      name: "Light Jogging in Place",
      muscleGroup: "cardio",
      equipment: ["none"],
      sets: 1,
      reps: 60, // seconds
      restTime: 0,
      description: "Jog lightly in place for 60 seconds to increase your heart rate and warm up your muscles."
    },
    {
      id: uuidv4(),
      name: "Arm Circles",
      muscleGroup: "shoulders",
      equipment: ["none"],
      sets: 1,
      reps: 20,
      restTime: 0,
      description: "Extend arms to the sides and make small circles, gradually increasing in size."
    },
    {
      id: uuidv4(),
      name: "Hip Rotations",
      muscleGroup: "core",
      equipment: ["none"],
      sets: 1,
      reps: 10,
      restTime: 0,
      description: "Stand on one leg and rotate the other leg at the hip, then switch sides."
    },
    {
      id: uuidv4(),
      name: "Bodyweight Squats",
      muscleGroup: "legs",
      equipment: ["none"],
      sets: 1,
      reps: 15,
      restTime: 0,
      description: "Perform light squats to warm up your legs and increase blood flow."
    },
    {
      id: uuidv4(),
      name: "Shoulder Stretches",
      muscleGroup: "shoulders",
      equipment: ["none"],
      sets: 1,
      reps: 10,
      restTime: 0,
      description: "Cross one arm across your chest and hold, then switch arms."
    }
  ];
  
  // Select 3-4 warmup exercises
  return warmupExercises.slice(0, 4);
};

// Generate cooldown exercises
const generateCooldownExercises = (targetMuscleGroups: MuscleGroup[]): Exercise[] => {
  const cooldownExercises: Exercise[] = [
    {
      id: uuidv4(),
      name: "Deep Breathing",
      muscleGroup: "core",
      equipment: ["none"],
      sets: 1,
      reps: 10,
      restTime: 0,
      description: "Deep breaths in through the nose, out through the mouth to lower heart rate."
    },
    {
      id: uuidv4(),
      name: "Quad Stretch",
      muscleGroup: "legs",
      equipment: ["none"],
      sets: 1,
      reps: 30, // seconds per side
      restTime: 0,
      description: "Stand on one leg, grab your ankle and pull your heel toward your glutes."
    },
    {
      id: uuidv4(),
      name: "Hamstring Stretch",
      muscleGroup: "legs",
      equipment: ["none"],
      sets: 1,
      reps: 30, // seconds per side
      restTime: 0,
      description: "Sit with one leg extended, reach toward your toes and hold."
    },
    {
      id: uuidv4(),
      name: "Child's Pose",
      muscleGroup: "back",
      equipment: ["none"],
      sets: 1,
      reps: 60, // seconds
      restTime: 0,
      description: "Kneel and extend arms forward on the floor, stretching your back."
    },
    {
      id: uuidv4(),
      name: "Shoulder Stretch",
      muscleGroup: "shoulders",
      equipment: ["none"],
      sets: 1,
      reps: 30, // seconds per side
      restTime: 0,
      description: "Pull your arm across your chest and hold with your other arm."
    },
    {
      id: uuidv4(),
      name: "Chest Stretch",
      muscleGroup: "chest",
      equipment: ["none"],
      sets: 1,
      reps: 30, // seconds
      restTime: 0,
      description: "Clasp hands behind your back and lift slightly to stretch your chest."
    }
  ];
  
  // Filter cooldown exercises to match some of the target muscle groups
  let targetSpecificCooldowns = cooldownExercises.filter(ex => 
    targetMuscleGroups.includes(ex.muscleGroup)
  );
  
  // If we don't have enough specific stretches, add some general ones
  if (targetSpecificCooldowns.length < 3) {
    const generalCooldowns = cooldownExercises.filter(ex => 
      !targetMuscleGroups.includes(ex.muscleGroup)
    );
    targetSpecificCooldowns = [...targetSpecificCooldowns, ...generalCooldowns];
  }
  
  // Select 3-4 cooldown exercises
  return targetSpecificCooldowns.slice(0, 4);
};

// Get alternative exercises for pain conditions
const getAlternativeExercises = (pain: import('@/types').BodyPain, equipment: Equipment[]): Exercise[] => {
  const alternatives: Record<string, Exercise[]> = {
    "knee pain": [
      {
        id: uuidv4(),
        name: "Glute Bridges",
        muscleGroup: "legs",
        equipment: ["none"],
        sets: 3,
        reps: 15,
        restTime: 60,
        description: "Lie on back, lift hips by squeezing glutes."
      },
      {
        id: uuidv4(),
        name: "Clamshells",
        muscleGroup: "legs",
        equipment: ["none"],
        sets: 3,
        reps: 12,
        restTime: 45,
        description: "Side-lying leg exercise targeting hip abductors."
      },
      {
        id: uuidv4(),
        name: "Deadbugs",
        muscleGroup: "core",
        equipment: ["none"],
        sets: 3,
        reps: 10,
        restTime: 45,
        description: "Core stability exercise lying on back."
      }
    ],
    "ankle pain": [
      {
        id: uuidv4(),
        name: "Seated Upper Body Press",
        muscleGroup: "shoulders",
        equipment: equipment.includes("dumbbells") ? ["dumbbells"] : ["resistance bands"],
        sets: 3,
        reps: 12,
        restTime: 60,
        description: "Seated shoulder press to avoid ankle stress."
      },
      {
        id: uuidv4(),
        name: "Lying Hamstring Curls",
        muscleGroup: "legs",
        equipment: ["resistance bands"],
        sets: 3,
        reps: 15,
        restTime: 60,
        description: "Hamstring exercise lying down."
      }
    ],
    "hip pain": [
      {
        id: uuidv4(),
        name: "Glute Bridges",
        muscleGroup: "legs",
        equipment: ["none"],
        sets: 3,
        reps: 15,
        restTime: 60,
        description: "Hip-safe glute strengthening."
      },
      {
        id: uuidv4(),
        name: "Bird-Dogs",
        muscleGroup: "core",
        equipment: ["none"],
        sets: 3,
        reps: 8,
        restTime: 45,
        description: "Core stability on hands and knees."
      }
    ],
    "shoulder pain": [
      {
        id: uuidv4(),
        name: "Resistance Band Rows",
        muscleGroup: "back",
        equipment: ["resistance bands"],
        sets: 3,
        reps: 15,
        restTime: 60,
        description: "Low anchor point rowing motion."
      },
      {
        id: uuidv4(),
        name: "Supported Bicep Curls",
        muscleGroup: "biceps",
        equipment: equipment.includes("dumbbells") ? ["dumbbells"] : ["resistance bands"],
        sets: 3,
        reps: 12,
        restTime: 45,
        description: "Bicep curls with arm support."
      }
    ],
    "lower back pain": [
      {
        id: uuidv4(),
        name: "Bird-Dogs",
        muscleGroup: "core",
        equipment: ["none"],
        sets: 3,
        reps: 8,
        restTime: 45,
        description: "Safe core strengthening exercise."
      },
      {
        id: uuidv4(),
        name: "Modified Planks",
        muscleGroup: "core",
        equipment: ["none"],
        sets: 3,
        reps: 30,
        restTime: 60,
        description: "Plank with knees down for back safety."
      }
    ],
    "elbow pain": [
      {
        id: uuidv4(),
        name: "Wall Sits",
        muscleGroup: "legs",
        equipment: ["none"],
        sets: 3,
        reps: 30,
        restTime: 60,
        description: "Isometric leg exercise against wall."
      },
      {
        id: uuidv4(),
        name: "Straight Arm Band Pulls",
        muscleGroup: "back",
        equipment: ["resistance bands"],
        sets: 3,
        reps: 15,
        restTime: 45,
        description: "Resistance band exercise with straight arms."
      }
    ],
    "wrist pain": [
      {
        id: uuidv4(),
        name: "Standing Core Twists",
        muscleGroup: "core",
        equipment: ["none"],
        sets: 3,
        reps: 20,
        restTime: 45,
        description: "Core exercise without wrist weight-bearing."
      },
      {
        id: uuidv4(),
        name: "Neutral Grip Band Exercises",
        muscleGroup: "back",
        equipment: ["resistance bands"],
        sets: 3,
        reps: 15,
        restTime: 60,
        description: "Resistance band work with neutral wrist."
      }
    ]
  };

  return alternatives[pain] || [];
};

export const generateWorkout = (
  time: TimeFrame,
  intensity: IntensityLevel,
  muscleGroups: MuscleGroup[],
  equipment: Equipment[],
  bodyPains?: import('@/types').BodyPain[]
): Workout => {
  console.log('Generating workout with:', { time, intensity, muscleGroups, equipment });
  
  // Get filtered exercises based on muscle groups, equipment, and intensity
  let selectedExercises = getFilteredExercises(muscleGroups, equipment, intensity);

  // Filter out exercises that could aggravate body pains
  if (bodyPains && bodyPains.length > 0) {
    selectedExercises = selectedExercises.filter((exercise: Exercise) => {
      const exerciseName = exercise.name.toLowerCase();
      
      // Define problematic exercises for each pain type based on detailed guidance
      const painExercises = {
        "knee pain": ["squat", "lunge", "jump", "step-up", "knee bend", "run", "box jump"],
        "ankle pain": ["jump", "run", "lunge", "calf raise", "burpee", "step-up"],
        "hip pain": ["lunge", "high knee", "leg raise", "jump", "deep squat", "hip thrust"],
        "shoulder pain": ["overhead", "push-up", "plank", "dip", "lateral raise", "front raise", "press"],
        "lower back pain": ["deadlift", "toe touch", "sit-up", "twist", "crunch", "bend"],
        "elbow pain": ["pull-up", "chin-up", "push-up", "curl", "extension", "tricep"],
        "wrist pain": ["plank", "push-up", "bear crawl", "curl", "press"]
      };

      // Check if exercise contains any problematic keywords for user's pains
      return !bodyPains.some(pain => {
        const problematicWords = painExercises[pain] || [];
        return problematicWords.some(word => exerciseName.includes(word));
      });
    });

    // Add recommended alternative exercises for each pain type
    const alternativeExercises: Exercise[] = [];
    
    bodyPains.forEach(pain => {
      const alternatives = getAlternativeExercises(pain, equipment);
      alternativeExercises.push(...alternatives);
    });

    // Merge alternatives with filtered exercises, avoiding duplicates
    const exerciseNames = selectedExercises.map(ex => ex.name.toLowerCase());
    const uniqueAlternatives = alternativeExercises.filter(alt => 
      !exerciseNames.includes(alt.name.toLowerCase())
    );
    
    selectedExercises = [...selectedExercises, ...uniqueAlternatives];
  }
  
  // Special handling for barbell full body workouts
  if (muscleGroups.includes("full body") && equipment.includes("barbell")) {
    const barbellExercises = exercises.filter(ex => 
      ex.equipment.includes("barbell") && 
      (ex.muscleGroup === "chest" || ex.muscleGroup === "back" || ex.muscleGroup === "legs" || ex.muscleGroup === "shoulders" || ex.muscleGroup === "biceps" || ex.muscleGroup === "triceps")
    );
    
    const bodyweightExercises = exercises.filter(ex => 
      ex.equipment.includes("none") && 
      (ex.muscleGroup === "core" || ex.muscleGroup === "full body")
    );
    
    // Prioritize barbell exercises (80%) with some bodyweight for variety (20%)
    const totalExercises = Math.min(10, barbellExercises.length + bodyweightExercises.length);
    const barbellCount = Math.ceil(totalExercises * 0.8);
    const bodyweightCount = totalExercises - barbellCount;
    
    selectedExercises = [
      ...barbellExercises.slice(0, barbellCount),
      ...bodyweightExercises.slice(0, bodyweightCount)
    ].sort(() => 0.5 - Math.random());
  }
  
  // Special handling for biceps + dumbbells workouts - MUST come before general dumbbell logic
  if (muscleGroups.includes("biceps") && muscleGroups.length === 1 && equipment.includes("dumbbells")) {
    const bicepCurl = exercises.find(ex => ex.id === "dumbbell-bicep-curl");
    const hammerCurl = exercises.find(ex => ex.id === "hammer-curl");
    
    if (time === 10) {
      // 10 mins: Only dumbbell bicep curls
      selectedExercises = bicepCurl ? [bicepCurl] : selectedExercises;
    } else if (time === 20 || time === 30) {
      // 20 and 30 mins: Dumbbell bicep curls and hammer curls
      selectedExercises = [];
      if (bicepCurl) selectedExercises.push(bicepCurl);
      if (hammerCurl) selectedExercises.push(hammerCurl);
    }
    // For other time durations, use default logic
  } 
  // Special handling for dumbbell workouts - vary based on time
  else if (equipment.includes("dumbbells") && !equipment.includes("none")) {
    const dumbbellExercises = exercises.filter(ex => 
      ex.equipment.includes("dumbbells") && 
      (muscleGroups.includes("full body") ? true : muscleGroups.includes(ex.muscleGroup))
    );
    
    // Create different exercise pools based on time
    let exercisePool: Exercise[] = [];
    
    if (time <= 20) {
      // Short workout - focus on compound movements
      exercisePool = dumbbellExercises.filter(ex => 
        ex.muscleGroup === "full body" || 
        ex.name.includes("Thruster") || 
        ex.name.includes("Clean") || 
        ex.name.includes("Squat") ||
        ex.name.includes("Row")
      );
    } else if (time <= 30) {
      // Medium workout - mix of compound and isolation
      exercisePool = dumbbellExercises.filter(ex => 
        ex.muscleGroup === "full body" || 
        ex.muscleGroup === "chest" || 
        ex.muscleGroup === "back" || 
        ex.muscleGroup === "legs"
      );
    } else {
      // Longer workout - full variety
      exercisePool = dumbbellExercises;
    }
    
    selectedExercises = exercisePool.sort(() => 0.5 - Math.random());
  }
  
  // If we don't have enough exercises, add some cardio or core exercises
  if (selectedExercises.length < 3) {
    const supplementaryExercises = getFilteredExercises(
      ["cardio", "core"], 
      equipment,
      intensity
    );
    selectedExercises = [
      ...selectedExercises, 
      ...supplementaryExercises.filter(ex => !selectedExercises.includes(ex))
    ];
  }
  
  // Set specific exercise count based on time frame - EXACTLY as requested
  let maxExercises: number;
  if (time === 30) {
    maxExercises = Math.random() < 0.5 ? 3 : 4; // Randomly choose 3 or 4 for 30min
  } else if (time === 45) {
    maxExercises = 4; // Exactly 4 for 45 minutes
  } else if (time === 60) {
    // For chest exercises, user wants AT LEAST 5 exercises for 60 minutes
    if (muscleGroups.includes("chest")) {
      maxExercises = Math.max(5, selectedExercises.length); // Ensure at least 5 for chest
    } else {
      maxExercises = 6;
    }
  } else {
    // For 10min and 20min workouts
    maxExercises = time <= 20 ? 2 : 3;
  }

  // Chest selection rules
  if (muscleGroups.includes("chest")) {
    // Remove bodyweight chest movements when dumbbells and/or barbell are selected
    const hasDumbbells = equipment.includes("dumbbells");
    const hasBarbell = equipment.includes("barbell");
    const hasCable = equipment.includes("cable machine");

    if (hasDumbbells || hasBarbell) {
      selectedExercises = selectedExercises.filter(ex => {
        if (ex.muscleGroup !== "chest") return true;
        const isBodyweightChest = ex.equipment.length === 1 && ex.equipment.includes("none");
        return !isBodyweightChest;
      });
    }

    // Ensure a fly if dumbbells only, or bench press if barbell included
    const ensureExercise = (id: string) => {
      const exists = selectedExercises.some(ex => ex.id === id);
      if (!exists) {
        const found = exercises.find(ex => ex.id === id);
        if (found) selectedExercises.unshift(found);
      }
    };

    if (hasDumbbells && !hasBarbell) {
      ensureExercise("dumbbell-chest-fly");
    }
    if (hasBarbell) {
      ensureExercise("barbell-bench-press");
    }

    // If cable machine is available, include cable chest fly
    if (hasCable) {
      ensureExercise("cable-chest-fly");
    }
  }

  // Special ordering for back exercises when specific equipment is available
  if (muscleGroups.includes("back") && 
      equipment.includes("barbell") && 
      equipment.includes("dumbbells") && 
      equipment.includes("pull-up bar")) {
    
    // Define specific order: pullups, deadlifts, bent over rows, hammer curls, bicep curls
    const orderedBackExercises: Exercise[] = [];
    
    // 1. Pull-ups
    const pullUp = exercises.find(ex => ex.id === "pull-up");
    if (pullUp) orderedBackExercises.push(pullUp);
    
    // 2. Deadlifts
    const deadlift = exercises.find(ex => ex.id === "barbell-deadlift");
    if (deadlift) orderedBackExercises.push(deadlift);
    
    // 3. Bent over rows
    const bentOverRow = exercises.find(ex => ex.id === "bent-over-row");
    if (bentOverRow) orderedBackExercises.push(bentOverRow);
    
    // 4. Hammer curls
    const hammerCurl = exercises.find(ex => ex.id === "hammer-curl");
    if (hammerCurl) orderedBackExercises.push(hammerCurl);
    
    // 5. Bicep curls
    const bicepCurl = exercises.find(ex => ex.id === "dumbbell-bicep-curl");
    if (bicepCurl) orderedBackExercises.push(bicepCurl);
    
    // Use the ordered exercises and limit to maxExercises
    selectedExercises = orderedBackExercises.slice(0, maxExercises);
  }
  
  const limitedExercises = selectedExercises.slice(0, maxExercises);
  
  // Adjust exercises for the given intensity and time
  const adjustedExercises = limitedExercises.map(ex => 
    adjustExerciseForIntensity(ex, intensity, time)
  );
  
  // Generate warmup and cooldown exercises
  const warmupExercises = generateWarmupExercises(equipment).slice(0, 3);
  const cooldownExercises = generateCooldownExercises(muscleGroups).slice(0, 3);
  
  // Generate a workout title
  const title = generateWorkoutTitle(muscleGroups, intensity);
  
  // Create the workout object - duration EXACTLY matches selected time
  const workout: Workout = {
    id: uuidv4(),
    title,
    duration: time, // This MUST exactly match the time parameter
    intensity,
    targetMuscleGroups: muscleGroups,
    equipment,
    warmupExercises,
    exercises: adjustedExercises,
    cooldownExercises
  };
  
  console.log('Generated workout:', workout);
  console.log(`Workout duration set to: ${workout.duration} minutes (matches selected time: ${time})`);
  return workout;
};
