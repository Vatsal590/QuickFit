export interface MealMacros {
  protein: number; // grams
  carbs: number; // grams
  fats: number; // grams
  calories: number;
}

export interface MealOption {
  name: string;
  macros: MealMacros;
  ingredients: MealIngredient[];
}

export interface MealIngredient {
  name: string;
  amount: number;
  unit: string; // e.g., "g", "oz", "cups", "pieces"
}

export interface DayMealPlan {
  day: number;
  meals: {
    breakfast: MealOption[];
    lunch: MealOption[];
    dinner: MealOption[];
    snacks: MealOption[];
  };
  totalMacros: MealMacros;
}

export interface GroceryItem {
  name: string;
  amount: number;
  unit: string;
  category: string;
}
