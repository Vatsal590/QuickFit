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
    id: "decline push-up",
    name: "Decline Push-up",
    muscleGroup: "chest",
    equipment: ["none"],
    sets: 3,
    reps: 12,
    restTime: 60,
    description: "Start with legs on an elevated surface and hands slightly wider than shoulder-width. Lower your body until chest nearly touches the floor, then push back up."
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
  {
    id: "cable-crossover",
    name: "Cable Crossover",
    muscleGroup: "full body",
    equipment: ["cable machine"],
    sets: 3,
    reps: 12,
    restTime: 60,
    description: "Stand between cable machines with cables set high. Cross cables in front of your body while engaging chest, shoulders, and core."
  },
  {
    id: "resistance-band-chest-press",
    name: "Resistance Band Chest Press",
    muscleGroup: "chest",
    equipment: ["resistance bands"],
    sets: 3,
    reps: 15,
    restTime: 60,
    description: "Anchor band behind you at chest height. Hold handles and press forward, squeezing chest muscles."
  },
  {
    id: "resistance-band-chest-fly",
    name: "Resistance Band Chest Fly",
    muscleGroup: "chest",
    equipment: ["resistance bands"],
    sets: 3,
    reps: 12,
    restTime: 60,
    description: "Anchor band behind you at chest height. With slight bend in elbows, bring handles together in front of chest."
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
    id: "cable-face-pull",
    name: "Cable Face-Pull",
    muscleGroup: "back",
    equipment: ["cable machine"],
    sets: 3,
    reps: 12,
    restTime: 60,
    description: "Set a rope attachment on a high pulley, grasp it with both hands, palms facing in. Pull the rope toward your face, keeping elbows high, then return slowly to the start."
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
  {
    id: "lower back extension",
    name: "Lower-Back Extension",
    muscleGroup: "back",
    equipment: ["bench"],
    sets: 3,
    reps: 8,
    restTime: 45,
    description: "Lie face down on a hyperextension bench with your hips supported and feet secured. Lower your upper body as much as you can while keeping it straight, then come back up."
  },
  {
    id: "resistance-band-row",
    name: "Resistance Band Row",
    muscleGroup: "back",
    equipment: ["resistance bands"],
    sets: 3,
    reps: 15,
    restTime: 60,
    description: "Anchor band in front of you at chest height. Pull handles back while squeezing shoulder blades together."
  },
  {
    id: "resistance-band-lat-pulldown",
    name: "Resistance Band Lat Pulldown",
    muscleGroup: "back",
    equipment: ["resistance bands"],
    sets: 3,
    reps: 12,
    restTime: 60,
    description: "Anchor band overhead. Pull handles down and back, focusing on engaging your lats."
  },
  {
    id: "resistance-band-reverse-fly",
    name: "Resistance Band Reverse Fly",
    muscleGroup: "back",
    equipment: ["resistance bands"],
    sets: 3,
    reps: 15,
    restTime: 45,
    description: "Hold band at chest height with arms extended. Pull handles apart while squeezing shoulder blades."
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
  {
    id: "resistance-band-shoulder-press",
    name: "Resistance Band Shoulder Press",
    muscleGroup: "shoulders",
    equipment: ["resistance bands"],
    sets: 3,
    reps: 12,
    restTime: 60,
    description: "Stand on band with feet shoulder-width apart. Hold handles at shoulder height and press overhead."
  },
  {
    id: "resistance-band-lateral-raise",
    name: "Resistance Band Lateral Raise",
    muscleGroup: "shoulders",
    equipment: ["resistance bands"],
    sets: 3,
    reps: 15,
    restTime: 45,
    description: "Stand on band with feet together. Hold handles and raise arms out to sides until shoulder height."
  },
  {
    id: "resistance-band-front-raise",
    name: "Resistance Band Front Raise",
    muscleGroup: "shoulders",
    equipment: ["resistance bands"],
    sets: 3,
    reps: 15,
    restTime: 45,
    description: "Stand on band with feet shoulder-width apart. Hold one handle and raise arm straight in front to shoulder height."
  },
  {
    id: "kettlebell-press",
    name: "Kettlebell Press",
    muscleGroup: "shoulders",
    equipment: ["kettlebell"],
    sets: 3,
    reps: 8,
    restTime: 90,
    description: "Hold kettlebell at shoulder height in rack position. Press overhead until arm is fully extended, then lower back down."
  },
  {
    id: "kettlebell-windmill",
    name: "Kettlebell Windmill",
    muscleGroup: "shoulders",
    equipment: ["kettlebell"],
    sets: 3,
    reps: 6,
    restTime: 90,
    description: "Hold kettlebell overhead with one arm. Slowly bend at waist toward the opposite side while keeping the kettlebell stable overhead."
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
    description: "Hold dumbbells at sides. Step forward with one leg, lowering until both knees are bent 90 degrees. Repeat while walking."
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
  {
    id: "kettlebell-goblet-squat",
    name: "Kettlebell Goblet Squat",
    muscleGroup: "legs",
    equipment: ["kettlebell"],
    sets: 3,
    reps: 12,
    restTime: 60,
    description: "Hold kettlebell by the horns at chest level. Squat down keeping chest up and knees out, then drive up through heels."
  },
  {
    id: "kettlebell-sumo-deadlift",
    name: "Kettlebell Sumo Deadlift",
    muscleGroup: "legs",
    equipment: ["kettlebell"],
    sets: 3,
    reps: 10,
    restTime: 90,
    description: "Stand with wide stance, kettlebell between legs. Hinge at hips to grab kettlebell, then drive up through heels and glutes."
  },
  {
    id: "kettlebell-lunge",
    name: "Kettlebell Lunge",
    muscleGroup: "legs",
    equipment: ["kettlebell"],
    sets: 3,
    reps: 8,
    restTime: 60,
    description: "Hold kettlebell in rack position. Step forward into lunge, lowering until both knees are bent 90 degrees, then return to start."
  },
  {
    id: "kettlebell-cossack-squat",
    name: "Kettlebell Cossack Squat",
    muscleGroup: "legs",
    equipment: ["kettlebell"],
    sets: 3,
    reps: 6,
    restTime: 90,
    description: "Hold kettlebell at chest. Step wide to one side, sitting back into one leg while keeping other leg straight. Return to center."
  },
  {
    id: "resistance-band-squat",
    name: "Resistance Band Squat",
    muscleGroup: "legs",
    equipment: ["resistance bands"],
    sets: 3,
    reps: 15,
    restTime: 60,
    description: "Stand on band with feet shoulder-width apart, holding handles at shoulders. Squat down then drive up against band resistance."
  },
  {
    id: "resistance-band-lateral-walk",
    name: "Resistance Band Lateral Walk",
    muscleGroup: "legs",
    equipment: ["resistance bands"],
    sets: 3,
    reps: 12,
    restTime: 45,
    description: "Place band around ankles or above knees. Take wide steps to the side while maintaining squat position."
  },
  {
    id: "resistance-band-glute-bridge",
    name: "Resistance Band Glute Bridge",
    muscleGroup: "legs",
    equipment: ["resistance bands"],
    sets: 3,
    reps: 15,
    restTime: 45,
    description: "Lie on back with band around knees. Lift hips up while pushing knees out against band resistance."
  },
  {
    id: "jump-squats",
    name: "Jump Squats",
    muscleGroup: "legs",
    equipment: ["none"],
    sets: 3,
    reps: 12,
    restTime: 60,
    description: "Perform a squat then explosively jump up, landing softly back into squat position."
  },
  {
    id: "jump-lunges",
    name: "Jump Lunges",
    muscleGroup: "legs",
    equipment: ["none"],
    sets: 3,
    reps: 10,
    restTime: 60,
    description: "Start in lunge position, jump up and switch legs in the air, landing in opposite lunge."
  },
  {
    id: "calf-raises",
    name: "Calf Raises",
    muscleGroup: "legs",
    equipment: ["none"],
    sets: 3,
    reps: 20,
    restTime: 45,
    description: "Stand on balls of feet, raise up as high as possible, then lower slowly back down."
  },
  {
    id: "lateral-squats",
    name: "Lateral Squats",
    muscleGroup: "legs",
    equipment: ["none"],
    sets: 3,
    reps: 12,
    restTime: 60,
    description: "Step wide to one side, squat down on that leg while keeping other leg straight, then return to center."
  },
  {
    id: "superman",
    name: "Superman",
    muscleGroup: "back",
    equipment: ["none"],
    sets: 3,
    reps: 12,
    restTime: 45,
    description: "Lie face down, simultaneously lift chest and legs off ground, hold briefly, then lower back down."
  },
  {
    id: "cat-cow-pose",
    name: "Cat-Cow Pose",
    muscleGroup: "back",
    equipment: ["none"],
    sets: 3,
    reps: 10,
    restTime: 30,
    description: "On hands and knees, alternate between arching back (cow) and rounding spine (cat)."
  },
  {
    id: "bird-dog-pose",
    name: "Bird Dog Pose",
    muscleGroup: "back",
    equipment: ["none"],
    sets: 3,
    reps: 8,
    restTime: 45,
    description: "On hands and knees, extend opposite arm and leg, hold for a few seconds, then switch sides."
  },
  {
    id: "towel-leg-curls",
    name: "Towel Leg Curls",
    muscleGroup: "biceps",
    equipment: ["none"],
    sets: 3,
    reps: 12,
    restTime: 60,
    description: "Lie on back, place towel under one foot, hold towel ends and curl leg up while providing resistance with towel."
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
    id: "barbell-reverse curl",
    name: "Barbell Reverse Curl",
    muscleGroup: "biceps",
    equipment: ["barbell"],
    sets: 3,
    reps: 10,
    restTime: 60,
    description: "Hold barbell with overhand grip, arms extended. Curl the bar up toward your chest while keeping elbows stationary, then lower back down."
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
  {
    id: "resistance-band-hammer-curl",
    name: "Resistance Band Hammer Curl",
    muscleGroup: "biceps",
    equipment: ["resistance bands"],
    sets: 3,
    reps: 15,
    restTime: 30,
    description: "Stand on band with feet shoulder-width apart. Hold handles with palms facing each other, curl up without rotating wrists."
  },
  {
    id: "kettlebell-curl",
    name: "Kettlebell Curl",
    muscleGroup: "biceps",
    equipment: ["kettlebell"],
    sets: 3,
    reps: 10,
    restTime: 60,
    description: "Hold kettlebell by the handle with underhand grip. Curl up toward shoulder while keeping elbow stationary."
  },
  {
    id: "kettlebell-bottoms-up-press",
    name: "Kettlebell Bottoms-Up Press",
    muscleGroup: "biceps",
    equipment: ["kettlebell"],
    sets: 3,
    reps: 6,
    restTime: 90,
    description: "Hold kettlebell upside down by the handle at shoulder height. Press overhead while gripping tightly to stabilize the bell."
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
    id: "cable-wood-chop",
    name: "Cable Wood Chop",
    muscleGroup: "full body",
    equipment: ["cable machine"],
    sets: 3,
    reps: 10,
    restTime: 60,
    description: "Set cable at high position. Pull handle diagonally down and across body while rotating torso, engaging core, shoulders, and back."
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
  {
    id: "resistance-band-tricep-extension",
    name: "Resistance Band Tricep Extension",
    muscleGroup: "triceps",
    equipment: ["resistance bands"],
    sets: 3,
    reps: 15,
    restTime: 45,
    description: "Anchor band overhead. Hold handle behind head with elbow pointing up, extend arm down against resistance."
  },
  {
    id: "resistance-band-tricep-pushdown",
    name: "Resistance Band Tricep Pushdown",
    muscleGroup: "triceps",
    equipment: ["resistance bands"],
    sets: 3,
    reps: 15,
    restTime: 45,
    description: "Anchor band overhead. Hold handles and push down while keeping elbows at sides until arms are fully extended."
  },
  {
    id: "kettlebell-floor-press",
    name: "Kettlebell Floor Press",
    muscleGroup: "triceps",
    equipment: ["kettlebell"],
    sets: 3,
    reps: 8,
    restTime: 90,
    description: "Lie on floor holding kettlebell. Press kettlebell up from chest level until arm is extended, focusing on tricep engagement."
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
  {
    id: "kettlebell-russian-twist",
    name: "Kettlebell Russian Twist",
    muscleGroup: "core",
    equipment: ["kettlebell"],
    sets: 3,
    reps: 20,
    restTime: 45,
    description: "Sit with knees bent, holding kettlebell at chest. Lean back and rotate kettlebell from side to side while keeping core engaged."
  },
  {
    id: "kettlebell-plank-pull-through",
    name: "Kettlebell Plank Pull-Through",
    muscleGroup: "core",
    equipment: ["kettlebell"],
    sets: 3,
    reps: 10,
    restTime: 60,
    description: "Start in plank position with kettlebell to one side. Reach under with opposite arm to pull kettlebell to other side while maintaining plank."
  },
  {
    id: "resistance-band-wood-chop",
    name: "Resistance Band Wood Chop",
    muscleGroup: "core",
    equipment: ["resistance bands"],
    sets: 3,
    reps: 12,
    restTime: 45,
    description: "Anchor band at shoulder height. Pull handle diagonally down and across body while rotating torso."
  },
  {
    id: "resistance-band-pallof-press",
    name: "Resistance Band Pallof Press",
    muscleGroup: "core",
    equipment: ["resistance bands"],
    sets: 3,
    reps: 10,
    restTime: 45,
    description: "Anchor band at chest height. Hold handle at chest and press straight out, resisting rotation while maintaining core stability."
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
  {
    id: "kettlebell-snatch",
    name: "Kettlebell Snatch",
    muscleGroup: "full body",
    equipment: ["kettlebell"],
    sets: 3,
    reps: 6,
    restTime: 90,
    description: "Start with kettlebell between legs. Explosively pull it up and overhead in one fluid motion, catching it at the top."
  },
  {
    id: "kettlebell-clean-press",
    name: "Kettlebell Clean and Press",
    muscleGroup: "full body",
    equipment: ["kettlebell"],
    sets: 3,
    reps: 6,
    restTime: 90,
    description: "Explosively pull kettlebell from between legs to shoulder in rack position, then press overhead."
  },
  {
    id: "kettlebell-thruster",
    name: "Kettlebell Thruster",
    muscleGroup: "full body",
    equipment: ["kettlebell"],
    sets: 3,
    reps: 10,
    restTime: 60,
    description: "Hold kettlebell in rack position. Squat down, then as you stand, press kettlebell overhead in one fluid motion."
  },
  {
    id: "kettlebell-figure-8",
    name: "Kettlebell Figure-8",
    muscleGroup: "full body",
    equipment: ["kettlebell"],
    sets: 3,
    reps: 10,
    restTime: 60,
    description: "Stand with wide stance. Pass kettlebell between legs in a figure-8 pattern, switching hands as it goes around each leg."
  },
  {
    id: "resistance-band-squat-to-press",
    name: "Resistance Band Squat to Press",
    muscleGroup: "full body",
    equipment: ["resistance bands"],
    sets: 3,
    reps: 12,
    restTime: 60,
    description: "Stand on band holding handles at shoulders. Squat down, then as you stand, press handles overhead."
  },
  {
    id: "resistance-band-burpee",
    name: "Resistance Band Burpee",
    muscleGroup: "full body",
    equipment: ["resistance bands"],
    sets: 3,
    reps: 8,
    restTime: 90,
    description: "Perform a burpee while wearing a resistance band around your ankles to add extra resistance to the movement."
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
  },
  {
    id: "kettlebell-swing-cardio",
    name: "Kettlebell Swing (Cardio)",
    muscleGroup: "cardio",
    equipment: ["kettlebell"],
    sets: 4,
    reps: 20,
    restTime: 30,
    description: "Perform kettlebell swings at a faster pace for cardiovascular benefits. Focus on explosive hip drive and breathing rhythm."
  },
  {
    id: "resistance-band-jumping-jacks",
    name: "Resistance Band Jumping Jacks",
    muscleGroup: "cardio",
    equipment: ["resistance bands"],
    sets: 3,
    reps: 20,
    restTime: 45,
    description: "Perform jumping jacks while holding resistance band handles to add upper body resistance to the cardio movement."
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
  
  // For multiple equipment selections, ensure balanced distribution
  if (availableEquipment.length > 1) {
    const exercisesByEquipment: { [key: string]: Exercise[] } = {};
    
    // Group exercises by equipment type
    availableEquipment.forEach(equipment => {
      exercisesByEquipment[equipment] = filteredByMuscleAndEquipment.filter(ex => 
        ex.equipment.includes(equipment)
      );
    });
    
    // Ensure each equipment type is represented proportionally
    const balancedExercises: Exercise[] = [];
    const totalSlots = 15; // Target number of exercises
    const slotsPerEquipment = Math.floor(totalSlots / availableEquipment.length);
    const remainingSlots = totalSlots % availableEquipment.length;
    
    let slotIndex = 0;
    availableEquipment.forEach(equipment => {
      const equipmentExercises = exercisesByEquipment[equipment] || [];
      if (equipmentExercises.length > 0) {
        // Give extra slot to first few equipment types for remainder
        const slots = slotsPerEquipment + (slotIndex < remainingSlots ? 1 : 0);
        const shuffled = [...equipmentExercises].sort(() => 0.5 - Math.random());
        balancedExercises.push(...shuffled.slice(0, Math.min(slots, shuffled.length)));
      }
      slotIndex++;
    });
    
    // Fill any remaining slots with any matching exercises not already included
    if (balancedExercises.length < totalSlots) {
      const remaining = filteredByMuscleAndEquipment.filter(ex => 
        !balancedExercises.some(included => included.id === ex.id)
      );
      const remainingShuffled = [...remaining].sort(() => 0.5 - Math.random());
      balancedExercises.push(...remainingShuffled.slice(0, totalSlots - balancedExercises.length));
    }
    
    return [...balancedExercises].sort(() => 0.5 - Math.random());
  }
  
  // Single equipment or no equipment - return all matching exercises
  const shuffled = [...filteredByMuscleAndEquipment].sort(() => 0.5 - Math.random());
  return shuffled;
};
