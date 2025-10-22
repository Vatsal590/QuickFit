import { MealOption } from '@/types/meal';

// Meal database with accurate macros and ingredients
export const mealDatabase: Record<string, MealOption> = {
  // AMERICAN BREAKFAST
  'Scrambled eggs with turkey bacon and avocado': {
    name: 'Scrambled eggs with turkey bacon and avocado',
    macros: { protein: 28, carbs: 12, fats: 22, calories: 380 },
    ingredients: [
      { name: 'Eggs', amount: 3, unit: 'pieces' },
      { name: 'Turkey bacon', amount: 60, unit: 'g' },
      { name: 'Avocado', amount: 100, unit: 'g' },
      { name: 'Olive oil', amount: 5, unit: 'ml' }
    ]
  },
  'Protein pancakes with Greek yogurt and berries': {
    name: 'Protein pancakes with Greek yogurt and berries',
    macros: { protein: 32, carbs: 45, fats: 8, calories: 380 },
    ingredients: [
      { name: 'Oat flour', amount: 60, unit: 'g' },
      { name: 'Protein powder', amount: 30, unit: 'g' },
      { name: 'Eggs', amount: 2, unit: 'pieces' },
      { name: 'Greek yogurt', amount: 150, unit: 'g' },
      { name: 'Mixed berries', amount: 100, unit: 'g' }
    ]
  },
  'Greek yogurt with granola and mixed nuts': {
    name: 'Greek yogurt with granola and mixed nuts',
    macros: { protein: 25, carbs: 48, fats: 18, calories: 450 },
    ingredients: [
      { name: 'Greek yogurt', amount: 200, unit: 'g' },
      { name: 'Granola', amount: 50, unit: 'g' },
      { name: 'Mixed nuts', amount: 30, unit: 'g' },
      { name: 'Honey', amount: 15, unit: 'ml' }
    ]
  },
  'Tofu scramble with nutritional yeast and spinach': {
    name: 'Tofu scramble with nutritional yeast and spinach',
    macros: { protein: 22, carbs: 15, fats: 14, calories: 280 },
    ingredients: [
      { name: 'Firm tofu', amount: 200, unit: 'g' },
      { name: 'Spinach', amount: 100, unit: 'g' },
      { name: 'Nutritional yeast', amount: 10, unit: 'g' },
      { name: 'Olive oil', amount: 10, unit: 'ml' },
      { name: 'Cherry tomatoes', amount: 80, unit: 'g' }
    ]
  },

  // AMERICAN LUNCH
  'Grilled chicken Caesar salad with parmesan': {
    name: 'Grilled chicken Caesar salad with parmesan',
    macros: { protein: 42, carbs: 18, fats: 22, calories: 450 },
    ingredients: [
      { name: 'Chicken breast', amount: 180, unit: 'g' },
      { name: 'Romaine lettuce', amount: 150, unit: 'g' },
      { name: 'Parmesan cheese', amount: 30, unit: 'g' },
      { name: 'Caesar dressing', amount: 30, unit: 'ml' },
      { name: 'Whole grain croutons', amount: 30, unit: 'g' }
    ]
  },
  'Salmon salad with mixed greens and nuts': {
    name: 'Salmon salad with mixed greens and nuts',
    macros: { protein: 38, carbs: 15, fats: 28, calories: 480 },
    ingredients: [
      { name: 'Salmon fillet', amount: 150, unit: 'g' },
      { name: 'Mixed greens', amount: 100, unit: 'g' },
      { name: 'Walnuts', amount: 30, unit: 'g' },
      { name: 'Cherry tomatoes', amount: 100, unit: 'g' },
      { name: 'Olive oil', amount: 15, unit: 'ml' },
      { name: 'Lemon juice', amount: 15, unit: 'ml' }
    ]
  },
  'Lentil and quinoa salad with tahini dressing': {
    name: 'Lentil and quinoa salad with tahini dressing',
    macros: { protein: 20, carbs: 52, fats: 16, calories: 440 },
    ingredients: [
      { name: 'Cooked lentils', amount: 150, unit: 'g' },
      { name: 'Cooked quinoa', amount: 100, unit: 'g' },
      { name: 'Tahini', amount: 25, unit: 'g' },
      { name: 'Mixed vegetables', amount: 150, unit: 'g' },
      { name: 'Lemon juice', amount: 15, unit: 'ml' }
    ]
  },

  // AMERICAN DINNER
  'Grilled salmon with quinoa and asparagus': {
    name: 'Grilled salmon with quinoa and asparagus',
    macros: { protein: 45, carbs: 48, fats: 24, calories: 600 },
    ingredients: [
      { name: 'Salmon fillet', amount: 200, unit: 'g' },
      { name: 'Quinoa', amount: 80, unit: 'g' },
      { name: 'Asparagus', amount: 200, unit: 'g' },
      { name: 'Olive oil', amount: 15, unit: 'ml' },
      { name: 'Lemon', amount: 1, unit: 'pieces' },
      { name: 'Garlic', amount: 2, unit: 'cloves' }
    ]
  },
  'Chicken breast with brown rice and steamed broccoli': {
    name: 'Chicken breast with brown rice and steamed broccoli',
    macros: { protein: 48, carbs: 52, fats: 10, calories: 500 },
    ingredients: [
      { name: 'Chicken breast', amount: 200, unit: 'g' },
      { name: 'Brown rice', amount: 80, unit: 'g' },
      { name: 'Broccoli', amount: 200, unit: 'g' },
      { name: 'Olive oil', amount: 10, unit: 'ml' }
    ]
  },
  'Tofu stir-fry with cashews and edamame': {
    name: 'Tofu stir-fry with cashews and edamame',
    macros: { protein: 28, carbs: 45, fats: 22, calories: 520 },
    ingredients: [
      { name: 'Firm tofu', amount: 200, unit: 'g' },
      { name: 'Edamame', amount: 100, unit: 'g' },
      { name: 'Cashews', amount: 30, unit: 'g' },
      { name: 'Mixed vegetables', amount: 200, unit: 'g' },
      { name: 'Brown rice', amount: 80, unit: 'g' },
      { name: 'Soy sauce', amount: 15, unit: 'ml' },
      { name: 'Sesame oil', amount: 10, unit: 'ml' }
    ]
  },

  // SNACKS
  'Greek yogurt with berries and granola': {
    name: 'Greek yogurt with berries and granola',
    macros: { protein: 18, carbs: 35, fats: 8, calories: 280 },
    ingredients: [
      { name: 'Greek yogurt', amount: 150, unit: 'g' },
      { name: 'Mixed berries', amount: 80, unit: 'g' },
      { name: 'Granola', amount: 30, unit: 'g' }
    ]
  },
  'Mixed nuts and seeds with dried fruit': {
    name: 'Mixed nuts and seeds with dried fruit',
    macros: { protein: 8, carbs: 28, fats: 18, calories: 300 },
    ingredients: [
      { name: 'Mixed nuts', amount: 40, unit: 'g' },
      { name: 'Pumpkin seeds', amount: 15, unit: 'g' },
      { name: 'Dried fruit', amount: 30, unit: 'g' }
    ]
  },
  'Hummus with vegetables and whole grain crackers': {
    name: 'Hummus with vegetables and whole grain crackers',
    macros: { protein: 10, carbs: 32, fats: 12, calories: 270 },
    ingredients: [
      { name: 'Hummus', amount: 80, unit: 'g' },
      { name: 'Carrot sticks', amount: 100, unit: 'g' },
      { name: 'Cucumber', amount: 100, unit: 'g' },
      { name: 'Whole grain crackers', amount: 30, unit: 'g' }
    ]
  },
  'Protein bar with nuts and seeds': {
    name: 'Protein bar with nuts and seeds',
    macros: { protein: 20, carbs: 25, fats: 10, calories: 270 },
    ingredients: [
      { name: 'Protein bar', amount: 1, unit: 'pieces' },
      { name: 'Almonds', amount: 15, unit: 'g' }
    ]
  },

  // ITALIAN
  'Chicken parmigiana with marinara sauce': {
    name: 'Chicken parmigiana with marinara sauce',
    macros: { protein: 48, carbs: 42, fats: 20, calories: 560 },
    ingredients: [
      { name: 'Chicken breast', amount: 200, unit: 'g' },
      { name: 'Mozzarella cheese', amount: 50, unit: 'g' },
      { name: 'Marinara sauce', amount: 150, unit: 'ml' },
      { name: 'Whole grain pasta', amount: 80, unit: 'g' },
      { name: 'Parmesan cheese', amount: 20, unit: 'g' },
      { name: 'Olive oil', amount: 10, unit: 'ml' }
    ]
  },
  'Seafood risotto with shrimp and scallops': {
    name: 'Seafood risotto with shrimp and scallops',
    macros: { protein: 42, carbs: 58, fats: 18, calories: 580 },
    ingredients: [
      { name: 'Arborio rice', amount: 80, unit: 'g' },
      { name: 'Shrimp', amount: 100, unit: 'g' },
      { name: 'Scallops', amount: 80, unit: 'g' },
      { name: 'Parmesan cheese', amount: 30, unit: 'g' },
      { name: 'White wine', amount: 50, unit: 'ml' },
      { name: 'Olive oil', amount: 15, unit: 'ml' }
    ]
  },

  // JAPANESE
  'Salmon sushi and miso soup': {
    name: 'Salmon sushi and miso soup',
    macros: { protein: 35, carbs: 52, fats: 14, calories: 480 },
    ingredients: [
      { name: 'Sushi rice', amount: 150, unit: 'g' },
      { name: 'Salmon', amount: 120, unit: 'g' },
      { name: 'Nori sheets', amount: 3, unit: 'pieces' },
      { name: 'Miso paste', amount: 20, unit: 'g' },
      { name: 'Tofu', amount: 50, unit: 'g' },
      { name: 'Soy sauce', amount: 15, unit: 'ml' }
    ]
  },
  'Chicken teriyaki with steamed rice': {
    name: 'Chicken teriyaki with steamed rice',
    macros: { protein: 45, carbs: 58, fats: 10, calories: 510 },
    ingredients: [
      { name: 'Chicken breast', amount: 180, unit: 'g' },
      { name: 'White rice', amount: 150, unit: 'g' },
      { name: 'Teriyaki sauce', amount: 40, unit: 'ml' },
      { name: 'Broccoli', amount: 150, unit: 'g' },
      { name: 'Sesame seeds', amount: 5, unit: 'g' }
    ]
  },

  // MEDITERRANEAN
  'Grilled chicken with Greek salad': {
    name: 'Grilled chicken with Greek salad',
    macros: { protein: 45, carbs: 22, fats: 24, calories: 500 },
    ingredients: [
      { name: 'Chicken breast', amount: 180, unit: 'g' },
      { name: 'Feta cheese', amount: 50, unit: 'g' },
      { name: 'Cucumber', amount: 150, unit: 'g' },
      { name: 'Tomatoes', amount: 150, unit: 'g' },
      { name: 'Olives', amount: 30, unit: 'g' },
      { name: 'Olive oil', amount: 20, unit: 'ml' },
      { name: 'Red onion', amount: 50, unit: 'g' }
    ]
  },
  'Grilled fish with herbs and olive oil': {
    name: 'Grilled fish with herbs and olive oil',
    macros: { protein: 42, carbs: 15, fats: 22, calories: 440 },
    ingredients: [
      { name: 'White fish fillet', amount: 200, unit: 'g' },
      { name: 'Olive oil', amount: 20, unit: 'ml' },
      { name: 'Fresh herbs', amount: 10, unit: 'g' },
      { name: 'Lemon', amount: 1, unit: 'pieces' },
      { name: 'Roasted vegetables', amount: 200, unit: 'g' }
    ]
  },

  // INDIAN
  'Chicken curry with brown rice': {
    name: 'Chicken curry with brown rice',
    macros: { protein: 45, carbs: 55, fats: 18, calories: 580 },
    ingredients: [
      { name: 'Chicken breast', amount: 180, unit: 'g' },
      { name: 'Brown rice', amount: 100, unit: 'g' },
      { name: 'Curry sauce', amount: 150, unit: 'ml' },
      { name: 'Onions', amount: 100, unit: 'g' },
      { name: 'Tomatoes', amount: 100, unit: 'g' },
      { name: 'Coconut milk', amount: 50, unit: 'ml' },
      { name: 'Spices', amount: 10, unit: 'g' }
    ]
  },
  'Paneer curry with brown rice': {
    name: 'Paneer curry with brown rice',
    macros: { protein: 28, carbs: 58, fats: 22, calories: 560 },
    ingredients: [
      { name: 'Paneer cheese', amount: 150, unit: 'g' },
      { name: 'Brown rice', amount: 100, unit: 'g' },
      { name: 'Curry sauce', amount: 150, unit: 'ml' },
      { name: 'Mixed vegetables', amount: 150, unit: 'g' },
      { name: 'Ghee', amount: 10, unit: 'ml' }
    ]
  },
  'Dal with brown rice and vegetables': {
    name: 'Dal with brown rice and vegetables',
    macros: { protein: 22, carbs: 62, fats: 8, calories: 420 },
    ingredients: [
      { name: 'Red lentils', amount: 100, unit: 'g' },
      { name: 'Brown rice', amount: 100, unit: 'g' },
      { name: 'Mixed vegetables', amount: 150, unit: 'g' },
      { name: 'Ghee', amount: 10, unit: 'ml' },
      { name: 'Spices', amount: 10, unit: 'g' }
    ]
  },

  // MEXICAN
  'Chicken taco bowl with brown rice': {
    name: 'Chicken taco bowl with brown rice',
    macros: { protein: 42, carbs: 52, fats: 18, calories: 540 },
    ingredients: [
      { name: 'Chicken breast', amount: 170, unit: 'g' },
      { name: 'Brown rice', amount: 100, unit: 'g' },
      { name: 'Black beans', amount: 80, unit: 'g' },
      { name: 'Avocado', amount: 50, unit: 'g' },
      { name: 'Salsa', amount: 50, unit: 'ml' },
      { name: 'Corn', amount: 60, unit: 'g' },
      { name: 'Bell peppers', amount: 80, unit: 'g' }
    ]
  },
  'Black bean and quinoa bowl': {
    name: 'Black bean and quinoa bowl',
    macros: { protein: 20, carbs: 58, fats: 12, calories: 420 },
    ingredients: [
      { name: 'Black beans', amount: 150, unit: 'g' },
      { name: 'Quinoa', amount: 80, unit: 'g' },
      { name: 'Avocado', amount: 50, unit: 'g' },
      { name: 'Corn', amount: 80, unit: 'g' },
      { name: 'Tomatoes', amount: 100, unit: 'g' },
      { name: 'Lime juice', amount: 15, unit: 'ml' }
    ]
  },

  // THAI
  'Pad Thai with chicken and vegetables': {
    name: 'Pad Thai with chicken and vegetables',
    macros: { protein: 38, carbs: 58, fats: 18, calories: 560 },
    ingredients: [
      { name: 'Rice noodles', amount: 100, unit: 'g' },
      { name: 'Chicken breast', amount: 150, unit: 'g' },
      { name: 'Eggs', amount: 2, unit: 'pieces' },
      { name: 'Bean sprouts', amount: 80, unit: 'g' },
      { name: 'Peanuts', amount: 25, unit: 'g' },
      { name: 'Tamarind sauce', amount: 30, unit: 'ml' },
      { name: 'Fish sauce', amount: 15, unit: 'ml' }
    ]
  },
  'Green curry chicken with jasmine rice': {
    name: 'Green curry chicken with jasmine rice',
    macros: { protein: 42, carbs: 54, fats: 20, calories: 580 },
    ingredients: [
      { name: 'Chicken breast', amount: 170, unit: 'g' },
      { name: 'Jasmine rice', amount: 100, unit: 'g' },
      { name: 'Green curry paste', amount: 30, unit: 'g' },
      { name: 'Coconut milk', amount: 100, unit: 'ml' },
      { name: 'Mixed vegetables', amount: 150, unit: 'g' },
      { name: 'Thai basil', amount: 10, unit: 'g' }
    ]
  },
  'Pad Thai with tofu and vegetables': {
    name: 'Pad Thai with tofu and vegetables',
    macros: { protein: 22, carbs: 62, fats: 16, calories: 500 },
    ingredients: [
      { name: 'Rice noodles', amount: 100, unit: 'g' },
      { name: 'Firm tofu', amount: 150, unit: 'g' },
      { name: 'Bean sprouts', amount: 100, unit: 'g' },
      { name: 'Peanuts', amount: 25, unit: 'g' },
      { name: 'Tamarind sauce', amount: 30, unit: 'ml' }
    ]
  },
};

// Helper function to get meal by name
export const getMealByName = (name: string): MealOption | undefined => {
  return mealDatabase[name];
};
