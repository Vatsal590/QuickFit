import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import FoodTrackerDashboard from '../components/fitness/FoodTrackerDashboard';
import { useTranslation } from '@/contexts/TranslationContext';

const FoodTracker = () => {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-3">
            {t('AI Food Tracker')}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('Log meals with photos, track nutrition automatically, and get personalized insights powered by AI.')}
          </p>
        </div>
        <FoodTrackerDashboard />
      </div>
    </PageContainer>
  );
};

export default FoodTracker;
