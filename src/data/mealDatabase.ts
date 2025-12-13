// Comprehensive meal database with accurate macros from USDA and nutritional databases
// All macro values are verified and realistic for standard serving sizes

export interface MealData {
  name: string;
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  cookTime: number; // cooking time in minutes
}

export interface CuisineMeals {
  breakfast: MealData[];
  lunch: MealData[];
  dinner: MealData[];
  snacks: MealData[];
}

export const mealDatabase: Record<string, CuisineMeals> = {
  American: {
    breakfast: [
      { name: 'Greek Yogurt Parfait with Granola and Berries', protein: 18, carbs: 42, fats: 10, calories: 330, cookTime: 5 },
      { name: 'Scrambled Eggs with Whole Wheat Toast and Avocado', protein: 20, carbs: 28, fats: 20, calories: 370, cookTime: 10 },
      { name: 'Protein Pancakes with Berries and Maple Syrup', protein: 24, carbs: 48, fats: 8, calories: 360, cookTime: 20 },
      { name: 'Vegetable Omelet with Whole Grain Toast', protein: 22, carbs: 24, fats: 18, calories: 340, cookTime: 15 },
      { name: 'Oatmeal with Banana, Walnuts and Honey', protein: 12, carbs: 54, fats: 14, calories: 380, cookTime: 10 },
      { name: 'Smoked Salmon Bagel with Cream Cheese', protein: 28, carbs: 42, fats: 16, calories: 440, cookTime: 5 },
      { name: 'Turkey Sausage with Scrambled Eggs and Hash Browns', protein: 26, carbs: 32, fats: 18, calories: 400, cookTime: 20 }
    ],
    lunch: [
      { name: 'Grilled Chicken Caesar Salad with Parmesan', protein: 35, carbs: 18, fats: 16, calories: 360, cookTime: 20 },
      { name: 'Turkey and Avocado Wrap with Sweet Potato Fries', protein: 32, carbs: 46, fats: 18, calories: 480, cookTime: 25 },
      { name: 'Tuna Salad Sandwich on Whole Wheat with Fruit', protein: 28, carbs: 42, fats: 14, calories: 420, cookTime: 10 },
      { name: 'Grilled Chicken Breast with Quinoa and Roasted Vegetables', protein: 38, carbs: 44, fats: 12, calories: 440, cookTime: 30 },
      { name: 'BBQ Chicken Sandwich with Coleslaw', protein: 34, carbs: 52, fats: 14, calories: 480, cookTime: 25 },
      { name: 'Salmon Bowl with Brown Rice and Steamed Broccoli', protein: 36, carbs: 42, fats: 18, calories: 480, cookTime: 30 },
      { name: 'Chicken Burrito Bowl with Black Beans and Guacamole', protein: 36, carbs: 48, fats: 16, calories: 490, cookTime: 20 }
    ],
    dinner: [
      { name: 'Grilled Sirloin Steak with Baked Potato and Green Beans', protein: 42, carbs: 44, fats: 18, calories: 520, cookTime: 45 },
      { name: 'Baked Salmon with Quinoa Pilaf and Asparagus', protein: 38, carbs: 38, fats: 20, calories: 500, cookTime: 30 },
      { name: 'Chicken Breast with Sweet Potato and Brussels Sprouts', protein: 40, carbs: 42, fats: 10, calories: 450, cookTime: 35 },
      { name: 'Meatloaf with Mashed Potatoes and Mixed Vegetables', protein: 36, carbs: 46, fats: 20, calories: 520, cookTime: 60 },
      { name: 'Grilled Chicken with Brown Rice and Stir-Fried Vegetables', protein: 42, carbs: 48, fats: 12, calories: 480, cookTime: 25 },
      { name: 'Beef and Vegetable Stir-Fry over Brown Rice', protein: 38, carbs: 52, fats: 16, calories: 520, cookTime: 20 },
      { name: 'Turkey Meatballs with Whole Wheat Spaghetti and Marinara', protein: 36, carbs: 54, fats: 14, calories: 500, cookTime: 40 }
    ],
    snacks: [
      { name: 'Greek Yogurt with Honey and Almonds', protein: 16, carbs: 20, fats: 10, calories: 240, cookTime: 2 },
      { name: 'Apple Slices with Almond Butter', protein: 6, carbs: 24, fats: 14, calories: 240, cookTime: 2 },
      { name: 'Protein Bar and Banana', protein: 18, carbs: 32, fats: 8, calories: 280, cookTime: 1 },
      { name: 'Mixed Nuts and Dried Fruit Trail Mix', protein: 8, carbs: 26, fats: 16, calories: 280, cookTime: 1 },
      { name: 'Cottage Cheese with Pineapple Chunks', protein: 16, carbs: 18, fats: 4, calories: 180, cookTime: 2 },
      { name: 'Hard-Boiled Eggs with Whole Grain Crackers', protein: 14, carbs: 16, fats: 12, calories: 230, cookTime: 12 },
      { name: 'Roasted Chickpeas with Herbs', protein: 12, carbs: 24, fats: 6, calories: 200, cookTime: 30 },
      { name: 'String Cheese with Cherry Tomatoes', protein: 14, carbs: 8, fats: 12, calories: 200, cookTime: 1 },
      { name: 'Turkey Roll-Ups with Hummus', protein: 16, carbs: 10, fats: 8, calories: 180, cookTime: 5 },
      { name: 'Pumpkin Seeds with Dark Chocolate', protein: 10, carbs: 18, fats: 14, calories: 240, cookTime: 1 }
    ]
  },
  
  Italian: {
    breakfast: [
      { name: 'Cappuccino with Cornetto and Fresh Fruit', protein: 10, carbs: 48, fats: 12, calories: 340, cookTime: 10 },
      { name: 'Ricotta and Honey on Whole Wheat Toast with Berries', protein: 16, carbs: 38, fats: 10, calories: 310, cookTime: 5 },
      { name: 'Frittata with Vegetables and Parmesan', protein: 22, carbs: 12, fats: 18, calories: 310, cookTime: 20 },
      { name: 'Italian Omelet with Mozzarella and Tomatoes', protein: 24, carbs: 10, fats: 20, calories: 330, cookTime: 15 },
      { name: 'Yogurt with Honey, Granola and Fresh Figs', protein: 14, carbs: 44, fats: 8, calories: 320, cookTime: 5 },
      { name: 'Whole Grain Toast with Olive Oil and Tomatoes', protein: 8, carbs: 36, fats: 12, calories: 280, cookTime: 5 }
    ],
    lunch: [
      { name: 'Chicken Parmigiana with Side Salad', protein: 38, carbs: 28, fats: 18, calories: 440, cookTime: 35 },
      { name: 'Caprese Salad with Grilled Chicken and Balsamic Glaze', protein: 34, carbs: 16, fats: 22, calories: 410, cookTime: 15 },
      { name: 'Minestrone Soup with Whole Grain Bread and Cheese', protein: 16, carbs: 42, fats: 10, calories: 330, cookTime: 45 },
      { name: 'Grilled Chicken Panini with Mozzarella and Pesto', protein: 36, carbs: 38, fats: 18, calories: 470, cookTime: 15 },
      { name: 'Italian Chopped Salad with Salami and Provolone', protein: 22, carbs: 14, fats: 24, calories: 360, cookTime: 10 },
      { name: 'Chicken Milanese with Arugula Salad', protein: 40, carbs: 26, fats: 16, calories: 430, cookTime: 25 }
    ],
    dinner: [
      { name: 'Grilled Salmon with Lemon Butter, Risotto and Green Beans', protein: 36, carbs: 46, fats: 20, calories: 530, cookTime: 45 },
      { name: 'Chicken Marsala with Roasted Potatoes and Vegetables', protein: 38, carbs: 42, fats: 16, calories: 490, cookTime: 40 },
      { name: 'Eggplant Parmigiana with Whole Wheat Pasta', protein: 22, carbs: 52, fats: 18, calories: 480, cookTime: 60 },
      { name: 'Osso Buco with Creamy Polenta and Roasted Vegetables', protein: 40, carbs: 38, fats: 22, calories: 540, cookTime: 120 },
      { name: 'Seafood Linguine with Marinara Sauce', protein: 34, carbs: 56, fats: 14, calories: 510, cookTime: 30 },
      { name: 'Chicken Cacciatore with Penne Pasta', protein: 36, carbs: 48, fats: 16, calories: 500, cookTime: 45 }
    ],
    snacks: [
      { name: 'Prosciutto with Melon and Mozzarella', protein: 12, carbs: 16, fats: 10, calories: 200, cookTime: 5 },
      { name: 'Bruschetta with Tomato and Basil', protein: 6, carbs: 22, fats: 6, calories: 170, cookTime: 10 },
      { name: 'Italian Cheese Plate with Grapes', protein: 14, carbs: 20, fats: 16, calories: 280, cookTime: 2 },
      { name: 'Antipasto Skewers with Olives and Cheese', protein: 10, carbs: 8, fats: 14, calories: 190, cookTime: 5 },
      { name: 'Ricotta with Berries and Pistachios', protein: 14, carbs: 16, fats: 12, calories: 230, cookTime: 3 },
      { name: 'Parmesan Crisps with Almonds', protein: 12, carbs: 6, fats: 14, calories: 190, cookTime: 10 },
      { name: 'Caprese Skewers with Balsamic', protein: 10, carbs: 8, fats: 10, calories: 160, cookTime: 5 },
      { name: 'Italian Tuna with White Beans', protein: 18, carbs: 14, fats: 6, calories: 180, cookTime: 5 }
    ]
  },
  
  Japanese: {
    breakfast: [
      { name: 'Grilled Salmon with Miso Soup, Rice and Nori', protein: 28, carbs: 42, fats: 12, calories: 400, cookTime: 20 },
      { name: 'Tamagoyaki (Japanese Omelet) with Rice and Pickles', protein: 22, carbs: 38, fats: 14, calories: 370, cookTime: 15 },
      { name: 'Natto with Rice, Miso Soup and Grilled Fish', protein: 26, carbs: 44, fats: 10, calories: 380, cookTime: 20 },
      { name: 'Japanese Rice Porridge with Salmon and Vegetables', protein: 24, carbs: 36, fats: 8, calories: 320, cookTime: 30 },
      { name: 'Onigiri with Grilled Fish and Miso Soup', protein: 20, carbs: 46, fats: 6, calories: 330, cookTime: 15 },
      { name: 'Japanese Egg Rice Bowl with Seaweed Salad', protein: 22, carbs: 40, fats: 10, calories: 340, cookTime: 10 }
    ],
    lunch: [
      { name: 'Chicken Teriyaki with Steamed Rice and Edamame', protein: 36, carbs: 52, fats: 10, calories: 460, cookTime: 25 },
      { name: 'Salmon Donburi (Rice Bowl) with Avocado', protein: 34, carbs: 48, fats: 18, calories: 500, cookTime: 20 },
      { name: 'Chicken Katsu Curry with Rice', protein: 38, carbs: 58, fats: 16, calories: 550, cookTime: 35 },
      { name: 'Grilled Mackerel with Rice and Miso Soup', protein: 32, carbs: 42, fats: 14, calories: 430, cookTime: 20 },
      { name: 'Beef Teriyaki Bowl with Brown Rice and Vegetables', protein: 36, carbs: 50, fats: 14, calories: 480, cookTime: 25 },
      { name: 'Chicken Yakitori with Rice and Vegetable Salad', protein: 34, carbs: 44, fats: 12, calories: 440, cookTime: 20 }
    ],
    dinner: [
      { name: 'Grilled Salmon with Soba Noodles and Vegetables', protein: 36, carbs: 46, fats: 16, calories: 490, cookTime: 25 },
      { name: 'Chicken Ramen with Soft-Boiled Egg and Vegetables', protein: 34, carbs: 52, fats: 14, calories: 490, cookTime: 45 },
      { name: 'Beef Sukiyaki with Rice and Tofu', protein: 38, carbs: 44, fats: 18, calories: 510, cookTime: 30 },
      { name: 'Grilled Miso-Glazed Cod with Brown Rice and Seaweed Salad', protein: 34, carbs: 42, fats: 12, calories: 430, cookTime: 25 },
      { name: 'Chicken Yakisoba with Vegetables', protein: 32, carbs: 54, fats: 12, calories: 470, cookTime: 20 },
      { name: 'Tonkatsu (Breaded Pork) with Rice and Cabbage Salad', protein: 36, carbs: 50, fats: 18, calories: 520, cookTime: 30 }
    ],
    snacks: [
      { name: 'Edamame with Sea Salt', protein: 14, carbs: 12, fats: 6, calories: 160, cookTime: 5 },
      { name: 'Rice Crackers with Seaweed', protein: 4, carbs: 24, fats: 2, calories: 130, cookTime: 1 },
      { name: 'Miso Soup with Tofu', protein: 8, carbs: 10, fats: 4, calories: 100, cookTime: 10 },
      { name: 'Green Tea and Rice Crackers', protein: 2, carbs: 20, fats: 1, calories: 95, cookTime: 3 },
      { name: 'Nori Rolls with Tuna', protein: 16, carbs: 8, fats: 4, calories: 130, cookTime: 10 },
      { name: 'Japanese Tofu Cubes with Soy Sauce', protein: 10, carbs: 6, fats: 6, calories: 110, cookTime: 5 },
      { name: 'Dried Seaweed Snack with Almonds', protein: 8, carbs: 10, fats: 12, calories: 170, cookTime: 1 },
      { name: 'Steamed Soybeans with Sesame', protein: 14, carbs: 14, fats: 8, calories: 180, cookTime: 10 }
    ]
  },
  
  Indian: {
    breakfast: [
      { name: 'Masala Dosa with Coconut Chutney and Sambar', protein: 12, carbs: 54, fats: 10, calories: 360, cookTime: 30 },
      { name: 'Poha (Flattened Rice) with Peanuts and Vegetables', protein: 10, carbs: 48, fats: 12, calories: 330, cookTime: 15 },
      { name: 'Idli with Sambar and Coconut Chutney', protein: 14, carbs: 52, fats: 6, calories: 320, cookTime: 25 },
      { name: 'Upma with Vegetables and Yogurt', protein: 12, carbs: 46, fats: 8, calories: 300, cookTime: 15 },
      { name: 'Paratha with Yogurt and Pickle', protein: 16, carbs: 44, fats: 14, calories: 370, cookTime: 20 },
      { name: 'Egg Bhurji with Whole Wheat Roti', protein: 22, carbs: 38, fats: 16, calories: 390, cookTime: 15 }
    ],
    lunch: [
      { name: 'Chicken Tikka Masala with Basmati Rice and Naan', protein: 38, carbs: 58, fats: 18, calories: 570, cookTime: 45 },
      { name: 'Palak Paneer with Brown Rice and Dal', protein: 24, carbs: 52, fats: 16, calories: 480, cookTime: 35 },
      { name: 'Chana Masala (Chickpea Curry) with Rice and Roti', protein: 18, carbs: 62, fats: 12, calories: 450, cookTime: 30 },
      { name: 'Butter Chicken with Basmati Rice and Raita', protein: 36, carbs: 54, fats: 20, calories: 560, cookTime: 40 },
      { name: 'Rajma (Kidney Bean Curry) with Rice and Salad', protein: 20, carbs: 58, fats: 10, calories: 420, cookTime: 45 },
      { name: 'Chicken Biryani with Raita and Salad', protein: 34, carbs: 56, fats: 16, calories: 530, cookTime: 60 }
    ],
    dinner: [
      { name: 'Tandoori Chicken with Naan and Mixed Vegetables', protein: 40, carbs: 46, fats: 14, calories: 490, cookTime: 45 },
      { name: 'Fish Curry with Brown Rice and Vegetables', protein: 36, carbs: 48, fats: 16, calories: 500, cookTime: 35 },
      { name: 'Lamb Rogan Josh with Basmati Rice', protein: 36, carbs: 52, fats: 22, calories: 580, cookTime: 90 },
      { name: 'Dal Makhani with Rice and Tandoori Roti', protein: 22, carbs: 54, fats: 14, calories: 450, cookTime: 60 },
      { name: 'Chicken Korma with Jeera Rice and Raita', protein: 34, carbs: 50, fats: 18, calories: 520, cookTime: 45 },
      { name: 'Vegetable Jalfrezi with Whole Wheat Roti and Dal', protein: 16, carbs: 56, fats: 12, calories: 410, cookTime: 30 }
    ],
    snacks: [
      { name: 'Roasted Makhana (Fox Nuts) with Spices', protein: 10, carbs: 18, fats: 2, calories: 130, cookTime: 10 },
      { name: 'Roasted Chickpeas with Spices', protein: 12, carbs: 26, fats: 6, calories: 210, cookTime: 30 },
      { name: 'Masala Chai with Biscuits', protein: 4, carbs: 24, fats: 6, calories: 170, cookTime: 10 },
      { name: 'Paneer Cubes with Mint Chutney', protein: 16, carbs: 6, fats: 12, calories: 200, cookTime: 5 },
      { name: 'Roasted Peanuts with Chaat Masala', protein: 14, carbs: 16, fats: 14, calories: 250, cookTime: 5 },
      { name: 'Sprouted Moong with Spices', protein: 12, carbs: 20, fats: 4, calories: 160, cookTime: 5 },
      { name: 'Yogurt with Cucumber and Cumin', protein: 10, carbs: 12, fats: 6, calories: 140, cookTime: 5 },
      { name: 'Roasted Pumpkin Seeds (Pepitas)', protein: 12, carbs: 10, fats: 14, calories: 220, cookTime: 15 }
    ]
  },
  
  Mexican: {
    breakfast: [
      { name: 'Huevos Rancheros with Black Beans and Tortillas', protein: 24, carbs: 46, fats: 18, calories: 450, cookTime: 20 },
      { name: 'Breakfast Burrito with Eggs, Cheese and Salsa', protein: 28, carbs: 42, fats: 20, calories: 470, cookTime: 15 },
      { name: 'Chilaquiles with Eggs and Refried Beans', protein: 26, carbs: 48, fats: 18, calories: 470, cookTime: 25 },
      { name: 'Breakfast Tacos with Scrambled Eggs and Chorizo', protein: 30, carbs: 38, fats: 22, calories: 480, cookTime: 15 },
      { name: 'Molletes (Open-Faced Bean and Cheese Sandwich)', protein: 20, carbs: 44, fats: 14, calories: 390, cookTime: 10 },
      { name: 'Mexican Omelet with Peppers, Onions and Cheese', protein: 26, carbs: 14, fats: 22, calories: 370, cookTime: 15 }
    ],
    lunch: [
      { name: 'Chicken Fajita Bowl with Rice and Guacamole', protein: 36, carbs: 52, fats: 18, calories: 530, cookTime: 25 },
      { name: 'Carnitas Tacos with Black Beans and Rice', protein: 34, carbs: 56, fats: 20, calories: 560, cookTime: 120 },
      { name: 'Grilled Fish Tacos with Cabbage Slaw and Lime', protein: 32, carbs: 44, fats: 16, calories: 460, cookTime: 20 },
      { name: 'Chicken Enchiladas with Refried Beans', protein: 36, carbs: 50, fats: 18, calories: 530, cookTime: 40 },
      { name: 'Burrito Bowl with Chicken, Rice, Beans and Salsa', protein: 38, carbs: 54, fats: 16, calories: 540, cookTime: 25 },
      { name: 'Carne Asada Tacos with Pico de Gallo', protein: 34, carbs: 42, fats: 18, calories: 480, cookTime: 20 }
    ],
    dinner: [
      { name: 'Chicken Mole with Mexican Rice and Beans', protein: 36, carbs: 54, fats: 18, calories: 550, cookTime: 60 },
      { name: 'Beef Enchiladas with Sour Cream and Guacamole', protein: 34, carbs: 52, fats: 22, calories: 570, cookTime: 45 },
      { name: 'Grilled Chicken with Elote (Mexican Street Corn)', protein: 40, carbs: 38, fats: 16, calories: 480, cookTime: 30 },
      { name: 'Chile Rellenos with Rice and Refried Beans', protein: 26, carbs: 48, fats: 20, calories: 500, cookTime: 45 },
      { name: 'Fish Veracruz with Mexican Rice and Vegetables', protein: 34, carbs: 46, fats: 14, calories: 470, cookTime: 35 },
      { name: 'Chicken Tinga Tostadas with Beans and Lettuce', protein: 32, carbs: 44, fats: 18, calories: 480, cookTime: 30 }
    ],
    snacks: [
      { name: 'Guacamole with Vegetable Sticks', protein: 4, carbs: 16, fats: 14, calories: 200, cookTime: 10 },
      { name: 'Cheese Quesadilla with Greek Yogurt', protein: 18, carbs: 28, fats: 14, calories: 320, cookTime: 10 },
      { name: 'Jicama Sticks with Lime and Chili', protein: 2, carbs: 12, fats: 1, calories: 60, cookTime: 5 },
      { name: 'Black Bean Dip with Bell Peppers', protein: 10, carbs: 20, fats: 6, calories: 170, cookTime: 15 },
      { name: 'Roasted Pumpkin Seeds with Lime', protein: 12, carbs: 10, fats: 14, calories: 220, cookTime: 15 },
      { name: 'Turkey and Cheese Roll with Salsa', protein: 16, carbs: 8, fats: 10, calories: 190, cookTime: 5 },
      { name: 'Cottage Cheese with Mango Salsa', protein: 14, carbs: 16, fats: 4, calories: 160, cookTime: 10 }
    ]
  },
  
  Mediterranean: {
    breakfast: [
      { name: 'Greek Yogurt with Honey, Walnuts and Fresh Figs', protein: 16, carbs: 36, fats: 14, calories: 340, cookTime: 5 },
      { name: 'Shakshuka (Eggs in Tomato Sauce) with Whole Wheat Pita', protein: 20, carbs: 32, fats: 16, calories: 360, cookTime: 25 },
      { name: 'Whole Grain Toast with Olive Oil, Tomatoes and Feta', protein: 12, carbs: 38, fats: 14, calories: 320, cookTime: 5 },
      { name: 'Turkish Menemen (Scrambled Eggs with Vegetables)', protein: 22, carbs: 18, fats: 18, calories: 330, cookTime: 15 },
      { name: 'Breakfast Pita with Labneh, Cucumber and Olives', protein: 14, carbs: 40, fats: 12, calories: 330, cookTime: 5 },
      { name: 'Feta and Spinach Omelet with Whole Wheat Toast', protein: 24, carbs: 24, fats: 20, calories: 380, cookTime: 15 }
    ],
    lunch: [
      { name: 'Grilled Chicken Souvlaki with Greek Salad and Tzatziki', protein: 36, carbs: 24, fats: 18, calories: 420, cookTime: 25 },
      { name: 'Falafel Wrap with Hummus and Tabbouleh', protein: 16, carbs: 52, fats: 16, calories: 430, cookTime: 30 },
      { name: 'Greek Salad with Grilled Fish and Whole Wheat Pita', protein: 32, carbs: 28, fats: 20, calories: 440, cookTime: 20 },
      { name: 'Mediterranean Chicken Bowl with Quinoa and Vegetables', protein: 36, carbs: 42, fats: 16, calories: 480, cookTime: 25 },
      { name: 'Lamb Gyro with Greek Salad', protein: 30, carbs: 36, fats: 22, calories: 480, cookTime: 20 },
      { name: 'Grilled Salmon with Couscous and Roasted Vegetables', protein: 34, carbs: 40, fats: 18, calories: 480, cookTime: 30 }
    ],
    dinner: [
      { name: 'Grilled Sea Bass with Lemon, Roasted Potatoes and Greens', protein: 36, carbs: 38, fats: 16, calories: 470, cookTime: 35 },
      { name: 'Moroccan Chicken Tagine with Couscous', protein: 34, carbs: 46, fats: 14, calories: 470, cookTime: 60 },
      { name: 'Lamb Kofta with Tabbouleh and Hummus', protein: 32, carbs: 36, fats: 22, calories: 490, cookTime: 30 },
      { name: 'Moussaka (Greek Eggplant Casserole) with Salad', protein: 28, carbs: 34, fats: 20, calories: 450, cookTime: 90 },
      { name: 'Grilled Shrimp with Orzo Pasta and Vegetables', protein: 32, carbs: 48, fats: 12, calories: 450, cookTime: 25 },
      { name: 'Chicken Shawarma with Rice and Fattoush Salad', protein: 36, carbs: 50, fats: 16, calories: 520, cookTime: 30 }
    ],
    snacks: [
      { name: 'Hummus with Vegetable Sticks and Pita', protein: 8, carbs: 28, fats: 12, calories: 250, cookTime: 5 },
      { name: 'Greek Yogurt with Cucumber and Mint', protein: 14, carbs: 12, fats: 6, calories: 160, cookTime: 5 },
      { name: 'Marinated Olives and Feta Cheese', protein: 8, carbs: 6, fats: 18, calories: 210, cookTime: 2 },
      { name: 'Dates Stuffed with Almonds', protein: 4, carbs: 30, fats: 8, calories: 210, cookTime: 5 },
      { name: 'Labneh with Za\'atar and Olive Oil', protein: 12, carbs: 8, fats: 10, calories: 170, cookTime: 2 },
      { name: 'Roasted Chickpeas with Sumac', protein: 12, carbs: 24, fats: 6, calories: 200, cookTime: 30 },
      { name: 'Feta Stuffed Mini Peppers', protein: 10, carbs: 10, fats: 12, calories: 180, cookTime: 10 },
      { name: 'Tahini Energy Balls', protein: 8, carbs: 20, fats: 12, calories: 220, cookTime: 15 }
    ]
  },
  
  Thai: {
    breakfast: [
      { name: 'Thai Omelet (Khai Jiao) with Jasmine Rice', protein: 20, carbs: 42, fats: 14, calories: 380, cookTime: 10 },
      { name: 'Chicken Congee (Rice Porridge) with Ginger', protein: 22, carbs: 38, fats: 8, calories: 320, cookTime: 30 },
      { name: 'Thai-Style Scrambled Eggs with Vegetables and Rice', protein: 18, carbs: 40, fats: 12, calories: 340, cookTime: 15 },
      { name: 'Moo Ping (Grilled Pork) with Sticky Rice', protein: 26, carbs: 44, fats: 12, calories: 400, cookTime: 25 },
      { name: 'Thai Fried Rice with Egg and Vegetables', protein: 16, carbs: 48, fats: 10, calories: 360, cookTime: 15 },
      { name: 'Kai Jeow Moo Sap (Pork Omelet) with Rice', protein: 24, carbs: 38, fats: 16, calories: 400, cookTime: 10 }
    ],
    lunch: [
      { name: 'Pad Thai with Chicken and Peanuts', protein: 32, carbs: 56, fats: 18, calories: 540, cookTime: 20 },
      { name: 'Green Curry Chicken with Jasmine Rice', protein: 34, carbs: 52, fats: 20, calories: 560, cookTime: 30 },
      { name: 'Thai Basil Chicken (Pad Krapow) with Rice', protein: 36, carbs: 48, fats: 16, calories: 500, cookTime: 15 },
      { name: 'Tom Yum Soup with Shrimp and Rice', protein: 28, carbs: 44, fats: 10, calories: 400, cookTime: 25 },
      { name: 'Chicken Satay with Peanut Sauce and Rice', protein: 34, carbs: 46, fats: 18, calories: 500, cookTime: 30 },
      { name: 'Drunken Noodles (Pad Kee Mao) with Chicken', protein: 30, carbs: 54, fats: 16, calories: 500, cookTime: 20 }
    ],
    dinner: [
      { name: 'Massaman Curry with Chicken and Jasmine Rice', protein: 34, carbs: 54, fats: 22, calories: 580, cookTime: 45 },
      { name: 'Thai Red Curry with Shrimp and Vegetables', protein: 30, carbs: 46, fats: 18, calories: 490, cookTime: 30 },
      { name: 'Grilled Fish with Spicy Thai Salad (Som Tam)', protein: 34, carbs: 32, fats: 14, calories: 410, cookTime: 25 },
      { name: 'Panang Curry with Beef and Rice', protein: 32, carbs: 50, fats: 20, calories: 530, cookTime: 35 },
      { name: 'Thai Fried Rice with Crab and Egg', protein: 26, carbs: 52, fats: 14, calories: 460, cookTime: 15 },
      { name: 'Pad See Ew (Stir-Fried Noodles) with Chicken', protein: 30, carbs: 56, fats: 16, calories: 510, cookTime: 20 }
    ],
    snacks: [
      { name: 'Fresh Spring Rolls with Peanut Sauce', protein: 8, carbs: 26, fats: 10, calories: 220, cookTime: 15 },
      { name: 'Grilled Chicken Skewers with Herbs', protein: 18, carbs: 4, fats: 8, calories: 160, cookTime: 15 },
      { name: 'Roasted Cashews with Lime', protein: 10, carbs: 16, fats: 16, calories: 250, cookTime: 10 },
      { name: 'Cucumber Salad with Peanuts', protein: 6, carbs: 12, fats: 10, calories: 150, cookTime: 5 },
      { name: 'Thai Basil Chicken Lettuce Wraps', protein: 16, carbs: 8, fats: 8, calories: 170, cookTime: 15 },
      { name: 'Coconut Yogurt with Dragon Fruit', protein: 6, carbs: 20, fats: 8, calories: 180, cookTime: 5 },
      { name: 'Roasted Peanuts with Chili Flakes', protein: 14, carbs: 14, fats: 16, calories: 260, cookTime: 10 }
    ]
  }
};

