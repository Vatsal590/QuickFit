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

export const generateWorkout = (formData: WorkoutFormData): Workout => {
  const { time, equipment, muscleGroups, intensity } = formData;
  
  // Get filtered exercises based on muscle groups, equipment, and intensity
  let selectedExercises = getFilteredExercises(muscleGroups, equipment, intensity);
  
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
  
  // Limit the number of exercises based on time available
  let maxExercises: number;
  if (time <= 10) {
    maxExercises = 3;
  } else if (time <= 20) {
    maxExercises = 4;
  } else if (time <= 30) {
    maxExercises = 6;
  } else if (time <= 45) {
    maxExercises = 8;
  } else {
    maxExercises = 10;
  }
  
  const limitedExercises = selectedExercises.slice(0, maxExercises);
  
  // Adjust exercises for the given intensity and time
  const adjustedExercises = limitedExercises.map(ex => 
    adjustExerciseForIntensity(ex, intensity, time)
  );
  
  // Generate a workout title
  const title = generateWorkoutTitle(muscleGroups, intensity);
  
  // Create the workout object
  const workout: Workout = {
    id: uuidv4(),
    title,
    duration: time,
    intensity,
    targetMuscleGroups: muscleGroups,
    equipment,
    exercises: adjustedExercises
  };
  
  return workout;
};
