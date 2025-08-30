import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import WeightTrackerComponent from '../components/fitness/WeightTracker';
import { useTranslation } from '@/contexts/TranslationContext';

const WeightTracker = () => {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-3">
            {t('Weight Tracker')}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('Track your daily weight and monitor your progress over time with detailed charts and insights.')}
          </p>
        </div>
        <WeightTrackerComponent />
      </div>
    </PageContainer>
  );
};

export default WeightTracker;