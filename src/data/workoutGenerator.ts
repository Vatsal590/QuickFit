import { v4 as uuidv4 } from 'uuid';
import { Exercise, Equipment, MuscleGroup, IntensityLevel, TimeFrame, Workout } from "../types";
import { exercises, getFilteredExercises } from "./exercises";

// Helper: capitalize first letter
const capitalizeFirstLetter = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

// Generate workout title
const generateWorkoutTitle = (muscleGroups: MuscleGroup[], intensity: IntensityLevel): string => {
  const intensityWords = {
    light: ["Quick", "Gentle", "Basic", "Starter", "Light"],
    moderate: ["Solid", "Standard", "Classic", "Balanced", "Core"],
    intense: ["Ultimate", "Power", "Intense", "Extreme", "Crusher"]
  };
  const word = intensityWords[intensity][Math.floor(Math.random() * intensityWords[intensity].length)];

  if (muscleGroups.length === 1) return `${word} ${capitalizeFirstLetter(muscleGroups[0])} Workout`;
  if (muscleGroups.includes("full body")) return `${word} Full Body Experience`;
  if (muscleGroups.length > 1) return `${word} ${capitalizeFirstLetter(muscleGroups[0])} & More Combo`;
  return `${word} Fitness Session`;
};

// Adjust sets, reps, rest based on intensity and time
const adjustExerciseForIntensity = (exercise: Exercise, intensity: IntensityLevel, timeAvailable: TimeFrame): Exercise => {
  const adjusted = { ...exercise };

  switch (intensity) {
    case "light":
      adjusted.sets = Math.max(2, exercise.sets - 1);
      adjusted.restTime = Math.max(60, exercise.restTime + 15);
      break;
    case "moderate": break;
    case "intense":
      adjusted.sets = exercise.sets + 1;
      adjusted.reps = Math.min(20, exercise.reps + 2);
      adjusted.restTime = Math.max(30, exercise.restTime - 15);
      break;
  }

  if (timeAvailable <= 20) {
    adjusted.sets = Math.min(adjusted.sets, 3);
    adjusted.restTime = Math.min(adjusted.restTime, 45);
  } else if (timeAvailable >= 45) {
    adjusted.sets = Math.max(adjusted.sets, 3);
  }

  return adjusted;
};

// Warmup exercises
const generateWarmupExercises = (equipment: Equipment[]): Exercise[] => {
  const warmup: Exercise[] = [
    { id: uuidv4(), name: "Light Jogging in Place", muscleGroup: "cardio", equipment: ["none"], sets: 1, reps: 60, restTime: 0, description: "Jog lightly in place for 60 seconds." },
    { id: uuidv4(), name: "Arm Circles", muscleGroup: "shoulders", equipment: ["none"], sets: 1, reps: 20, restTime: 0, description: "Small arm circles." },
    { id: uuidv4(), name: "Hip Rotations", muscleGroup: "core", equipment: ["none"], sets: 1, reps: 10, restTime: 0, description: "Rotate hips gently." },
    { id: uuidv4(), name: "Bodyweight Squats", muscleGroup: "legs", equipment: ["none"], sets: 1, reps: 15, restTime: 0, description: "Light squats to warm up legs." },
    { id: uuidv4(), name: "Shoulder Stretches", muscleGroup: "shoulders", equipment: ["none"], sets: 1, reps: 10, restTime: 0, description: "Cross one arm across chest and hold." }
  ];

  // If only "no equipment" selected, return bodyweight warm-ups only
  if (equipment.includes("none") && equipment.length === 1) {
    return warmup.filter(ex => ex.equipment.includes("none")).slice(0, 4);
  }

  return warmup.slice(0, 4);
};

