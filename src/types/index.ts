
export type MuscleGroup = 
  | "chest" 
  | "back" 
  | "shoulders" 
  | "legs" 
  | "biceps"
  | "triceps" 
  | "core" 
  | "full body" 
  | "cardio";

export type Equipment = 
  | "none" 
  | "dumbbells" 
  | "barbell" 
  | "kettlebell" 
  | "resistance bands" 
  | "cable machine" 
  | "bench" 
  | "pull-up bar";

export type IntensityLevel = "light" | "moderate" | "intense";

export type TimeFrame = 10 | 20 | 30 | 45 | 60;

export type Workout = {
  id: string;
  title: string;
  duration: TimeFrame;
  intensity: IntensityLevel;
  targetMuscleGroups: MuscleGroup[];
  equipment: Equipment[];
  warmupExercises: Exercise[];
  exercises: Exercise[];
  cooldownExercises: Exercise[];
};

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment[];
  sets: number;
  reps: number;
  restTime: number; // in seconds
  description: string;
  imageUrl?: string;
};

export type WorkoutHistoryItem = {
  id: string;
  date: string;
  workoutId: string;
  completed: boolean;
};

export type WorkoutFormData = {
  time: TimeFrame;
  equipment: Equipment[];
  muscleGroups: MuscleGroup[];
  intensity: IntensityLevel;
};

export type WorkoutPlan = {
  id: string;
  title: string;
  goal: string;
  type: string;
  duration: number;
  daysLeft: number;
  equipment: Equipment[];
  exercises?: Exercise[];
  schedule?: any[];
  createdAt: string;
};
