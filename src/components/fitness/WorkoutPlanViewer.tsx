
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Target, CheckCircle, Circle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

interface WorkoutPlan {
  id: string;
  plan_name: string;
  fitness_goal: string;
  total_days: number;
  daily_workouts: any[];
  created_at: string;
  is_active: boolean;
}

interface WorkoutPlanViewerProps {
  isOpen: boolean;
  onClose: () => void;
  plan: WorkoutPlan | null;
}

const WorkoutPlanViewer = ({ isOpen, onClose, plan }: WorkoutPlanViewerProps) => {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  if (!plan) return null;

  const weeks = Array.from({ length: 5 }, (_, i) => i + 1); // 30 days = ~4.3 weeks, so 5 weeks
  
  const getWeekDays = (week: number) => {
    const startDay = (week - 1) * 7 + 1;
    const endDay = Math.min(week * 7, 30);
    return plan.daily_workouts.slice(startDay - 1, endDay);
  };

  const getGoalColor = (goal: string) => {
    switch (goal) {
      case 'muscle_gain': return 'bg-blue-100 text-blue-800';
      case 'fat_loss': return 'bg-red-100 text-red-800';
      case 'athlete_training': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const capitalizeWords = (str: string) => {
    return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const completedDays = plan.daily_workouts.filter(day => day.completed).length;
  const remainingDays = plan.total_days - completedDays;

  const markDayComplete = async (dayIndex: number) => {
    try {
      const updatedWorkouts = [...plan.daily_workouts];
      updatedWorkouts[dayIndex] = { ...updatedWorkouts[dayIndex], completed: true };

      const { error } = await supabase
        .from('workout_plans')
        .update({ daily_workouts: updatedWorkouts })
        .eq('id', plan.id);

      if (error) throw error;

      toast({
        title: "Day completed!",
        description: `Great job! ${remainingDays - 1} days remaining.`,
      });

      queryClient.invalidateQueries({ queryKey: ['workout-plans', user?.id] });
    } catch (error) {
      console.error('Error marking day complete:', error);
      toast({
        title: "Error",
        description: "Failed to mark day as complete. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {plan.plan_name}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 flex-wrap">
            <Badge className={getGoalColor(plan.fitness_goal)}>
              {capitalizeWords(plan.fitness_goal)}
            </Badge>
            <span>•</span>
            <span>{completedDays}/{plan.total_days} days completed</span>
            <span>•</span>
            <span className="font-medium text-fitness-primary">{remainingDays} days remaining</span>
            <span>•</span>
            <span>Created {new Date(plan.created_at).toLocaleDateString()}</span>
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedWeek.toString()} onValueChange={(value) => setSelectedWeek(parseInt(value))}>
          <TabsList className="grid w-full grid-cols-5">
            {weeks.map((week) => (
              <TabsTrigger key={week} value={week.toString()}>
                Week {week}
              </TabsTrigger>
            ))}
          </TabsList>

          {weeks.map((week) => (
            <TabsContent key={week} value={week.toString()} className="space-y-4">
              <div className="grid gap-4">
                {getWeekDays(week).map((dayPlan, index) => {
                  const dayNumber = (week - 1) * 7 + index + 1;
                  const globalDayIndex = dayNumber - 1;
                  
                  return (
                    <Card key={dayNumber} className={`${dayPlan.isRestDay ? 'bg-gray-50' : 'bg-white'} ${dayPlan.completed ? 'border-green-500 bg-green-50' : ''}`}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            {dayPlan.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <Calendar className="h-4 w-4" />
                            )}
                            Day {dayNumber}
                            {dayPlan.isRestDay ? ' - Rest Day' : ` - ${dayPlan.workout?.title || ''}`}
                            {dayPlan.completed && <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>}
                          </span>
                          <div className="flex items-center gap-2">
                            {!dayPlan.isRestDay && (
                              <Badge variant="outline">
                                <Clock className="h-3 w-3 mr-1" />
                                {dayPlan.workout?.duration || 45}min
                              </Badge>
                            )}
                            {!dayPlan.completed && (
                              <Button
                                size="sm"
                                onClick={() => markDayComplete(globalDayIndex)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                Mark Complete
                              </Button>
                            )}
                          </div>
                        </CardTitle>
                      </CardHeader>

                      <CardContent>
                        {dayPlan.isRestDay ? (
                          <div className="text-center py-4">
                            <Circle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-gray-600">{dayPlan.restType}</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {dayPlan.workout?.notes && (
                              <div className="bg-blue-50 p-3 rounded-lg">
                                <p className="text-sm text-blue-800">{dayPlan.workout.notes}</p>
                              </div>
                            )}
                            
                            <div className="space-y-3">
                              <h4 className="font-medium">Exercises:</h4>
                              {dayPlan.workout?.exercises?.map((exercise: any, exerciseIndex: number) => (
                                <div key={exerciseIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div>
                                    <h5 className="font-medium">{exercise.name}</h5>
                                    <p className="text-sm text-gray-600">
                                      {exercise.sets} sets × {exercise.reps} reps
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-500">Rest: {exercise.rest}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutPlanViewer;
