
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, Calendar, CheckCircle } from 'lucide-react';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
}

interface WorkoutDay {
  day: number;
  type: 'workout' | 'rest';
  focus?: string;
  exercises?: Exercise[];
  completed?: boolean;
}

interface WorkoutPlan {
  id: string;
  type: string;
  duration: number;
  daysLeft: number;
  schedule: WorkoutDay[];
  createdAt: string;
}

interface WorkoutPlanViewerProps {
  plan: WorkoutPlan;
  onMarkComplete: (planId: string, dayNumber: number) => void;
}

const WorkoutPlanViewer: React.FC<WorkoutPlanViewerProps> = ({ plan, onMarkComplete }) => {
  // Capitalize the plan type for display
  const capitalizedPlanType = plan.type
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{capitalizedPlanType} Plan</CardTitle>
              <p className="text-gray-600 mt-2">
                {plan.daysLeft} days remaining of {plan.duration}-day program
              </p>
            </div>
            <Badge variant="secondary" className="bg-fitness-primary/10 text-fitness-primary">
              <Target className="h-3 w-3 mr-1" />
              {capitalizedPlanType}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {plan.schedule.map((day) => (
          <Card key={day.day} className={`${day.completed ? 'bg-green-50 border-green-200' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    day.completed 
                      ? 'bg-green-500 text-white' 
                      : day.type === 'rest' 
                        ? 'bg-gray-200 text-gray-600' 
                        : 'bg-fitness-primary text-white'
                  }`}>
                    {day.completed ? <CheckCircle className="h-4 w-4" /> : day.day}
                  </div>
                  <div>
                    <h3 className="font-semibold">Day {day.day}</h3>
                    <p className="text-sm text-gray-600">
                      {day.type === 'rest' ? 'Rest Day' : `${day.focus} Training`}
                    </p>
                  </div>
                </div>
                {day.type === 'workout' && !day.completed && (
                  <Button
                    onClick={() => onMarkComplete(plan.id, day.day)}
                    variant="outline"
                    size="sm"
                    className="border-green-500 text-green-600 hover:bg-green-50"
                  >
                    Mark Complete
                  </Button>
                )}
                {day.completed && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Completed
                  </Badge>
                )}
              </div>
            </CardHeader>

            {day.type === 'workout' && day.exercises && (
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {day.exercises.map((exercise, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{exercise.name}</h4>
                        <p className="text-sm text-gray-600">
                          {exercise.sets} sets × {exercise.reps}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {exercise.rest} rest
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}

            {day.type === 'rest' && (
              <CardContent className="pt-0">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                    <p className="text-blue-700">Rest and recovery day. Stay hydrated and get good sleep!</p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WorkoutPlanViewer;
