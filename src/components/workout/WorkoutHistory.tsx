
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkoutHistoryItem, Workout } from '@/types';
import { format } from 'date-fns';
import { CheckCircle, Clock, Dumbbell } from 'lucide-react';

interface WorkoutHistoryProps {
  history: WorkoutHistoryItem[];
  recentWorkouts: Workout[];
  onView: (workout: Workout) => void;
}

const WorkoutHistory = ({ history, recentWorkouts, onView }: WorkoutHistoryProps) => {
  // Match history items with workout details
  const historyWithDetails = history.map(historyItem => {
    const matchingWorkout = recentWorkouts.find(w => w.id === historyItem.workoutId);
    return {
      ...historyItem,
      workout: matchingWorkout,
    };
  });

  // Group history items by date
  const groupedByDate: Record<string, (WorkoutHistoryItem & { workout?: Workout })[]> = {};
  
  historyWithDetails.forEach(item => {
    const dateStr = format(new Date(item.date), 'yyyy-MM-dd');
    if (!groupedByDate[dateStr]) {
      groupedByDate[dateStr] = [];
    }
    groupedByDate[dateStr].push(item);
  });

  // Sort dates in reverse chronological order
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  if (history.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Workout History</CardTitle>
          <CardDescription>You haven't completed any workouts yet</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-8 text-center">
          <div className="bg-gray-100 rounded-full p-4 mb-4">
            <Clock className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No workout history yet</h3>
          <p className="text-gray-500 max-w-md">
            Generate your first workout and complete it to start tracking your progress
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workout History</CardTitle>
        <CardDescription>Track your workout progress over time</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {sortedDates.map(dateStr => (
          <div key={dateStr} className="space-y-3">
            <h3 className="font-medium text-sm text-gray-500">
              {format(new Date(dateStr), 'EEEE, MMMM d, yyyy')}
            </h3>
            <div className="space-y-2">
              {groupedByDate[dateStr].map(item => (
                <div 
                  key={item.id}
                  className="border rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <h4 className="font-medium">
                        {item.workout?.title || "Workout"}
                      </h4>
                      {item.completed && (
                        <span className="ml-2 flex items-center text-green-600 text-sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Completed
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {format(new Date(item.date), 'h:mm a')}
                    </span>
                  </div>
                  
                  {item.workout && (
                    <>
                      <div className="flex items-center gap-4 mb-3 text-sm">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-fitness-primary mr-1" />
                          <span>{item.workout.duration} min</span>
                        </div>
                        <div className="flex items-center">
                          <Dumbbell className="h-4 w-4 text-fitness-primary mr-1" />
                          <span>
                            {item.workout.equipment.includes("none") && item.workout.equipment.length === 1
                              ? "No equipment"
                              : item.workout.equipment.length > 2
                                ? "Multiple"
                                : item.workout.equipment
                                    .filter(eq => eq !== "none")
                                    .map(eq => eq.charAt(0).toUpperCase() + eq.slice(1))
                                    .join(", ")}
                          </span>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline" 
                        size="sm"
                        onClick={() => onView(item.workout!)}
                        className="text-fitness-primary border-fitness-primary/30 hover:bg-fitness-primary/10"
                      >
                        View Details
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default WorkoutHistory;
