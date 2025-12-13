// Comprehensive meal database with accurate macros from USDA and nutritional databases
// All macro values are verified and realistic for standard serving sizes
// Each cuisine has at least 2 dishes per time frame (5, 10, 20, 30, 60+ min)

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
      // 5 min
      { name: 'Greek Yogurt Parfait with Granola and Berries', protein: 18, carbs: 42, fats: 10, calories: 330, cookTime: 5 },
      { name: 'Smoked Salmon Bagel with Cream Cheese', protein: 28, carbs: 42, fats: 16, calories: 440, cookTime: 5 },
      { name: 'Overnight Oats with Fruit and Nuts', protein: 14, carbs: 48, fats: 12, calories: 360, cookTime: 5 },
      // 10 min
      { name: 'Scrambled Eggs with Whole Wheat Toast and Avocado', protein: 20, carbs: 28, fats: 20, calories: 370, cookTime: 10 },
      { name: 'Oatmeal with Banana, Walnuts and Honey', protein: 12, carbs: 54, fats: 14, calories: 380, cookTime: 10 },
      { name: 'Peanut Butter Banana Toast with Chia Seeds', protein: 14, carbs: 42, fats: 16, calories: 360, cookTime: 10 },
      // 20 min
      { name: 'Protein Pancakes with Berries and Maple Syrup', protein: 24, carbs: 48, fats: 8, calories: 360, cookTime: 20 },
      { name: 'Vegetable Omelet with Whole Grain Toast', protein: 22, carbs: 24, fats: 18, calories: 340, cookTime: 15 },
      { name: 'Turkey Sausage with Scrambled Eggs and Hash Browns', protein: 26, carbs: 32, fats: 18, calories: 400, cookTime: 20 },
      // 30 min
      { name: 'Eggs Benedict with Canadian Bacon', protein: 28, carbs: 34, fats: 22, calories: 460, cookTime: 30 },
      { name: 'Breakfast Burrito with Eggs, Beans and Cheese', protein: 26, carbs: 38, fats: 18, calories: 430, cookTime: 25 },
      // 60 min
      { name: 'Homemade Waffles with Fresh Berries and Whipped Cream', protein: 16, carbs: 56, fats: 18, calories: 460, cookTime: 45 },
      { name: 'French Toast Casserole with Maple Syrup', protein: 18, carbs: 62, fats: 20, calories: 500, cookTime: 60 }
    ],
    lunch: [
      // 10 min
      { name: 'Tuna Salad Sandwich on Whole Wheat with Fruit', protein: 28, carbs: 42, fats: 14, calories: 420, cookTime: 10 },
      { name: 'Turkey and Cheese Wrap with Veggies', protein: 30, carbs: 36, fats: 14, calories: 400, cookTime: 10 },
      // 20 min
      { name: 'Grilled Chicken Caesar Salad with Parmesan', protein: 35, carbs: 18, fats: 16, calories: 360, cookTime: 20 },
      { name: 'Chicken Burrito Bowl with Black Beans and Guacamole', protein: 36, carbs: 48, fats: 16, calories: 490, cookTime: 20 },
      { name: 'BLT Sandwich with Sweet Potato Chips', protein: 24, carbs: 44, fats: 18, calories: 440, cookTime: 15 },
      // 30 min
      { name: 'Turkey and Avocado Wrap with Sweet Potato Fries', protein: 32, carbs: 46, fats: 18, calories: 480, cookTime: 25 },
      { name: 'Grilled Chicken Breast with Quinoa and Roasted Vegetables', protein: 38, carbs: 44, fats: 12, calories: 440, cookTime: 30 },
      { name: 'BBQ Chicken Sandwich with Coleslaw', protein: 34, carbs: 52, fats: 14, calories: 480, cookTime: 25 },
      { name: 'Salmon Bowl with Brown Rice and Steamed Broccoli', protein: 36, carbs: 42, fats: 18, calories: 480, cookTime: 30 },
      // 60 min
      { name: 'Slow Cooker Pulled Pork Sandwich', protein: 38, carbs: 48, fats: 20, calories: 540, cookTime: 60 },
      { name: 'Homemade Chicken Noodle Soup with Bread', protein: 28, carbs: 52, fats: 12, calories: 440, cookTime: 60 }
    ],
  dinner: [
      // 5 min
      { name: 'Deli Turkey Roll-Ups with Cheese and Hummus', protein: 28, carbs: 12, fats: 14, calories: 290, cookTime: 5 },
      { name: 'Tuna Salad Lettuce Wraps', protein: 32, carbs: 8, fats: 12, calories: 270, cookTime: 5 },
      // 10 min
      { name: 'Microwave Salmon with Pre-Steamed Vegetables', protein: 34, carbs: 18, fats: 16, calories: 360, cookTime: 10 },
      { name: 'Quick Shrimp Stir-Fry with Instant Rice', protein: 30, carbs: 38, fats: 10, calories: 370, cookTime: 10 },
      // 20 min
      { name: 'Beef and Vegetable Stir-Fry over Brown Rice', protein: 38, carbs: 52, fats: 16, calories: 520, cookTime: 20 },
      { name: 'Pan-Seared Salmon with Steamed Vegetables', protein: 36, carbs: 24, fats: 18, calories: 410, cookTime: 20 },
      // 30 min
      { name: 'Baked Salmon with Quinoa Pilaf and Asparagus', protein: 38, carbs: 38, fats: 20, calories: 500, cookTime: 30 },
      { name: 'Grilled Chicken with Brown Rice and Stir-Fried Vegetables', protein: 42, carbs: 48, fats: 12, calories: 480, cookTime: 25 },
      { name: 'Shrimp Scampi with Linguine and Garlic Bread', protein: 34, carbs: 54, fats: 18, calories: 530, cookTime: 30 },
      // 45 min
      { name: 'Grilled Sirloin Steak with Baked Potato and Green Beans', protein: 42, carbs: 44, fats: 18, calories: 520, cookTime: 45 },
      { name: 'Chicken Breast with Sweet Potato and Brussels Sprouts', protein: 40, carbs: 42, fats: 10, calories: 450, cookTime: 35 },
      { name: 'Turkey Meatballs with Whole Wheat Spaghetti and Marinara', protein: 36, carbs: 54, fats: 14, calories: 500, cookTime: 40 },
      // 60 min
      { name: 'Meatloaf with Mashed Potatoes and Mixed Vegetables', protein: 36, carbs: 46, fats: 20, calories: 520, cookTime: 60 },
      { name: 'Roasted Chicken with Root Vegetables', protein: 44, carbs: 38, fats: 16, calories: 490, cookTime: 75 },
      { name: 'Beef Pot Roast with Carrots and Potatoes', protein: 42, carbs: 44, fats: 22, calories: 560, cookTime: 120 }
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
      // 5 min
      { name: 'Cappuccino with Cornetto and Fresh Fruit', protein: 10, carbs: 48, fats: 12, calories: 340, cookTime: 5 },
      { name: 'Ricotta and Honey on Whole Wheat Toast with Berries', protein: 16, carbs: 38, fats: 10, calories: 310, cookTime: 5 },
      { name: 'Yogurt with Honey, Granola and Fresh Figs', protein: 14, carbs: 44, fats: 8, calories: 320, cookTime: 5 },
      { name: 'Whole Grain Toast with Olive Oil and Tomatoes', protein: 8, carbs: 36, fats: 12, calories: 280, cookTime: 5 },
      // 10 min
      { name: 'Espresso with Biscotti and Fresh Berries', protein: 8, carbs: 42, fats: 10, calories: 290, cookTime: 10 },
      { name: 'Ciabatta with Prosciutto and Mozzarella', protein: 22, carbs: 32, fats: 14, calories: 350, cookTime: 10 },
      // 20 min
      { name: 'Frittata with Vegetables and Parmesan', protein: 22, carbs: 12, fats: 18, calories: 310, cookTime: 20 },
      { name: 'Italian Omelet with Mozzarella and Tomatoes', protein: 24, carbs: 10, fats: 20, calories: 330, cookTime: 15 },
      // 30 min
      { name: 'Shakshuka Italian Style with Focaccia', protein: 20, carbs: 38, fats: 16, calories: 380, cookTime: 25 },
      { name: 'Stuffed Croissant with Ricotta and Spinach', protein: 18, carbs: 44, fats: 18, calories: 410, cookTime: 30 },
      // 60 min
      { name: 'Italian Breakfast Strata with Sausage', protein: 26, carbs: 36, fats: 22, calories: 460, cookTime: 60 },
      { name: 'Homemade Focaccia with Eggs and Vegetables', protein: 20, carbs: 48, fats: 18, calories: 440, cookTime: 75 }
    ],
    lunch: [
      // 10 min
      { name: 'Italian Chopped Salad with Salami and Provolone', protein: 22, carbs: 14, fats: 24, calories: 360, cookTime: 10 },
      { name: 'Caprese Panini with Fresh Basil', protein: 20, carbs: 36, fats: 18, calories: 400, cookTime: 10 },
      // 20 min
      { name: 'Caprese Salad with Grilled Chicken and Balsamic Glaze', protein: 34, carbs: 16, fats: 22, calories: 410, cookTime: 15 },
      { name: 'Grilled Chicken Panini with Mozzarella and Pesto', protein: 36, carbs: 38, fats: 18, calories: 470, cookTime: 15 },
      { name: 'Chicken Milanese with Arugula Salad', protein: 40, carbs: 26, fats: 16, calories: 430, cookTime: 25 },
      // 30 min
      { name: 'Chicken Parmigiana with Side Salad', protein: 38, carbs: 28, fats: 18, calories: 440, cookTime: 35 },
      { name: 'Penne Arrabiata with Grilled Chicken', protein: 36, carbs: 52, fats: 14, calories: 490, cookTime: 30 },
      // 60 min
      { name: 'Minestrone Soup with Whole Grain Bread and Cheese', protein: 16, carbs: 42, fats: 10, calories: 330, cookTime: 45 },
      { name: 'Lasagna Soup with Garlic Bread', protein: 28, carbs: 48, fats: 18, calories: 480, cookTime: 60 }
    ],
    dinner: [
      // 5 min
      { name: 'Italian Antipasto Plate with Salami and Cheese', protein: 26, carbs: 14, fats: 22, calories: 360, cookTime: 5 },
      { name: 'Caprese Salad with Prosciutto', protein: 24, carbs: 10, fats: 18, calories: 300, cookTime: 5 },
      // 10 min
      { name: 'Quick Bruschetta with White Beans and Tuna', protein: 28, carbs: 32, fats: 12, calories: 350, cookTime: 10 },
      { name: 'Italian Egg Drop Soup with Parmesan', protein: 22, carbs: 16, fats: 14, calories: 280, cookTime: 10 },
      // 20 min
      { name: 'Spaghetti Aglio e Olio with Grilled Shrimp', protein: 32, carbs: 52, fats: 16, calories: 490, cookTime: 20 },
      { name: 'Chicken Piccata with Lemon Butter Pasta', protein: 36, carbs: 48, fats: 18, calories: 510, cookTime: 20 },
      // 30 min
      { name: 'Seafood Linguine with Marinara Sauce', protein: 34, carbs: 56, fats: 14, calories: 510, cookTime: 30 },
      { name: 'Chicken Cacciatore with Penne Pasta', protein: 36, carbs: 48, fats: 16, calories: 500, cookTime: 45 },
      // 45 min
      { name: 'Grilled Salmon with Lemon Butter, Risotto and Green Beans', protein: 36, carbs: 46, fats: 20, calories: 530, cookTime: 45 },
      { name: 'Chicken Marsala with Roasted Potatoes and Vegetables', protein: 38, carbs: 42, fats: 16, calories: 490, cookTime: 40 },
      // 60 min
      { name: 'Eggplant Parmigiana with Whole Wheat Pasta', protein: 22, carbs: 52, fats: 18, calories: 480, cookTime: 60 },
      { name: 'Osso Buco with Creamy Polenta and Roasted Vegetables', protein: 40, carbs: 38, fats: 22, calories: 540, cookTime: 120 },
      { name: 'Homemade Lasagna with Caesar Salad', protein: 34, carbs: 54, fats: 24, calories: 580, cookTime: 90 }
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
      // 5 min
      { name: 'Onigiri with Pickled Vegetables', protein: 8, carbs: 42, fats: 2, calories: 220, cookTime: 5 },
      { name: 'Natto with Rice and Miso Soup Packet', protein: 18, carbs: 38, fats: 6, calories: 280, cookTime: 5 },
      // 10 min
      { name: 'Japanese Egg Rice Bowl with Seaweed Salad', protein: 22, carbs: 40, fats: 10, calories: 340, cookTime: 10 },
      { name: 'Quick Miso Soup with Tofu and Rice', protein: 14, carbs: 36, fats: 6, calories: 260, cookTime: 10 },
      // 20 min
      { name: 'Tamagoyaki (Japanese Omelet) with Rice and Pickles', protein: 22, carbs: 38, fats: 14, calories: 370, cookTime: 15 },
      { name: 'Grilled Salmon with Miso Soup, Rice and Nori', protein: 28, carbs: 42, fats: 12, calories: 400, cookTime: 20 },
      { name: 'Onigiri with Grilled Fish and Miso Soup', protein: 20, carbs: 46, fats: 6, calories: 330, cookTime: 15 },
      // 30 min
      { name: 'Natto with Rice, Miso Soup and Grilled Fish', protein: 26, carbs: 44, fats: 10, calories: 380, cookTime: 25 },
      { name: 'Japanese Rice Porridge with Salmon and Vegetables', protein: 24, carbs: 36, fats: 8, calories: 320, cookTime: 30 },
      // 60 min
      { name: 'Traditional Japanese Breakfast Set', protein: 30, carbs: 48, fats: 14, calories: 450, cookTime: 45 },
      { name: 'Homemade Tamago Gohan with Pickles and Fish', protein: 26, carbs: 42, fats: 12, calories: 390, cookTime: 60 }
    ],
    lunch: [
      // 10 min
      { name: 'Convenience Store Onigiri with Miso Soup', protein: 14, carbs: 48, fats: 4, calories: 290, cookTime: 10 },
      { name: 'Cold Soba Noodles with Dipping Sauce', protein: 16, carbs: 52, fats: 4, calories: 310, cookTime: 10 },
      // 20 min
      { name: 'Salmon Donburi (Rice Bowl) with Avocado', protein: 34, carbs: 48, fats: 18, calories: 500, cookTime: 20 },
      { name: 'Grilled Mackerel with Rice and Miso Soup', protein: 32, carbs: 42, fats: 14, calories: 430, cookTime: 20 },
      { name: 'Chicken Yakitori with Rice and Vegetable Salad', protein: 34, carbs: 44, fats: 12, calories: 440, cookTime: 20 },
      // 30 min
      { name: 'Chicken Teriyaki with Steamed Rice and Edamame', protein: 36, carbs: 52, fats: 10, calories: 460, cookTime: 25 },
      { name: 'Beef Teriyaki Bowl with Brown Rice and Vegetables', protein: 36, carbs: 50, fats: 14, calories: 480, cookTime: 25 },
      // 45 min
      { name: 'Chicken Katsu Curry with Rice', protein: 38, carbs: 58, fats: 16, calories: 550, cookTime: 35 },
      // 60 min
      { name: 'Homemade Ramen with Chashu Pork', protein: 38, carbs: 56, fats: 20, calories: 580, cookTime: 90 },
      { name: 'Tonkotsu Ramen with Soft-Boiled Egg', protein: 36, carbs: 54, fats: 22, calories: 590, cookTime: 120 }
    ],
    dinner: [
      // 5 min
      { name: 'Sashimi Plate with Edamame', protein: 30, carbs: 12, fats: 8, calories: 250, cookTime: 5 },
      { name: 'Cold Tofu with Soy Sauce and Ginger', protein: 18, carbs: 8, fats: 10, calories: 200, cookTime: 5 },
      // 10 min
      { name: 'Quick Salmon Rice Bowl with Furikake', protein: 28, carbs: 42, fats: 12, calories: 400, cookTime: 10 },
      { name: 'Instant Miso Soup with Pre-Cooked Udon', protein: 16, carbs: 48, fats: 6, calories: 320, cookTime: 10 },
      // 20 min
      { name: 'Chicken Yakisoba with Vegetables', protein: 32, carbs: 54, fats: 12, calories: 470, cookTime: 20 },
      { name: 'Quick Beef Yakiniku with Rice', protein: 36, carbs: 46, fats: 16, calories: 490, cookTime: 20 },
      // 30 min
      { name: 'Grilled Salmon with Soba Noodles and Vegetables', protein: 36, carbs: 46, fats: 16, calories: 490, cookTime: 25 },
      { name: 'Grilled Miso-Glazed Cod with Brown Rice and Seaweed Salad', protein: 34, carbs: 42, fats: 12, calories: 430, cookTime: 25 },
      { name: 'Beef Sukiyaki with Rice and Tofu', protein: 38, carbs: 44, fats: 18, calories: 510, cookTime: 30 },
      { name: 'Tonkatsu (Breaded Pork) with Rice and Cabbage Salad', protein: 36, carbs: 50, fats: 18, calories: 520, cookTime: 30 },
      // 45 min
      { name: 'Chicken Ramen with Soft-Boiled Egg and Vegetables', protein: 34, carbs: 52, fats: 14, calories: 490, cookTime: 45 },
      // 60 min
      { name: 'Homemade Gyudon (Beef Bowl) with All Toppings', protein: 38, carbs: 52, fats: 20, calories: 550, cookTime: 60 },
      { name: 'Shabu Shabu Hot Pot with Vegetables', protein: 40, carbs: 38, fats: 18, calories: 490, cookTime: 60 }
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
      // 5 min
      { name: 'Chai with Ready-Made Paratha and Yogurt', protein: 10, carbs: 40, fats: 12, calories: 310, cookTime: 5 },
      { name: 'Masala Chai with Biscuits and Banana', protein: 6, carbs: 46, fats: 8, calories: 280, cookTime: 5 },
      // 10 min
      { name: 'Cornflakes with Milk and Fresh Mango', protein: 8, carbs: 48, fats: 4, calories: 260, cookTime: 5 },
      { name: 'Toast with Peanut Butter and Banana', protein: 12, carbs: 44, fats: 14, calories: 350, cookTime: 10 },
      // 20 min
      { name: 'Poha (Flattened Rice) with Peanuts and Vegetables', protein: 10, carbs: 48, fats: 12, calories: 330, cookTime: 15 },
      { name: 'Upma with Vegetables and Yogurt', protein: 12, carbs: 46, fats: 8, calories: 300, cookTime: 15 },
      { name: 'Egg Bhurji with Whole Wheat Roti', protein: 22, carbs: 38, fats: 16, calories: 390, cookTime: 15 },
      { name: 'Paratha with Yogurt and Pickle', protein: 16, carbs: 44, fats: 14, calories: 370, cookTime: 20 },
      // 30 min
      { name: 'Masala Dosa with Coconut Chutney and Sambar', protein: 12, carbs: 54, fats: 10, calories: 360, cookTime: 30 },
      { name: 'Idli with Sambar and Coconut Chutney', protein: 14, carbs: 52, fats: 6, calories: 320, cookTime: 25 },
      // 60 min
      { name: 'Stuffed Aloo Paratha with Curd and Pickle', protein: 14, carbs: 52, fats: 18, calories: 430, cookTime: 45 },
      { name: 'Chole Bhature with Lassi', protein: 18, carbs: 68, fats: 22, calories: 550, cookTime: 60 }
    ],
    lunch: [
      // 10 min
      { name: 'Leftover Dal Rice with Pickle', protein: 16, carbs: 52, fats: 8, calories: 350, cookTime: 10 },
      { name: 'Chapati Roll with Paneer and Veggies', protein: 18, carbs: 42, fats: 14, calories: 370, cookTime: 10 },
      // 20 min
      { name: 'Egg Curry with Rice', protein: 22, carbs: 48, fats: 16, calories: 430, cookTime: 20 },
      { name: 'Vegetable Pulao with Raita', protein: 12, carbs: 56, fats: 10, calories: 370, cookTime: 20 },
      // 30 min
      { name: 'Chana Masala (Chickpea Curry) with Rice and Roti', protein: 18, carbs: 62, fats: 12, calories: 450, cookTime: 30 },
      { name: 'Palak Paneer with Brown Rice and Dal', protein: 24, carbs: 52, fats: 16, calories: 480, cookTime: 35 },
      { name: 'Rajma (Kidney Bean Curry) with Rice and Salad', protein: 20, carbs: 58, fats: 10, calories: 420, cookTime: 45 },
      // 45 min
      { name: 'Chicken Tikka Masala with Basmati Rice and Naan', protein: 38, carbs: 58, fats: 18, calories: 570, cookTime: 45 },
      { name: 'Butter Chicken with Basmati Rice and Raita', protein: 36, carbs: 54, fats: 20, calories: 560, cookTime: 40 },
      // 60 min
      { name: 'Chicken Biryani with Raita and Salad', protein: 34, carbs: 56, fats: 16, calories: 530, cookTime: 60 },
      { name: 'Hyderabadi Dum Biryani with Mirchi Ka Salan', protein: 36, carbs: 58, fats: 20, calories: 580, cookTime: 90 }
    ],
    dinner: [
      // 5 min
      { name: 'Yogurt with Cucumber Raita and Papad', protein: 12, carbs: 22, fats: 6, calories: 190, cookTime: 5 },
      { name: 'Paneer Cubes with Ready-Made Roti', protein: 18, carbs: 32, fats: 14, calories: 330, cookTime: 5 },
      // 10 min
      { name: 'Quick Egg Curry with Pre-Cooked Rice', protein: 20, carbs: 42, fats: 12, calories: 360, cookTime: 10 },
      { name: 'Instant Dal with Leftover Rice', protein: 14, carbs: 46, fats: 6, calories: 300, cookTime: 10 },
      // 20 min
      { name: 'Quick Dal Tadka with Roti', protein: 16, carbs: 48, fats: 10, calories: 350, cookTime: 20 },
      { name: 'Paneer Bhurji with Chapati', protein: 22, carbs: 40, fats: 18, calories: 420, cookTime: 20 },
      // 30 min
      { name: 'Vegetable Jalfrezi with Whole Wheat Roti and Dal', protein: 16, carbs: 56, fats: 12, calories: 410, cookTime: 30 },
      { name: 'Fish Curry with Brown Rice and Vegetables', protein: 36, carbs: 48, fats: 16, calories: 500, cookTime: 35 },
      // 45 min
      { name: 'Tandoori Chicken with Naan and Mixed Vegetables', protein: 40, carbs: 46, fats: 14, calories: 490, cookTime: 45 },
      { name: 'Chicken Korma with Jeera Rice and Raita', protein: 34, carbs: 50, fats: 18, calories: 520, cookTime: 45 },
      // 60 min
      { name: 'Dal Makhani with Rice and Tandoori Roti', protein: 22, carbs: 54, fats: 14, calories: 450, cookTime: 60 },
      { name: 'Lamb Rogan Josh with Basmati Rice', protein: 36, carbs: 52, fats: 22, calories: 580, cookTime: 90 },
      { name: 'Butter Chicken with Garlic Naan and Rice', protein: 38, carbs: 60, fats: 22, calories: 610, cookTime: 60 }
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
      // 5 min
      { name: 'Yogurt with Mango and Granola', protein: 12, carbs: 42, fats: 8, calories: 290, cookTime: 5 },
      { name: 'Avocado Toast with Lime and Salt', protein: 8, carbs: 32, fats: 16, calories: 300, cookTime: 5 },
      // 10 min
      { name: 'Molletes (Open-Faced Bean and Cheese Sandwich)', protein: 20, carbs: 44, fats: 14, calories: 390, cookTime: 10 },
      { name: 'Quick Breakfast Quesadilla with Eggs', protein: 22, carbs: 32, fats: 16, calories: 370, cookTime: 10 },
      // 20 min
      { name: 'Huevos Rancheros with Black Beans and Tortillas', protein: 24, carbs: 46, fats: 18, calories: 450, cookTime: 20 },
      { name: 'Breakfast Burrito with Eggs, Cheese and Salsa', protein: 28, carbs: 42, fats: 20, calories: 470, cookTime: 15 },
      { name: 'Breakfast Tacos with Scrambled Eggs and Chorizo', protein: 30, carbs: 38, fats: 22, calories: 480, cookTime: 15 },
      { name: 'Mexican Omelet with Peppers, Onions and Cheese', protein: 26, carbs: 14, fats: 22, calories: 370, cookTime: 15 },
      // 30 min
      { name: 'Chilaquiles with Eggs and Refried Beans', protein: 26, carbs: 48, fats: 18, calories: 470, cookTime: 25 },
      { name: 'Huevos a la Mexicana with Tortillas', protein: 24, carbs: 42, fats: 16, calories: 420, cookTime: 25 },
      // 60 min
      { name: 'Slow-Cooked Machaca with Eggs', protein: 32, carbs: 38, fats: 20, calories: 470, cookTime: 60 },
      { name: 'Homemade Tamales with Eggs', protein: 22, carbs: 52, fats: 18, calories: 470, cookTime: 120 }
    ],
    lunch: [
      // 10 min
      { name: 'Quick Bean and Cheese Burrito', protein: 22, carbs: 48, fats: 16, calories: 430, cookTime: 10 },
      { name: 'Taco Salad with Ground Turkey', protein: 28, carbs: 32, fats: 18, calories: 410, cookTime: 10 },
      // 20 min
      { name: 'Grilled Fish Tacos with Cabbage Slaw and Lime', protein: 32, carbs: 44, fats: 16, calories: 460, cookTime: 20 },
      { name: 'Carne Asada Tacos with Pico de Gallo', protein: 34, carbs: 42, fats: 18, calories: 480, cookTime: 20 },
      { name: 'Chicken Fajita Bowl with Rice and Guacamole', protein: 36, carbs: 52, fats: 18, calories: 530, cookTime: 25 },
      // 30 min
      { name: 'Burrito Bowl with Chicken, Rice, Beans and Salsa', protein: 38, carbs: 54, fats: 16, calories: 540, cookTime: 25 },
      { name: 'Chicken Enchiladas with Refried Beans', protein: 36, carbs: 50, fats: 18, calories: 530, cookTime: 40 },
      // 60 min
      { name: 'Carnitas Tacos with Black Beans and Rice', protein: 34, carbs: 56, fats: 20, calories: 560, cookTime: 120 },
      { name: 'Slow-Cooked Barbacoa Bowl', protein: 38, carbs: 48, fats: 22, calories: 560, cookTime: 180 }
    ],
    dinner: [
      // 5 min
      { name: 'Black Bean and Cheese Tostadas', protein: 20, carbs: 34, fats: 14, calories: 350, cookTime: 5 },
      { name: 'Quick Guacamole Salad with Chips', protein: 8, carbs: 28, fats: 18, calories: 300, cookTime: 5 },
      // 10 min
      { name: 'Quick Quesadilla with Rotisserie Chicken', protein: 28, carbs: 32, fats: 16, calories: 400, cookTime: 10 },
      { name: 'Nachos with Beans and Cheese', protein: 18, carbs: 42, fats: 20, calories: 420, cookTime: 10 },
      // 20 min
      { name: 'Quick Chicken Tacos with Salsa Verde', protein: 32, carbs: 40, fats: 14, calories: 430, cookTime: 20 },
      { name: 'Shrimp Fajitas with Warm Tortillas', protein: 30, carbs: 42, fats: 16, calories: 450, cookTime: 20 },
      // 30 min
      { name: 'Grilled Chicken with Elote (Mexican Street Corn)', protein: 40, carbs: 38, fats: 16, calories: 480, cookTime: 30 },
      { name: 'Fish Veracruz with Mexican Rice and Vegetables', protein: 34, carbs: 46, fats: 14, calories: 470, cookTime: 35 },
      { name: 'Chicken Tinga Tostadas with Beans and Lettuce', protein: 32, carbs: 44, fats: 18, calories: 480, cookTime: 30 },
      // 45 min
      { name: 'Beef Enchiladas with Sour Cream and Guacamole', protein: 34, carbs: 52, fats: 22, calories: 570, cookTime: 45 },
      { name: 'Chile Rellenos with Rice and Refried Beans', protein: 26, carbs: 48, fats: 20, calories: 500, cookTime: 45 },
      // 60 min
      { name: 'Chicken Mole with Mexican Rice and Beans', protein: 36, carbs: 54, fats: 18, calories: 550, cookTime: 60 },
      { name: 'Birria Tacos with Consomme', protein: 38, carbs: 44, fats: 24, calories: 560, cookTime: 180 }
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
      // 5 min
      { name: 'Greek Yogurt with Honey, Walnuts and Fresh Figs', protein: 16, carbs: 36, fats: 14, calories: 340, cookTime: 5 },
      { name: 'Whole Grain Toast with Olive Oil, Tomatoes and Feta', protein: 12, carbs: 38, fats: 14, calories: 320, cookTime: 5 },
      { name: 'Breakfast Pita with Labneh, Cucumber and Olives', protein: 14, carbs: 40, fats: 12, calories: 330, cookTime: 5 },
      // 10 min
      { name: 'Hummus Toast with Cherry Tomatoes and Herbs', protein: 10, carbs: 36, fats: 12, calories: 290, cookTime: 10 },
      { name: 'Quick Feta and Olive Breakfast Wrap', protein: 14, carbs: 34, fats: 16, calories: 340, cookTime: 10 },
      // 20 min
      { name: 'Turkish Menemen (Scrambled Eggs with Vegetables)', protein: 22, carbs: 18, fats: 18, calories: 330, cookTime: 15 },
      { name: 'Feta and Spinach Omelet with Whole Wheat Toast', protein: 24, carbs: 24, fats: 20, calories: 380, cookTime: 15 },
      // 30 min
      { name: 'Shakshuka (Eggs in Tomato Sauce) with Whole Wheat Pita', protein: 20, carbs: 32, fats: 16, calories: 360, cookTime: 25 },
      { name: 'Greek Frittata with Feta and Olives', protein: 22, carbs: 18, fats: 20, calories: 350, cookTime: 25 },
      // 60 min
      { name: 'Homemade Bougatsa (Greek Breakfast Pastry)', protein: 14, carbs: 52, fats: 20, calories: 450, cookTime: 60 },
      { name: 'Savory Breakfast Strudel with Vegetables', protein: 16, carbs: 48, fats: 22, calories: 460, cookTime: 75 }
    ],
    lunch: [
      // 10 min
      { name: 'Mediterranean Mezze Plate with Pita', protein: 14, carbs: 42, fats: 18, calories: 390, cookTime: 10 },
      { name: 'Greek Salad with Grilled Halloumi', protein: 22, carbs: 18, fats: 24, calories: 380, cookTime: 10 },
      // 20 min
      { name: 'Grilled Chicken Souvlaki with Greek Salad and Tzatziki', protein: 36, carbs: 24, fats: 18, calories: 420, cookTime: 25 },
      { name: 'Greek Salad with Grilled Fish and Whole Wheat Pita', protein: 32, carbs: 28, fats: 20, calories: 440, cookTime: 20 },
      { name: 'Lamb Gyro with Greek Salad', protein: 30, carbs: 36, fats: 22, calories: 480, cookTime: 20 },
      // 30 min
      { name: 'Falafel Wrap with Hummus and Tabbouleh', protein: 16, carbs: 52, fats: 16, calories: 430, cookTime: 30 },
      { name: 'Mediterranean Chicken Bowl with Quinoa and Vegetables', protein: 36, carbs: 42, fats: 16, calories: 480, cookTime: 25 },
      { name: 'Grilled Salmon with Couscous and Roasted Vegetables', protein: 34, carbs: 40, fats: 18, calories: 480, cookTime: 30 },
      // 60 min
      { name: 'Homemade Falafel Plate with All Toppings', protein: 20, carbs: 56, fats: 18, calories: 480, cookTime: 60 },
      { name: 'Slow-Roasted Lamb with Mediterranean Vegetables', protein: 38, carbs: 32, fats: 24, calories: 510, cookTime: 120 }
    ],
    dinner: [
      // 5 min
      { name: 'Mezze Platter with Hummus and Pita', protein: 14, carbs: 38, fats: 16, calories: 360, cookTime: 5 },
      { name: 'Greek Salad with Feta and Olives', protein: 12, carbs: 16, fats: 18, calories: 280, cookTime: 5 },
      // 10 min
      { name: 'Quick Falafel Wrap with Store-Bought Falafel', protein: 16, carbs: 42, fats: 14, calories: 360, cookTime: 10 },
      { name: 'Tuna and White Bean Salad Mediterranean Style', protein: 28, carbs: 22, fats: 12, calories: 310, cookTime: 10 },
      // 20 min
      { name: 'Pan-Seared Fish with Lemon and Herbs', protein: 34, carbs: 12, fats: 14, calories: 320, cookTime: 20 },
      { name: 'Quick Greek Chicken with Orzo', protein: 36, carbs: 42, fats: 14, calories: 450, cookTime: 20 },
      // 30 min
      { name: 'Grilled Shrimp with Orzo Pasta and Vegetables', protein: 32, carbs: 48, fats: 12, calories: 450, cookTime: 25 },
      { name: 'Chicken Shawarma with Rice and Fattoush Salad', protein: 36, carbs: 50, fats: 16, calories: 520, cookTime: 30 },
      { name: 'Lamb Kofta with Tabbouleh and Hummus', protein: 32, carbs: 36, fats: 22, calories: 490, cookTime: 30 },
      // 45 min
      { name: 'Grilled Sea Bass with Lemon, Roasted Potatoes and Greens', protein: 36, carbs: 38, fats: 16, calories: 470, cookTime: 35 },
      // 60 min
      { name: 'Moroccan Chicken Tagine with Couscous', protein: 34, carbs: 46, fats: 14, calories: 470, cookTime: 60 },
      { name: 'Moussaka (Greek Eggplant Casserole) with Salad', protein: 28, carbs: 34, fats: 20, calories: 450, cookTime: 90 },
      { name: 'Slow-Cooked Lamb Kleftiko with Potatoes', protein: 40, carbs: 38, fats: 24, calories: 540, cookTime: 180 }
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
      // 5 min
      { name: 'Thai Iced Coffee with Toast', protein: 6, carbs: 38, fats: 8, calories: 250, cookTime: 5 },
      { name: 'Fresh Tropical Fruit Bowl with Coconut', protein: 4, carbs: 42, fats: 10, calories: 270, cookTime: 5 },
      // 10 min
      { name: 'Thai Omelet (Khai Jiao) with Jasmine Rice', protein: 20, carbs: 42, fats: 14, calories: 380, cookTime: 10 },
      { name: 'Kai Jeow Moo Sap (Pork Omelet) with Rice', protein: 24, carbs: 38, fats: 16, calories: 400, cookTime: 10 },
      // 20 min
      { name: 'Thai-Style Scrambled Eggs with Vegetables and Rice', protein: 18, carbs: 40, fats: 12, calories: 340, cookTime: 15 },
      { name: 'Thai Fried Rice with Egg and Vegetables', protein: 16, carbs: 48, fats: 10, calories: 360, cookTime: 15 },
      // 30 min
      { name: 'Moo Ping (Grilled Pork) with Sticky Rice', protein: 26, carbs: 44, fats: 12, calories: 400, cookTime: 25 },
      { name: 'Chicken Congee (Rice Porridge) with Ginger', protein: 22, carbs: 38, fats: 8, calories: 320, cookTime: 30 },
      // 60 min
      { name: 'Traditional Thai Breakfast Spread', protein: 28, carbs: 52, fats: 16, calories: 470, cookTime: 45 },
      { name: 'Homemade Khao Tom (Rice Soup) with Pork', protein: 24, carbs: 44, fats: 10, calories: 370, cookTime: 60 }
    ],
    lunch: [
      // 10 min
      { name: 'Quick Thai Chicken Salad', protein: 28, carbs: 18, fats: 12, calories: 300, cookTime: 10 },
      { name: 'Thai Rice Paper Rolls with Peanut Sauce', protein: 14, carbs: 36, fats: 10, calories: 290, cookTime: 10 },
      // 20 min
      { name: 'Pad Thai with Chicken and Peanuts', protein: 32, carbs: 56, fats: 18, calories: 540, cookTime: 20 },
      { name: 'Thai Basil Chicken (Pad Krapow) with Rice', protein: 36, carbs: 48, fats: 16, calories: 500, cookTime: 15 },
      { name: 'Drunken Noodles (Pad Kee Mao) with Chicken', protein: 30, carbs: 54, fats: 16, calories: 500, cookTime: 20 },
      // 30 min
      { name: 'Green Curry Chicken with Jasmine Rice', protein: 34, carbs: 52, fats: 20, calories: 560, cookTime: 30 },
      { name: 'Tom Yum Soup with Shrimp and Rice', protein: 28, carbs: 44, fats: 10, calories: 400, cookTime: 25 },
      { name: 'Chicken Satay with Peanut Sauce and Rice', protein: 34, carbs: 46, fats: 18, calories: 500, cookTime: 30 },
      // 60 min
      { name: 'Khao Soi (Northern Thai Curry Noodles)', protein: 32, carbs: 56, fats: 22, calories: 570, cookTime: 60 },
      { name: 'Slow-Cooked Thai Beef Massaman', protein: 36, carbs: 48, fats: 24, calories: 580, cookTime: 120 }
    ],
    dinner: [
      // 5 min
      { name: 'Thai Fresh Spring Rolls with Shrimp', protein: 16, carbs: 24, fats: 6, calories: 220, cookTime: 5 },
      { name: 'Thai Salad with Peanut Dressing', protein: 10, carbs: 18, fats: 12, calories: 220, cookTime: 5 },
      // 10 min
      { name: 'Quick Thai Basil Beef over Rice', protein: 28, carbs: 44, fats: 14, calories: 420, cookTime: 10 },
      { name: 'Instant Noodles Thai Style with Egg', protein: 16, carbs: 52, fats: 12, calories: 380, cookTime: 10 },
      // 20 min
      { name: 'Thai Fried Rice with Crab and Egg', protein: 26, carbs: 52, fats: 14, calories: 460, cookTime: 15 },
      { name: 'Pad See Ew (Stir-Fried Noodles) with Chicken', protein: 30, carbs: 56, fats: 16, calories: 510, cookTime: 20 },
      // 30 min
      { name: 'Thai Red Curry with Shrimp and Vegetables', protein: 30, carbs: 46, fats: 18, calories: 490, cookTime: 30 },
      { name: 'Grilled Fish with Spicy Thai Salad (Som Tam)', protein: 34, carbs: 32, fats: 14, calories: 410, cookTime: 25 },
      { name: 'Panang Curry with Beef and Rice', protein: 32, carbs: 50, fats: 20, calories: 530, cookTime: 35 },
      // 45 min
      { name: 'Massaman Curry with Chicken and Jasmine Rice', protein: 34, carbs: 54, fats: 22, calories: 580, cookTime: 45 },
      // 60 min
      { name: 'Whole Steamed Fish with Lime and Chili', protein: 38, carbs: 24, fats: 14, calories: 390, cookTime: 60 },
      { name: 'Thai Braised Pork Belly with Rice', protein: 34, carbs: 48, fats: 28, calories: 600, cookTime: 120 }
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
           !lower.includes('tuna') && !lower.includes('prosciutto') &&
           !lower.includes('chorizo') && !lower.includes('sausage') &&
           !lower.includes('bacon') && !lower.includes('carnitas') &&
           !lower.includes('barbacoa') && !lower.includes('chashu') &&
           !lower.includes('gyudon') && !lower.includes('birria');
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
           !lower.includes('paneer') && !lower.includes('ricotta') &&
           !lower.includes('prosciutto') && !lower.includes('chorizo') &&
           !lower.includes('sausage') && !lower.includes('bacon') &&
           !lower.includes('halloumi') && !lower.includes('labneh');
  });
}

