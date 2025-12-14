import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FoodPhotoUpload from './FoodPhotoUpload';
import FoodLogsList from './FoodLogsList';
import NutritionSummary from './NutritionSummary';
import NutritionGoals from './NutritionGoals';
import { useTranslation } from '@/contexts/TranslationContext';

const FoodTrackerDashboard = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { t } = useTranslation();

  const handleFoodLogged = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="log" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="log">{t('Log Meal')}</TabsTrigger>
          <TabsTrigger value="summary">{t("Today's Summary")}</TabsTrigger>
          <TabsTrigger value="goals">{t('Goals')}</TabsTrigger>
        </TabsList>

        <TabsContent value="log" className="space-y-6">
          <FoodPhotoUpload onFoodLogged={handleFoodLogged} />
          <FoodLogsList key={refreshTrigger} />
        </TabsContent>

        <TabsContent value="summary">
          <NutritionSummary key={refreshTrigger} />
        </TabsContent>

        <TabsContent value="goals">
          <NutritionGoals />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FoodTrackerDashboard;