// Cooldown exercises
const generateCooldownExercises = (targetMuscleGroups: MuscleGroup[]): Exercise[] => {
  const cooldown: Exercise[] = [
    { id: uuidv4(), name: "Deep Breathing", muscleGroup: "core", equipment: ["none"], sets: 1, reps: 10, restTime: 0, description: "Deep breaths to lower heart rate." },
    { id: uuidv4(), name: "Quad Stretch", muscleGroup: "legs", equipment: ["none"], sets: 1, reps: 30, restTime: 0, description: "Grab ankle, pull heel to glutes." },
    { id: uuidv4(), name: "Hamstring Stretch", muscleGroup: "legs", equipment: ["none"], sets: 1, reps: 30, restTime: 0, description: "Reach for toes and hold." },
    { id: uuidv4(), name: "Child's Pose", muscleGroup: "back", equipment: ["none"], sets: 1, reps: 60, restTime: 0, description: "Stretch your back." },
    { id: uuidv4(), name: "Shoulder Stretch", muscleGroup: "shoulders", equipment: ["none"], sets: 1, reps: 30, restTime: 0, description: "Pull arm across chest and hold." },
    { id: uuidv4(), name: "Chest Stretch", muscleGroup: "chest", equipment: ["none"], sets: 1, reps: 30, restTime: 0, description: "Clasp hands behind back and lift slightly." }
  ];

  let targetSpecific = cooldown.filter(ex => {
    const exerciseMuscleGroups = Array.isArray(ex.muscleGroup) ? ex.muscleGroup : [ex.muscleGroup];
    return exerciseMuscleGroups.some(mg => targetMuscleGroups.includes(mg));
  });
  if (targetSpecific.length < 3) targetSpecific = [...targetSpecific, ...cooldown.filter(ex => {
    const exerciseMuscleGroups = Array.isArray(ex.muscleGroup) ? ex.muscleGroup : [ex.muscleGroup];
    return !exerciseMuscleGroups.some(mg => targetMuscleGroups.includes(mg));
  })];
  return targetSpecific.slice(0, 4);
};

// Alternative exercises for body pains (fixed to respect equipment)
const getAlternativeExercises = (pain: import('@/types').BodyPain, equipment: Equipment[]): Exercise[] => {
  const hasEquipment = !equipment.includes("none");

  const alternatives: Record<string, Exercise[]> = {
    "knee pain": [
      { id: uuidv4(), name: "Glute Bridges", muscleGroup: "legs", equipment: ["none"], sets: 3, reps: 15, restTime: 60, description: "Lie on back, lift hips." },
      { id: uuidv4(), name: "Clamshells", muscleGroup: "legs", equipment: ["none"], sets: 3, reps: 12, restTime: 45, description: "Side-lying hip exercise." },
      { id: uuidv4(), name: "Deadbugs", muscleGroup: "core", equipment: ["none"], sets: 3, reps: 10, restTime: 45, description: "Core stability on back." }
    ],
    "ankle pain": hasEquipment
      ? [
          { id: uuidv4(), name: "Seated Upper Body Press", muscleGroup: "shoulders", equipment: ["dumbbells"], sets: 3, reps: 12, restTime: 60, description: "Seated shoulder press." },
          { id: uuidv4(), name: "Lying Hamstring Curls", muscleGroup: "legs", equipment: ["resistance bands"], sets: 3, reps: 15, restTime: 60, description: "Hamstring exercise lying down." }
        ]
      : [
          { id: uuidv4(), name: "Glute Bridges", muscleGroup: "legs", equipment: ["none"], sets: 3, reps: 15, restTime: 60, description: "No-equipment hamstring work." },
          { id: uuidv4(), name: "Wall March", muscleGroup: "core", equipment: ["none"], sets: 3, reps: 20, restTime: 45, description: "Drive knees up while leaning on wall." }
        ],
    "hip pain": [
      { id: uuidv4(), name: "Glute Bridges", muscleGroup: "legs", equipment: ["none"], sets: 3, reps: 15, restTime: 60, description: "Hip-safe glute strengthening." },
      { id: uuidv4(), name: "Bird-Dogs", muscleGroup: "core", equipment: ["none"], sets: 3, reps: 8, restTime: 45, description: "Core stability on hands and knees." }
    ],
    "shoulder pain": hasEquipment
      ? [
          { id: uuidv4(), name: "Resistance Band Rows", muscleGroup: "back", equipment: ["resistance bands"], sets: 3, reps: 15, restTime: 60, description: "Low anchor rowing motion." },
          { id: uuidv4(), name: "Supported Bicep Curls", muscleGroup: "biceps", equipment: ["dumbbells"], sets: 3, reps: 12, restTime: 45, description: "Bicep curls with support." }
        ]
      : [
          { id: uuidv4(), name: "Scapular Retractions", muscleGroup: "back", equipment: ["none"], sets: 3, reps: 15, restTime: 45, description: "Squeeze shoulder blades together." },
          { id: uuidv4(), name: "Wall Angels", muscleGroup: "shoulders", equipment: ["none"], sets: 3, reps: 10, restTime: 45, description: "Improve shoulder mobility." }
        ],
    "lower back pain": [
      { id: uuidv4(), name: "Bird-Dogs", muscleGroup: "core", equipment: ["none"], sets: 3, reps: 8, restTime: 45, description: "Safe core strengthening." },
      { id: uuidv4(), name: "Modified Planks", muscleGroup: "core", equipment: ["none"], sets: 3, reps: 30, restTime: 60, description: "Plank with knees down." }
    ],
    "elbow pain": hasEquipment
      ? [
          { id: uuidv4(), name: "Straight Arm Band Pulls", muscleGroup: "back", equipment: ["resistance bands"], sets: 3, reps: 15, restTime: 45, description: "Resistance band exercise." },
          { id: uuidv4(), name: "Wall Sits", muscleGroup: "legs", equipment: ["none"], sets: 3, reps: 30, restTime: 60, description: "Isometric leg exercise." }
        ]
      : [
          { id: uuidv4(), name: "Wall Sits", muscleGroup: "legs", equipment: ["none"], sets: 3, reps: 30, restTime: 60, description: "Isometric leg exercise." },
          { id: uuidv4(), name: "Standing Core Twists", muscleGroup: "core", equipment: ["none"], sets: 3, reps: 20, restTime: 45, description: "Core exercise without arm strain." }
        ],
    "wrist pain": [
      { id: uuidv4(), name: "Standing Core Twists", muscleGroup: "core" as MuscleGroup, equipment: ["none"] as Equipment[], sets: 3, reps: 20, restTime: 45, description: "Core exercise without wrist stress." },
      ...(hasEquipment
        ? [
            { id: uuidv4(), name: "Neutral Grip Band Rows", muscleGroup: "back" as MuscleGroup, equipment: ["resistance bands"] as Equipment[], sets: 3, reps: 15, restTime: 60, description: "Neutral wrist resistance band work." }
          ]
        : [])
    ]
  };

  return alternatives[pain] || [];
};

