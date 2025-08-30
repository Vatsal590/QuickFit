import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFitnessProfile } from '@/hooks/useFitnessProfile';
import { UtensilsCrossed, Target, Calendar, ChefHat } from 'lucide-react';
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
    // Define meal options by cuisine and dietary restrictions
    const mealOptions = {
      American: {
        breakfast: isVegan ? ['Oatmeal with berries', 'Avocado toast', 'Smoothie bowl'] 
                 : isVegetarian ? ['Greek yogurt with granola', 'Scrambled eggs with toast', 'Protein smoothie']
                 : ['Scrambled eggs with bacon', 'Pancakes with syrup', 'Protein smoothie'],
        lunch: isVegan ? ['Quinoa salad', 'Veggie burger', 'Buddha bowl']
              : isVegetarian ? ['Caprese sandwich', 'Veggie wrap', 'Pasta salad']
              : ['Grilled chicken salad', 'Turkey sandwich', 'Beef wrap'],
        dinner: isVegan ? ['Lentil curry', 'Stuffed bell peppers', 'Vegetable stir-fry']
               : isVegetarian ? ['Vegetable lasagna', 'Mushroom risotto', 'Veggie pasta']
               : ['Grilled salmon', 'Chicken breast with vegetables', 'Lean beef steak'],
        snacks: isVegan ? ['Mixed nuts', 'Fruit', 'Hummus with vegetables']
               : ['Greek yogurt', 'Cottage cheese', 'Protein bar']
      },
      Italian: {
        breakfast: isVegan ? ['Espresso with vegan pastry', 'Fruit with granola']
                  : ['Cappuccino with croissant', 'Italian frittata'],
        lunch: isVegan ? ['Pasta marinara', 'Minestrone soup']
              : isVegetarian ? ['Margherita pizza', 'Caprese salad']
              : ['Chicken parmigiana', 'Prosciutto pizza'],
        dinner: isVegan ? ['Pasta arrabbiata', 'Eggplant parmigiana']
               : isVegetarian ? ['Four cheese pizza', 'Mushroom risotto']
               : ['Osso buco', 'Seafood pasta'],
        snacks: ['Olives', 'Bruschetta', 'Italian nuts']
      },
      Indian: {
        breakfast: isVegan ? ['Upma', 'Poha', 'Idli with sambhar']
                  : ['Paratha with yogurt', 'Dosa with chutney'],
        lunch: isVegan ? ['Dal with rice', 'Vegetable curry', 'Chana masala']
              : isVegetarian ? ['Paneer butter masala', 'Rajma with rice']
              : ['Chicken curry', 'Mutton biryani'],
        dinner: isVegan ? ['Mixed vegetable curry', 'Palak dal']
               : isVegetarian ? ['Palak paneer', 'Aloo gobi']
               : ['Tandoori chicken', 'Fish curry'],
        snacks: ['Roasted chickpeas', 'Masala chai', 'Mixed namkeen']
      },
      Mexican: {
        breakfast: isVegan ? ['Tofu scramble', 'Avocado toast', 'Fruit bowl']
                  : ['Huevos rancheros', 'Breakfast burrito'],
        lunch: isVegan ? ['Black bean tacos', 'Veggie quesadilla']
              : isVegetarian ? ['Cheese quesadilla', 'Bean burrito']
              : ['Chicken tacos', 'Carnitas bowl'],
        dinner: isVegan ? ['Vegetable fajitas', 'Black bean enchiladas']
               : isVegetarian ? ['Cheese enchiladas', 'Veggie burrito']
               : ['Chicken fajitas', 'Carne asada'],
        snacks: ['Guacamole with chips', 'Salsa with vegetables', 'Mixed nuts']
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
      breakfast: [getRandomMeal(cuisineMeals.breakfast)],
      lunch: [getRandomMeal(cuisineMeals.lunch)],
      dinner: [getRandomMeal(cuisineMeals.dinner)],
      snacks: [getRandomMeal(cuisineMeals.snacks)]
    };
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

              <Button 
                onClick={generateDietPlan} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? 'Generating...' : 'Generate 7-Day Diet Plan'}
              </Button>
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
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Your 7-Day {getPlanType()} Plan
            </CardTitle>
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
                          <ul className="space-y-1">
                            {plan.meals.breakfast.map((meal, index) => (
                              <li key={index} className="text-sm">{meal}</li>
                            ))}
                          </ul>
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
                          <ul className="space-y-1">
                            {plan.meals.lunch.map((meal, index) => (
                              <li key={index} className="text-sm">{meal}</li>
                            ))}
                          </ul>
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
                          <ul className="space-y-1">
                            {plan.meals.dinner.map((meal, index) => (
                              <li key={index} className="text-sm">{meal}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Snacks</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-1">
                            {plan.meals.snacks.map((snack, index) => (
                              <li key={index} className="text-sm">{snack}</li>
                            ))}
                          </ul>
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