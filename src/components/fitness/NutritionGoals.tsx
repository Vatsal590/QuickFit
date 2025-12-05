import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const NutritionGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState({
    daily_calories: 2000,
    daily_protein: 150,
    daily_carbs: 250,
    daily_fats: 65,
    daily_sodium: 2300,
    daily_calcium: 1000,
    daily_iron: 18,
    daily_fiber: 25,
    daily_sugar: 25,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('user_nutrition_goals')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

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

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('user_nutrition_goals')
        .upsert({
          user_id: user.id,
          daily_calories: goals.daily_calories,
          daily_protein: goals.daily_protein,
          daily_carbs: goals.daily_carbs,
          daily_fats: goals.daily_fats,
          daily_sodium: goals.daily_sodium,
          daily_calcium: goals.daily_calcium,
          daily_iron: goals.daily_iron,
          daily_fiber: goals.daily_fiber,
          daily_sugar: goals.daily_sugar,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
      toast.success('Goals updated successfully!');
    } catch (error: any) {
      console.error('Error saving goals:', error);
      toast.error('Failed to update goals');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Nutrition Goals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold mb-3">Macronutrients</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                value={goals.daily_calories}
                onChange={(e) => setGoals({ ...goals, daily_calories: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                value={goals.daily_protein}
                onChange={(e) => setGoals({ ...goals, daily_protein: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                value={goals.daily_carbs}
                onChange={(e) => setGoals({ ...goals, daily_carbs: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="fats">Fats (g)</Label>
              <Input
                id="fats"
                type="number"
                value={goals.daily_fats}
                onChange={(e) => setGoals({ ...goals, daily_fats: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">Micronutrients</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="sodium">Sodium (mg)</Label>
              <Input
                id="sodium"
                type="number"
                value={goals.daily_sodium}
                onChange={(e) => setGoals({ ...goals, daily_sodium: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="calcium">Calcium (mg)</Label>
              <Input
                id="calcium"
                type="number"
                value={goals.daily_calcium}
                onChange={(e) => setGoals({ ...goals, daily_calcium: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="iron">Iron (mg)</Label>
              <Input
                id="iron"
                type="number"
                step="0.1"
                value={goals.daily_iron}
                onChange={(e) => setGoals({ ...goals, daily_iron: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="fiber">Fiber (g)</Label>
              <Input
                id="fiber"
                type="number"
                value={goals.daily_fiber}
                onChange={(e) => setGoals({ ...goals, daily_fiber: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="sugar">Sugar (g)</Label>
              <Input
                id="sugar"
                type="number"
                value={goals.daily_sugar}
                onChange={(e) => setGoals({ ...goals, daily_sugar: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving ? 'Saving...' : 'Save Goals'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NutritionGoals;
