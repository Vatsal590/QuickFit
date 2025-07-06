
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Clock, Target, Trophy, Play } from 'lucide-react';
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
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  
  const completedDays = getCompletedDaysCount(plan);
  const progressPercentage = (completedDays / plan.duration) * 100;
  
  const handleDayClick = (dayNumber: number) => {
    setSelectedDay(selectedDay === dayNumber ? null : dayNumber);
    setCurrentExerciseIndex(0);
  };

  const handleMarkComplete = (dayNumber: number) => {
    onMarkComplete(plan.id, dayNumber);
  };

  const selectedDayData = selectedDay ? plan.dailyWorkouts?.find((day: any) => day.day === selectedDay) : null;

  // Exercise animation mapping
  const exerciseMap: { [key: string]: string } = {
    'Push-ups': 'https://media.giphy.com/media/ZZjmgRavW8Y6I/giphy.gif',
    'Squats': 'https://media.giphy.com/media/1qfDiJpuj6l8wSZtuI/giphy.gif',
    'Plank': 'https://media.giphy.com/media/jJF6K2zjd8Cdi/giphy.gif',
    'Lunges': 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif',
    'Burpees': 'https://media.giphy.com/media/ZYzt9dXQUjmBa/giphy.gif',
    'Mountain Climbers': 'https://media.giphy.com/media/l3vRhE4BxJPVBsKnm/giphy.gif',
    'Jumping Jacks': 'https://media.giphy.com/media/3o6ZtqrfglpgV8EdCU/giphy.gif',
    'Sit-ups': 'https://media.giphy.com/media/3o6fITUr1mUMQq4xy0/giphy.gif',
    'Deadlifts': 'https://media.giphy.com/media/xT9IgmqMhHxILK7TGg/giphy.gif',
    'Bench Press': 'https://media.giphy.com/media/3oKIP7CaDfNTeVVjCU/giphy.gif',
    'Pull-ups': 'https://media.giphy.com/media/26FPqQiKnqBJyOUow/giphy.gif',
    'Dips': 'https://media.giphy.com/media/3oKIPfLNVTOJR6K6Gk/giphy.gif',
    'Shoulder Press': 'https://media.giphy.com/media/26gR0YFZxWbnUPtMA/giphy.gif',
    'Bicep Curls': 'https://media.giphy.com/media/3oKIPgQNzIKxz3r5aU/giphy.gif',
    'Tricep Extensions': 'https://media.giphy.com/media/3oKIPbKgJi6YJy9y6c/giphy.gif',
    'Leg Press': 'https://media.giphy.com/media/3oKIPdLCAYdaKGmN4k/giphy.gif',
    'Calf Raises': 'https://media.giphy.com/media/3oKIP8kNuTJJL3zTXi/giphy.gif',
    'Russian Twists': 'https://media.giphy.com/media/3oKIPg2bWOUjgAh7OE/giphy.gif',
    'High Knees': 'https://media.giphy.com/media/3oKIPfZqKjDhNJ8dTq/giphy.gif',
    'Butt Kicks': 'https://media.giphy.com/media/3oKIPd8bWOUja9F8fC/giphy.gif',
    'Side Plank': 'https://media.giphy.com/media/3oKIPgTIdBpWRcDmGk/giphy.gif',
    'Wall Sit': 'https://media.giphy.com/media/3oKIPbm9KjZaGJF7Aq/giphy.gif',
    'Glute Bridges': 'https://media.giphy.com/media/3oKIPg8TKxSzJDwfuM/giphy.gif',
    'Pike Push-ups': 'https://media.giphy.com/media/3oKIPckXiX6b2HHs2I/giphy.gif',
    'Jump Squats': 'https://media.giphy.com/media/3oKIPgLVYDqP3s8jXC/giphy.gif',
    'Star Jumps': 'https://media.giphy.com/media/3oKIPb5M7hWOGBXpWM/giphy.gif',
    'Cross Body Crunches': 'https://media.giphy.com/media/3oKIPeqT9nRAIh7fvO/giphy.gif',
    'Single Leg Deadlifts': 'https://media.giphy.com/media/3oKIPaLQTmSq9gJk4M/giphy.gif',
    'Reverse Lunges': 'https://media.giphy.com/media/3oKIPbNHLJYK8k3rPG/giphy.gif',
    'Incline Push-ups': 'https://media.giphy.com/media/3oKIPdDLcQrQjVwD1S/giphy.gif',
    'Chair Dips': 'https://media.giphy.com/media/3oKIPg9BhE8K7rM8ww/giphy.gif',
    'Step-ups': 'https://media.giphy.com/media/3oKIPaJKGrTIdKJfSw/giphy.gif',
    'Bear Crawls': 'https://media.giphy.com/media/3oKIPbxhIJVgHWOqLm/giphy.gif',
    'Superman': 'https://media.giphy.com/media/3oKIPgKQQO7b8hpFPW/giphy.gif',
    'Bicycle Crunches': 'https://media.giphy.com/media/3oKIPeqjFGJ5Q2YGJC/giphy.gif',
    'Diamond Push-ups': 'https://media.giphy.com/media/3oKIPb6mHsJ4hHOQbS/giphy.gif',
    'Walking Lunges': 'https://media.giphy.com/media/3oKIPbuHbQQJxJF7DG/giphy.gif',
    'Donkey Kicks': 'https://media.giphy.com/media/3oKIPefj4S8YQqQwj6/giphy.gif',
    'Leg Raises': 'https://media.giphy.com/media/3oKIPbhSLdQgfJk4tG/giphy.gif',
    'T Push-ups': 'https://media.giphy.com/media/3oKIPa0fRzGrTGJ9Cw/giphy.gif',
    'Split Squats': 'https://media.giphy.com/media/3oKIPaTyJ8J6YXdF9C/giphy.gif',
    'Reverse Crunches': 'https://media.giphy.com/media/3oKIPeTjZzKQJ2RIvm/giphy.gif',
    'Inchworms': 'https://media.giphy.com/media/3oKIPgGrQJBtBlEEHm/giphy.gif',
    'Side Lunges': 'https://media.giphy.com/media/3oKIPbrJ4FdXFRZwrC/giphy.gif',
    'Hollow Body Hold': 'https://media.giphy.com/media/3oKIPcK8VqNzXiM6qA/giphy.gif',
    'Curtsy Lunges': 'https://media.giphy.com/media/3oKIPcrD6LKMq9wOD6/giphy.gif',
    'Frog Jumps': 'https://media.giphy.com/media/3oKIPb8TrGqJKQHhTG/giphy.gif',
    'Dead Bug': 'https://media.giphy.com/media/3oKIPe5jKQqJ9D8Qi4/giphy.gif',
    'Archer Push-ups': 'https://media.giphy.com/media/3oKIPaTJI3xBpYJHhC/giphy.gif',
    'Single Leg Glute Bridges': 'https://media.giphy.com/media/3oKIPdyB7sjHrZdyLm/giphy.gif',
    'Lateral Lunges': 'https://media.giphy.com/media/3oKIPaKDkQLBhHhq1G/giphy.gif',
    'Bird Dog': 'https://media.giphy.com/media/3oKIPeqeEhfOQ2LGBG/giphy.gif',
    'Reverse Plank': 'https://media.giphy.com/media/3oKIPbhAb2kqTpKNe8/giphy.gif',
    'Handstand Push-ups': 'https://media.giphy.com/media/3oKIPcJTJGqUL9GkGQ/giphy.gif',
    'Pistol Squats': 'https://media.giphy.com/media/3oKIPbh5aKDd9M5hfO/giphy.gif',
    'L-Sit': 'https://media.giphy.com/media/3oKIPbrDnJ8QaR0X6M/giphy.gif',
    'One Arm Push-ups': 'https://media.giphy.com/media/3oKIPb7QdQhk5VQNwI/giphy.gif',
    'Muscle-ups': 'https://media.giphy.com/media/3oKIPd7D5KqMuYK2Dq/giphy.gif',
    'Planche Push-ups': 'https://media.giphy.com/media/3oKIPgGlQnxF9dJ1Qi/giphy.gif',
    'Human Flag': 'https://media.giphy.com/media/3oKIPa9yLc8BElHnAk/giphy.gif',
    'Front Lever': 'https://media.giphy.com/media/3oKIPcrP8xKVGtYN2M/giphy.gif'
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

      {/* Days Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plan.dailyWorkouts.map((day: any) => {
          const isCompleted = day.completed || false;
          const isSelected = selectedDay === day.day;
          
          return (
            <Card 
              key={day.day} 
              className={`cursor-pointer transition-all duration-200 ${
                isSelected ? 'ring-2 ring-fitness-primary' : ''
              } ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}
              onClick={() => handleDayClick(day.day)}
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
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Target className="h-4 w-4" />
                    <span>{day.exercises?.length || 0} exercises</span>
                  </div>
                  {!isCompleted && (
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkComplete(day.day);
                      }}
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

      {/* Selected Day Details */}
      {selectedDay && selectedDayData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Day {selectedDay} - {selectedDayData.focus || 'Workout'}
            </CardTitle>
            <CardDescription>
              {selectedDayData.exercises?.length || 0} exercises
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {selectedDayData.exercises?.map((exercise: any, index: number) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start gap-4">
                    {exerciseMap[exercise.name] && (
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={exerciseMap[exercise.name]}
                          alt={exercise.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2">{exercise.name}</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        {exercise.sets && (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{exercise.sets} sets</Badge>
                          </div>
                        )}
                        {exercise.reps && (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{exercise.reps} reps</Badge>
                          </div>
                        )}
                        {exercise.duration && (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{exercise.duration}</Badge>
                          </div>
                        )}
                        {exercise.rest && (
                          <div className="text-xs text-gray-500">
                            Rest: {exercise.rest}
                          </div>
                        )}
                      </div>
                      {exercise.description && (
                        <p className="text-sm text-gray-600 mt-2">{exercise.description}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {!selectedDayData.completed && (
              <div className="mt-6 pt-4 border-t">
                <Button
                  onClick={() => handleMarkComplete(selectedDay)}
                  className="w-full bg-fitness-primary hover:bg-fitness-primary/90"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Day {selectedDay}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkoutPlanViewer;
