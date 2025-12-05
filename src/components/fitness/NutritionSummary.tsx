import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const NutritionSummary = () => {
  const { user } = useAuth();
  const [todayTotals, setTodayTotals] = useState({ 
    calories: 0, protein: 0, carbs: 0, fats: 0,
    sodium: 0, calcium: 0, iron: 0, fiber: 0, sugar: 0
  });
  const [goals, setGoals] = useState({ 
    daily_calories: 2000, daily_protein: 150, daily_carbs: 250, daily_fats: 65,
    daily_sodium: 2300, daily_calcium: 1000, daily_iron: 18, daily_fiber: 25, daily_sugar: 25
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchTodayData();
      fetchGoals();
    }
  }, [user]);

  const fetchTodayData = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('food_logs')
        .select('total_calories, total_protein, total_carbs, total_fats, foods')
        .eq('user_id', user?.id)
        .gte('created_at', today.toISOString());

      if (error) throw error;

      const totals = (data || []).reduce((acc, log) => {
        // Calculate micronutrients from foods JSON
        const foods = log.foods as any[] || [];
        const micronutrients = foods.reduce((micro, food) => ({
          sodium: micro.sodium + (Number(food.sodium) || 0),
          calcium: micro.calcium + (Number(food.calcium) || 0),
          iron: micro.iron + (Number(food.iron) || 0),
          fiber: micro.fiber + (Number(food.fiber) || 0),
          sugar: micro.sugar + (Number(food.sugar) || 0),
        }), { sodium: 0, calcium: 0, iron: 0, fiber: 0, sugar: 0 });

        return {
          calories: acc.calories + (Number(log.total_calories) || 0),
          protein: acc.protein + (Number(log.total_protein) || 0),
          carbs: acc.carbs + (Number(log.total_carbs) || 0),
          fats: acc.fats + (Number(log.total_fats) || 0),
          sodium: acc.sodium + micronutrients.sodium,
          calcium: acc.calcium + micronutrients.calcium,
          iron: acc.iron + micronutrients.iron,
          fiber: acc.fiber + micronutrients.fiber,
          sugar: acc.sugar + micronutrients.sugar,
        };
      }, { calories: 0, protein: 0, carbs: 0, fats: 0, sodium: 0, calcium: 0, iron: 0, fiber: 0, sugar: 0 });

      setTodayTotals(totals);
    } catch (error: any) {
      console.error('Error fetching today data:', error);
    }
  };

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('user_nutrition_goals')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setGoals({
          daily_calories: Number(data.daily_calories) || 2000,
          daily_protein: Number(data.daily_protein) || 150,
          daily_carbs: Number(data.daily_carbs) || 250,
          daily_fats: Number(data.daily_fats) || 65,
          daily_sodium: Number(data.daily_sodium) || 2300,
          daily_calcium: Number(data.daily_calcium) || 1000,
          daily_iron: Number(data.daily_iron) || 18,
          daily_fiber: Number(data.daily_fiber) || 25,
          daily_sugar: Number(data.daily_sugar) || 25,
        });
      }
    } catch (error: any) {
      console.error('Error fetching goals:', error);
    }
  };

  useEffect(() => {
    generateSuggestions();
  }, [todayTotals, goals]);

  const generateSuggestions = () => {
    const newSuggestions: string[] = [];
    
    const proteinPercent = (todayTotals.protein / goals.daily_protein) * 100;
    const carbsPercent = (todayTotals.carbs / goals.daily_carbs) * 100;
    const fatsPercent = (todayTotals.fats / goals.daily_fats) * 100;
    const sodiumPercent = (todayTotals.sodium / goals.daily_sodium) * 100;
    const fiberPercent = (todayTotals.fiber / goals.daily_fiber) * 100;
    const sugarPercent = (todayTotals.sugar / goals.daily_sugar) * 100;

    if (proteinPercent < 70) {
      newSuggestions.push('Increase protein intake - add lean meats, fish, or legumes');
    }
    if (carbsPercent > 120) {
      newSuggestions.push('Reduce carbs - consider swapping refined carbs for vegetables');
    }
    if (fatsPercent > 120) {
      newSuggestions.push('Reduce fats - opt for grilled instead of fried foods');
    }
    if (sodiumPercent > 100) {
      newSuggestions.push('Sodium is high - reduce salt, processed foods, and sauces');
    }
    if (fiberPercent < 70) {
      newSuggestions.push('Add more fiber - include whole grains, fruits, and vegetables');
    }
    if (sugarPercent > 100) {
      newSuggestions.push('Sugar intake is high - limit sugary drinks and desserts');
    }
    if (proteinPercent >= 70 && carbsPercent <= 120 && fatsPercent <= 120 && newSuggestions.length === 0) {
      newSuggestions.push('Great job! Your macros are on track today');
    }
    if (todayTotals.calories < goals.daily_calories * 0.5) {
      newSuggestions.push('You\'re under your calorie goal - make sure to eat enough!');
    }

    setSuggestions(newSuggestions);
  };

  const getNutrientProgress = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getProgressColor = (current: number, goal: number, isLimitType: boolean = false) => {
    const percent = (current / goal) * 100;
    if (isLimitType) {
      // For sodium/sugar - exceeding is bad
      if (percent > 100) return 'bg-destructive';
      if (percent > 80) return 'bg-yellow-500';
      return '';
    }
    return '';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Today's Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold mb-3">Macronutrients</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Calories</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(todayTotals.calories)} / {goals.daily_calories}
                  </span>
                </div>
                <Progress value={getNutrientProgress(todayTotals.calories, goals.daily_calories)} />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Protein</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(todayTotals.protein)}g / {goals.daily_protein}g
                  </span>
                </div>
                <Progress value={getNutrientProgress(todayTotals.protein, goals.daily_protein)} />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Carbs</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(todayTotals.carbs)}g / {goals.daily_carbs}g
                  </span>
                </div>
                <Progress value={getNutrientProgress(todayTotals.carbs, goals.daily_carbs)} />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Fats</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(todayTotals.fats)}g / {goals.daily_fats}g
                  </span>
                </div>
                <Progress value={getNutrientProgress(todayTotals.fats, goals.daily_fats)} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Micronutrients</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Sodium</span>
                  <span className={`text-sm ${todayTotals.sodium > goals.daily_sodium ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                    {Math.round(todayTotals.sodium)}mg / {goals.daily_sodium}mg
                  </span>
                </div>
                <Progress 
                  value={getNutrientProgress(todayTotals.sodium, goals.daily_sodium)} 
                  className={getProgressColor(todayTotals.sodium, goals.daily_sodium, true)}
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Calcium</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(todayTotals.calcium)}mg / {goals.daily_calcium}mg
                  </span>
                </div>
                <Progress value={getNutrientProgress(todayTotals.calcium, goals.daily_calcium)} />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Iron</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(todayTotals.iron * 10) / 10}mg / {goals.daily_iron}mg
                  </span>
                </div>
                <Progress value={getNutrientProgress(todayTotals.iron, goals.daily_iron)} />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Fiber</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(todayTotals.fiber)}g / {goals.daily_fiber}g
                  </span>
                </div>
                <Progress value={getNutrientProgress(todayTotals.fiber, goals.daily_fiber)} />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Sugar</span>
                  <span className={`text-sm ${todayTotals.sugar > goals.daily_sugar ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                    {Math.round(todayTotals.sugar)}g / {goals.daily_sugar}g
                  </span>
                </div>
                <Progress 
                  value={getNutrientProgress(todayTotals.sugar, goals.daily_sugar)} 
                  className={getProgressColor(todayTotals.sugar, goals.daily_sugar, true)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Smart Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span className="text-sm">{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NutritionSummary;