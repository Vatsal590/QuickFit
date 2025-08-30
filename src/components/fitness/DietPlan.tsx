import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useFitnessProfile } from '@/hooks/useFitnessProfile';
import { UtensilsCrossed, Target, Calendar, ChefHat, Trash2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MealPlan {
  day: number;
  meals: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };
  calories: number;
}

const DietPlan = () => {
  const { profile } = useFitnessProfile();
  const { toast } = useToast();
  const [dietPlan, setDietPlan] = useState<MealPlan[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateDietPlan = () => {
    if (!profile) {
      toast({
        title: "Profile Required",
        description: "Please complete your fitness profile first to generate a diet plan.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    // Determine if bulking or cutting based on goal weight
    const isBulking = profile.goal_weight ? profile.goal_weight > profile.weight : false;
    const isCutting = profile.goal_weight ? profile.goal_weight < profile.weight : false;

    // Calculate target calories
    const baseCalories = 2000; // Base calculation would be more complex in real app
    let targetCalories = baseCalories;
    
    if (isBulking) {
      targetCalories += 500; // Surplus for bulking
    } else if (isCutting) {
      targetCalories -= 500; // Deficit for cutting
    }

    // Get dietary preferences
    const isDietVegetarian = profile.diet_preferences?.includes('Vegetarian');
    const isDietVegan = profile.diet_preferences?.includes('Vegan');
    const isLactoseIntolerant = profile.diet_preferences?.includes('Lactose Intolerant');
    
    // Get taste preferences
    const tastePreferences = profile.taste_preferences || ['American'];
    const primaryCuisine = tastePreferences[0];

    // Get food allergies to avoid
    const allergies = profile.food_allergies || [];

    // Generate meal plans for 7 days
    const plans: MealPlan[] = [];

    for (let day = 1; day <= 7; day++) {
      const meals = generateMealsForDay(
        primaryCuisine,
        isDietVegetarian,
        isDietVegan,
        isLactoseIntolerant,
        allergies,
        isBulking,
        isCutting
      );

      plans.push({
        day,
        meals,
        calories: targetCalories
      });
    }

    setDietPlan(plans);
    setIsGenerating(false);

    toast({
      title: "Diet Plan Generated!",
      description: `Your ${isBulking ? 'bulking' : isCutting ? 'cutting' : 'maintenance'} plan is ready.`
    });
  };

  const generateMealsForDay = (
    cuisine: string,
    isVegetarian: boolean,
    isVegan: boolean,
    isLactoseIntolerant: boolean,
    allergies: string[],
    isBulking: boolean,
    isCutting: boolean
  ) => {
    // Define meal options by cuisine and dietary restrictions with more protein-dense options
    const mealOptions = {
      American: {
        breakfast: isVegan ? [
          'Protein-packed oatmeal with hemp seeds and almond butter', 
          'Tofu scramble with nutritional yeast and spinach',
          'Quinoa breakfast bowl with pumpkin seeds and berries',
          'Chia seed pudding with protein powder and nuts',
          'Smoothie bowl with plant protein, spinach, and peanut butter'
        ] : isVegetarian ? [
          'Greek yogurt with granola and mixed nuts', 
          'Scrambled eggs with cheese and whole grain toast',
          'Protein smoothie with whey protein and banana',
          'Cottage cheese pancakes with berries',
          'Egg white omelet with vegetables and feta cheese'
        ] : [
          'Scrambled eggs with turkey bacon and avocado',
          'Protein pancakes with Greek yogurt and berries',
          'Egg and chicken sausage breakfast burrito',
          'Smoked salmon bagel with cream cheese',
          'Steak and eggs with sweet potato hash'
        ],
        lunch: isVegan ? [
          'Lentil and quinoa salad with tahini dressing',
          'Black bean and tofu burger with sweet potato fries',
          'Buddha bowl with tempeh, quinoa, and hemp seeds',
          'Chickpea curry with brown rice',
          'Protein-packed veggie wrap with hummus and nuts'
        ] : isVegetarian ? [
          'Caprese sandwich with mozzarella and basil',
          'Quinoa and black bean veggie wrap',
          'Greek salad with feta and chickpeas',
          'Vegetarian protein bowl with eggs and cheese',
          'Lentil soup with whole grain bread'
        ] : [
          'Grilled chicken Caesar salad with parmesan',
          'Turkey and avocado wrap with whole grain tortilla',
          'Lean beef and quinoa power bowl',
          'Salmon salad with mixed greens and nuts',
          'Chicken breast with sweet potato and broccoli'
        ],
        dinner: isVegan ? [
          'Lentil walnut bolognese with whole grain pasta',
          'Stuffed bell peppers with quinoa and black beans',
          'Chickpea and vegetable curry with brown rice',
          'Tofu stir-fry with cashews and edamame',
          'Black bean and sweet potato enchiladas'
        ] : isVegetarian ? [
          'Vegetable lasagna with ricotta and mozzarella',
          'Mushroom and spinach risotto with parmesan',
          'Eggplant parmesan with side salad',
          'Quinoa stuffed portobello mushrooms',
          'Vegetarian chili with cornbread'
        ] : [
          'Grilled salmon with quinoa and asparagus',
          'Lean beef steak with roasted vegetables',
          'Chicken breast with brown rice and steamed broccoli',
          'Pork tenderloin with sweet potato and green beans',
          'Turkey meatballs with zucchini noodles'
        ],
        snacks: isVegan ? [
          'Mixed nuts and seeds with dried fruit',
          'Hummus with vegetables and whole grain crackers',
          'Protein smoothie with plant-based powder',
          'Almond butter with apple slices',
          'Trail mix with cashews and pumpkin seeds'
        ] : [
          'Greek yogurt with berries and granola',
          'Cottage cheese with cucumber and tomatoes',
          'Hard-boiled eggs with whole grain crackers',
          'Protein bar with nuts and seeds',
          'String cheese with almonds'
        ]
      },
      Italian: {
        breakfast: isVegan ? [
          'Espresso with vegan protein pastry and nuts',
          'Oat milk cappuccino with almond biscotti',
          'Fresh fruit salad with hemp seeds',
          'Vegan cornetto with cashew cream',
          'Quinoa breakfast bowl with Italian herbs'
        ] : [
          'Cappuccino with ricotta-filled cornetto',
          'Italian frittata with herbs and parmesan',
          'Espresso with Greek yogurt and honey',
          'Prosciutto and mozzarella breakfast wrap'
        ],
        lunch: isVegan ? [
          'Pasta e fagioli with white beans and herbs',
          'Minestrone soup with cannellini beans',
          'Vegan pasta with lentil bolognese',
          'Chickpea and vegetable risotto'
        ] : isVegetarian ? [
          'Margherita pizza with extra mozzarella',
          'Caprese salad with burrata cheese',
          'Pasta carbonara with eggs and parmesan',
          'Eggplant parmigiana with ricotta'
        ] : [
          'Chicken parmigiana with marinara sauce',
          'Prosciutto and arugula pizza',
          'Seafood risotto with shrimp and scallops',
          'Osso buco with polenta'
        ],
        dinner: isVegan ? [
          'Pasta arrabbiata with white beans',
          'Vegan eggplant parmigiana with cashew cheese',
          'Lentil and herb pasta with nutritional yeast',
          'Chickpea and spinach curry Italian-style'
        ] : isVegetarian ? [
          'Four cheese ravioli with spinach',
          'Mushroom and truffle risotto',
          'Gnocchi with gorgonzola and walnuts',
          'Vegetarian lasagna with ricotta'
        ] : [
          'Osso buco with saffron risotto',
          'Seafood linguine with clams and mussels',
          'Veal piccata with lemon and capers',
          'Grilled branzino with herbs'
        ],
        snacks: [
          'Olives and nuts mix',
          'Bruschetta with tomatoes and basil',
          'Italian nuts and dried fruits',
          'Parmigiano-Reggiano with walnuts'
        ]
      },
      Indian: {
        breakfast: isVegan ? [
          'Upma with vegetables and cashews',
          'Poha with peanuts and curry leaves',
          'Idli with sambar and coconut chutney',
          'Quinoa upma with mixed vegetables',
          'Moong dal cheela with vegetables'
        ] : [
          'Paratha with Greek yogurt and pickle',
          'Dosa with paneer filling and chutney',
          'Scrambled paneer with roti',
          'Lassi with almonds and honey'
        ],
        lunch: isVegan ? [
          'Dal tadka with brown rice and vegetables',
          'Chana masala with quinoa',
          'Mixed vegetable curry with roti',
          'Rajma (kidney bean curry) with rice',
          'Palak dal with jeera rice'
        ] : isVegetarian ? [
          'Paneer butter masala with naan',
          'Palak paneer with brown rice',
          'Chole bhature with yogurt',
          'Vegetable biryani with raita'
        ] : [
          'Chicken tikka masala with basmati rice',
          'Lamb biryani with boiled eggs',
          'Fish curry with coconut rice',
          'Butter chicken with garlic naan'
        ],
        dinner: isVegan ? [
          'Mixed dal with vegetables and quinoa',
          'Baingan bharta with roti',
          'Aloo gobi with brown rice',
          'Vegetable korma with coconut milk'
        ] : isVegetarian ? [
          'Palak paneer with whole wheat roti',
          'Paneer makhani with jeera rice',
          'Vegetable biryani with cucumber raita',
          'Dal makhani with naan'
        ] : [
          'Tandoori chicken with mint chutney',
          'Mutton curry with basmati rice',
          'Fish tikka with vegetable curry',
          'Chicken biryani with boiled eggs'
        ],
        snacks: [
          'Roasted chickpeas with spices',
          'Masala chai with nuts',
          'Mixed namkeen with peanuts',
          'Almonds and dates mix'
        ]
      },
      Mexican: {
        breakfast: isVegan ? [
          'Tofu scramble with black beans and salsa',
          'Avocado toast with hemp seeds',
          'Quinoa breakfast bowl with peppers',
          'Chia seed pudding with coconut and lime',
          'Bean and vegetable breakfast burrito'
        ] : [
          'Huevos rancheros with refried beans',
          'Breakfast burrito with eggs and cheese',
          'Scrambled eggs with chorizo and peppers',
          'Greek yogurt with granola and berries'
        ],
        lunch: isVegan ? [
          'Black bean and quinoa tacos',
          'Veggie burrito bowl with guacamole',
          'Lentil and vegetable quesadilla',
          'Chickpea and sweet potato tacos'
        ] : isVegetarian ? [
          'Cheese quesadilla with black beans',
          'Veggie burrito with rice and beans',
          'Caprese-style Mexican salad',
          'Bean and cheese enchiladas'
        ] : [
          'Chicken tacos with cilantro and onions',
          'Carnitas bowl with brown rice',
          'Fish tacos with cabbage slaw',
          'Beef barbacoa burrito'
        ],
        dinner: isVegan ? [
          'Vegetable and black bean fajitas',
          'Quinoa stuffed bell peppers',
          'Lentil and sweet potato enchiladas',
          'Chickpea and vegetable tostadas'
        ] : isVegetarian ? [
          'Cheese enchiladas with verde sauce',
          'Veggie burrito with guacamole',
          'Black bean and cheese quesadillas',
          'Vegetable fajitas with peppers'
        ] : [
          'Chicken fajitas with peppers and onions',
          'Carne asada with cilantro lime rice',
          'Fish tacos with mango salsa',
          'Pork carnitas with black beans'
        ],
        snacks: [
          'Guacamole with baked tortilla chips',
          'Salsa with fresh vegetables',
          'Mixed nuts with chili powder',
          'Roasted pumpkin seeds'
        ]
      }
    };

    // Get meals for the selected cuisine or default to American
    const cuisineMeals = mealOptions[cuisine as keyof typeof mealOptions] || mealOptions.American;

    // Filter out foods with allergies
    const filterAllergies = (foods: string[]) => {
      return foods.filter(food => {
        return !allergies.some(allergy => 
          food.toLowerCase().includes(allergy.toLowerCase())
        );
      });
    };

    // Randomly select meals
    const getRandomMeal = (meals: string[]) => {
      const filtered = filterAllergies(meals);
      return filtered[Math.floor(Math.random() * filtered.length)] || 'Custom meal';
    };

    return {
      breakfast: [getRandomMeal(cuisineMeals.breakfast), getRandomMeal(cuisineMeals.breakfast)],
      lunch: [getRandomMeal(cuisineMeals.lunch), getRandomMeal(cuisineMeals.lunch)],
      dinner: [getRandomMeal(cuisineMeals.dinner), getRandomMeal(cuisineMeals.dinner)],
      snacks: [getRandomMeal(cuisineMeals.snacks), getRandomMeal(cuisineMeals.snacks)]
    };
  };

  const clearDietPlan = () => {
    setDietPlan([]);
    toast({
      title: "Diet Plan Cleared",
      description: "Your diet plan has been cleared successfully."
    });
  };

  const getPlanType = () => {
    if (!profile?.goal_weight) return 'Maintenance';
    if (profile.goal_weight > profile.weight) return 'Bulking';
    if (profile.goal_weight < profile.weight) return 'Cutting';
    return 'Maintenance';
  };

  return (
    <div className="space-y-6">
      {/* Profile Summary & Generate Button */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Your Diet Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profile ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Current Weight:</span> {profile.weight}kg
                </div>
                <div>
                  <span className="font-medium">Goal Weight:</span> {profile.goal_weight || 'Not set'}kg
                </div>
                <div>
                  <span className="font-medium">Plan Type:</span>
                  <Badge variant="secondary" className="ml-2">
                    {getPlanType()}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Fitness Goal:</span> {profile.fitness_goal}
                </div>
              </div>
              
              {profile.diet_preferences && profile.diet_preferences.length > 0 && (
                <div>
                  <span className="font-medium text-sm">Diet Preferences:</span>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {profile.diet_preferences.map((pref, index) => (
                      <Badge key={index} variant="outline">{pref}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile.food_allergies && profile.food_allergies.length > 0 && (
                <div>
                  <span className="font-medium text-sm">Food Allergies:</span>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {profile.food_allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive">{allergy}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile.taste_preferences && profile.taste_preferences.length > 0 && (
                <div>
                  <span className="font-medium text-sm">Cuisine Preferences:</span>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {profile.taste_preferences.map((taste, index) => (
                      <Badge key={index} variant="secondary">{taste}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={generateDietPlan} 
                  disabled={isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? 'Generating...' : 'Generate 7-Day Diet Plan'}
                </Button>
                
                {dietPlan.length > 0 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Diet Plan</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete your current diet plan? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={clearDietPlan}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <UtensilsCrossed className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Complete your fitness profile to generate a personalized diet plan
              </p>
              <Button onClick={() => {
                const event = new CustomEvent('openFitnessProfileForm');
                window.dispatchEvent(event);
              }}>
                Complete Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diet Plan Display */}
      {dietPlan.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Your 7-Day {getPlanType()} Plan
              </CardTitle>
              <Button
                onClick={generateDietPlan}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {isGenerating ? 'Generating...' : 'Generate New Plan'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="day1" className="w-full">
              <TabsList className="grid w-full grid-cols-7">
                {dietPlan.map((plan) => (
                  <TabsTrigger key={plan.day} value={`day${plan.day}`}>
                    Day {plan.day}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {dietPlan.map((plan) => (
                <TabsContent key={plan.day} value={`day${plan.day}`}>
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <Badge variant="outline" className="text-lg px-4 py-2">
                        Target: {plan.calories} calories
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <ChefHat className="h-4 w-4" />
                            Breakfast
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-1">
                            {plan.meals.breakfast.map((meal, index) => (
                              <div key={index} className="text-sm">{meal}</div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <UtensilsCrossed className="h-4 w-4" />
                            Lunch
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-1">
                            {plan.meals.lunch.map((meal, index) => (
                              <div key={index} className="text-sm">{meal}</div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <ChefHat className="h-4 w-4" />
                            Dinner
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-1">
                            {plan.meals.dinner.map((meal, index) => (
                              <div key={index} className="text-sm">{meal}</div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Snacks</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-1">
                            {plan.meals.snacks.map((snack, index) => (
                              <div key={index} className="text-sm">{snack}</div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DietPlan;