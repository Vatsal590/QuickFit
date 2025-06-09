
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Crown, Clock, Play, Eye } from 'lucide-react';
import PurchasedWorkoutDetail from './PurchasedWorkoutDetail';

interface PremiumWorkout {
  id: string;
  name: string;
  category: string;
  level: string;
  price: number;
  description: string;
  duration: number;
  exercises: any[];
  warmup_exercises: any[];
  cooldown_exercises: any[];
}

const PurchasedWorkouts = () => {
  const { user } = useAuth();
  const [selectedWorkout, setSelectedWorkout] = useState<PremiumWorkout | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const { data: purchasedWorkouts, isLoading } = useQuery({
    queryKey: ['purchased-workouts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          premium_workout_id,
          premium_workouts (
            id,
            name,
            category,
            level,
            price,
            description,
            duration,
            exercises,
            warmup_exercises,
            cooldown_exercises
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'completed');
      
      if (error) throw error;
      
      return data.map(purchase => purchase.premium_workouts).filter(Boolean) as PremiumWorkout[];
    },
    enabled: !!user
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'dance': return '💃';
      case 'athlete': return '🏃';
      case 'calisthenics': return '🤸';
      case 'boxing': return '🥊';
      case 'yoga': return '🧘';
      case 'hiit': return '⚡';
      default: return '💪';
    }
  };

  const handleViewWorkout = (workout: PremiumWorkout) => {
    setSelectedWorkout(workout);
    setShowDetail(true);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!purchasedWorkouts || purchasedWorkouts.length === 0) {
    return null;
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Crown className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-900">Your Premium Workouts</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {purchasedWorkouts.map((workout) => (
            <Card key={workout.id} className="border-green-200 bg-green-50">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-2xl">{getCategoryIcon(workout.category)}</span>
                    {workout.name}
                  </CardTitle>
                  <Badge className={getLevelColor(workout.level)}>
                    {workout.level}
                  </Badge>
                </div>
                <CardDescription>{workout.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {workout.duration} minutes
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleViewWorkout(workout)}
                    className="flex-1 bg-fitness-primary hover:bg-fitness-primary/90"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <PurchasedWorkoutDetail
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        workout={selectedWorkout}
      />
    </>
  );
};

export default PurchasedWorkouts;
