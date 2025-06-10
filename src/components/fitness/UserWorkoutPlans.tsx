
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Target, Clock, Play } from 'lucide-react';
import WorkoutPlanGenerator from './WorkoutPlanGenerator';
import WorkoutPlanViewer from './WorkoutPlanViewer';
import { useFitnessProfile } from '../../hooks/useFitnessProfile';

interface WorkoutPlan {
  id: string;
  plan_name: string;
  fitness_goal: string;
  total_days: number;
  daily_workouts: any;
  created_at: string;
  is_active: boolean;
}

const UserWorkoutPlans = () => {
  const { user } = useAuth();
  const { profile } = useFitnessProfile();
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);

  const { data: workoutPlans, isLoading } = useQuery({
    queryKey: ['workout-plans', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as WorkoutPlan[];
    },
    enabled: !!user
  });

  const getGoalColor = (goal: string) => {
    switch (goal) {
      case 'muscle_gain': return 'bg-blue-100 text-blue-800';
      case 'fat_loss': return 'bg-red-100 text-red-800';
      case 'athlete_training': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGoalEmoji = (goal: string) => {
    switch (goal) {
      case 'muscle_gain': return '💪';
      case 'fat_loss': return '🔥';
      case 'athlete_training': return '🏃‍♂️';
      default: return '🎯';
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse mb-8">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Your 30-Day Workout Plans</h2>
          <Button 
            onClick={() => setShowGenerator(true)}
            className="bg-fitness-primary hover:bg-fitness-primary/90"
          >
            Generate New Plan
          </Button>
        </div>
        
        {workoutPlans && workoutPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workoutPlans.map((plan) => (
              <Card key={plan.id} className="border-green-200 bg-green-50">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-2xl">{getGoalEmoji(plan.fitness_goal)}</span>
                      {plan.plan_name}
                    </CardTitle>
                    <Badge className={getGoalColor(plan.fitness_goal)}>
                      {plan.fitness_goal.replace('_', ' ')}
                    </Badge>
                  </div>
                  <CardDescription>
                    Created on {new Date(plan.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {plan.total_days} days total
                  </div>

                  <Button 
                    onClick={() => setSelectedPlan(plan)}
                    className="w-full bg-fitness-primary hover:bg-fitness-primary/90"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    View Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-8">
            <CardHeader>
              <CardTitle>No workout plans yet</CardTitle>
              <CardDescription>
                Generate your first personalized 30-day workout plan based on your fitness profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setShowGenerator(true)}
                className="bg-fitness-primary hover:bg-fitness-primary/90"
              >
                Generate Your First Plan
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <WorkoutPlanGenerator 
        isOpen={showGenerator}
        onClose={() => setShowGenerator(false)}
        profile={profile}
      />

      <WorkoutPlanViewer
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        plan={selectedPlan}
      />
    </>
  );
};

export default UserWorkoutPlans;
