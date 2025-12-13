import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import WorkoutHistory from '../components/workout/WorkoutHistory';
import WorkoutDisplay from '../components/workout/WorkoutDisplay';
import { useWorkoutHistory } from '../hooks/useWorkoutHistory';
import { useTranslation } from '@/contexts/TranslationContext';
import { Workout } from '../types';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

const History = () => {
  const { history, recentWorkouts, markWorkoutCompleted } = useWorkoutHistory();
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const { t } = useTranslation();

  const handleViewWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    window.scrollTo(0, 0);
  };

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t('History')}</h1>

        {selectedWorkout ? (
          <WorkoutDisplay
            workout={selectedWorkout}
            onBack={() => setSelectedWorkout(null)}
            onComplete={() => {
              markWorkoutCompleted(selectedWorkout.id);
              setSelectedWorkout(null);
            }}
          />
        ) : history.length > 0 ? (
          <WorkoutHistory
            history={history}
            recentWorkouts={recentWorkouts}
            onView={handleViewWorkout}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-gray-100 rounded-full p-4 mb-4">
                <Clock className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-medium mb-2">{t('No workout history yet')}</h2>
              <p className="text-gray-500 mb-6 max-w-md">
                {t('Generate your first workout to see it here!')}
              </p>
              <Button 
                onClick={() => window.location.href = '/instant-workout'}
                className="bg-fitness-primary hover:bg-fitness-primary/90"
              >
                {t('Go to Workouts')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default History;