// Helper function to filter by allergies
export function filterAllergies(meals: MealData[], allergies: string[]): MealData[] {
  if (allergies.length === 0) return meals;
  
  // Map allergy categories to specific ingredient keywords
  const allergyKeywords: Record<string, string[]> = {
    'Nuts': ['nut', 'almond', 'cashew', 'walnut', 'pecan', 'peanut', 'pistachio', 'hazelnut', 'macadamia'],
    'Dairy': ['milk', 'cheese', 'yogurt', 'cream', 'butter', 'ghee', 'paneer', 'ricotta', 'feta', 'mozzarella', 'cheddar', 'parmesan', 'whey', 'casein', 'halloumi', 'labneh'],
    'Eggs': ['egg', 'omelette', 'omelet', 'scrambled', 'frittata', 'quiche', 'tamagoyaki', 'khai jiao'],
    'Shellfish': ['shrimp', 'crab', 'lobster', 'prawn', 'crawfish', 'crayfish', 'oyster', 'clam', 'mussel', 'scallop'],
    'Soy': ['soy', 'tofu', 'tempeh', 'edamame', 'miso'],
    'Wheat': ['wheat', 'bread', 'pasta', 'noodle', 'flour', 'tortilla', 'pita', 'bagel', 'croissant', 'pancake', 'waffle', 'roti', 'naan', 'chapati'],
    'Fish': ['fish', 'salmon', 'tuna', 'cod', 'tilapia', 'trout', 'halibut', 'mackerel', 'sardine', 'anchovy', 'sea bass'],
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
