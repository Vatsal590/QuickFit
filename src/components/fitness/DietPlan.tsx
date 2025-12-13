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
import { UtensilsCrossed, Target, Calendar, ChefHat, Trash2, Settings, Download, BookOpen, Loader2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast as sonnerToast } from 'sonner';
import { mealDatabase, filterVegetarian, filterVegan, filterAllergies, filterByCookTime, MealData } from '@/data/mealDatabase';
import NutritionGoals from '@/components/fitness/NutritionGoals';
import { activityTracker } from '@/utils/activityTracker';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

import { calculateNutritionTargets } from '@/utils/nutritionCalculations';

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
  const [selectedRecipe, setSelectedRecipe] = useState<{
    mealName: string;
    ingredients: string[];
    instructions: string[];
  } | null>(null);
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  const [editFormData, setEditFormData] = useState({
    goal_weight: '',
    diet_preferences: [] as string[],
    food_allergies: [] as string[],
    taste_preferences: [] as string[],
    breakfast_cook_time: '20',
    lunch_cook_time: '30',
    dinner_cook_time: '30'
  });

  useEffect(() => {
    if (profile) {
      setEditFormData({
        goal_weight: profile.goal_weight ? profile.goal_weight.toString() : '',
        diet_preferences: profile.diet_preferences || [],
        food_allergies: profile.food_allergies || [],
        taste_preferences: profile.taste_preferences || [],
        breakfast_cook_time: (profile as any).breakfast_cook_time || '20',
        lunch_cook_time: (profile as any).lunch_cook_time || '30',
        dinner_cook_time: (profile as any).dinner_cook_time || '30'
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

      // Calculate scientifically accurate nutrition targets based on user profile
      const nutritionTargets = calculateNutritionTargets({
        weight: profile.weight,
        height: profile.height,
        goalWeight: profile.goal_weight || undefined,
        bodyType: Array.isArray(profile.body_type) ? profile.body_type[0] : profile.body_type,
        workoutDaysPerWeek: profile.workout_days_per_week,
        age: 30, // Default age if not in profile
        gender: 'male' // Default gender if not in profile
      });

      // Use custom goals if set in Food Tracker, otherwise use calculated targets
      const targetCalories = goalsData?.daily_calories 
        ? Number(goalsData.daily_calories) 
        : nutritionTargets.calories;
      
      const targetProtein = goalsData?.daily_protein 
        ? Number(goalsData.daily_protein) 
        : nutritionTargets.protein;
      
      const targetCarbs = goalsData?.daily_carbs 
        ? Number(goalsData.daily_carbs) 
        : nutritionTargets.carbs;
      
      const targetFats = goalsData?.daily_fats 
        ? Number(goalsData.daily_fats) 
        : nutritionTargets.fats;

      // If no custom goals exist, save the calculated targets to sync with Food Tracker
      if (!goalsData) {
        await supabase
          .from('user_nutrition_goals')
          .upsert({
            user_id: user!.id,
            daily_calories: targetCalories,
            daily_protein: targetProtein,
            daily_carbs: targetCarbs,
            daily_fats: targetFats
          }, {
            onConflict: 'user_id'
          });
      }

      const isDietVegetarian = profile.diet_preferences?.includes('Vegetarian');
      const isDietVegan = profile.diet_preferences?.includes('Vegan');
      const tastePreferences = profile.taste_preferences || ['American'];
      const allergies = profile.food_allergies || [];
      const breakfastCookTime = parseInt((profile as any).breakfast_cook_time || '20', 10);
      const lunchCookTime = parseInt((profile as any).lunch_cook_time || '30', 10);
      const dinnerCookTime = parseInt((profile as any).dinner_cook_time || '30', 10);

      // Generate 7-day meal plan
      const plans: MealPlan[] = [];

      // Build comprehensive snack pool from all cuisines for variety
      const allSnacks = buildComprehensiveSnackPool(tastePreferences, isDietVegetarian, isDietVegan, allergies, 30);

      for (let day = 1; day <= 7; day++) {
        const dailyMeals = generateMealsForDay(
          tastePreferences,
          isDietVegetarian,
          isDietVegan,
          allergies,
          targetCalories,
          day,
          allSnacks,
          { breakfast: breakfastCookTime, lunch: lunchCookTime, dinner: dinnerCookTime }
        );

        // Calculate totals for selected meals
        const allMeals = [
          ...dailyMeals.breakfast,
          ...dailyMeals.lunch,
          ...dailyMeals.dinner,
          ...dailyMeals.snacks
        ];

        // Adjust foods (add/remove snacks) to match macro targets
        const snackPool = getSnackPool(tastePreferences, !!isDietVegetarian, !!isDietVegan, allergies);
        const { adjustedMeals, totals } = adjustMealsToTarget(
          dailyMeals, 
          { calories: targetCalories, protein: targetProtein, carbs: targetCarbs, fats: targetFats },
          snackPool
        );

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

      // Save to database with calculated nutrition targets
      const { error } = await supabase
        .from('diet_plans')
        .insert([{
          user_id: user!.id,
          plan_name: `${nutritionTargets.goalType.charAt(0).toUpperCase() + nutritionTargets.goalType.slice(1)} Diet Plan`,
          target_calories: targetCalories,
          target_protein: targetProtein,
          target_carbs: targetCarbs,
          target_fats: targetFats,
          daily_meals: plans as any,
          cuisine_preferences: tastePreferences,
          is_active: true
        }]);

      if (error) throw error;

      // Track activity
      await activityTracker.trackActivity('diet_plan_created', 'diet-plan', {
        planName: `${nutritionTargets.goalType} Diet Plan`,
        targetCalories,
        targetProtein,
        targetCarbs,
        targetFats,
        cuisines: tastePreferences
      });

      toast({
        title: "Diet Plan Generated!",
        description: `Your scientifically calculated ${nutritionTargets.goalType} plan is ready with ${targetCalories} calories (P: ${targetProtein}g, C: ${targetCarbs}g, F: ${targetFats}g).`
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
    allergies: string[],
    maxCookTime: number
  ): MealData[] => {
    const activeCuisines = cuisines.filter(c => c !== 'French');
    const allSnacks: MealData[] = [];

    // Collect snacks from all selected cuisines
    activeCuisines.forEach(cuisine => {
      let snacks = mealDatabase[cuisine]?.snacks || [];
      if (isVegan) snacks = filterVegan(snacks);
      else if (isVegetarian) snacks = filterVegetarian(snacks);
      snacks = filterAllergies(snacks, allergies);
      snacks = filterByCookTime(snacks, maxCookTime);
      allSnacks.push(...snacks);
    });

    // If no cuisines selected or no snacks found, use American
    if (allSnacks.length === 0) {
      let snacks = mealDatabase.American.snacks;
      if (isVegan) snacks = filterVegan(snacks);
      else if (isVegetarian) snacks = filterVegetarian(snacks);
      snacks = filterAllergies(snacks, allergies);
      snacks = filterByCookTime(snacks, maxCookTime);
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
    comprehensiveSnackPool: MealData[],
    cookTimes: { breakfast: number; lunch: number; dinner: number }
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

    // Apply individual cooking time filters for each meal type
    breakfastOptions = filterByCookTime(breakfastOptions, cookTimes.breakfast);
    lunchOptions = filterByCookTime(lunchOptions, cookTimes.lunch);
    dinnerOptions = filterByCookTime(dinnerOptions, cookTimes.dinner);
    snackOptions = filterByCookTime(snackOptions, 30);

    // Sort by absolute protein content first, then by protein density
    const sortByProteinAmount = (meals: MealData[]) => 
      [...meals].sort((a, b) => {
        const proteinDiff = b.protein - a.protein;
        if (Math.abs(proteinDiff) > 5) return proteinDiff;
        return (b.protein / b.calories) - (a.protein / a.calories);
      });

    breakfastOptions = sortByProteinAmount(breakfastOptions);
    lunchOptions = sortByProteinAmount(lunchOptions);
    dinnerOptions = sortByProteinAmount(dinnerOptions);
    snackOptions = sortByProteinAmount(snackOptions);

    const breakfast = selectMeals(breakfastOptions, 1, dayNumber);
    const lunch = selectMeals(lunchOptions, 1, dayNumber);
    const dinner = selectMeals(dinnerOptions, 1, dayNumber);
    const snacks = selectMeals(comprehensiveSnackPool, 1, dayNumber);

    return { breakfast, lunch, dinner, snacks };
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

  // Intelligently adjust meals to match ALL macro targets (calories, protein, carbs, fats)
  const adjustMealsToTarget = (
    meals: { breakfast: MealData[]; lunch: MealData[]; dinner: MealData[]; snacks: MealData[] },
    targets: { calories: number; protein: number; carbs: number; fats: number },
    snackPool: MealData[]
  ) => {
    const tolerance = 25; // +/- tolerance for each macro
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
    
    // Calculate what macros we're missing
    const getMacroDeficit = () => ({
      protein: Math.max(0, targets.protein - totals.protein),
      carbs: Math.max(0, targets.carbs - totals.carbs),
      fats: Math.max(0, targets.fats - totals.fats),
      calories: Math.max(0, targets.calories - totals.calories)
    });

    // Find best snack to add based on current macro deficits
    const findBestSnack = (deficit: ReturnType<typeof getMacroDeficit>) => {
      if (snackPool.length === 0) return null;
      
      // Score each snack based on how well it fills the deficit
      const scored = snackPool.map(snack => {
        let score = 0;
        
        // Prioritize the macro we need most
        if (deficit.protein > 20) score += snack.protein * 2; // Need protein most
        else if (deficit.carbs > 30) score += snack.carbs * 1.5; // Need carbs
        else if (deficit.fats > 15) score += snack.fats * 1.5; // Need fats
        
        // General contribution to calories
        if (deficit.calories > 100) score += snack.calories * 0.5;
        
        // Penalize if snack has too much of what we don't need
        if (totals.protein >= targets.protein) score -= snack.protein;
        if (totals.carbs >= targets.carbs) score -= snack.carbs * 0.5;
        if (totals.fats >= targets.fats) score -= snack.fats;
        
        return { snack, score };
      });
      
      scored.sort((a, b) => b.score - a.score);
      return scored[0].snack;
    };

    // Add snacks intelligently to meet macro targets (max 3 snacks per day)
    let addAttempts = 0;
    const maxAttempts = 10;
    while (adjusted.snacks.length < 3 && addAttempts < maxAttempts) {
      const deficit = getMacroDeficit();
      
      // Stop if we're within tolerance for all macros
      if (deficit.protein <= tolerance && 
          deficit.carbs <= tolerance && 
          deficit.fats <= tolerance &&
          deficit.calories <= tolerance) {
        break;
      }
      
      const bestSnack = findBestSnack(deficit);
      if (!bestSnack) break;
      
      adjusted.snacks.push(bestSnack);
      totals = calcTotals();
      addAttempts++;
    }

    // If we're significantly over on calories, try removing snacks
    while (totals.calories > targets.calories + 100 && adjusted.snacks.length > 0) {
      // Remove the snack with the most calories that doesn't hurt our macro targets
      const sortedByCalories = [...adjusted.snacks].sort((a, b) => b.calories - a.calories);
      
      for (const snack of sortedByCalories) {
        const tempTotals = {
          protein: totals.protein - snack.protein,
          carbs: totals.carbs - snack.carbs,
          fats: totals.fats - snack.fats,
          calories: totals.calories - snack.calories
        };
        
        // Only remove if we stay above minimum macro thresholds
        if (tempTotals.protein >= targets.protein - tolerance &&
            tempTotals.carbs >= targets.carbs - tolerance &&
            tempTotals.fats >= targets.fats - tolerance) {
          const removeIndex = adjusted.snacks.findIndex(s => s.name === snack.name);
          if (removeIndex !== -1) {
            adjusted.snacks.splice(removeIndex, 1);
            totals = calcTotals();
            break;
          }
        }
      }
      
      // Prevent infinite loop
      break;
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
        taste_preferences: editFormData.taste_preferences,
        breakfast_cook_time: editFormData.breakfast_cook_time,
        lunch_cook_time: editFormData.lunch_cook_time,
        dinner_cook_time: editFormData.dinner_cook_time
      } as any);

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

  const fetchRecipe = async (mealName: string) => {
    // Open dialog immediately with loading state
    setSelectedRecipe({ mealName, ingredients: [], instructions: [] });
    setLoadingRecipe(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('get-recipe', {
        body: { mealName }
      });

      if (error) throw error;

      if (data.success) {
        setSelectedRecipe(data.recipe);
      } else {
        throw new Error(data.error || 'Failed to fetch recipe');
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
      sonnerToast.error('Failed to load recipe. Please try again.');
      setSelectedRecipe(null); // Close dialog on error
    } finally {
      setLoadingRecipe(false);
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
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Your Nutrition Plan
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {getPlanType()} • {profile.taste_preferences?.join(', ') || 'American'} Cuisine
            </p>
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                <Settings className="h-4 w-4 mr-2" />
                Edit Preferences
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] md:w-full">
              <DialogHeader>
                <DialogTitle>Edit Diet Preferences</DialogTitle>
                <DialogDescription>
                  Update your dietary preferences and restrictions
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-3">
                  <Label>Goal Weight</Label>
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

                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Available Cooking Time
                  </Label>
                  <p className="text-xs text-muted-foreground -mt-2">
                    Set your available cooking time for each meal
                  </p>
                  
                  {/* Breakfast */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">🌅 Breakfast</p>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { value: '5', label: '5 min' },
                        { value: '10', label: '10 min' },
                        { value: '20', label: '20 min' },
                        { value: '30', label: '30 min' },
                        { value: '60', label: '60+ min' }
                      ].map((option) => (
                        <Button
                          key={option.value}
                          type="button"
                          variant={editFormData.breakfast_cook_time === option.value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setEditFormData(prev => ({ ...prev, breakfast_cook_time: option.value }))}
                          className="w-full text-xs"
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Lunch */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">🌞 Lunch</p>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { value: '5', label: '5 min' },
                        { value: '10', label: '10 min' },
                        { value: '20', label: '20 min' },
                        { value: '30', label: '30 min' },
                        { value: '60', label: '60+ min' }
                      ].map((option) => (
                        <Button
                          key={option.value}
                          type="button"
                          variant={editFormData.lunch_cook_time === option.value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setEditFormData(prev => ({ ...prev, lunch_cook_time: option.value }))}
                          className="w-full text-xs"
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Dinner */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">🌙 Dinner</p>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { value: '5', label: '5 min' },
                        { value: '10', label: '10 min' },
                        { value: '20', label: '20 min' },
                        { value: '30', label: '30 min' },
                        { value: '60', label: '60+ min' }
                      ].map((option) => (
                        <Button
                          key={option.value}
                          type="button"
                          variant={editFormData.dinner_cook_time === option.value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setEditFormData(prev => ({ ...prev, dinner_cook_time: option.value }))}
                          className="w-full text-xs"
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
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
              <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                <Settings className="h-4 w-4 mr-2" />
                Calories & Macros
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md w-[95vw] md:w-full">
              <DialogHeader>
                <DialogTitle>Edit Calories & Macros</DialogTitle>
                <DialogDescription>
                  These sync with your AI Food Tracker goals.
                </DialogDescription>
              </DialogHeader>
              <NutritionGoals />
            </DialogContent>
          </Dialog>
          </div>
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <h2 className="text-2xl font-bold">Your 7-Day {getPlanType()} Plan</h2>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" size="sm" onClick={generateDietPlan} className="flex-1 md:flex-none">
                Regenerate Plan
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="flex-1 md:flex-none">
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
            <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
              <TabsList className="inline-flex md:grid md:grid-cols-7 w-auto md:w-full min-w-max">
                {dietPlan.map((plan) => (
                  <TabsTrigger key={plan.day} value={`day${plan.day}`} className="flex-shrink-0">
                    Day {plan.day}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

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
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
                      <div className="text-center">
                        <p className="text-xs md:text-sm text-muted-foreground">Target</p>
                        <p className="text-xl md:text-2xl font-bold">{plan.targetCalories}</p>
                        <p className="text-xs text-muted-foreground">cal</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs md:text-sm text-muted-foreground">Total</p>
                        <p className="text-xl md:text-2xl font-bold">{plan.totalCalories}</p>
                        <p className="text-xs text-muted-foreground">cal</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs md:text-sm text-muted-foreground">Protein</p>
                        <p className="text-xl md:text-2xl font-bold">{plan.totalProtein}g</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs md:text-sm text-muted-foreground">Carbs</p>
                        <p className="text-xl md:text-2xl font-bold">{plan.totalCarbs}g</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs md:text-sm text-muted-foreground">Fats</p>
                        <p className="text-xl md:text-2xl font-bold">{plan.totalFats}g</p>
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
                      <div key={idx} className="flex flex-col sm:flex-row justify-between items-start gap-3 p-4 bg-muted/50 rounded-lg">
                        <div className="flex-1 w-full sm:w-auto">
                          <h4 className="font-semibold mb-2">{meal.name}</h4>
                          <div className="flex flex-wrap gap-2 md:gap-3 text-sm">
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
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {meal.cookTime} min
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => fetchRecipe(meal.name)}
                            className="w-full sm:w-auto whitespace-nowrap"
                          >
                            <BookOpen className="h-4 w-4 mr-2" />
                            Recipe
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => syncMealToTracker(meal, 'breakfast', plan.day)}
                            disabled={syncingMeal === `${plan.day}-breakfast-${meal.name}`}
                            className="w-full sm:w-auto whitespace-nowrap"
                          >
                            {syncingMeal === `${plan.day}-breakfast-${meal.name}` ? 'Syncing...' : 'Add to Tracker'}
                          </Button>
                        </div>
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
                      <div key={idx} className="flex flex-col sm:flex-row justify-between items-start gap-3 p-4 bg-muted/50 rounded-lg">
                        <div className="flex-1 w-full sm:w-auto">
                          <h4 className="font-semibold mb-2">{meal.name}</h4>
                          <div className="flex flex-wrap gap-2 md:gap-3 text-sm">
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
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {meal.cookTime} min
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => fetchRecipe(meal.name)}
                            className="w-full sm:w-auto whitespace-nowrap"
                          >
                            <BookOpen className="h-4 w-4 mr-2" />
                            Recipe
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => syncMealToTracker(meal, 'lunch', plan.day)}
                            disabled={syncingMeal === `${plan.day}-lunch-${meal.name}`}
                            className="w-full sm:w-auto whitespace-nowrap"
                          >
                            {syncingMeal === `${plan.day}-lunch-${meal.name}` ? 'Syncing...' : 'Add to Tracker'}
                          </Button>
                        </div>
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
                      <div key={idx} className="flex flex-col sm:flex-row justify-between items-start gap-3 p-4 bg-muted/50 rounded-lg">
                        <div className="flex-1 w-full sm:w-auto">
                          <h4 className="font-semibold mb-2">{meal.name}</h4>
                          <div className="flex flex-wrap gap-2 md:gap-3 text-sm">
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
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {meal.cookTime} min
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => fetchRecipe(meal.name)}
                            className="w-full sm:w-auto whitespace-nowrap"
                          >
                            <BookOpen className="h-4 w-4 mr-2" />
                            Recipe
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => syncMealToTracker(meal, 'dinner', plan.day)}
                            disabled={syncingMeal === `${plan.day}-dinner-${meal.name}`}
                            className="w-full sm:w-auto whitespace-nowrap"
                          >
                            {syncingMeal === `${plan.day}-dinner-${meal.name}` ? 'Syncing...' : 'Add to Tracker'}
                          </Button>
                        </div>
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
                      <div key={idx} className="flex flex-col sm:flex-row justify-between items-start gap-3 p-4 bg-muted/50 rounded-lg">
                        <div className="flex-1 w-full sm:w-auto">
                          <h4 className="font-semibold mb-2">{meal.name}</h4>
                          <div className="flex flex-wrap gap-2 md:gap-3 text-sm">
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
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => fetchRecipe(meal.name)}
                            className="w-full sm:w-auto whitespace-nowrap"
                          >
                            <BookOpen className="h-4 w-4 mr-2" />
                            Recipe
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => syncMealToTracker(meal, 'snacks', plan.day)}
                            disabled={syncingMeal === `${plan.day}-snacks-${meal.name}`}
                            className="w-full sm:w-auto whitespace-nowrap"
                          >
                            {syncingMeal === `${plan.day}-snacks-${meal.name}` ? 'Syncing...' : 'Add to Tracker'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}

      {/* Recipe Dialog */}
      <Dialog open={!!selectedRecipe} onOpenChange={(open) => !open && setSelectedRecipe(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden w-[95vw] md:w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              {selectedRecipe?.mealName}
            </DialogTitle>
            <DialogDescription>
              Recipe for 1 portion
            </DialogDescription>
          </DialogHeader>
          
          {loadingRecipe ? (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm font-medium">Generating recipe...</span>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="space-y-2 pt-4">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
          ) : selectedRecipe ? (
            <ScrollArea className="h-[calc(90vh-12rem)] pr-4">
              <div className="space-y-6">
                {/* Ingredients */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <UtensilsCrossed className="h-5 w-5" />
                    Ingredients
                  </h3>
                  <ul className="space-y-2">
                    {selectedRecipe.ingredients.map((ingredient, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="flex-1">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Instructions
                  </h3>
                  <ol className="space-y-3">
                    {selectedRecipe.instructions.map((instruction, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="font-semibold text-primary min-w-[2rem]">
                          {idx + 1}.
                        </span>
                        <span className="flex-1">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </ScrollArea>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DietPlan;
