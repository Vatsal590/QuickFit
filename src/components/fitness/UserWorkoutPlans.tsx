
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Dumbbell, Target, Plus, Eye, Trash2 } from 'lucide-react';
import { WorkoutPlan } from '@/types';
import FitnessProfileForm from './FitnessProfileForm';

interface UserWorkoutPlansProps {
  workoutPlans: WorkoutPlan[];
  onDeletePlan: (planId: string) => Promise<void>;
  onPlanGenerated?: (plan: any) => void;
  onSelectPlan?: (plan: WorkoutPlan) => void;
}

const UserWorkoutPlans = ({ workoutPlans, onDeletePlan, onPlanGenerated, onSelectPlan }: UserWorkoutPlansProps) => {
  const [showProfileForm, setShowProfileForm] = useState(false);

  const getGoalColor = (goal: string) => {
    switch (goal) {
      case 'muscle_gain':
        return 'bg-blue-100 text-blue-800';
      case 'fat_loss':
        return 'bg-red-100 text-red-800';
      case 'athlete_training':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatGoal = (goal: string) => {
    return goal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Your Workout Plans</h2>
            <p className="text-gray-600">
              Personalized 30-day workout plans based on your fitness profile
            </p>
          </div>
          <Button 
            onClick={() => setShowProfileForm(true)}
            className="bg-fitness-primary hover:bg-fitness-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Plan
          </Button>
        </div>

        {/* Workout Plans Grid */}
        {workoutPlans.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workoutPlans.map((plan) => {
              const progress = plan.duration > 0 ? ((plan.duration - plan.daysLeft) / plan.duration) * 100 : 0;
              
              return (
                <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{plan.title}</CardTitle>
                        <Badge className={getGoalColor(plan.goal)} variant="secondary">
                          {formatGoal(plan.goal)}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSelectPlan?.(plan)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeletePlan(plan.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{plan.duration} days</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Dumbbell className="h-4 w-4" />
                        <span>{plan.daysLeft} left</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="w-full" />
                    </div>
                    
                    <Button 
                      className="w-full"
                      onClick={() => onSelectPlan?.(plan)}
                    >
                      <Target className="mr-2 h-4 w-4" />
                      View Plan
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Dumbbell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <CardTitle className="mb-2">No Workout Plans Yet</CardTitle>
              <CardDescription className="mb-4">
                Create your first personalized 30-day workout plan based on your fitness goals
              </CardDescription>
              <Button 
                onClick={() => setShowProfileForm(true)}
                className="bg-fitness-primary hover:bg-fitness-primary/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Plan
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Fitness Profile Form Modal */}
      <FitnessProfileForm
        isOpen={showProfileForm}
        onClose={() => setShowProfileForm(false)}
        onPlanGenerated={onPlanGenerated}
      />
    </>
  );
};

export default UserWorkoutPlans;
