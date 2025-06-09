
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Crown, Clock, Star, CheckCircle } from 'lucide-react';

interface PremiumWorkout {
  id: string;
  name: string;
  category: string;
  level: string;
  price: number;
  description: string;
  duration: number;
}

interface Purchase {
  premium_workout_id: string;
}

const Store = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  // Fetch premium workouts
  const { data: premiumWorkouts, isLoading: loadingWorkouts } = useQuery({
    queryKey: ['premium-workouts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('premium_workouts')
        .select('*')
        .order('category', { ascending: true })
        .order('level', { ascending: true });
      
      if (error) throw error;
      return data as PremiumWorkout[];
    }
  });

  // Fetch user's purchases
  const { data: purchases, isLoading: loadingPurchases } = useQuery({
    queryKey: ['user-purchases', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('purchases')
        .select('premium_workout_id')
        .eq('user_id', user.id)
        .eq('status', 'completed');
      
      if (error) throw error;
      return data as Purchase[];
    },
    enabled: !!user
  });

  const purchasedWorkoutIds = purchases?.map(p => p.premium_workout_id) || [];

  const handlePurchase = async (workoutId: string, price: number) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to purchase premium workouts",
        variant: "destructive"
      });
      return;
    }

    setPurchasingId(workoutId);
    
    try {
      // Create one-time payment session for this specific workout
      const { data, error } = await supabase.functions.invoke('create-workout-purchase', {
        body: { workoutId, price }
      });
      
      if (error) throw error;
      
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating purchase session:', error);
      toast({
        title: "Purchase Failed",
        description: "Unable to process payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setPurchasingId(null);
    }
  };

  const categories = [...new Set(premiumWorkouts?.map(w => w.category) || [])];

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

  if (loadingWorkouts || loadingPurchases) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fitness-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Premium Workout Store
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock professional workout routines for just $2.99 each. 
            Purchase once, access forever!
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {getCategoryIcon(category)} {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {categories.map(category => (
              <div key={category}>
                <h2 className="text-2xl font-semibold mb-4 capitalize flex items-center">
                  <span className="mr-2 text-3xl">{getCategoryIcon(category)}</span>
                  {category} Workouts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {premiumWorkouts
                    ?.filter(workout => workout.category === category)
                    .map(workout => {
                      const isPurchased = purchasedWorkoutIds.includes(workout.id);
                      return (
                        <Card key={workout.id} className={`relative ${isPurchased ? 'border-green-500 bg-green-50' : ''}`}>
                          {isPurchased && (
                            <div className="absolute -top-2 -right-2">
                              <Badge className="bg-green-500 text-white">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Owned
                              </Badge>
                            </div>
                          )}
                          
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{workout.name}</CardTitle>
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

                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Crown className="h-5 w-5 text-yellow-500 mr-1" />
                                <span className="text-2xl font-bold">${(workout.price / 100).toFixed(2)}</span>
                              </div>
                              
                              {isPurchased ? (
                                <Button disabled variant="outline">
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Purchased
                                </Button>
                              ) : (
                                <Button 
                                  onClick={() => handlePurchase(workout.id, workout.price)}
                                  disabled={purchasingId === workout.id}
                                  className="bg-fitness-primary hover:bg-fitness-primary/90"
                                >
                                  {purchasingId === workout.id ? 'Processing...' : 'Buy Now'}
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </div>
            ))}
          </TabsContent>

          {categories.map(category => (
            <TabsContent key={category} value={category} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {premiumWorkouts
                  ?.filter(workout => workout.category === category)
                  .map(workout => {
                    const isPurchased = purchasedWorkoutIds.includes(workout.id);
                    return (
                      <Card key={workout.id} className={`relative ${isPurchased ? 'border-green-500 bg-green-50' : ''}`}>
                        {isPurchased && (
                          <div className="absolute -top-2 -right-2">
                            <Badge className="bg-green-500 text-white">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Owned
                            </Badge>
                          </div>
                        )}
                        
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{workout.name}</CardTitle>
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

                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Crown className="h-5 w-5 text-yellow-500 mr-1" />
                              <span className="text-2xl font-bold">${(workout.price / 100).toFixed(2)}</span>
                            </div>
                            
                            {isPurchased ? (
                              <Button disabled variant="outline">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Purchased
                              </Button>
                            ) : (
                              <Button 
                                onClick={() => handlePurchase(workout.id, workout.price)}
                                disabled={purchasingId === workout.id}
                                className="bg-fitness-primary hover:bg-fitness-primary/90"
                              >
                                {purchasingId === workout.id ? 'Processing...' : 'Buy Now'}
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Store;
