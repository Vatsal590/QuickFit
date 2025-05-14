
import { Exercise, Equipment, MuscleGroup } from "../types";

export const exercises: Exercise[] = [
  // Chest exercises
  {
    id: "push-up",
    name: "Push-up",
    muscleGroup: "chest",
    equipment: ["none"],
    sets: 3,
    reps: 12,
    restTime: 60,
    description: "Start in a plank position with hands slightly wider than shoulder-width. Lower your body until chest nearly touches the floor, then push back up."
  },
  {
    id: "dumbbell-chest-press",
    name: "Dumbbell Chest Press",
    muscleGroup: "chest",
    equipment: ["dumbbells", "bench"],
    sets: 3,
    reps: 10,
    restTime: 90,
    description: "Lie on a bench holding dumbbells at chest level. Press the weights up until arms are extended, then lower back to start position."
  },
  {
    id: "incline-dumbbell-press",
    name: "Incline Dumbbell Press",
    muscleGroup: "chest",
    equipment: ["dumbbells", "bench"],
    sets: 3,
    reps: 10,
    restTime: 90,
    description: "Lie on an incline bench holding dumbbells at chest level. Press the weights up until arms are extended, then lower back to start position."
  },
  {
    id: "cable-chest-fly",
    name: "Cable Chest Fly",
    muscleGroup: "chest",
    equipment: ["cable machine"],
    sets: 3,
    reps: 12,
    restTime: 60,
    description: "Stand between cable machines with cables at chest height. With a slight bend in the elbows, bring hands together in front of your chest."
  },

  // Back exercises
  {
    id: "pull-up",
    name: "Pull-up",
    muscleGroup: "back",
    equipment: ["pull-up bar"],
    sets: 3,
    reps: 8,
    restTime: 90,
    description: "Hang from a bar with palms facing away. Pull your body up until chin is above the bar, then lower back down with control."
  },
  {
    id: "bent-over-row",
    name: "Bent-Over Row",
    muscleGroup: "back",
    equipment: ["dumbbells"],
    sets: 3,
    reps: 10,
    restTime: 60,
    description: "Bend at hips with slight knee bend, back straight. Hold dumbbells hanging down, then pull them to your sides, squeezing shoulder blades together."
  },
  {
    id: "lat-pulldown",
    name: "Lat Pulldown",
    muscleGroup: "back",
    equipment: ["cable machine"],
    sets: 3,
    reps: 12,
    restTime: 60,
    description: "Sit at a lat pulldown station and grip the bar wider than shoulder-width. Pull the bar down to your chest, then slowly return to starting position."
  },
  {
    id: "single-arm-dumbbell-row",
    name: "Single-Arm Dumbbell Row",
    muscleGroup: "back",
    equipment: ["dumbbells", "bench"],
    sets: 3,
    reps: 10,
    restTime: 45,
    description: "Place one knee and hand on a bench, other foot on the floor. Hold dumbbell in free hand, row it up to your side while keeping your back flat."
  },

  // Shoulder exercises
  {
    id: "dumbbell-shoulder-press",
    name: "Dumbbell Shoulder Press",
    muscleGroup: "shoulders",
    equipment: ["dumbbells"],
    sets: 3,
    reps: 10,
    restTime: 60,
    description: "Hold dumbbells at shoulder height, palms facing forward. Press weights up until arms are extended, then lower back to start position."
  },
  {
    id: "lateral-raise",
    name: "Lateral Raise",
    muscleGroup: "shoulders",
    equipment: ["dumbbells"],
    sets: 3,
    reps: 12,
    restTime: 45,
    description: "Stand holding dumbbells at sides. Raise arms out to sides until they're at shoulder height, then lower back down with control."
  },
  {
    id: "front-raise",
    name: "Front Raise",
    muscleGroup: "shoulders",
    equipment: ["dumbbells"],
    sets: 3,
    reps: 12,
    restTime: 45,
    description: "Stand holding dumbbells in front of thighs. Raise arms straight in front until they're at shoulder height, then lower back down with control."
  },
  {
    id: "resistance-band-face-pull",
    name: "Resistance Band Face Pull",
    muscleGroup: "shoulders",
    equipment: ["resistance bands"],
    sets: 3,
    reps: 15,
    restTime: 30,
    description: "Attach band at head height. Hold ends with arms extended, pull band toward face while pulling elbows back and squeezing shoulder blades."
  },

  // Legs exercises
  {
    id: "bodyweight-squat",
    name: "Bodyweight Squat",
    muscleGroup: "legs",
    equipment: ["none"],
    sets: 3,
    reps: 15,
    restTime: 60,
    description: "Stand with feet shoulder-width apart. Lower your body as if sitting in a chair, keeping chest up and knees tracking over toes. Return to standing."
  },
  {
    id: "dumbbell-lunge",
    name: "Dumbbell Lunge",
    muscleGroup: "legs",
    equipment: ["dumbbells"],
    sets: 3,
    reps: 10,
    restTime: 60,
    description: "Hold dumbbells at sides. Step forward with one leg, lowering until both knees are bent 90 degrees. Push back to start. Repeat on other side."
  },
  {
    id: "goblet-squat",
    name: "Goblet Squat",
    muscleGroup: "legs",
    equipment: ["kettlebell", "dumbbells"],
    sets: 3,
    reps: 12,
    restTime: 60,
    description: "Hold dumbbell or kettlebell close to chest. Squat down while keeping chest up and knees tracking over toes, then return to standing."
  },
  {
    id: "romanian-deadlift",
    name: "Romanian Deadlift",
    muscleGroup: "legs",
    equipment: ["barbell", "dumbbells"],
    sets: 3,
    reps: 10,
    restTime: 90,
    description: "Hold weight in front of thighs, feet hip-width apart. Hinge at hips sending butt backward, lowering weight while keeping back flat. Return to standing."
  },

  // Arms exercises
  {
    id: "dumbbell-bicep-curl",
    name: "Dumbbell Bicep Curl",
    muscleGroup: "arms",
    equipment: ["dumbbells"],
    sets: 3,
    reps: 12,
    restTime: 45,
    description: "Hold dumbbells at sides, palms facing forward. Curl weights up toward shoulders while keeping elbows close to sides, then lower back down."
  },
  {
    id: "tricep-dips",
    name: "Tricep Dips",
    muscleGroup: "arms",
    equipment: ["bench"],
    sets: 3,
    reps: 12,
    restTime: 45,
    description: "Sit on bench edge, hands gripping edge beside hips. Slide buttocks off bench, lower body by bending elbows, then push back up."
  },
  {
    id: "resistance-band-curl",
    name: "Resistance Band Curl",
    muscleGroup: "arms",
    equipment: ["resistance bands"],
    sets: 3,
    reps: 15,
    restTime: 30,
    description: "Stand on band with feet shoulder-width apart. Hold handles with palms facing forward, curl hands toward shoulders, then lower."
  },
  {
    id: "overhead-tricep-extension",
    name: "Overhead Tricep Extension",
    muscleGroup: "arms",
    equipment: ["dumbbells"],
    sets: 3,
    reps: 12,
    restTime: 45,
    description: "Hold one dumbbell with both hands above head, elbows bent. Straighten arms to lift weight, then lower back behind head with control."
  },

  // Core exercises
  {
    id: "plank",
    name: "Plank",
    muscleGroup: "core",
    equipment: ["none"],
    sets: 3,
    reps: 1,
    restTime: 45,
    description: "Hold a push-up position with weight on forearms. Keep body in straight line from head to heels, engaging core. Hold for 30-60 seconds."
  },
  {
    id: "bicycle-crunch",
    name: "Bicycle Crunch",
    muscleGroup: "core",
    equipment: ["none"],
    sets: 3,
    reps: 20,
    restTime: 30,
    description: "Lie on back, hands behind head, knees bent. Bring opposite elbow to knee while extending other leg, alternating sides in pedaling motion."
  },
  {
    id: "russian-twist",
    name: "Russian Twist",
    muscleGroup: "core",
    equipment: ["none", "kettlebell", "dumbbells"],
    sets: 3,
    reps: 20,
    restTime: 30,
    description: "Sit with knees bent, feet elevated. Lean back slightly, twist torso to one side, then the other. Add weight for increased difficulty."
  },
  {
    id: "mountain-climber",
    name: "Mountain Climber",
    muscleGroup: "core",
    equipment: ["none"],
    sets: 3,
    reps: 20,
    restTime: 30,
    description: "Start in push-up position. Quickly bring one knee toward chest, then return to start position as you bring the other knee in. Continue alternating."
  },

  // Full body exercises
  {
    id: "burpee",
    name: "Burpee",
    muscleGroup: "full body",
    equipment: ["none"],
    sets: 3,
    reps: 10,
    restTime: 60,
    description: "From standing, squat down, place hands on floor, jump feet back to plank, do a push-up, jump feet forward, then jump up with arms overhead."
  },
  {
    id: "kettlebell-swing",
    name: "Kettlebell Swing",
    muscleGroup: "full body",
    equipment: ["kettlebell"],
    sets: 3,
    reps: 15,
    restTime: 60,
    description: "Stand with feet shoulder-width apart, holding kettlebell with both hands. Hinge at hips, swing kettlebell between legs, then thrust hips forward to swing it up to chest height."
  },
  {
    id: "dumbbell-thruster",
    name: "Dumbbell Thruster",
    muscleGroup: "full body",
    equipment: ["dumbbells"],
    sets: 3,
    reps: 12,
    restTime: 60,
    description: "Hold dumbbells at shoulder height. Squat down, then as you stand, press dumbbells overhead. Lower them back to shoulders as you squat again."
  },
  {
    id: "turkish-get-up",
    name: "Turkish Get-Up",
    muscleGroup: "full body",
    equipment: ["kettlebell", "dumbbells"],
    sets: 3,
    reps: 5,
    restTime: 60,
    description: "Lie on back holding weight in one hand extended up. Roll to elbow, then hand, then sit up, then stand up, all while keeping weight overhead."
  },

  // Cardio exercises
  {
    id: "jumping-jacks",
    name: "Jumping Jacks",
    muscleGroup: "cardio",
    equipment: ["none"],
    sets: 3,
    reps: 30,
    restTime: 30,
    description: "Start standing with arms at sides. Jump feet out while raising arms overhead, then jump back to start position. Repeat at a brisk pace."
  },
  {
    id: "high-knees",
    name: "High Knees",
    muscleGroup: "cardio",
    equipment: ["none"],
    sets: 3,
    reps: 30,
    restTime: 30,
    description: "Run in place, bringing knees up toward chest as high as possible. Keep a quick pace, pumping arms as if running."
  },
  {
    id: "jump-rope",
    name: "Jump Rope",
    muscleGroup: "cardio",
    equipment: ["none"],
    sets: 3,
    reps: 50,
    restTime: 30,
    description: "Jump rope at a steady pace, keeping jumps small and consistent. Use an actual jump rope or simulate the movement."
  },
  {
    id: "jumping-squat",
    name: "Jumping Squat",
    muscleGroup: "cardio",
    equipment: ["none"],
    sets: 3,
    reps: 15,
    restTime: 45,
    description: "Perform a bodyweight squat, then explode up into a jump. Land softly with bent knees, immediately lowering back into the next squat."
  }
];

export const getFilteredExercises = (
  targetMuscleGroups: MuscleGroup[], 
  availableEquipment: Equipment[],
  intensity: string
): Exercise[] => {
  // Filter exercises that match the target muscle groups and available equipment
  const filteredByMuscleAndEquipment = exercises.filter(exercise => {
    // Check if the exercise targets one of the selected muscle groups
    const matchesMuscleGroup = targetMuscleGroups.includes(exercise.muscleGroup);
    
    // Check if the exercise can be performed with the available equipment
    const hasRequiredEquipment = exercise.equipment.some(eq => 
      availableEquipment.includes(eq) || eq === "none"
    );
    
    return matchesMuscleGroup && hasRequiredEquipment;
  });
  
  // Adjust number of exercises based on intensity
  let maxExercises: number;
  if (intensity === "light") {
    maxExercises = 4;
  } else if (intensity === "moderate") {
    maxExercises = 6;
  } else {
    maxExercises = 8;
  }
  
  // Shuffle the filtered exercises
  const shuffled = [...filteredByMuscleAndEquipment].sort(() => 0.5 - Math.random());
  
  // Return a subset based on intensity
  return shuffled.slice(0, Math.min(maxExercises, shuffled.length));
};
