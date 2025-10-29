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
          daily_calories: Number(data.daily_calories),
          daily_protein: Number(data.daily_protein),
          daily_carbs: Number(data.daily_carbs),
          daily_fats: Number(data.daily_fats),
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
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="calories">Daily Calories</Label>
          <Input
            id="calories"
            type="number"
            value={goals.daily_calories}
            onChange={(e) => setGoals({ ...goals, daily_calories: Number(e.target.value) })}
          />
        </div>

        <div>
          <Label htmlFor="protein">Daily Protein (g)</Label>
          <Input
            id="protein"
            type="number"
            value={goals.daily_protein}
            onChange={(e) => setGoals({ ...goals, daily_protein: Number(e.target.value) })}
          />
        </div>

        <div>
          <Label htmlFor="carbs">Daily Carbs (g)</Label>
          <Input
            id="carbs"
            type="number"
            value={goals.daily_carbs}
            onChange={(e) => setGoals({ ...goals, daily_carbs: Number(e.target.value) })}
          />
        </div>

        <div>
          <Label htmlFor="fats">Daily Fats (g)</Label>
          <Input
            id="fats"
            type="number"
            value={goals.daily_fats}
            onChange={(e) => setGoals({ ...goals, daily_fats: Number(e.target.value) })}
          />
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving ? 'Saving...' : 'Save Goals'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NutritionGoals;
