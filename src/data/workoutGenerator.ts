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

  // Store pain relief exercises separately - they will ALWAYS be included
  let painReliefExercises: Exercise[] = [];
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

    // Get pain relief exercises - equipment doesn't matter for these
    const alternatives = bodyPains.flatMap(pain => getAlternativeExercises(pain, equipment));
    painReliefExercises = alternatives.slice(0, 2); // Take up to 2 pain relief exercises
  }

  // Special case: Cable machine + Back + Biceps
  if (
    equipment.includes("cable machine") &&
    muscleGroups.includes("back") &&
    muscleGroups.includes("biceps")
  ) {
    const targetExerciseNames = [
      "lat pulldown",
      "cable pulldown",
      "face pull",
      "cable hammer curl",
      "cable bicep curl"
    ];
    
    const targetExercises = selectedExercises.filter(ex =>
      targetExerciseNames.some(name => ex.name.toLowerCase().includes(name))
    );
    
    // If we don't have all exercises, find them from the main exercises pool
    const needed = targetExerciseNames.filter(name =>
      !targetExercises.some(ex => ex.name.toLowerCase().includes(name))
    );
    
    if (needed.length > 0) {
      const additional = exercises.filter(ex =>
        needed.some(name => ex.name.toLowerCase().includes(name)) &&
        ex.equipment.includes("cable machine")
      );
      targetExercises.push(...additional);
    }
    
    selectedExercises = targetExercises.slice(0, 5);
  }
  // Special case: Cable machine + Biceps only
  else if (
    equipment.includes("cable machine") &&
    muscleGroups.includes("biceps") &&
    !muscleGroups.includes("back")
  ) {
    const bicepExerciseNames = [
      "cable hammer curl",
      "cable bicep curl"
    ];
    
    const bicepExercises = selectedExercises.filter(ex =>
      bicepExerciseNames.some(name => ex.name.toLowerCase().includes(name))
    );
    
    // If we don't have both, find them from the main exercises pool
    const needed = bicepExerciseNames.filter(name =>
      !bicepExercises.some(ex => ex.name.toLowerCase().includes(name))
    );
    
    if (needed.length > 0) {
      const additional = exercises.filter(ex =>
        needed.some(name => ex.name.toLowerCase().includes(name)) &&
        ex.equipment.includes("cable machine")
      );
      bicepExercises.push(...additional);
    }
    
    selectedExercises = bicepExercises.slice(0, 2);
  }
  // Special case: Cable machine workouts for 45 and 60 mins (full body) - only when cable machine is primary equipment
  else if (
    (time === 45 || time === 60) &&
    equipment.includes("cable machine") &&
    muscleGroups.includes("full body") &&
    (equipment.length === 1 || (equipment.length === 2 && equipment.includes("none")))
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
  // Special case: Barbell full body for any time frame
  else if (
    equipment.includes("barbell") &&
    muscleGroups.includes("full body")
  ) {
    const targetCount = time === 60 ? 5 : time === 45 ? 4 : time === 30 ? 3 : time === 20 ? 2 : 1;

    const barbellFromSelected = selectedExercises.filter(ex => ex.equipment.includes("barbell"));
    let barbellExercises = [...barbellFromSelected];

    if (barbellExercises.length < targetCount) {
      const additional = exercises.filter(ex => ex.equipment.includes("barbell"));
      const existing = new Set(barbellExercises.map(ex => ex.name.toLowerCase()));
      additional.forEach(ex => {
        if (!existing.has(ex.name.toLowerCase())) {
          barbellExercises.push(ex);
          existing.add(ex.name.toLowerCase());
        }
      });
    }

    const priorityGroups: MuscleGroup[] = ["legs","chest","back","shoulders","core"];
    const diversified: Exercise[] = [];
    const used = new Set<string>();
    const byGroup = new Map<MuscleGroup, Exercise[]>();
    barbellExercises.forEach(ex => {
      const groups = Array.isArray(ex.muscleGroup) ? ex.muscleGroup : [ex.muscleGroup];
      groups.forEach(g => {
        if (!byGroup.has(g)) byGroup.set(g, []);
        byGroup.get(g)!.push(ex);
      });
    });
    priorityGroups.forEach(g => {
      if (diversified.length < targetCount) {
        const list = byGroup.get(g) || [];
        const ex = list.find(e => !used.has(e.name.toLowerCase()));
        if (ex) {
          diversified.push(ex);
          used.add(ex.name.toLowerCase());
        }
      }
    });
    barbellExercises.forEach(ex => {
      if (diversified.length < targetCount && !used.has(ex.name.toLowerCase())) {
        diversified.push(ex);
        used.add(ex.name.toLowerCase());
      }
    });

    selectedExercises = diversified.slice(0, targetCount);
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

  // Determine max exercises based on time (accounting for pain relief exercises)
  let maxExercises: number;
  const painReliefCount = painReliefExercises.length;
  if (time === 10) maxExercises = Math.max(1, 1 - painReliefCount);
  else if (time === 20) maxExercises = Math.max(1, 2 - painReliefCount);
  else if (time === 30) maxExercises = Math.max(1, 3 - painReliefCount);
  else if (time === 45) maxExercises = Math.max(2, 4 - painReliefCount);
  else if (time === 60) maxExercises = Math.max(3, 5 - painReliefCount);
  else maxExercises = Math.max(1, 3 - painReliefCount);

  // Equipment-based splitting logic (only for multi-equipment selections)
  const hasMultipleEquipment = equipment.length > 1 && !equipment.every(e => e === "none");
  
  if (hasMultipleEquipment && !equipment.includes("none")) {
    const equipmentRatios: Record<string, Partial<Record<Equipment, number>>> = {
      "dumbbell,cable machine": { "dumbbells": 0.5, "cable machine": 0.5 },
      "cable machine,dumbbell": { "dumbbells": 0.5, "cable machine": 0.5 },
      "barbell,dumbbell,cable machine": { "barbell": 0.4, "dumbbells": 0.3, "cable machine": 0.3 },
      "barbell,cable machine,dumbbell": { "barbell": 0.4, "dumbbells": 0.3, "cable machine": 0.3 },
      "dumbbell,barbell,cable machine": { "barbell": 0.4, "dumbbells": 0.3, "cable machine": 0.3 },
      "dumbbell,cable machine,barbell": { "barbell": 0.4, "dumbbells": 0.3, "cable machine": 0.3 },
      "cable machine,barbell,dumbbell": { "barbell": 0.4, "dumbbells": 0.3, "cable machine": 0.3 },
      "cable machine,dumbbell,barbell": { "barbell": 0.4, "dumbbells": 0.3, "cable machine": 0.3 },
      "kettlebell,dumbbell,cable machine": { "kettlebell": 0.33, "dumbbells": 0.33, "cable machine": 0.34 },
      "kettlebell,cable machine,dumbbell": { "kettlebell": 0.33, "dumbbells": 0.33, "cable machine": 0.34 },
      "dumbbell,kettlebell,cable machine": { "kettlebell": 0.33, "dumbbells": 0.33, "cable machine": 0.34 },
      "dumbbell,cable machine,kettlebell": { "kettlebell": 0.33, "dumbbells": 0.33, "cable machine": 0.34 },
      "cable machine,kettlebell,dumbbell": { "kettlebell": 0.33, "dumbbells": 0.33, "cable machine": 0.34 },
      "cable machine,dumbbell,kettlebell": { "kettlebell": 0.33, "dumbbells": 0.33, "cable machine": 0.34 },
      "kettlebell,barbell,cable machine": { "kettlebell": 0.3, "barbell": 0.4, "cable machine": 0.3 },
      "kettlebell,cable machine,barbell": { "kettlebell": 0.3, "barbell": 0.4, "cable machine": 0.3 },
      "barbell,kettlebell,cable machine": { "kettlebell": 0.3, "barbell": 0.4, "cable machine": 0.3 },
      "barbell,cable machine,kettlebell": { "kettlebell": 0.3, "barbell": 0.4, "cable machine": 0.3 },
      "cable machine,kettlebell,barbell": { "kettlebell": 0.3, "barbell": 0.4, "cable machine": 0.3 },
      "cable machine,barbell,kettlebell": { "kettlebell": 0.3, "barbell": 0.4, "cable machine": 0.3 },
    };

    const equipmentKey = equipment.filter(e => e !== "none").sort().join(",");
    const ratios = equipmentRatios[equipmentKey];

    if (ratios) {
      const splitExercises: Exercise[] = [];
      const equipmentList = Object.keys(ratios) as Equipment[];
      
      equipmentList.forEach(eq => {
        const targetCount = Math.round(maxExercises * ratios[eq]);
        const eqExercises = selectedExercises.filter(ex => ex.equipment.includes(eq));
        splitExercises.push(...eqExercises.slice(0, targetCount));
      });

      // Remove duplicates while preserving order
      const seen = new Set<string>();
      selectedExercises = splitExercises.filter(ex => {
        if (seen.has(ex.name)) return false;
        seen.add(ex.name);
        return true;
      });

      // Fill remaining slots if needed
      if (selectedExercises.length < maxExercises) {
        const remaining = maxExercises - selectedExercises.length;
        const allExercises = getFilteredExercises(muscleGroups, equipment, intensity);
        const existingNames = new Set(selectedExercises.map(ex => ex.name));
        
        allExercises.forEach(ex => {
          if (selectedExercises.length < maxExercises && !existingNames.has(ex.name)) {
            selectedExercises.push(ex);
            existingNames.add(ex.name);
          }
        });
      }
    }
  }

  // Ensure at least 1 exercise per selected muscle group (respecting max limit)
  if (muscleGroups.length > 1 && !muscleGroups.includes("full body")) {
    const exercisesByMuscleGroup = new Map<MuscleGroup, Exercise[]>();
    const finalExercises: Exercise[] = [];
    
    // Group exercises by muscle group
    selectedExercises.forEach(ex => {
      const exMuscleGroups = Array.isArray(ex.muscleGroup) ? ex.muscleGroup : [ex.muscleGroup];
      exMuscleGroups.forEach(mg => {
        if (muscleGroups.includes(mg)) {
          if (!exercisesByMuscleGroup.has(mg)) {
            exercisesByMuscleGroup.set(mg, []);
          }
          exercisesByMuscleGroup.get(mg)!.push(ex);
        }
      });
    });
    
    // Add at least 1 exercise per muscle group
    const added = new Set<string>();
    muscleGroups.forEach(mg => {
      const mgExercises = exercisesByMuscleGroup.get(mg) || [];
      if (mgExercises.length > 0 && finalExercises.length < maxExercises) {
        const ex = mgExercises[0];
        if (!added.has(ex.name)) {
          finalExercises.push(ex);
          added.add(ex.name);
        }
      }
    });
    
    // Fill remaining slots with other exercises
    selectedExercises.forEach(ex => {
      if (finalExercises.length < maxExercises && !added.has(ex.name)) {
        finalExercises.push(ex);
        added.add(ex.name);
      }
    });
    
    selectedExercises = finalExercises;
  }
  
  // Ensure at least minimum exercises
  if (selectedExercises.length < Math.min(3, maxExercises)) {
    const supplementary = getFilteredExercises(["cardio","core"], equipment, intensity);
    const existing = new Set(selectedExercises.map(ex => ex.name));
    selectedExercises.push(...supplementary.filter(ex => !existing.has(ex.name)));
  }

  // Add pain relief exercises FIRST (they always get priority)
  const finalExerciseList = [...painReliefExercises, ...selectedExercises.slice(0, maxExercises)];
  const adjustedExercises = finalExerciseList.map(ex => adjustExerciseForIntensity(ex, intensity, time));
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