// Main workout generator
export const generateWorkout = (
  time: TimeFrame,
  intensity: IntensityLevel,
  muscleGroups: MuscleGroup[],
  equipment: Equipment[],
  bodyPains?: import('@/types').BodyPain[]
): Workout => {
  console.log('Generating workout with:', { time, intensity, muscleGroups, equipment });

  let selectedExercises = getFilteredExercises(muscleGroups, equipment, intensity);

  // Respect "no equipment" — only use bodyweight exercises
  if (equipment.includes("none") && equipment.length === 1) {
    selectedExercises = selectedExercises.filter(ex => ex.equipment.includes("none"));
  }

  // Filter by body pains and add suitable alternatives
  if (bodyPains?.length) {
    const painKeywords: Record<string, string[]> = {
      "knee pain": ["squat","lunge","jump","step-up","knee bend","run","box jump"],
      "ankle pain": ["jump","run","lunge","calf raise","burpee","step-up"],
      "hip pain": ["lunge","high knee","leg raise","jump","deep squat","hip thrust"],
      "shoulder pain": ["overhead","push-up","plank","dip","lateral raise","front raise","press"],
      "lower back pain": ["deadlift","toe touch","sit-up","twist","crunch","bend"],
      "elbow pain": ["pull-up","chin-up","push-up","curl","extension","tricep"],
      "wrist pain": ["plank","push-up","bear crawl","curl","press"]
    };

    selectedExercises = selectedExercises.filter(ex =>
      !bodyPains.some(pain =>
        (painKeywords[pain] || []).some(word => ex.name.toLowerCase().includes(word))
      )
    );

    const alternatives = bodyPains.flatMap(pain => getAlternativeExercises(pain, equipment));
    const validAlternatives = equipment.includes("none")
      ? alternatives.filter(ex => ex.equipment.includes("none"))
      : alternatives;

    const existing = new Set(selectedExercises.map(ex => ex.name.toLowerCase()));
    validAlternatives.forEach(ex => {
      if (!existing.has(ex.name.toLowerCase())) selectedExercises.push(ex);
    });
  }

  // Special case: Cable machine workouts for 45 and 60 mins
  if (
    (time === 45 || time === 60) &&
    equipment.includes("cable machine")
  ) {
    const cableExerciseNames = [
      "cable crossover",
      "cable wood chop",
      "face pull",
      "tricep pushdown"
    ];
    
    const cableExercises = selectedExercises.filter(ex =>
      cableExerciseNames.some(name => ex.name.toLowerCase().includes(name))
    );
    
    // If we don't have all 4, find them from the main exercises pool
    const needed = cableExerciseNames.filter(name =>
      !cableExercises.some(ex => ex.name.toLowerCase().includes(name))
    );
    
    if (needed.length > 0) {
      const additional = exercises.filter(ex =>
        needed.some(name => ex.name.toLowerCase().includes(name)) &&
        ex.equipment.includes("cable machine")
      );
      cableExercises.push(...additional);
    }
    
    // Set correct number of sets based on duration
    const sets = time === 60 ? 4 : 3;
    selectedExercises = cableExercises.slice(0, 4).map(ex => ({
      ...ex,
      sets
    }));
  }
  // Special case: Back & Biceps with dumbbells and barbells for 60 mins
  else if (
    time === 60 &&
    muscleGroups.includes("back") &&
    muscleGroups.includes("biceps") &&
    equipment.includes("dumbbells") &&
    equipment.includes("barbell")
  ) {
    // Get back exercises with barbell
    const backExercisesBarbell = selectedExercises.filter(ex => {
      const exerciseMuscleGroups = Array.isArray(ex.muscleGroup) ? ex.muscleGroup : [ex.muscleGroup];
      return exerciseMuscleGroups.includes("back") && ex.equipment.includes("barbell");
    });
    
    // Get back exercises with dumbbell
    const backExercisesDumbbell = selectedExercises.filter(ex => {
      const exerciseMuscleGroups = Array.isArray(ex.muscleGroup) ? ex.muscleGroup : [ex.muscleGroup];
      return exerciseMuscleGroups.includes("back") && 
             ex.equipment.includes("dumbbells") && 
             !ex.equipment.includes("barbell");
    });
    
    // Get bicep exercises
    const bicepExercises = selectedExercises.filter(ex => {
      const exerciseMuscleGroups = Array.isArray(ex.muscleGroup) ? ex.muscleGroup : [ex.muscleGroup];
      return exerciseMuscleGroups.includes("biceps");
    });
    
    // Select 2 barbell back, 1 dumbbell back, 2 bicep
    const selected = [
      ...backExercisesBarbell.slice(0, 2),
      ...backExercisesDumbbell.slice(0, 1),
      ...bicepExercises.slice(0, 2)
    ];
    
    selectedExercises = selected;
  }

  // Ensure at least 3 exercises
  if (selectedExercises.length < 3) {
    const supplementary = getFilteredExercises(["cardio","core"], equipment, intensity);
    const existing = new Set(selectedExercises.map(ex => ex.name));
    selectedExercises.push(...supplementary.filter(ex => !existing.has(ex.name)));
  }

  // Limit exercises based on time
  let maxExercises: number;
  if (time === 10) maxExercises = 1;
  else if (time === 20) maxExercises = 2;
  else if (time === 30) maxExercises = 3;
  else if (time === 45) maxExercises = 4;
  else if (time === 60) maxExercises = 5;
  else maxExercises = 3;

  const adjustedExercises = selectedExercises.slice(0, maxExercises).map(ex => adjustExerciseForIntensity(ex, intensity, time));
  const warmup = generateWarmupExercises(equipment).slice(0,3);
  const cooldown = generateCooldownExercises(muscleGroups).slice(0,3);
  const title = generateWorkoutTitle(muscleGroups, intensity);

  const workout: Workout = {
    id: uuidv4(),
    title,
    duration: time,
    intensity,
    targetMuscleGroups: muscleGroups,
    equipment,
    warmupExercises: warmup,
    exercises: adjustedExercises,
    cooldownExercises: cooldown
  };

  console.log('Generated workout:', workout);
  return workout;
};
