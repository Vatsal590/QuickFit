import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import { 
  Calendar,
  History,
  Scale,
  Camera,
  UtensilsCrossed,
  Gift,
  BookOpen,
  Dumbbell,
  Zap,
} from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <PageContainer>

      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-fitness-primary to-fitness-secondary bg-clip-text text-transparent">
            {t('Welcome to QuickFit')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('Your complete fitness companion. Access all your fitness tools in one place.')}
          </p>
        </div>

        <div className="space-y-8">
          {/* Workout Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Dumbbell className="w-6 h-6 text-fitness-primary" />
              {t('Workouts')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/plans')}
                className="group relative overflow-hidden glass-card p-6 text-left transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-3 shadow-md">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{t('30 Day Plan')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('Your personalized workout plans')}
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/instant-workout')}
                className="group relative overflow-hidden glass-card p-6 text-left transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-3 shadow-md">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{t('Instant Workout')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('Generate quick custom workouts')}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Nutrition Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <UtensilsCrossed className="w-6 h-6 text-fitness-primary" />
              {t('Nutrition')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/diet-plan')}
                className="group relative overflow-hidden glass-card p-6 text-left transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 p-3 shadow-md">
                    <UtensilsCrossed className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{t('Diet Plan')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('Personalized nutrition plans')}
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/food-tracker')}
                className="group relative overflow-hidden glass-card p-6 text-left transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 p-3 shadow-md">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{t('AI Food Tracker')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('Track meals with AI')}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Tracking Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Scale className="w-6 h-6 text-fitness-primary" />
              {t('Tracking')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/weight-tracker')}
                className="group relative overflow-hidden glass-card p-6 text-left transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 p-3 shadow-md">
                    <Scale className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{t('Weight Tracker')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('Monitor your progress')}
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/history')}
                className="group relative overflow-hidden glass-card p-6 text-left transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 p-3 shadow-md">
                    <History className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{t('History')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('View your workout history')}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* More Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-fitness-primary" />
              {t('More')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/free-access')}
                className="group relative overflow-hidden glass-card p-6 text-left transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 p-3 shadow-md">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{t('Free Access')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('Refer friends for rewards')}
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/blogs')}
                className="group relative overflow-hidden glass-card p-6 text-left transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 p-3 shadow-md">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{t('Fitness Blogs')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('Tips and guides')}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Index;
