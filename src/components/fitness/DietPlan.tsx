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
import { UtensilsCrossed, Target, Calendar, ChefHat, Trash2, Settings } from 'lucide-react';
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
  console.log('DietPlan component starting to render...');
  const { profile, updateProfile } = useFitnessProfile();
  console.log('Profile loaded:', profile);
  const { toast } = useToast();
  const [dietPlan, setDietPlan] = useState<MealPlan[]>([]);
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
    const plans: MealPlan[] = [];

    for (let day = 1; day <= 7; day++) {
      const meals = generateMealsForDay(
        tastePreferences,
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
    cuisines: string[],
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
        breakfast: isVegan ? [
          'Protein-packed oatmeal with hemp seeds and almond butter',
          'Tofu scramble with nutritional yeast and spinach',
          'Quinoa breakfast bowl with pumpkin seeds and berries',
          'Chia seed pudding with protein powder and nuts',
          'Smoothie bowl with plant protein and spinach',
          'Overnight oats with chia seeds and protein powder',
          'Tempeh bacon with avocado toast',
          'Protein-rich buckwheat pancakes with nuts',
          'Green smoothie with hemp protein and spinach',
          'Lentil breakfast hash with vegetables'
        ] : isVegetarian ? [
          'Greek yogurt with granola and mixed nuts',
          'Scrambled eggs with cheese and whole grain toast',
          'Protein smoothie with whey protein and banana',
          'Cottage cheese pancakes with berries',
          'Egg white omelet with vegetables and feta cheese',
          'Ricotta toast with honey and almonds',
          'Protein-rich French toast with Greek yogurt',
          'Quinoa breakfast bowl with Greek yogurt',
          'Spinach and mushroom frittata',
          'High-protein muesli with milk and nuts'
        ] : [
          'Scrambled eggs with turkey bacon and avocado',
          'Protein pancakes with Greek yogurt and berries',
          'Egg and chicken sausage breakfast burrito',
          'Smoked salmon bagel with cream cheese',
          'Steak and eggs with sweet potato hash',
          'Chicken and vegetable breakfast bowl',
          'Turkey sausage with egg white scramble',
          'Salmon and spinach omelet',
          'Lean beef breakfast patty with eggs',
          'Chicken breakfast hash with sweet potatoes'
        ],
        lunch: isVegan ? [
          'Lentil and quinoa salad with tahini dressing',
          'Black bean and tofu burger with sweet potato fries',
          'Buddha bowl with tempeh and quinoa',
          'Chickpea curry with brown rice',
          'Protein-packed veggie wrap with hummus',
          'Tempeh stir-fry with brown rice and vegetables',
          'Quinoa stuffed bell peppers with black beans',
          'Lentil and vegetable protein bowl'
        ] : isVegetarian ? [
          'Quinoa and black bean veggie wrap',
          'Greek salad with feta and chickpeas',
          'Vegetarian protein bowl with eggs and cheese',
          'Lentil soup with whole grain bread',
          'Caprese salad with mozzarella and basil',
          'Egg salad sandwich with whole grain bread'
        ] : [
          'Grilled chicken Caesar salad with parmesan',
          'Turkey and avocado wrap with whole grain tortilla',
          'Lean beef and quinoa power bowl',
          'Salmon salad with mixed greens and nuts',
          'Chicken breast with sweet potato and broccoli',
          'Tuna salad with mixed vegetables'
        ],
        dinner: isVegan ? [
          'Lentil walnut bolognese with whole grain pasta',
          'Stuffed bell peppers with quinoa and black beans',
          'Chickpea and vegetable curry with brown rice',
          'Tofu stir-fry with cashews and edamame',
          'Black bean and sweet potato enchiladas',
          'Tempeh and vegetable stir-fry with quinoa'
        ] : isVegetarian ? [
          'Vegetable lasagna with ricotta and mozzarella',
          'Mushroom and spinach risotto with parmesan',
          'Eggplant parmesan with side salad',
          'Quinoa stuffed portobello mushrooms',
          'Vegetarian chili with cornbread',
          'Spinach and ricotta stuffed shells'
        ] : [
          'Grilled salmon with quinoa and asparagus',
          'Lean beef steak with roasted vegetables',
          'Chicken breast with brown rice and steamed broccoli',
          'Pork tenderloin with sweet potato and green beans',
          'Turkey meatballs with zucchini noodles',
          'Baked cod with herb quinoa'
        ],
        snacks: isVegan ? [
          'Mixed nuts and seeds with dried fruit',
          'Hummus with vegetables and whole grain crackers',
          'Protein smoothie with plant-based powder',
          'Almond butter with apple slices',
          'Trail mix with cashews and pumpkin seeds',
          'Roasted chickpeas with spices'
        ] : [
          'Greek yogurt with berries and granola',
          'Cottage cheese with cucumber and tomatoes',
          'Hard-boiled eggs with whole grain crackers',
          'Protein bar with nuts and seeds',
          'String cheese with almonds',
          'Turkey roll-ups with cheese'
        ]
      },
      Italian: {
        breakfast: isVegan ? [
          'Espresso with vegan protein pastry and nuts',
          'Oat milk cappuccino with almond biscotti',
          'Fresh fruit salad with hemp seeds',
          'Vegan cornetto with cashew cream'
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
      Japanese: {
        breakfast: isVegan ? [
          'Miso soup with tofu and wakame',
          'Rice bowl with natto and sesame seeds',
          'Green tea with rice balls and pickled vegetables',
          'Oatmeal with matcha powder and nuts'
        ] : [
          'Traditional Japanese breakfast with rice and grilled fish',
          'Tamago kake gohan (egg rice bowl)',
          'Miso soup with tofu and salmon',
          'Green tea with rice and nori'
        ],
        lunch: isVegan ? [
          'Vegetable sushi rolls with quinoa',
          'Ramen with tofu and vegetables',
          'Teriyaki tempeh with brown rice',
          'Miso soup with vegetables and tofu'
        ] : isVegetarian ? [
          'Vegetable sushi rolls with brown rice',
          'Ramen with egg and vegetables',
          'Teriyaki tofu with steamed vegetables',
          'Udon noodles with vegetables and egg'
        ] : [
          'Salmon sushi and miso soup',
          'Chicken teriyaki with steamed rice',
          'Ramen with pork and vegetables',
          'Grilled fish with rice and pickled vegetables'
        ],
        dinner: isVegan ? [
          'Vegetable curry with brown rice',
          'Stir-fried tofu with vegetables and quinoa',
          'Miso-glazed eggplant with rice',
          'Vegetable tempura with soba noodles'
        ] : isVegetarian ? [
          'Vegetable tempura with rice',
          'Egg fried rice with vegetables',
          'Miso-glazed tofu with steamed vegetables',
          'Vegetable soba noodles with egg'
        ] : [
          'Grilled salmon with teriyaki sauce and rice',
          'Chicken katsu with steamed vegetables',
          'Beef yakitori with rice and miso soup',
          'Sashimi with rice and pickled vegetables'
        ],
        snacks: [
          'Edamame with sea salt',
          'Rice crackers with nori',
          'Green tea with mochi',
          'Seaweed salad'
        ]
      },
      Thai: {
        breakfast: isVegan ? [
          'Thai-style coconut rice with fruits',
          'Mango and coconut smoothie bowl',
          'Thai basil and tofu scramble',
          'Rice porridge with coconut milk and nuts'
        ] : [
          'Thai-style omelet with jasmine rice',
          'Coconut rice with fresh fruit',
          'Thai basil chicken with rice',
          'Mango sticky rice with protein'
        ],
        lunch: isVegan ? [
          'Pad Thai with tofu and vegetables',
          'Green curry with tofu and brown rice',
          'Som tam (papaya salad) with peanuts',
          'Tom yum soup with tofu and vegetables'
        ] : isVegetarian ? [
          'Vegetable Pad Thai with egg',
          'Green curry with vegetables and rice',
          'Thai basil fried rice with egg',
          'Coconut soup with vegetables'
        ] : [
          'Pad Thai with chicken and vegetables',
          'Green curry chicken with jasmine rice',
          'Thai basil beef with steamed rice',
          'Tom yum soup with shrimp'
        ],
        dinner: isVegan ? [
          'Red curry with tofu and vegetables',
          'Massaman curry with potatoes and tofu',
          'Stir-fried vegetables with Thai basil',
          'Thai-style fried rice with vegetables'
        ] : isVegetarian ? [
          'Vegetable red curry with rice',
          'Thai green curry with vegetables',
          'Pad see ew with vegetables and egg',
          'Thai coconut soup with vegetables'
        ] : [
          'Red curry with chicken and vegetables',
          'Massaman beef curry with potatoes',
          'Thai basil pork with jasmine rice',
          'Green curry fish with vegetables'
        ],
        snacks: [
          'Fresh tropical fruits',
          'Thai rice crackers',
          'Coconut water with mixed nuts',
          'Thai-style fruit salad'
        ]
      },
      Mediterranean: {
        breakfast: isVegan ? [
          'Avocado toast with tomatoes and olive oil',
          'Oatmeal with nuts and dried fruits',
          'Hummus with whole grain pita and vegetables',
          'Smoothie bowl with tahini and berries'
        ] : isVegetarian ? [
          'Greek yogurt with honey and walnuts',
          'Feta cheese with tomatoes and olives',
          'Vegetarian omelet with herbs',
          'Ricotta with figs and almonds'
        ] : [
          'Greek yogurt with honey and nuts',
          'Smoked salmon with cream cheese on whole grain bread',
          'Mediterranean omelet with feta and olives',
          'Prosciutto with figs and cheese'
        ],
        lunch: isVegan ? [
          'Chickpea and vegetable stew',
          'Quinoa tabbouleh with herbs',
          'Lentil soup with olive oil and herbs',
          'Hummus bowl with vegetables and quinoa'
        ] : isVegetarian ? [
          'Greek salad with feta cheese',
          'Vegetarian moussaka',
          'Caprese salad with mozzarella',
          'Spinach and feta stuffed pita'
        ] : [
          'Grilled chicken with Greek salad',
          'Salmon with quinoa and vegetables',
          'Lamb souvlaki with tzatziki',
          'Tuna salad with olives and feta'
        ],
        dinner: isVegan ? [
          'Ratatouille with quinoa',
          'Lentil and vegetable stew',
          'Stuffed bell peppers with quinoa',
          'Mediterranean vegetable curry'
        ] : isVegetarian ? [
          'Vegetarian paella with vegetables',
          'Eggplant moussaka with cheese',
          'Spinach and ricotta cannelloni',
          'Mediterranean quinoa bowl'
        ] : [
          'Grilled fish with herbs and olive oil',
          'Lamb with roasted vegetables',
          'Chicken souvlaki with rice',
          'Seafood paella with vegetables'
        ],
        snacks: [
          'Mixed olives and nuts',
          'Hummus with vegetable sticks',
          'Greek yogurt with berries',
          'Feta cheese with cucumber'
        ]
      },
      Indian: {
        breakfast: isVegan ? [
          'Quinoa upma with vegetables',
          'Coconut chutney with dosa made from lentils',
          'Oats poha with curry leaves',
          'Chia seed pudding with cardamom'
        ] : isVegetarian ? [
          'Vegetable poha with yogurt',
          'Masala dosa with coconut chutney',
          'Upma with vegetables and paneer',
          'Idli with sambar and chutney'
        ] : [
          'Chicken tikka with whole wheat roti',
          'Egg curry with rice',
          'Keema with paratha',
          'Fish curry with rice'
        ],
        lunch: isVegan ? [
          'Dal with brown rice and vegetables',
          'Chickpea curry with quinoa',
          'Vegetable biryani with lentils',
          'Sambar with brown rice'
        ] : isVegetarian ? [
          'Paneer curry with brown rice',
          'Dal with roti and yogurt',
          'Vegetable biryani with raita',
          'Palak paneer with quinoa'
        ] : [
          'Chicken curry with brown rice',
          'Lamb biryani with raita',
          'Fish curry with rice',
          'Tandoori chicken with vegetables'
        ],
        dinner: isVegan ? [
          'Mixed dal with quinoa',
          'Vegetable curry with brown rice',
          'Chana masala with roti',
          'Lentil and spinach curry'
        ] : isVegetarian ? [
          'Paneer makhani with rice',
          'Vegetable korma with roti',
          'Palak paneer with quinoa',
          'Dal makhani with brown rice'
        ] : [
          'Chicken tikka masala with rice',
          'Lamb curry with naan',
          'Fish tandoori with vegetables',
          'Butter chicken with quinoa'
        ],
        snacks: [
          'Roasted chickpeas with spices',
          'Mixed nuts and dried fruits',
          'Yogurt with cucumber (raita)',
          'Spiced tea with whole grain crackers'
        ]
      },
      Mexican: {
        breakfast: isVegan ? [
          'Black bean and avocado breakfast bowl',
          'Quinoa breakfast burrito with vegetables',
          'Chia seed pudding with tropical fruits',
          'Tofu scramble with peppers and onions'
        ] : isVegetarian ? [
          'Vegetarian breakfast burrito with eggs',
          'Black bean quesadilla with cheese',
          'Huevos rancheros with beans',
          'Avocado toast with Mexican spices'
        ] : [
          'Huevos rancheros with lean protein',
          'Breakfast burrito with eggs and turkey',
          'Mexican omelet with cheese and salsa',
          'Chorizo and egg breakfast bowl'
        ],
        lunch: isVegan ? [
          'Black bean and quinoa bowl',
          'Lentil and vegetable tacos',
          'Chickpea and avocado salad',
          'Mexican quinoa stuffed peppers'
        ] : isVegetarian ? [
          'Cheese quesadilla with black beans',
          'Vegetarian taco bowl with rice',
          'Bean and cheese burrito',
          'Mexican salad with feta'
        ] : [
          'Chicken taco bowl with brown rice',
          'Lean beef burrito with vegetables',
          'Fish tacos with avocado',
          'Turkey and bean quesadilla'
        ],
        dinner: isVegan ? [
          'Lentil and vegetable enchiladas',
          'Black bean and quinoa stuffed peppers',
          'Vegetable fajitas with guacamole',
          'Mexican-style stuffed sweet potatoes'
        ] : isVegetarian ? [
          'Cheese enchiladas with beans',
          'Vegetarian fajitas with cheese',
          'Bean and cheese quesadilla',
          'Mexican quinoa casserole'
        ] : [
          'Chicken fajitas with vegetables',
          'Lean beef tacos with avocado',
          'Fish tacos with cilantro lime rice',
          'Turkey and bean burrito bowl'
        ],
        snacks: [
          'Guacamole with vegetable sticks',
          'Mixed nuts with chili powder',
          'Greek yogurt with salsa',
          'Roasted pumpkin seeds'
        ]
      }
    };

    // Filter out foods with allergies
    const filterAllergies = (foods: string[]) => {
      return foods.filter(food => {
        return !allergies.some(allergy => 
          food.toLowerCase().includes(allergy.toLowerCase())
        );
      });
    };

    // Get meals from multiple cuisines
    const getMealsFromMultipleCuisines = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks', count: number = 2) => {
      const selected: string[] = [];
      
      if (cuisines.length === 1) {
        const cuisineName = cuisines[0];
        const cuisineMeals = mealOptions[cuisineName as keyof typeof mealOptions] || mealOptions.American;
        const meals = filterAllergies(cuisineMeals[mealType]);
        
        for (let i = 0; i < count && i < meals.length; i++) {
          const randomIndex = Math.floor(Math.random() * meals.length);
          if (!selected.includes(meals[randomIndex])) {
            selected.push(meals[randomIndex]);
          }
        }
      } else {
        // Multiple cuisines
        const availableCuisines = [...cuisines];
        
        for (let i = 0; i < Math.min(count, availableCuisines.length); i++) {
          const cuisineName = availableCuisines[i];
          const cuisineMeals = mealOptions[cuisineName as keyof typeof mealOptions] || mealOptions.American;
          const meals = filterAllergies(cuisineMeals[mealType]);
          if (meals.length > 0) {
            const randomIndex = Math.floor(Math.random() * meals.length);
            selected.push(`${meals[randomIndex]} (${cuisineName})`);
          }
        }
      }
      
      // Fill remaining slots if needed
      while (selected.length < count) {
        selected.push('Custom meal option');
      }
      
      return selected;
    };

    return {
      breakfast: getMealsFromMultipleCuisines('breakfast'),
      lunch: getMealsFromMultipleCuisines('lunch'),
      dinner: getMealsFromMultipleCuisines('dinner'),
      snacks: getMealsFromMultipleCuisines('snacks')
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
                {dietPlan[0]?.calories} calories/day
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <ChefHat className="h-4 w-4" />
                            Breakfast
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-1">
                            <div className="text-sm">
                              {plan.meals.breakfast.join(' or ')}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Lunch</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-1">
                            <div className="text-sm">
                              {plan.meals.lunch.join(' or ')}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Dinner</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-1">
                            <div className="text-sm">
                              {plan.meals.dinner.join(' or ')}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">Snacks</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-1">
                            <div className="text-sm">
                              {plan.meals.snacks.join(' or ')}
                            </div>
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

console.log('DietPlan component definition completed');
export default DietPlan;