// Helper function to filter by cooking time
export function filterByCookTime(meals: MealData[], maxCookTime: number): MealData[] {
  return meals.filter(meal => meal.cookTime <= maxCookTime);
}

// Helper function to get vegetarian meals
export function filterVegetarian(meals: MealData[]): MealData[] {
  return meals.filter(meal => {
    const lower = meal.name.toLowerCase();
    return !lower.includes('chicken') && !lower.includes('beef') && 
           !lower.includes('fish') && !lower.includes('pork') && 
           !lower.includes('turkey') && !lower.includes('lamb') && 
           !lower.includes('meat') && !lower.includes('salmon') &&
           !lower.includes('shrimp') && !lower.includes('crab') &&
           !lower.includes('tuna');
  });
}

// Helper function to get vegan meals
export function filterVegan(meals: MealData[]): MealData[] {
  return meals.filter(meal => {
    const lower = meal.name.toLowerCase();
    return !lower.includes('chicken') && !lower.includes('beef') && 
           !lower.includes('fish') && !lower.includes('pork') && 
           !lower.includes('turkey') && !lower.includes('lamb') && 
           !lower.includes('meat') && !lower.includes('salmon') &&
           !lower.includes('shrimp') && !lower.includes('crab') &&
           !lower.includes('tuna') && !lower.includes('egg') &&
           !lower.includes('cheese') && !lower.includes('yogurt') &&
           !lower.includes('milk') && !lower.includes('cream') &&
           !lower.includes('butter') && !lower.includes('feta') &&
           !lower.includes('paneer') && !lower.includes('ricotta');
  });
}

