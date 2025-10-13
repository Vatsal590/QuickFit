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
    case "moderate": break; // keep default
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

  let targetSpecific = cooldown.filter(ex => targetMuscleGroups.includes(ex.muscleGroup));
  if (targetSpecific.length < 3) targetSpecific = [...targetSpecific, ...cooldown.filter(ex => !targetMuscleGroups.includes(ex.muscleGroup))];
  return targetSpecific.slice(0, 4);
};

// Alternative exercises for body pains
const getAlternativeExercises = (pain: import('@/types').BodyPain, equipment: Equipment[]): Exercise[] => {
  const alternatives: Record<string, Exercise[]> = {
    "knee pain": [
      { id: uuidv4(), name: "Glute Bridges", muscleGroup: "legs", equipment: ["none"], sets: 3, reps: 15, restTime: 60, description: "Lie on back, lift hips." },
      { id: uuidv4(), name: "Clamshells", muscleGroup: "legs", equipment: ["none"], sets: 3, reps: 12, restTime: 45, description: "Side-lying hip exercise." },
      { id: uuidv4(), name: "Deadbugs", muscleGroup: "core", equipment: ["none"], sets: 3, reps: 10, restTime: 45, description: "Core stability on back." }
    ],
    "ankle pain": [
      { id: uuidv4(), name: "Seated Upper Body Press", muscleGroup: "shoulders", equipment: equipment.includes("dumbbells") ? ["dumbbells"] : ["resistance bands"], sets: 3, reps: 12, restTime: 60, description: "Seated shoulder press." },
      { id: uuidv4(), name: "Lying Hamstring Curls", muscleGroup: "legs", equipment: ["resistance bands"], sets: 3, reps: 15, restTime: 60, description: "Hamstring exercise lying down." }
    ],
    "hip pain": [
      { id: uuidv4(), name: "Glute Bridges", muscleGroup: "legs", equipment: ["none"], sets: 3, reps: 15, restTime: 60, description: "Hip-safe glute strengthening." },
      { id: uuidv4(), name: "Bird-Dogs", muscleGroup: "core", equipment: ["none"], sets: 3, reps: 8, restTime: 45, description: "Core stability on hands and knees." }
    ],
    "shoulder pain": [
      { id: uuidv4(), name: "Resistance Band Rows", muscleGroup: "back", equipment: ["resistance bands"], sets: 3, reps: 15, restTime: 60, description: "Low anchor rowing motion." },
      { id: uuidv4(), name: "Supported Bicep Curls", muscleGroup: "biceps", equipment: equipment.includes("dumbbells") ? ["dumbbells"] : ["resistance bands"], sets: 3, reps: 12, restTime: 45, description: "Bicep curls with support." }
    ],
    "lower back pain": [
      { id: uuidv4(), name: "Bird-Dogs", muscleGroup: "core", equipment: ["none"], sets: 3, reps: 8, restTime: 45, description: "Safe core strengthening." },
      { id: uuidv4(), name: "Modified Planks", muscleGroup: "core", equipment: ["none"], sets: 3, reps: 30, restTime: 60, description: "Plank with knees down." }
    ],
    "elbow pain": [
      { id: uuidv4(), name: "Wall Sits", muscleGroup: "legs", equipment: ["none"], sets: 3, reps: 30, restTime: 60, description: "Isometric leg exercise." },
      { id: uuidv4(), name: "Straight Arm Band Pulls", muscleGroup: "back", equipment: ["resistance bands"], sets: 3, reps: 15, restTime: 45, description: "Resistance band exercise." }
    ],
    "wrist pain": [
      { id: uuidv4(), name: "Standing Core Twists", muscleGroup: "core", equipment: ["none"], sets: 3, reps: 20, restTime: 45, description: "Core exercise without wrist stress." },
      { id: uuidv4(), name: "Neutral Grip Band Exercises", muscleGroup: "back", equipment: ["resistance bands"], sets: 3, reps: 15, restTime: 60, description: "Neutral wrist resistance band work." }
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

  // Filter exercises for body pains and add alternatives
  if (bodyPains?.length) {
    const painExercises: Record<string, string[]> = {
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
        (painExercises[pain] || []).some(word => ex.name.toLowerCase().includes(word))
      )
    );

    const alternatives = bodyPains.flatMap(pain => getAlternativeExercises(pain, equipment));
    const existingNames = new Set(selectedExercises.map(ex => ex.name.toLowerCase()));
    alternatives.forEach(ex => { if (!existingNames.has(ex.name.toLowerCase())) selectedExercises.push(ex); });
  }

  // Special cases
  if (muscleGroups.includes("full body") && equipment.includes("barbell")) {
    const barbellExercises = exercises.filter(ex => ex.equipment.includes("barbell") && ["chest","back","legs","shoulders","biceps","triceps"].includes(ex.muscleGroup));
    const bodyweightExercises = exercises.filter(ex => ex.equipment.includes("none") && ["core","full body"].includes(ex.muscleGroup));
    const total = Math.min(10, barbellExercises.length + bodyweightExercises.length);
    const barbellCount = Math.ceil(total * 0.8);
    const bodyweightCount = total - barbellCount;
    selectedExercises = [...barbellExercises.slice(0, barbellCount), ...bodyweightExercises.slice(0, bodyweightCount)];
  }

  // Biceps dumbbells special case
  if (muscleGroups.length === 1 && muscleGroups.includes("biceps") && equipment.includes("dumbbells")) {
    const bicepCurl = exercises.find(ex => ex.id === "dumbbell-bicep-curl");
    const hammerCurl = exercises.find(ex => ex.id === "hammer-curl");
    selectedExercises = [];
    if (time === 10 && bicepCurl) selectedExercises.push(bicepCurl);
    if ((time === 20 || time === 30) && bicepCurl) selectedExercises.push(bicepCurl);
    if ((time === 20 || time === 30) && hammerCurl) selectedExercises.push(hammerCurl);
  }

  // Dumbbell general case
  if (equipment.includes("dumbbells") && !equipment.includes("none") && !muscleGroups.includes("biceps")) {
    const dumbbellExercises = exercises.filter(ex => ex.equipment.includes("dumbbells") && (muscleGroups.includes("full body") ? true : muscleGroups.includes(ex.muscleGroup)));
    let pool: Exercise[] = [];
    if (time <= 20) pool = dumbbellExercises.filter(ex => ["full body"].includes(ex.muscleGroup) || ["Thruster","Clean","Squat","Row"].some(w => ex.name.includes(w)));
    else if (time <= 30) pool = dumbbellExercises.filter(ex => ["full body","chest","back","legs"].includes(ex.muscleGroup));
    else pool = dumbbellExercises;
    selectedExercises = pool.sort(() => Math.random() - 0.5);
  }

  // Ensure minimum exercises
  if (selectedExercises.length < 3) {
    const supplementary = getFilteredExercises(["cardio","core"], equipment, intensity);
    const existing = new Set(selectedExercises.map(ex => ex.name));
    selectedExercises.push(...supplementary.filter(ex => !existing.has(ex.name)));
  }

  // Max exercises
  let maxExercises: number;
  if (time === 30) maxExercises = Math.random() < 0.5 ? 3 : 4;
  else if (time === 45) maxExercises = 4;
  else if (time === 60) maxExercises = muscleGroups.includes("chest") ? Math.max(5, selectedExercises.length) : 6;
  else maxExercises = time <= 20 ? 2 : 3;

  // Chest special handling
  if (muscleGroups.includes("chest")) {
    const hasDumbbells = equipment.includes("dumbbells");
    const hasBarbell = equipment.includes("barbell");
    const hasCable = equipment.includes("cable machine");

    if (hasDumbbells || hasBarbell) selectedExercises = selectedExercises.filter(ex => !(ex.muscleGroup === "chest" && ex.equipment.includes("none")));

    const ensure = (id: string) => { if (!selectedExercises.some(ex => ex.id === id)) { const found = exercises.find(ex => ex.id === id); if (found) selectedExercises.unshift(found); } };
    if (hasDumbbells && !hasBarbell) ensure("dumbbell-chest-fly");
    if (hasBarbell) ensure("barbell-bench-press");
    if (hasCable) ensure("cable-chest-fly");
  }

  // Back special ordering
  if (muscleGroups.includes("back") && ["barbell","dumbbells","pull-up bar"].every(eq => equipment.includes(eq))) {
    const orderIds = ["pull-up","barbell-deadlift","bent-over-row","hammer-curl","dumbbell-bicep-curl"];
    selectedExercises = orderIds.map(id => exercises.find(ex => ex.id === id)).filter(Boolean) as Exercise[];
  }

  // Limit exercises & adjust intensity
  const adjustedExercises = selectedExercises.slice(0, maxExercises).map(ex => adjustExerciseForIntensity(ex, intensity, time));

  // Warmup & cooldown
  const warmup = generateWarmupExercises(equipment).slice(0,3);
  const cooldown = generateCooldownExercises(muscleGroups).slice(0,3);

  // Workout title
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
