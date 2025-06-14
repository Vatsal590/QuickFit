
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import WorkoutPlanGenerator from '@/components/fitness/WorkoutPlanGenerator';
import UserWorkoutPlans from '@/components/fitness/UserWorkoutPlans';
import SubscriptionSuccess from '@/components/subscription/SubscriptionSuccess';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successPlan, setSuccessPlan] = useState('');

  useEffect(() => {
    const success = searchParams.get('success');
    const plan = searchParams.get('plan');
    
    if (success === 'true' && plan) {
      setShowSuccess(true);
      setSuccessPlan(plan);
      // Clean up URL
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setSuccessPlan('');
  };

  if (showSuccess) {
    return (
      <PageContainer>
        <SubscriptionSuccess plan={successPlan} onClose={handleCloseSuccess} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to QuickFit
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your personal fitness journey starts here. Generate custom workouts or follow our expert-designed athlete plans.
          </p>
        </div>
        
        <WorkoutPlanGenerator />
        <UserWorkoutPlans />
      </div>
    </PageContainer>
  );
};

export default Index;
