
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WorkoutPlan } from '@/types';
import { Calendar, Clock, Target, Play, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserWorkoutPlansProps {
  workoutPlans?: WorkoutPlan[];
  onSelectPlan?: (plan: WorkoutPlan) => void;
  onDeletePlan?: (planId: string) => void;
}

const UserWorkoutPlans = ({ 
  workoutPlans = [], 
  onSelectPlan = () => {}, 
  onDeletePlan = () => {} 
}: UserWorkoutPlansProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [planToDelete, setPlanToDelete] = React.useState<string | null>(null);

  const handleDeleteClick = (planId: string) => {
    setPlanToDelete(planId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (planToDelete) {
      onDeletePlan(planToDelete);
      setPlanToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const getButtonText = (plan: WorkoutPlan) => {
    // Check if plan has any progress by looking at days left vs total duration
    const hasProgress = plan.daysLeft < plan.duration;
    return hasProgress ? 'Continue Plan' : 'Start Plan';
  };
  if (!workoutPlans || workoutPlans.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>My 30-Day Workout Plans</CardTitle>
          <CardDescription>No workout plans yet</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-8 text-center">
          <div className="bg-gray-100 rounded-full p-4 mb-4">
            <Target className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No workout plans yet</h3>
          <p className="text-gray-500 max-w-md mb-4">
            Create your first 30-day workout plan to get started on your fitness journey!
          </p>
          <Button
            onClick={() => {
              window.dispatchEvent(new Event('openFitnessProfile'));
            }}
            className="bg-fitness-primary hover:bg-fitness-primary/90"
          >
            <Target className="h-4 w-4 mr-2" />
            Customize
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My 30-Day Workout Plans</CardTitle>
        <CardDescription>Generate Workout Plan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {workoutPlans.map((plan) => (
          <div 
            key={plan.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg capitalize">
                    {plan.title}
                  </h3>
                  <Badge variant="secondary" className="capitalize">
                    {plan.goal}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-fitness-primary mr-1" />
                    <span>Created {format(new Date(plan.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-fitness-primary mr-1" />
                    <span>{plan.duration} days</span>
                  </div>
                  <div className="flex items-center">
                    <Target className="h-4 w-4 text-fitness-primary mr-1" />
                    <span>{plan.daysLeft} days left</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteClick(plan.id)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="pt-3 border-t">
                <Button
                  onClick={() => onSelectPlan({
                    ...plan,
                    type: plan.type || 'custom',
                    duration: plan.duration || 30,
                    daysLeft: plan.daysLeft || plan.duration || 30,
                    schedule: plan.schedule || plan.exercises || [],
                    createdAt: plan.createdAt || new Date().toISOString()
                  })}
                  className="w-full bg-fitness-primary hover:bg-fitness-primary/90"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {getButtonText(plan)}
                </Button>
            </div>
          </div>
        ))}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Plan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this workout plan? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Plan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default UserWorkoutPlans;
