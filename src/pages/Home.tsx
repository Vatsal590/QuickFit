
import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import WorkoutForm from '../components/workout/WorkoutForm';
import WorkoutDisplay from '../components/workout/WorkoutDisplay';
import UserWorkoutPlans from '../components/fitness/UserWorkoutPlans';
import WorkoutPlanViewer from '../components/fitness/WorkoutPlanViewer';
import WorkoutPlanGenerator from '../components/fitness/WorkoutPlanGenerator';
import { Workout, WorkoutFormData, WorkoutPlan } from '../types';
import { useWorkoutHistory } from '../hooks/useWorkoutHistory';
import { useWorkoutPlans } from '../hooks/useWorkoutPlans';
import { generateWorkout } from '../data/workoutGenerator';
import { useToast } from '@/hooks/use-toast';
import { useFitnessProfile } from '../hooks/useFitnessProfile';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap, Target, TrendingUp, Clock, Users, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Update user activity in profiles table
const updateUserActivity = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ 
          last_used: new Date().toISOString(),
          last_active: new Date().toISOString() 
        })
        .eq('id', user.id);
      console.log('User activity tracked');
    }
  } catch (error) {
    console.error('Failed to track user activity:', error);
  }
};

const Home = () => {
  const { toast } = useToast();
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [showPlanGenerator, setShowPlanGenerator] = useState(false);
  const { addWorkoutToHistory, markWorkoutCompleted } = useWorkoutHistory();
  const { profile, isLoading: profileLoading } = useFitnessProfile();
  const { workoutPlans, loading: plansLoading, deleteWorkoutPlan, markDayComplete, loadWorkoutPlans, addWorkoutPlan } = useWorkoutPlans();

  // Track user activity
  const trackUserActivity = async () => {
    await updateUserActivity();
  };

  const handleCreateWorkout = (formData: WorkoutFormData) => {
    trackUserActivity();
    try {
      const newWorkout = generateWorkout(
        formData.time,
        formData.intensity,
        formData.muscleGroups,
        formData.equipment
      );
      setCurrentWorkout(newWorkout);
      
      toast({
        title: "Workout generated",
        description: `Your ${newWorkout.duration} minute workout is ready with 5-min warmup and cooldown!`,
      });
      
      addWorkoutToHistory(newWorkout);
    } catch (error) {
      console.error("Failed to generate workout:", error);
      toast({
        title: "Error",
        description: "Failed to generate workout. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleCompleteWorkout = (workout: Workout) => {
    trackUserActivity();
    markWorkoutCompleted(workout.id);
  };

  const handleSelectPlan = (plan: WorkoutPlan) => {
    trackUserActivity();
    console.log("Selected plan:", plan);
    setSelectedPlan(plan);
  };

  const handleDeletePlan = async (planId: string) => {
    trackUserActivity();
    try {
      await deleteWorkoutPlan(planId);
      toast({
        title: "Plan deleted",
        description: "Your workout plan has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete workout plan. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleMarkDayComplete = async (planId: string, dayNumber: number) => {
    trackUserActivity();
    try {
      await markDayComplete(planId, dayNumber);
      toast({
        title: "Day completed!",
        description: "Great job! Your progress has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark day as complete. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePlanGenerated = (newPlan: WorkoutPlan) => {
    trackUserActivity();
    addWorkoutPlan(newPlan);
  };

  // Listen for plan generation events to refresh the plans
  React.useEffect(() => {
    const handlePlanGeneratedEvent = () => {
      loadWorkoutPlans();
    };

    const handleOpenCustomize = () => {
      console.log('Opening customization dialog');
      setShowPlanGenerator(true);
    };

    const handleOpenFitnessProfile = () => {
      console.log('Opening fitness profile form');
      // We need to trigger the fitness profile form instead
      const event = new CustomEvent('openFitnessProfileForm');
      window.dispatchEvent(event);
    };

    window.addEventListener('planGenerated', handlePlanGeneratedEvent);
    window.addEventListener('openCustomize', handleOpenCustomize);
    window.addEventListener('openFitnessProfile', handleOpenFitnessProfile);
    return () => {
      window.removeEventListener('planGenerated', handlePlanGeneratedEvent);
      window.removeEventListener('openCustomize', handleOpenCustomize);
      window.removeEventListener('openFitnessProfile', handleOpenFitnessProfile);
    };
  }, [loadWorkoutPlans]);

  if (profileLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fitness-primary"></div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Professional Fitness Platform</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Transform Your
                </span>
                <br />
                <span className="text-foreground">Fitness Journey</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
                Experience the future of personalized fitness with our AI-powered workout generator. 
                Create custom training plans, track your progress, and achieve your goals with professional precision.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="xl" className="professional-button">
                  Start Your Journey
                </Button>
                <Button variant="outline" size="xl">
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Show Plan Viewer if a plan is selected */}
        {selectedPlan ? (
          <section className="px-6 pb-20">
            <div className="max-w-6xl mx-auto">
              <Button
                variant="glass"
                onClick={() => { setSelectedPlan(null); trackUserActivity(); }}
                className="mb-8"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="professional-card p-8">
                <WorkoutPlanViewer
                  plan={selectedPlan}
                  onMarkComplete={handleMarkDayComplete}
                />
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* Professional Features Section */}
            <section className="py-20 px-6">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16 animate-fade-in-up">
                  <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
                    Professional Features
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Discover what makes our platform the choice of fitness professionals worldwide
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                  <Card className="animate-scale-in">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                        <Zap className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle>AI-Powered Generation</CardTitle>
                      <CardDescription>
                        Advanced algorithms create personalized workouts based on your goals, equipment, and preferences
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card className="animate-scale-in" style={{animationDelay: '0.1s'}}>
                    <CardHeader>
                      <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle>Precision Tracking</CardTitle>
                      <CardDescription>
                        Monitor your progress with detailed analytics and performance insights
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card className="animate-scale-in" style={{animationDelay: '0.2s'}}>
                    <CardHeader>
                      <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle>Smart Progression</CardTitle>
                      <CardDescription>
                        Automatically adjust difficulty and intensity as you improve and reach new milestones
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            </section>

            {/* 30-Day Plans Section */}
            <section className="py-20 px-6 bg-gradient-secondary">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-4 text-foreground">
                    Your Workout Plans
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    Professional 30-day programs designed for real results
                  </p>
                </div>
                <UserWorkoutPlans 
                  workoutPlans={workoutPlans}
                  onSelectPlan={handleSelectPlan}
                  onDeletePlan={handleDeletePlan}
                />
              </div>
            </section>

            {/* Custom Workout Generator Section */}
            <section className="py-20 px-6">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
                    Instant Workout Generator
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    Need a quick workout? Generate one instantly based on your available time and equipment
                  </p>
                </div>
                
                <div className="professional-card p-8">
                  {currentWorkout ? (
                    <WorkoutDisplay
                      workout={currentWorkout}
                      onBack={() => { setCurrentWorkout(null); trackUserActivity(); }}
                      onComplete={handleCompleteWorkout}
                    />
                  ) : (
                    <WorkoutForm 
                      onSubmit={handleCreateWorkout}
                    />
                  )}
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-6 bg-gradient-accent">
              <div className="max-w-6xl mx-auto text-center">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="animate-fade-in-up">
                    <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                    <div className="text-muted-foreground">Active Users</div>
                  </div>
                  <div className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                    <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                    <div className="text-muted-foreground">Workouts Generated</div>
                  </div>
                  <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                    <div className="text-4xl font-bold text-primary mb-2">98%</div>
                    <div className="text-muted-foreground">Success Rate</div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Workout Plan Generator Dialog */}
        <WorkoutPlanGenerator
          isOpen={showPlanGenerator}
          onClose={() => setShowPlanGenerator(false)}
          profile={profile}
          onPlanGenerated={handlePlanGenerated}
        />
      </div>
    </PageContainer>
  );
};

export default Home;
