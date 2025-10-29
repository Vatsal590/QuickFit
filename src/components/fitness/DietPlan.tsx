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
import { UtensilsCrossed, Target, Calendar, ChefHat, Trash2, Settings, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast as sonnerToast } from 'sonner';
import { mealDatabase, filterVegetarian, filterVegan, filterAllergies, MealData } from '@/data/mealDatabase';
import NutritionGoals from '@/components/fitness/NutritionGoals';

interface MealPlan {
  day: number;
  meals: {
    breakfast: MealData[];
    lunch: MealData[];
    dinner: MealData[];
    snacks: MealData[];
  };
  targetCalories: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}

const DietPlan = () => {
  const { profile, updateProfile } = useFitnessProfile();
  const { toast } = useToast();
  const { user } = useAuth();
  const [dietPlan, setDietPlan] = useState<MealPlan[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [syncingMeal, setSyncingMeal] = useState<string | null>(null);
  const [isEditingGoals, setIsEditingGoals] = useState(false);
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

  // Load existing diet plan on mount
  useEffect(() => {
    if (user) {
      loadExistingPlan();
    }
  }, [user]);

  const loadExistingPlan = async () => {
    try {
      const { data, error } = await supabase
        .from('diet_plans')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data && data.daily_meals) {
        setDietPlan(data.daily_meals as unknown as MealPlan[]);
      }
    } catch (error) {
      console.error('Error loading diet plan:', error);
    }
  };

  const generateDietPlan = async () => {
    if (!profile) {
      toast({
        title: "Profile Required",
        description: "Please complete your fitness profile first to generate a diet plan.",
        variant: "destructive"
      });
      const event = new CustomEvent('openFitnessProfileForm');
      window.dispatchEvent(event);
      return;
    }

    setIsGenerating(true);

    try {
      // Fetch latest nutrition goals to sync with Food Tracker
      const { data: goalsData, error: goalsError } = await supabase
        .from('user_nutrition_goals')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();
      if (goalsError && goalsError.code !== 'PGRST116') throw goalsError;

      const isBulking = profile.goal_weight ? profile.goal_weight > profile.weight : false;
      const isCutting = profile.goal_weight ? profile.goal_weight < profile.weight : false;

      // Determine target calories
      let targetCalories = goalsData?.daily_calories ? Number(goalsData.daily_calories) : 2200; // Base maintenance
      if (!goalsData?.daily_calories) {
        if (isBulking) {
          targetCalories = 2700; // Bulking surplus
        } else if (isCutting) {
          targetCalories = 1800; // Cutting deficit
        }
      }

      const isDietVegetarian = profile.diet_preferences?.includes('Vegetarian');
      const isDietVegan = profile.diet_preferences?.includes('Vegan');
      const tastePreferences = profile.taste_preferences || ['American'];
      const allergies = profile.food_allergies || [];

      // Generate 9-day meal plan
      const plans: MealPlan[] = [];

      // Build comprehensive snack pool from all cuisines for variety
      const allSnacks = buildComprehensiveSnackPool(tastePreferences, isDietVegetarian, isDietVegan, allergies);

      for (let day = 1; day <= 9; day++) {
        const dailyMeals = generateMealsForDay(
          tastePreferences,
          isDietVegetarian,
          isDietVegan,
          allergies,
          targetCalories,
          day,
          allSnacks
        );

        // Calculate totals for selected meals
        const allMeals = [
          ...dailyMeals.breakfast,
          ...dailyMeals.lunch,
          ...dailyMeals.dinner,
          ...dailyMeals.snacks
        ];
        let totalCalories = allMeals.reduce((sum, meal) => sum + meal.calories, 0);
        let totalProtein = allMeals.reduce((sum, meal) => sum + meal.protein, 0);
        let totalCarbs = allMeals.reduce((sum, meal) => sum + meal.carbs, 0);
        let totalFats = allMeals.reduce((sum, meal) => sum + meal.fats, 0);

        // Adjust foods (add/remove snacks) to get close to target calories
        const snackPool = getSnackPool(tastePreferences, !!isDietVegetarian, !!isDietVegan, allergies);
        const { adjustedMeals, totals } = adjustMealsToTarget(dailyMeals, targetCalories, snackPool);

        plans.push({
          day,
          meals: adjustedMeals,
          targetCalories,
          totalCalories: totals.calories,
          totalProtein: totals.protein,
          totalCarbs: totals.carbs,
          totalFats: totals.fats
        });
      }

      setDietPlan(plans);

      // Save to database
      const targetProtein = (goalsData?.daily_protein && Number(goalsData.daily_protein)) || Math.round((targetCalories * 0.35) / 4);
      const targetCarbs = (goalsData?.daily_carbs && Number(goalsData.daily_carbs)) || Math.round((targetCalories * 0.40) / 4);
      const targetFats = (goalsData?.daily_fats && Number(goalsData.daily_fats)) || Math.round((targetCalories * 0.25) / 9);

      const { error } = await supabase
        .from('diet_plans')
        .insert([{
          user_id: user!.id,
          plan_name: `${isBulking ? 'Bulking' : isCutting ? 'Cutting' : 'Maintenance'} Diet Plan`,
          target_calories: targetCalories,
          target_protein: targetProtein,
          target_carbs: targetCarbs,
          target_fats: targetFats,
          daily_meals: plans as any,
          cuisine_preferences: tastePreferences,
          is_active: true
        }]);

      if (error) throw error;

      toast({
        title: "Diet Plan Generated!",
        description: `Your ${isBulking ? 'bulking' : isCutting ? 'cutting' : 'maintenance'} plan is ready with accurate macros.`
      });
    } catch (error) {
      console.error('Error generating diet plan:', error);
      toast({
        title: "Error",
        description: "Failed to generate diet plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Build comprehensive snack pool from all selected cuisines for maximum variety
  const buildComprehensiveSnackPool = (
    cuisines: string[],
    isVegetarian: boolean,
    isVegan: boolean,
    allergies: string[]
  ): MealData[] => {
    const activeCuisines = cuisines.filter(c => c !== 'French');
    const allSnacks: MealData[] = [];

    // Collect snacks from all selected cuisines
    activeCuisines.forEach(cuisine => {
      let snacks = mealDatabase[cuisine]?.snacks || [];
      if (isVegan) snacks = filterVegan(snacks);
      else if (isVegetarian) snacks = filterVegetarian(snacks);
      snacks = filterAllergies(snacks, allergies);
      allSnacks.push(...snacks);
    });

    // If no cuisines selected or no snacks found, use American
    if (allSnacks.length === 0) {
      let snacks = mealDatabase.American.snacks;
      if (isVegan) snacks = filterVegan(snacks);
      else if (isVegetarian) snacks = filterVegetarian(snacks);
      snacks = filterAllergies(snacks, allergies);
      allSnacks.push(...snacks);
    }

    // Sort by protein density and return all unique snacks
    const uniqueSnacks = Array.from(new Map(allSnacks.map(s => [s.name, s])).values());
    return uniqueSnacks.sort((a, b) => (b.protein / b.calories) - (a.protein / a.calories));
  };

  const generateMealsForDay = (
    cuisines: string[],
    isVegetarian: boolean,
    isVegan: boolean,
    allergies: string[],
    targetCalories: number,
    dayNumber: number,
    comprehensiveSnackPool: MealData[]
  ) => {
    // Select primary cuisine for the day (rotate through preferences)
    const activeCuisines = cuisines.filter(c => c !== 'French');
    const primaryCuisine = activeCuisines[(dayNumber - 1) % activeCuisines.length] || 'American';
    
    // Get meals from the database
    let breakfastOptions = mealDatabase[primaryCuisine]?.breakfast || mealDatabase.American.breakfast;
    let lunchOptions = mealDatabase[primaryCuisine]?.lunch || mealDatabase.American.lunch;
    let dinnerOptions = mealDatabase[primaryCuisine]?.dinner || mealDatabase.American.dinner;
    let snackOptions = mealDatabase[primaryCuisine]?.snacks || mealDatabase.American.snacks;

    // Apply dietary filters
    if (isVegan) {
      breakfastOptions = filterVegan(breakfastOptions);
      lunchOptions = filterVegan(lunchOptions);
      dinnerOptions = filterVegan(dinnerOptions);
      snackOptions = filterVegan(snackOptions);
    } else if (isVegetarian) {
      breakfastOptions = filterVegetarian(breakfastOptions);
      lunchOptions = filterVegetarian(lunchOptions);
      dinnerOptions = filterVegetarian(dinnerOptions);
      snackOptions = filterVegetarian(snackOptions);
    }

    // Apply allergy filters
    breakfastOptions = filterAllergies(breakfastOptions, allergies);
    lunchOptions = filterAllergies(lunchOptions, allergies);
    dinnerOptions = filterAllergies(dinnerOptions, allergies);
    snackOptions = filterAllergies(snackOptions, allergies);

    // Sort by absolute protein content first, then by protein density
    const sortByProteinAmount = (meals: MealData[]) => 
      [...meals].sort((a, b) => {
        const proteinDiff = b.protein - a.protein;
        if (Math.abs(proteinDiff) > 5) return proteinDiff; // Prioritize high protein
        return (b.protein / b.calories) - (a.protein / a.calories); // Then density
      });

    breakfastOptions = sortByProteinAmount(breakfastOptions);
    lunchOptions = sortByProteinAmount(lunchOptions);
    dinnerOptions = sortByProteinAmount(dinnerOptions);
    snackOptions = sortByProteinAmount(snackOptions);

    // Select high-protein meals with variety (use day number as seed for rotation)
    const breakfast = selectMeals(breakfastOptions, 1, dayNumber);
    const lunch = selectMeals(lunchOptions, 1, dayNumber);
    const dinner = selectMeals(dinnerOptions, 1, dayNumber);
    // Use comprehensive snack pool for variety across all days
    const snacks = selectMeals(comprehensiveSnackPool, 2, dayNumber);

    return {
      breakfast,
      lunch,
      dinner,
      snacks
    };
  };

  const selectMeals = (options: MealData[], count: number, seed: number): MealData[] => {
    if (options.length === 0) return [];
    
    const selected: MealData[] = [];
    const startIndex = (seed - 1) * count;
    
    for (let i = 0; i < count; i++) {
      const index = (startIndex + i) % options.length;
      selected.push(options[index]);
    }
    
    return selected;
  };

  // Build a protein-dense snack pool based on preferences and restrictions
  const getSnackPool = (
    cuisines: string[],
    isVegetarian: boolean,
    isVegan: boolean,
    allergies: string[]
  ): MealData[] => {
    const activeCuisines = cuisines.filter(c => c !== 'French');
    const cuisine = activeCuisines[0] || 'American';
    let snacks = mealDatabase[cuisine]?.snacks || mealDatabase.American.snacks;

    if (isVegan) snacks = filterVegan(snacks);
    else if (isVegetarian) snacks = filterVegetarian(snacks);
    snacks = filterAllergies(snacks, allergies);

    // Sort by protein density
    return [...snacks].sort((a, b) => (b.protein / b.calories) - (a.protein / a.calories)).slice(0, 10);
  };

  // Add or reduce snacks to approach target calories and ensure protein goals; return adjusted meals and recalculated totals
  const adjustMealsToTarget = (
    meals: { breakfast: MealData[]; lunch: MealData[]; dinner: MealData[]; snacks: MealData[] },
    targetCalories: number,
    snackPool: MealData[]
  ) => {
    const tolerance = 100; // +/- calories tolerance
    const adjusted = {
      breakfast: [...meals.breakfast],
      lunch: [...meals.lunch],
      dinner: [...meals.dinner],
      snacks: [...meals.snacks],
    };

    const calcTotals = () => {
      const all = [...adjusted.breakfast, ...adjusted.lunch, ...adjusted.dinner, ...adjusted.snacks];
      return {
        calories: all.reduce((s, m) => s + m.calories, 0),
        protein: all.reduce((s, m) => s + m.protein, 0),
        carbs: all.reduce((s, m) => s + m.carbs, 0),
        fats: all.reduce((s, m) => s + m.fats, 0),
      };
    };

    let totals = calcTotals();
    
    // Calculate target protein (35% of calories from protein, 1g = 4 cal)
    const targetProtein = Math.round((targetCalories * 0.35) / 4);

    // Priority 1: Add high-protein snacks if protein is low (even if over calorie budget slightly)
    let addIndex = 0;
    while (totals.protein < targetProtein && adjusted.snacks.length < 6 && addIndex < snackPool.length) {
      adjusted.snacks.push(snackPool[addIndex % snackPool.length]);
      addIndex++;
      totals = calcTotals();
    }

    // Priority 2: If under calorie target after meeting protein, add more snacks
    addIndex = 0;
    while (totals.calories < targetCalories - tolerance && adjusted.snacks.length < 6 && addIndex < snackPool.length) {
      adjusted.snacks.push(snackPool[addIndex % snackPool.length]);
      addIndex++;
      totals = calcTotals();
    }

    // Priority 3: If over calorie target but protein is still met, remove lowest-protein snacks
    while (totals.calories > targetCalories + tolerance && adjusted.snacks.length > 0) {
      // Sort snacks by protein (ascending) and remove the lowest protein snack
      const sortedByProtein = [...adjusted.snacks].sort((a, b) => a.protein - b.protein);
      const toRemove = sortedByProtein[0];
      const removeIndex = adjusted.snacks.findIndex(s => s.name === toRemove.name);
      if (removeIndex !== -1) {
        adjusted.snacks.splice(removeIndex, 1);
      }
      totals = calcTotals();
      
      // Stop removing if we'll drop below protein target
      if (totals.protein < targetProtein) {
        // Add it back
        adjusted.snacks.push(toRemove);
        totals = calcTotals();
        break;
      }
    }

    return { adjustedMeals: adjusted, totals };
  };
  const handleUpdateProfile = async () => {
    if (!profile) return;

    try {
      await updateProfile({
        goal_weight: editFormData.goal_weight ? parseFloat(editFormData.goal_weight) : null,
        diet_preferences: editFormData.diet_preferences,
        food_allergies: editFormData.food_allergies,
        taste_preferences: editFormData.taste_preferences
      });

      toast({
        title: "Profile Updated",
        description: "Your dietary preferences have been saved."
      });
      
      setIsEditingProfile(false);
      
      if (dietPlan.length > 0) {
        generateDietPlan();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCheckboxChange = (category: 'diet_preferences' | 'food_allergies' | 'taste_preferences', value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const clearDietPlan = () => {
    setDietPlan([]);
    toast({
      title: "Diet Plan Cleared",
      description: "Your diet plan has been removed."
    });
  };

  const getPlanType = () => {
    if (!profile || !profile.goal_weight) return 'Maintenance';
    if (profile.goal_weight > profile.weight) return 'Bulking';
    if (profile.goal_weight < profile.weight) return 'Cutting';
    return 'Maintenance';
  };

  const syncMealToTracker = async (meal: MealData, mealType: string, day: number) => {
    if (!user) return;

    const mealKey = `${day}-${mealType}-${meal.name}`;
    setSyncingMeal(mealKey);

    try {
      const { error } = await supabase
        .from('food_logs')
        .insert({
          user_id: user.id,
          foods: [{
            name: meal.name,
            protein: meal.protein,
            carbs: meal.carbs,
            fats: meal.fats,
            calories: meal.calories
          }],
          total_protein: meal.protein,
          total_carbs: meal.carbs,
          total_fats: meal.fats,
          total_calories: meal.calories,
          meal_type: mealType,
          notes: `From Day ${day} diet plan`
        });

      if (error) throw error;

      sonnerToast.success('Meal synced to food tracker!');
    } catch (error) {
      console.error('Error syncing meal:', error);
      sonnerToast.error('Failed to sync meal');
    } finally {
      setSyncingMeal(null);
    }
  };

  const dietPreferences = ['Vegetarian', 'Vegan', 'Lactose Intolerant'];
  const allergyOptions = ['Peanuts', 'Tree Nuts', 'Dairy', 'Eggs', 'Shellfish', 'Fish', 'Soy', 'Wheat'];
  const cuisineOptions = ['American', 'Italian', 'Japanese', 'Indian', 'Mexican', 'Mediterranean', 'Thai'];

  if (!profile) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ChefHat className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Complete Your Profile</h3>
          <p className="text-muted-foreground text-center mb-6">
            Set up your fitness profile to get a personalized diet plan
          </p>
          <Button onClick={() => {
            const event = new CustomEvent('openFitnessProfileForm');
            window.dispatchEvent(event);
          }}>
            Complete Profile
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Summary Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Your Nutrition Plan
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {getPlanType()} • {profile.taste_preferences?.join(', ') || 'American'} Cuisine
            </p>
          </div>
          <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Edit Preferences
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Diet Preferences</DialogTitle>
                <DialogDescription>
                  Update your dietary preferences and restrictions
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-3">
                  <Label>Goal Weight (lbs)</Label>
                  <Input
                    type="number"
                    value={editFormData.goal_weight}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, goal_weight: e.target.value }))}
                    placeholder="Enter goal weight"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Dietary Preferences</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {dietPreferences.map((pref) => (
                      <div key={pref} className="flex items-center space-x-2">
                        <Checkbox
                          id={`diet-${pref}`}
                          checked={editFormData.diet_preferences.includes(pref)}
                          onCheckedChange={() => handleCheckboxChange('diet_preferences', pref)}
                        />
                        <label htmlFor={`diet-${pref}`} className="text-sm cursor-pointer">
                          {pref}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Food Allergies</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {allergyOptions.map((allergy) => (
                      <div key={allergy} className="flex items-center space-x-2">
                        <Checkbox
                          id={`allergy-${allergy}`}
                          checked={editFormData.food_allergies.includes(allergy)}
                          onCheckedChange={() => handleCheckboxChange('food_allergies', allergy)}
                        />
                        <label htmlFor={`allergy-${allergy}`} className="text-sm cursor-pointer">
                          {allergy}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Cuisine Preferences</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {cuisineOptions.map((cuisine) => (
                      <div key={cuisine} className="flex items-center space-x-2">
                        <Checkbox
                          id={`cuisine-${cuisine}`}
                          checked={editFormData.taste_preferences.includes(cuisine)}
                          onCheckedChange={() => handleCheckboxChange('taste_preferences', cuisine)}
                        />
                        <label htmlFor={`cuisine-${cuisine}`} className="text-sm cursor-pointer">
                          {cuisine}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateProfile}>
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        <Dialog open={isEditingGoals} onOpenChange={(open) => {
            setIsEditingGoals(open);
            if (!open && dietPlan.length > 0) {
              // Regenerate plan to reflect any updated goals
              generateDietPlan();
            }
          }}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Calories & Macros
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Calories & Macros</DialogTitle>
                <DialogDescription>
                  These sync with your AI Food Tracker goals.
                </DialogDescription>
              </DialogHeader>
              <NutritionGoals />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profile.diet_preferences && profile.diet_preferences.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {profile.diet_preferences.map(pref => (
                  <Badge key={pref} variant="secondary">{pref}</Badge>
                ))}
              </div>
            )}
            {profile.food_allergies && profile.food_allergies.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {profile.food_allergies.map(allergy => (
                  <Badge key={allergy} variant="destructive">{allergy}</Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generate Plan Button */}
      {dietPlan.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UtensilsCrossed className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Generate Your Diet Plan</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Get a personalized 7-day meal plan with accurate macros based on your preferences
            </p>
            <Button 
              size="lg" 
              onClick={generateDietPlan}
              disabled={isGenerating}
              className="min-w-[200px]"
            >
              {isGenerating ? 'Generating...' : 'Generate 7-Day Plan'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Diet Plan Display */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Your 7-Day {getPlanType()} Plan</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={generateDietPlan}>
                Regenerate Plan
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Plan
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear Diet Plan?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove your current diet plan. You can always generate a new one.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={clearDietPlan}>
                      Clear Plan
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <Tabs defaultValue="day1" className="w-full">
            <TabsList className="grid grid-cols-7 w-full">
              {dietPlan.map((plan) => (
                <TabsTrigger key={plan.day} value={`day${plan.day}`}>
                  Day {plan.day}
                </TabsTrigger>
              ))}
            </TabsList>

            {dietPlan.map((plan) => (
              <TabsContent key={plan.day} value={`day${plan.day}`} className="space-y-6">
                {/* Daily Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Day {plan.day} Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Target</p>
                        <p className="text-2xl font-bold">{plan.targetCalories}</p>
                        <p className="text-xs text-muted-foreground">cal</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold">{plan.totalCalories}</p>
                        <p className="text-xs text-muted-foreground">cal</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Protein</p>
                        <p className="text-2xl font-bold">{plan.totalProtein}g</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Carbs</p>
                        <p className="text-2xl font-bold">{plan.totalCarbs}g</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Fats</p>
                        <p className="text-2xl font-bold">{plan.totalFats}g</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Breakfast */}
                <Card>
                  <CardHeader>
                    <CardTitle>🌅 Breakfast</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {plan.meals.breakfast.map((meal, idx) => (
                      <div key={idx} className="flex justify-between items-start p-4 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2">{meal.name}</h4>
                          <div className="flex flex-wrap gap-3 text-sm">
                            <span className="text-muted-foreground">
                              <strong>Protein:</strong> {meal.protein}g
                            </span>
                            <span className="text-muted-foreground">
                              <strong>Carbs:</strong> {meal.carbs}g
                            </span>
                            <span className="text-muted-foreground">
                              <strong>Fats:</strong> {meal.fats}g
                            </span>
                            <span className="text-muted-foreground">
                              <strong>Calories:</strong> {meal.calories}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => syncMealToTracker(meal, 'breakfast', plan.day)}
                          disabled={syncingMeal === `${plan.day}-breakfast-${meal.name}`}
                        >
                          {syncingMeal === `${plan.day}-breakfast-${meal.name}` ? 'Syncing...' : 'Add to Tracker'}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Lunch */}
                <Card>
                  <CardHeader>
                    <CardTitle>🌞 Lunch</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {plan.meals.lunch.map((meal, idx) => (
                      <div key={idx} className="flex justify-between items-start p-4 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2">{meal.name}</h4>
                          <div className="flex flex-wrap gap-3 text-sm">
                            <span className="text-muted-foreground">
                              <strong>Protein:</strong> {meal.protein}g
                            </span>
                            <span className="text-muted-foreground">
                              <strong>Carbs:</strong> {meal.carbs}g
                            </span>
                            <span className="text-muted-foreground">
                              <strong>Fats:</strong> {meal.fats}g
                            </span>
                            <span className="text-muted-foreground">
                              <strong>Calories:</strong> {meal.calories}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => syncMealToTracker(meal, 'lunch', plan.day)}
                          disabled={syncingMeal === `${plan.day}-lunch-${meal.name}`}
                        >
                          {syncingMeal === `${plan.day}-lunch-${meal.name}` ? 'Syncing...' : 'Add to Tracker'}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Dinner */}
                <Card>
                  <CardHeader>
                    <CardTitle>🌙 Dinner</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {plan.meals.dinner.map((meal, idx) => (
                      <div key={idx} className="flex justify-between items-start p-4 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2">{meal.name}</h4>
                          <div className="flex flex-wrap gap-3 text-sm">
                            <span className="text-muted-foreground">
                              <strong>Protein:</strong> {meal.protein}g
                            </span>
                            <span className="text-muted-foreground">
                              <strong>Carbs:</strong> {meal.carbs}g
                            </span>
                            <span className="text-muted-foreground">
                              <strong>Fats:</strong> {meal.fats}g
                            </span>
                            <span className="text-muted-foreground">
                              <strong>Calories:</strong> {meal.calories}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => syncMealToTracker(meal, 'dinner', plan.day)}
                          disabled={syncingMeal === `${plan.day}-dinner-${meal.name}`}
                        >
                          {syncingMeal === `${plan.day}-dinner-${meal.name}` ? 'Syncing...' : 'Add to Tracker'}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Snacks */}
                <Card>
                  <CardHeader>
                    <CardTitle>🍎 Snacks</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {plan.meals.snacks.map((meal, idx) => (
                      <div key={idx} className="flex justify-between items-start p-4 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2">{meal.name}</h4>
                          <div className="flex flex-wrap gap-3 text-sm">
                            <span className="text-muted-foreground">
                              <strong>Protein:</strong> {meal.protein}g
                            </span>
                            <span className="text-muted-foreground">
                              <strong>Carbs:</strong> {meal.carbs}g
                            </span>
                            <span className="text-muted-foreground">
                              <strong>Fats:</strong> {meal.fats}g
                            </span>
                            <span className="text-muted-foreground">
                              <strong>Calories:</strong> {meal.calories}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => syncMealToTracker(meal, 'snacks', plan.day)}
                          disabled={syncingMeal === `${plan.day}-snacks-${meal.name}`}
                        >
                          {syncingMeal === `${plan.day}-snacks-${meal.name}` ? 'Syncing...' : 'Add to Tracker'}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
    </div>
  );
};

export default DietPlan;