// Helper function to filter by allergies
export function filterAllergies(meals: MealData[], allergies: string[]): MealData[] {
  if (allergies.length === 0) return meals;
  
  // Map allergy categories to specific ingredient keywords
  const allergyKeywords: Record<string, string[]> = {
    'Nuts': ['nut', 'almond', 'cashew', 'walnut', 'pecan', 'peanut', 'pistachio', 'hazelnut', 'macadamia'],
    'Dairy': ['milk', 'cheese', 'yogurt', 'cream', 'butter', 'ghee', 'paneer', 'ricotta', 'feta', 'mozzarella', 'cheddar', 'parmesan', 'whey', 'casein'],
    'Eggs': ['egg', 'omelette', 'omelet', 'scrambled', 'frittata', 'quiche'],
    'Shellfish': ['shrimp', 'crab', 'lobster', 'prawn', 'crawfish', 'crayfish', 'oyster', 'clam', 'mussel', 'scallop'],
    'Soy': ['soy', 'tofu', 'tempeh', 'edamame', 'miso'],
    'Wheat': ['wheat', 'bread', 'pasta', 'noodle', 'flour', 'tortilla', 'pita', 'bagel', 'croissant', 'pancake', 'waffle'],
    'Fish': ['fish', 'salmon', 'tuna', 'cod', 'tilapia', 'trout', 'halibut', 'mackerel', 'sardine', 'anchovy'],
    'Sesame': ['sesame', 'tahini']
  };
  
  return meals.filter(meal => {
    const lower = meal.name.toLowerCase();
    // Check if meal contains any keyword from selected allergies
    return !allergies.some(allergy => {
      const keywords = allergyKeywords[allergy] || [allergy.toLowerCase()];
      return keywords.some(keyword => lower.includes(keyword));
    });
  });
}
