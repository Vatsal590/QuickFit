import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar,
  History,
  Scale,
  Camera,
  UtensilsCrossed,
  Gift,
  BookOpen,
  Dumbbell,
  Zap
} from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navigationCards = [
    {
      title: t('30 Day Plan'),
      description: t('Your personalized workout plans'),
      icon: Calendar,
      path: '/plans',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: t('Instant Workout'),
      description: t('Generate quick custom workouts'),
      icon: Zap,
      path: '/instant-workout',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: t('Diet Plan'),
      description: t('Personalized nutrition plans'),
      icon: UtensilsCrossed,
      path: '/diet-plan',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: t('AI Food Tracker'),
      description: t('Track meals with AI'),
      icon: Camera,
      path: '/food-tracker',
      gradient: 'from-orange-500 to-amber-500'
    },
    {
      title: t('Weight Tracker'),
      description: t('Monitor your progress'),
      icon: Scale,
      path: '/weight-tracker',
      gradient: 'from-indigo-500 to-blue-500'
    },
    {
      title: t('History'),
      description: t('View your workout history'),
      icon: History,
      path: '/history',
      gradient: 'from-violet-500 to-purple-500'
    },
    {
      title: t('Free Access'),
      description: t('Refer friends for rewards'),
      icon: Gift,
      path: '/free-access',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      title: t('Fitness Blogs'),
      description: t('Tips and guides'),
      icon: BookOpen,
      path: '/blogs',
      gradient: 'from-teal-500 to-cyan-500'
    }
  ];

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-fitness-primary to-fitness-secondary bg-clip-text text-transparent">
            {t('Welcome to QuickFit')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('Your complete fitness companion. Choose where you want to go:')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {navigationCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.path}
                className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 overflow-hidden"
                onClick={() => navigate(card.path)}
              >
                <div className={`h-2 bg-gradient-to-r ${card.gradient}`} />
                <CardContent className="p-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-fitness-primary transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
};

export default HomePage;
