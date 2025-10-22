import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useFitnessProfile } from '@/hooks/useFitnessProfile';
import { UtensilsCrossed, Target, Calendar, ChefHat, Trash2, Settings, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DayMealPlan, MealOption, MealMacros } from '@/types/meal';
import { getMealByName } from '@/data/mealDatabase';
import GroceryList from './GroceryList';

const DietPlan = () => {
  const { profile, updateProfile } = useFitnessProfile();
  const { toast } = useToast();
  const [dietPlan, setDietPlan] = useState<DayMealPlan[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    goal_weight: '',
    diet_preferences: [] as string[],
    food_allergies: [] as string[],
    taste_preferences: [] as string[]
  });

  useEffect(() => {
    if (profile) {
      setEditFormData({
        goal_weight: profile.goal_weight ? profile.goal_weight.toString() : '',
        diet_preferences: profile.diet_preferences || [],
        food_allergies: profile.food_allergies || [],
        taste_preferences: profile.taste_preferences || []
      });
    }
  }, [profile]);

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
    const baseCalories = 2000;
    let targetCalories = baseCalories;
    
    if (isBulking) {
      targetCalories += 500;
    } else if (isCutting) {
      targetCalories -= 500;
    }

    // Get dietary preferences
    const isDietVegetarian = profile.diet_preferences?.includes('Vegetarian');
    const isDietVegan = profile.diet_preferences?.includes('Vegan');
    const isLactoseIntolerant = profile.diet_preferences?.includes('Lactose Intolerant');
    
    // Get taste preferences for multi-cuisine support
    const tastePreferences = profile.taste_preferences || ['American'];

    // Get food allergies to avoid
    const allergies = profile.food_allergies || [];

    // Generate meal plans for 7 days
    const plans: DayMealPlan[] = [];

    for (let day = 1; day <= 7; day++) {
      const meals = generateMealsForDay(
        tastePreferences,
        isDietVegetarian,
        isDietVegan,
        isLactoseIntolerant,
        allergies,
        targetCalories,
        day
      );

      // Calculate total macros for the day
      const totalMacros: MealMacros = {
        protein: 0,
        carbs: 0,
        fats: 0,
        calories: 0
      };

      Object.values(meals).forEach(mealOptions => {
        mealOptions.forEach(meal => {
          totalMacros.protein += meal.macros.protein;
          totalMacros.carbs += meal.macros.carbs;
          totalMacros.fats += meal.macros.fats;
          totalMacros.calories += meal.macros.calories;
        });
      });

      plans.push({
        day,
        meals,
        totalMacros
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
    cuisines: string[],
    isVegetarian: boolean,
    isVegan: boolean,
    isLactoseIntolerant: boolean,
    allergies: string[],
    targetCalories: number,
    dayNumber: number = 1
  ): { breakfast: MealOption[]; lunch: MealOption[]; dinner: MealOption[]; snacks: MealOption[] } => {
    // Define meal name options by cuisine and dietary restrictions
    const mealNames = {
      American: {
        breakfast: isVegan ? [
          'Protein-packed oatmeal with hemp seeds and almond butter',
          'Tofu scramble with nutritional yeast and spinach',
        ] : isVegetarian ? [
          'Greek yogurt with granola and mixed nuts',
          'Protein pancakes with Greek yogurt and berries',
        ] : [
          'Scrambled eggs with turkey bacon and avocado',
          'Protein pancakes with Greek yogurt and berries',
        ],
        lunch: isVegan ? [
          'Lentil and quinoa salad with tahini dressing',
          'Black bean and tofu burger with sweet potato fries',
        ] : [
          'Grilled chicken Caesar salad with parmesan',
          'Salmon salad with mixed greens and nuts',
        ],
        dinner: isVegan ? [
          'Tofu stir-fry with cashews and edamame',
        ] : [
          'Grilled salmon with quinoa and asparagus',
          'Chicken breast with brown rice and steamed broccoli',
        ],
        snacks: isVegan ? [
          'Mixed nuts and seeds with dried fruit',
          'Hummus with vegetables and whole grain crackers',
        ] : [
          'Greek yogurt with berries and granola',
          'Mixed nuts and seeds with dried fruit',
          'Protein bar with nuts and seeds',
        ]
      },
      Italian: {
        breakfast: ['Chicken parmigiana with marinara sauce'],
        lunch: ['Chicken parmigiana with marinara sauce', 'Seafood risotto with shrimp and scallops'],
        dinner: ['Chicken parmigiana with marinara sauce', 'Seafood risotto with shrimp and scallops'],
        snacks: ['Mixed nuts and seeds with dried fruit']
      },
      Japanese: {
        breakfast: ['Salmon sushi and miso soup'],
        lunch: ['Salmon sushi and miso soup', 'Chicken teriyaki with steamed rice'],
        dinner: ['Salmon sushi and miso soup', 'Chicken teriyaki with steamed rice'],
        snacks: ['Mixed nuts and seeds with dried fruit']
      },
      Mediterranean: {
        breakfast: ['Grilled chicken with Greek salad'],
        lunch: ['Grilled chicken with Greek salad', 'Grilled fish with herbs and olive oil'],
        dinner: ['Grilled chicken with Greek salad', 'Grilled fish with herbs and olive oil'],
        snacks: ['Hummus with vegetables and whole grain crackers']
      },
      Indian: {
        breakfast: ['Chicken curry with brown rice'],
        lunch: isVegetarian ? ['Paneer curry with brown rice', 'Dal with brown rice and vegetables'] : ['Chicken curry with brown rice'],
        dinner: isVegetarian ? ['Paneer curry with brown rice', 'Dal with brown rice and vegetables'] : ['Chicken curry with brown rice'],
        snacks: ['Mixed nuts and seeds with dried fruit']
      },
      Mexican: {
        breakfast: ['Chicken taco bowl with brown rice'],
        lunch: isVegetarian ? ['Black bean and quinoa bowl'] : ['Chicken taco bowl with brown rice'],
        dinner: isVegetarian ? ['Black bean and quinoa bowl'] : ['Chicken taco bowl with brown rice'],
        snacks: ['Mixed nuts and seeds with dried fruit']
      },
      Thai: {
        breakfast: ['Pad Thai with chicken and vegetables'],
        lunch: isVegan ? ['Pad Thai with tofu and vegetables'] : ['Pad Thai with chicken and vegetables', 'Green curry chicken with jasmine rice'],
        dinner: isVegan ? ['Pad Thai with tofu and vegetables'] : ['Pad Thai with chicken and vegetables', 'Green curry chicken with jasmine rice'],
        snacks: ['Mixed nuts and seeds with dried fruit']
      }
    };

    // Get meals from selected cuisines
    const getMealsFromCuisines = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks', count: number = 1): MealOption[] => {
      const selected: MealOption[] = [];
      const activeCuisines = cuisines.length > 0 ? cuisines : ['American'];
      
      for (let i = 0; i < count && selected.length < count; i++) {
        const cuisineIndex = ((dayNumber - 1) + i) % activeCuisines.length;
        const cuisineName = activeCuisines[cuisineIndex] as keyof typeof mealNames;
        const cuisineMealNames = mealNames[cuisineName]?.[mealType] || mealNames.American[mealType];
        
        if (cuisineMealNames && cuisineMealNames.length > 0) {
          const mealIndex = ((dayNumber - 1) * 2 + i) % cuisineMealNames.length;
          const mealName = cuisineMealNames[mealIndex];
          const meal = getMealByName(mealName);
          
          if (meal && !selected.some(m => m.name === meal.name)) {
            selected.push(meal);
          }
        }
      }
      
      return selected;
    };

    return {
      breakfast: getMealsFromCuisines('breakfast', 1),
      lunch: getMealsFromCuisines('lunch', 1),
      dinner: getMealsFromCuisines('dinner', 1),
      snacks: getMealsFromCuisines('snacks', 2)
    };
  };

  const handleUpdateProfile = async () => {
    if (!profile) return;

    try {
      await updateProfile({
        ...profile,
        goal_weight: editFormData.goal_weight ? parseFloat(editFormData.goal_weight) : null,
        diet_preferences: editFormData.diet_preferences,
        food_allergies: editFormData.food_allergies,
        taste_preferences: editFormData.taste_preferences
      });

      toast({
        title: "Profile Updated",
        description: "Your diet preferences have been updated successfully."
      });

      setIsEditingProfile(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCheckboxChange = (
    field: 'diet_preferences' | 'food_allergies' | 'taste_preferences', 
    value: string, 
    checked: boolean
  ) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
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

              <div className="flex gap-2">
                <Button 
                  onClick={generateDietPlan} 
                  disabled={isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? 'Generating...' : 'Generate 7-Day Diet Plan'}
                </Button>

                <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                   <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                     <DialogHeader>
                       <DialogTitle>Edit Diet Preferences</DialogTitle>
                       <DialogDescription>
                         Update your dietary preferences, allergies, and cuisine choices to get a personalized diet plan.
                       </DialogDescription>
                     </DialogHeader>
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="goal_weight">Goal Weight (kg)</Label>
                        <Input
                          id="goal_weight"
                          type="number"
                          value={editFormData.goal_weight}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, goal_weight: e.target.value }))}
                          placeholder="Enter your goal weight"
                        />
                      </div>

                      <div>
                        <Label>Diet Preferences</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Lactose Intolerant'].map((pref) => (
                            <div key={pref} className="flex items-center space-x-2">
                              <Checkbox
                                id={`diet-${pref}`}
                                checked={editFormData.diet_preferences.includes(pref)}
                                onCheckedChange={(checked) => handleCheckboxChange('diet_preferences', pref, checked as boolean)}
                              />
                              <Label htmlFor={`diet-${pref}`} className="text-sm">{pref}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label>Food Allergies</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {['Nuts', 'Shellfish', 'Eggs', 'Fish', 'Soy', 'Wheat'].map((allergy) => (
                            <div key={allergy} className="flex items-center space-x-2">
                              <Checkbox
                                id={`allergy-${allergy}`}
                                checked={editFormData.food_allergies.includes(allergy)}
                                onCheckedChange={(checked) => handleCheckboxChange('food_allergies', allergy, checked as boolean)}
                              />
                              <Label htmlFor={`allergy-${allergy}`} className="text-sm">{allergy}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label>Cuisine Preferences</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                         {['American', 'Italian', 'Indian', 'Mexican', 'Japanese', 'Mediterranean', 'Thai'].map((cuisine) => (
                            <div key={cuisine} className="flex items-center space-x-2">
                              <Checkbox
                                id={`cuisine-${cuisine}`}
                                checked={editFormData.taste_preferences.includes(cuisine)}
                                onCheckedChange={(checked) => handleCheckboxChange('taste_preferences', cuisine, checked as boolean)}
                              />
                              <Label htmlFor={`cuisine-${cuisine}`} className="text-sm">{cuisine}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button onClick={handleUpdateProfile} className="w-full">
                        Update Preferences
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {dietPlan.length > 0 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Clear Diet Plan</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to clear your current diet plan? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={clearDietPlan}>Clear Plan</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <UtensilsCrossed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Please complete your fitness profile first to generate a personalized diet plan.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generated Diet Plan */}
      {dietPlan.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Your 7-Day Diet Plan
              <Badge variant="outline" className="ml-2">
                {Math.round(dietPlan[0]?.totalMacros.calories || 0)} calories/day
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="day-1" className="w-full">
              <TabsList className="grid w-full grid-cols-7">
                {dietPlan.map((_, index) => (
                  <TabsTrigger key={index} value={`day-${index + 1}`}>
                    Day {index + 1}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {dietPlan.map((plan, index) => (
                <TabsContent key={index} value={`day-${index + 1}`} className="mt-6">
                  <div className="space-y-6">
                    {/* Daily Macros Summary */}
                    <Card className="bg-muted/50">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp className="h-4 w-4 text-fitness-primary" />
                          <span className="font-semibold">Daily Macros</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <div className="text-2xl font-bold text-fitness-primary">{Math.round(plan.totalMacros.calories)}</div>
                            <div className="text-xs text-muted-foreground">Calories</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold">{Math.round(plan.totalMacros.protein)}g</div>
                            <div className="text-xs text-muted-foreground">Protein</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold">{Math.round(plan.totalMacros.carbs)}g</div>
                            <div className="text-xs text-muted-foreground">Carbs</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold">{Math.round(plan.totalMacros.fats)}g</div>
                            <div className="text-xs text-muted-foreground">Fats</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <ChefHat className="h-4 w-4" />
                            Breakfast
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {plan.meals.breakfast.map((meal, idx) => (
                              <div key={idx} className="p-3 bg-muted/30 rounded-lg">
                                <div className="text-sm font-medium mb-2">{meal.name}</div>
                                <div className="flex gap-3 text-xs text-muted-foreground">
                                  <span>{Math.round(meal.macros.calories)} cal</span>
                                  <span>P: {Math.round(meal.macros.protein)}g</span>
                                  <span>C: {Math.round(meal.macros.carbs)}g</span>
                                  <span>F: {Math.round(meal.macros.fats)}g</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Lunch</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {plan.meals.lunch.map((meal, idx) => (
                              <div key={idx} className="p-3 bg-muted/30 rounded-lg">
                                <div className="text-sm font-medium mb-2">{meal.name}</div>
                                <div className="flex gap-3 text-xs text-muted-foreground">
                                  <span>{Math.round(meal.macros.calories)} cal</span>
                                  <span>P: {Math.round(meal.macros.protein)}g</span>
                                  <span>C: {Math.round(meal.macros.carbs)}g</span>
                                  <span>F: {Math.round(meal.macros.fats)}g</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Dinner</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {plan.meals.dinner.map((meal, idx) => (
                              <div key={idx} className="p-3 bg-muted/30 rounded-lg">
                                <div className="text-sm font-medium mb-2">{meal.name}</div>
                                <div className="flex gap-3 text-xs text-muted-foreground">
                                  <span>{Math.round(meal.macros.calories)} cal</span>
                                  <span>P: {Math.round(meal.macros.protein)}g</span>
                                  <span>C: {Math.round(meal.macros.carbs)}g</span>
                                  <span>F: {Math.round(meal.macros.fats)}g</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Snacks</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {plan.meals.snacks.map((meal, idx) => (
                              <div key={idx} className="p-3 bg-muted/30 rounded-lg">
                                <div className="text-sm font-medium mb-2">{meal.name}</div>
                                <div className="flex gap-3 text-xs text-muted-foreground">
                                  <span>{Math.round(meal.macros.calories)} cal</span>
                                  <span>P: {Math.round(meal.macros.protein)}g</span>
                                  <span>C: {Math.round(meal.macros.carbs)}g</span>
                                  <span>F: {Math.round(meal.macros.fats)}g</span>
                                </div>
                              </div>
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

      {/* Grocery List */}
      {dietPlan.length > 0 && (
        <GroceryList weekPlan={dietPlan} />
      )}
    </div>
  );
};

export default DietPlan;