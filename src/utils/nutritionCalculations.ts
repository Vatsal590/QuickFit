// Comprehensive nutrition calculation utilities based on scientific formulas
// Using Mifflin-St Jeor equation for BMR and evidence-based macro distributions

export interface NutritionProfile {
  weight: number; // in kg
  height: number; // in cm
  goalWeight?: number; // in kg
  bodyType: string; // 'Ectomorph', 'Mesomorph', 'Endomorph'
  workoutDaysPerWeek: number;
  age?: number; // optional, defaults to 30 if not provided
  gender?: 'male' | 'female'; // optional, defaults to male if not provided
}

export interface MacroTargets {
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fats: number; // in grams
}

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation
 * Most accurate formula for modern populations
 * 
 * Men: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(y) + 5
 * Women: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(y) - 161
 */
export const calculateBMR = (
  weight: number,
  height: number,
  age: number = 30,
  gender: 'male' | 'female' = 'male'
): number => {
  const baseBMR = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? baseBMR + 5 : baseBMR - 161;
};

/**
 * Calculate Total Daily Energy Expenditure (TDEE)
 * Based on activity level from workout frequency
 */
export const calculateTDEE = (bmr: number, workoutDaysPerWeek: number): number => {
  // Activity multipliers based on workout frequency
  let activityMultiplier: number;
  
  if (workoutDaysPerWeek === 0) {
    activityMultiplier = 1.2; // Sedentary
  } else if (workoutDaysPerWeek <= 2) {
    activityMultiplier = 1.375; // Lightly active (1-2 days/week)
  } else if (workoutDaysPerWeek <= 4) {
    activityMultiplier = 1.55; // Moderately active (3-4 days/week)
  } else if (workoutDaysPerWeek <= 6) {
    activityMultiplier = 1.725; // Very active (5-6 days/week)
  } else {
    activityMultiplier = 1.9; // Extremely active (7+ days/week)
  }
  
  return Math.round(bmr * activityMultiplier);
};

/**
 * Determine calorie adjustment based on goal
 * Returns adjusted daily calorie target
 */
export const adjustCaloriesForGoal = (
  tdee: number,
  currentWeight: number,
  goalWeight?: number
): { targetCalories: number; goalType: 'bulking' | 'cutting' | 'maintenance' } => {
  if (!goalWeight || Math.abs(goalWeight - currentWeight) < 2) {
    // Maintenance (within 2kg of goal)
    return { targetCalories: tdee, goalType: 'maintenance' };
  }
  
  const weightDifference = goalWeight - currentWeight;
  
  if (weightDifference > 0) {
    // Bulking: +300-500 calories for lean muscle gain
    return { 
      targetCalories: tdee + 400,
      goalType: 'bulking'
    };
  } else {
    // Cutting: -300-500 calories for fat loss
    return { 
      targetCalories: tdee - 400,
      goalType: 'cutting'
    };
  }
};

/**
 * Calculate macro distribution based on body type and goal
 * Based on research-backed recommendations for each body type
 */
export const calculateMacros = (
  targetCalories: number,
  bodyType: string,
  goalType: 'bulking' | 'cutting' | 'maintenance'
): MacroTargets => {
  let proteinPercent: number;
  let carbsPercent: number;
  let fatsPercent: number;

  // Body type specific macro ratios
  if (bodyType === 'Ectomorph') {
    // Ectomorphs: Fast metabolism, need more carbs
    if (goalType === 'bulking') {
      proteinPercent = 0.30;
      carbsPercent = 0.50;
      fatsPercent = 0.20;
    } else if (goalType === 'cutting') {
      proteinPercent = 0.35;
      carbsPercent = 0.40;
      fatsPercent = 0.25;
    } else {
      proteinPercent = 0.30;
      carbsPercent = 0.45;
      fatsPercent = 0.25;
    }
  } else if (bodyType === 'Mesomorph') {
    // Mesomorphs: Balanced metabolism, even macro distribution
    if (goalType === 'bulking') {
      proteinPercent = 0.30;
      carbsPercent = 0.40;
      fatsPercent = 0.30;
    } else if (goalType === 'cutting') {
      proteinPercent = 0.35;
      carbsPercent = 0.35;
      fatsPercent = 0.30;
    } else {
      proteinPercent = 0.30;
      carbsPercent = 0.40;
      fatsPercent = 0.30;
    }
  } else {
    // Endomorph: Slower metabolism, lower carbs, higher protein/fats
    if (goalType === 'bulking') {
      proteinPercent = 0.30;
      carbsPercent = 0.35;
      fatsPercent = 0.35;
    } else if (goalType === 'cutting') {
      proteinPercent = 0.40;
      carbsPercent = 0.30;
      fatsPercent = 0.30;
    } else {
      proteinPercent = 0.35;
      carbsPercent = 0.35;
      fatsPercent = 0.30;
    }
  }

  // Calculate macros in grams
  // Protein: 4 calories per gram
  // Carbs: 4 calories per gram
  // Fats: 9 calories per gram
  const proteinGrams = Math.round((targetCalories * proteinPercent) / 4);
  const carbsGrams = Math.round((targetCalories * carbsPercent) / 4);
  const fatsGrams = Math.round((targetCalories * fatsPercent) / 9);

  return {
    calories: targetCalories,
    protein: proteinGrams,
    carbs: carbsGrams,
    fats: fatsGrams
  };
};

/**
 * Main function to calculate complete nutrition targets
 * Uses scientific formulas and body type specific recommendations
 */
export const calculateNutritionTargets = (profile: NutritionProfile): MacroTargets & { goalType: string } => {
  // Step 1: Calculate BMR using Mifflin-St Jeor
  const bmr = calculateBMR(
    profile.weight,
    profile.height,
    profile.age,
    profile.gender
  );

  // Step 2: Calculate TDEE based on activity level
  const tdee = calculateTDEE(bmr, profile.workoutDaysPerWeek);

  // Step 3: Adjust calories based on goal
  const { targetCalories, goalType } = adjustCaloriesForGoal(
    tdee,
    profile.weight,
    profile.goalWeight
  );

  // Step 4: Calculate macro distribution
  const macros = calculateMacros(targetCalories, profile.bodyType, goalType);

  return {
    ...macros,
    goalType
  };
};
