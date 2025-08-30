import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import DietPlanComponent from '../components/fitness/DietPlan';
import { useTranslation } from '@/contexts/TranslationContext';

const DietPlan = () => {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-3">
            {t('Diet Plan')}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('Get a personalized nutrition plan based on your fitness goals, dietary preferences, and taste preferences.')}
          </p>
        </div>
        <DietPlanComponent />
      </div>
    </PageContainer>
  );
};

export default DietPlan;