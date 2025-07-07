
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Clock, Trophy, Target } from 'lucide-react';
import { WorkoutPlan } from '@/types';

interface WorkoutPlanViewerProps {
  plan: WorkoutPlan;
  onMarkComplete: (planId: string, dayNumber: number) => void;
}

// Calculate completed days from the plan's dailyWorkouts
const getCompletedDaysCount = (plan: WorkoutPlan): number => {
  if (!plan.dailyWorkouts || !Array.isArray(plan.dailyWorkouts)) return 0;
  return plan.dailyWorkouts.filter((day: any) => day.completed).length;
};

const WorkoutPlanViewer = ({ plan, onMarkComplete }: WorkoutPlanViewerProps) => {
  const completedDays = getCompletedDaysCount(plan);
  const progressPercentage = (completedDays / plan.duration) * 100;

  const handleMarkComplete = (dayNumber: number) => {
    onMarkComplete(plan.id, dayNumber);
  };

  if (!plan.dailyWorkouts || !Array.isArray(plan.dailyWorkouts)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{plan.title}</CardTitle>
          <CardDescription>No workout data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Plan Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{plan.title}</CardTitle>
              <CardDescription className="text-lg mt-2">
                {plan.goal} • {plan.duration} Days
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-fitness-primary">{completedDays}</div>
              <div className="text-sm text-gray-600">of {plan.duration} days</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
            
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-fitness-primary" />
                <span>Goal: {plan.goal}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-fitness-primary" />
                <span>{plan.duration} Days Total</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Days List */}
      <div className="space-y-4">
        {plan.dailyWorkouts.map((day: any) => {
          const isCompleted = day.completed || false;
          
          return (
            <Card 
              key={day.day} 
              className={`${isCompleted ? 'bg-green-50 border-green-200' : ''}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Day {day.day}</CardTitle>
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <Circle className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <CardDescription>
                  {day.focus || 'Workout'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Target className="h-4 w-4" />
                    <span>{day.exercises?.length || 0} exercises</span>
                  </div>
                  {!isCompleted && (
                    <Button
                      className="w-full bg-black hover:bg-gray-800 text-white"
                      onClick={() => handleMarkComplete(day.day)}
                    >
                      Mark Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default WorkoutPlanViewer;
