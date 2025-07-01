
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
    id: "barbell-bench-press",
    name: "Barbell Bench Press",
    muscleGroup: "chest",
    equipment: ["barbell", "bench"],
    sets: 3,
    reps: 8,
    restTime: 120,
    description: "Lie on bench, grip barbell slightly wider than shoulders. Lower bar to chest, then press up until arms are fully extended."
  },
  {
    id: "incline-barbell-press",
    name: "Incline Barbell Press",
    muscleGroup: "chest",
    equipment: ["barbell", "bench"],
    sets: 3,
    reps: 8,
    restTime: 120,
    description: "Lie on incline bench, press barbell from chest level up until arms are extended, focusing on upper chest."
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
    id: "barbell-row",
    name: "Barbell Row",
    muscleGroup: "back",
    equipment: ["barbell"],
    sets: 3,
    reps: 8,
    restTime: 90,
    description: "Bend at hips with barbell in hands, pull bar to lower chest while squeezing shoulder blades together."
  },
  {
    id: "bent-over-row",
    name: "Bent-Over Dumbbell Row",
    muscleGroup: "back",
    equipment: ["dumbbells"],
    sets: 3,
    reps: 10,
    restTime: 60,
    description: "Bend at hips with slight knee bend, back straight. Hold dumbbells hanging down, then pull them to your sides, squeezing shoulder blades together."
  },
  {
    id: "t-bar-row",
    name: "T-Bar Row",
    muscleGroup: "back",
    equipment: ["barbell"],
    sets: 3,
    reps: 10,
    restTime: 90,
    description: "Straddle barbell with weight on one end, pull handle to chest while maintaining straight back."
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
    id: "barbell-overhead-press",
    name: "Barbell Overhead Press",
    muscleGroup: "shoulders",
    equipment: ["barbell"],
    sets: 3,
    reps: 8,
    restTime: 90,
    description: "Stand with barbell at shoulder height, press overhead until arms are fully extended, then lower back to shoulders."
  },
  {
    id: "barbell-upright-row",
    name: "Barbell Upright Row",
    muscleGroup: "shoulders",
    equipment: ["barbell"],
    sets: 3,
    reps: 10,
    restTime: 60,
    description: "Hold barbell with narrow grip, pull up to chest level keeping elbows high, then lower with control."
  },
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
    id: "barbell-squat",
    name: "Barbell Squat",
    muscleGroup: "legs",
    equipment: ["barbell"],
    sets: 3,
    reps: 8,
    restTime: 120,
    description: "Position barbell on upper back, squat down until thighs are parallel to floor, then drive up through heels."
  },
  {
    id: "barbell-deadlift",
    name: "Barbell Deadlift",
    muscleGroup: "legs",
    equipment: ["barbell"],
    sets: 3,
    reps: 6,
    restTime: 120,
    description: "Stand with barbell over mid-foot, hinge at hips and knees to grip bar, then stand up by driving through heels."
  },
  {
    id: "barbell-front-squat",
    name: "Barbell Front Squat",
    muscleGroup: "legs",
    equipment: ["barbell"],
    sets: 3,
    reps: 8,
    restTime: 90,
    description: "Hold barbell at shoulder height in front, squat down keeping chest up, then drive up through heels."
  },
  {
    id: "barbell-split-squat",
    name: "Barbell Split Squat",
    muscleGroup: "legs",
    equipment: ["barbell"],
    sets: 3,
    reps: 10,
    restTime: 60,
    description: "Hold barbell on shoulders, step into lunge position, lower back knee toward ground, then push back up."
  },
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
    id: "dumbbell-squat",
    name: "Dumbbell Squat",
    muscleGroup: "legs",
    equipment: ["dumbbells"],
    sets: 3,
    reps: 12,
    restTime: 60,
    description: "Hold dumbbells at shoulders or sides, squat down keeping chest up, then drive up through heels."
  },
  {
    id: "dumbbell-step-up",
    name: "Dumbbell Step-Up",
    muscleGroup: "legs",
    equipment: ["dumbbells", "bench"],
    sets: 3,
    reps: 10,
    restTime: 60,
    description: "Hold dumbbells, step up onto bench with one foot, drive through heel to stand, then step down with control."
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

  // Biceps exercises
  {
    id: "barbell-curl",
    name: "Barbell Curl",
    muscleGroup: "biceps",
    equipment: ["barbell"],
    sets: 3,
    reps: 10,
    restTime: 60,
    description: "Hold barbell with underhand grip, arms extended. Curl the bar up toward your chest while keeping elbows stationary, then lower back down."
  },
  {
    id: "dumbbell-bicep-curl",
    name: "Dumbbell Bicep Curl",
    muscleGroup: "biceps",
    equipment: ["dumbbells"],
    sets: 3,
    reps: 12,
    restTime: 45,
    description: "Hold dumbbells at sides, palms facing forward. Curl weights up toward shoulders while keeping elbows close to sides, then lower back down."
  },
  {
    id: "hammer-curl",
    name: "Hammer Curl",
    muscleGroup: "biceps",
    equipment: ["dumbbells"],
    sets: 3,
    reps: 12,
    restTime: 45,
    description: "Hold dumbbells at sides with palms facing each other. Curl weights up toward shoulders without rotating wrists, then lower back down."
  },
  {
    id: "resistance-band-curl",
    name: "Resistance Band Curl",
    muscleGroup: "biceps",
    equipment: ["resistance bands"],
    sets: 3,
    reps: 15,
    restTime: 30,
    description: "Stand on band with feet shoulder-width apart. Hold handles with palms facing forward, curl hands toward shoulders, then lower."
  },

  // Triceps exercises
  {
    id: "barbell-close-grip-press",
    name: "Close-Grip Barbell Press",
    muscleGroup: "triceps",
    equipment: ["barbell", "bench"],
    sets: 3,
    reps: 10,
    restTime: 90,
    description: "Lie on bench with narrow grip on barbell. Lower bar to chest, then press up focusing on triceps."
  },
  {
    id: "tricep-dips",
    name: "Tricep Dips",
    muscleGroup: "triceps",
    equipment: ["bench"],
    sets: 3,
    reps: 12,
    restTime: 45,
    description: "Sit on bench edge, hands gripping edge beside hips. Slide buttocks off bench, lower body by bending elbows, then push back up."
  },
  {
    id: "overhead-tricep-extension",
    name: "Overhead Tricep Extension",
    muscleGroup: "triceps",
    equipment: ["dumbbells"],
    sets: 3,
    reps: 12,
    restTime: 45,
    description: "Hold one dumbbell with both hands above head, elbows bent. Straighten arms to lift weight, then lower back behind head with control."
  },
  {
    id: "tricep-pushdown",
    name: "Tricep Pushdown",
    muscleGroup: "triceps",
    equipment: ["cable machine"],
    sets: 3,
    reps: 12,
    restTime: 45,
    description: "Stand at cable machine with rope or bar attachment. Keep elbows at sides and push weight down until arms are fully extended, then return to start."
  },
  {
    id: "close-grip-push-up",
    name: "Close-Grip Push-up",
    muscleGroup: "triceps",
    equipment: ["none"],
    sets: 3,
    reps: 10,
    restTime: 60,
    description: "Perform a push-up with hands close together, forming a diamond shape with your fingers. This targets the triceps more than regular push-ups."
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
    id: "dumbbell-clean-press",
    name: "Dumbbell Clean and Press",
    muscleGroup: "full body",
    equipment: ["dumbbells"],
    sets: 3,
    reps: 8,
    restTime: 90,
    description: "Start with dumbbells on floor, explosively pull them to shoulders, then press overhead in one fluid movement."
  },
  {
    id: "dumbbell-renegade-row",
    name: "Dumbbell Renegade Row",
    muscleGroup: "full body",
    equipment: ["dumbbells"],
    sets: 3,
    reps: 10,
    restTime: 60,
    description: "In plank position holding dumbbells, row one weight to side while balancing on the other, then alternate sides."
  },
  {
    id: "dumbbell-man-maker",
    name: "Dumbbell Man Maker",
    muscleGroup: "full body",
    equipment: ["dumbbells"],
    sets: 3,
    reps: 6,
    restTime: 90,
    description: "Hold dumbbells, squat down, kick back to plank, do push-up, row each arm, jump feet forward, then clean and press overhead."
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
      availableEquipment.includes(eq)
    );
    
    return matchesMuscleGroup && hasRequiredEquipment;
  });
  
  // For full body workouts with specific equipment, prioritize exercises that use that equipment
  if (targetMuscleGroups.includes("full body") && availableEquipment.length > 0) {
    // If barbell is selected, prioritize barbell exercises
    if (availableEquipment.includes("barbell")) {
      const barbellExercises = exercises.filter(ex => 
        ex.equipment.includes("barbell") && 
        (ex.muscleGroup === "full body" || ex.muscleGroup === "chest" || ex.muscleGroup === "back" || ex.muscleGroup === "legs" || ex.muscleGroup === "shoulders")
      );
      const bodyweightExercises = exercises.filter(ex => 
        ex.equipment.includes("none") && 
        (ex.muscleGroup === "full body" || ex.muscleGroup === "core")
      );
      
      // Return 70% barbell exercises, 30% bodyweight for variety
      const barbellCount = Math.ceil(barbellExercises.length * 0.7);
      const bodyweightCount = Math.floor(bodyweightExercises.length * 0.3);
      
      return [
        ...barbellExercises.slice(0, barbellCount),
        ...bodyweightExercises.slice(0, bodyweightCount)
      ].sort(() => 0.5 - Math.random());
    }
    
    // If dumbbells are selected, get varied dumbbell exercises
    if (availableEquipment.includes("dumbbells")) {
      const dumbbellExercises = exercises.filter(ex => 
        ex.equipment.includes("dumbbells") && 
        (ex.muscleGroup === "full body" || ex.muscleGroup === "chest" || ex.muscleGroup === "back" || ex.muscleGroup === "legs" || ex.muscleGroup === "shoulders" || ex.muscleGroup === "biceps" || ex.muscleGroup === "triceps")
      );
      
      // Shuffle and return varied exercises
      return dumbbellExercises.sort(() => 0.5 - Math.random());
    }
  }
  
  // Shuffle the filtered exercises
  const shuffled = [...filteredByMuscleAndEquipment].sort(() => 0.5 - Math.random());
  
  // Return all matching exercises (will be limited by workout generator based on time)
  return shuffled;
};
