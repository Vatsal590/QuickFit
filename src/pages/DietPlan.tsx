import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import DietPlanComponent from '../components/fitness/DietPlan';
import { useTranslation } from '@/contexts/TranslationContext';

const DietPlan = () => {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-3">
            {t('Diet Plan')}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            {t('Get a personalized nutrition plan based on your fitness goals, dietary preferences, and taste preferences.')}
          </p>
        </div>
        <DietPlanComponent />
      </div>
    </PageContainer>
  );
};

export default DietPlan;