
import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/contexts/TranslationContext';

const About = () => {
  const { t } = useTranslation();
  
  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {t('About Us')}
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            {t('QuickFit is your ultimate fitness companion, designed to create personalized workouts that fit your schedule, equipment, and fitness goals. Whether you have 10 minutes or an hour, we\'ll generate the perfect workout for you.')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-fitness-primary">{t('Our Mission')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {t('To make fitness accessible to everyone, regardless of their equipment, time constraints, or fitness level. We believe that everyone deserves a personalized workout experience.')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-fitness-primary">{t('What Makes Us Different')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-600 space-y-2">
                <li>• {t('Truly personalized workouts based on your available time and equipment')}</li>
                <li>• {t('No subscription fees - completely free to use')}</li>
                <li>• {t('Works with any equipment or no equipment at all')}</li>
                <li>• {t('Quick and efficient - generate a workout in seconds')}</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{t('Meet the Founder')}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <img 
                src="/lovable-uploads/1c5d9536-3ab1-4377-bc37-da68da0ce646.png" 
                alt="Vatsal Agarwala" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-fitness-primary mb-2">{t('Vatsal Agarwala')}</h3>
              <p className="text-gray-500 mb-4">{t('Fitness Enthusiast & Developer')}</p>
            </div>
            
            <div className="text-left max-w-3xl mx-auto space-y-4 text-gray-600">
              <p>
                {t('As someone who struggled to maintain a consistent workout routine due to busy schedules and limited equipment access, I created QuickFit to solve a problem I faced daily. I believe that fitness should adapt to your life, not the other way around.')}
              </p>
              
              <p>
                {t('The idea for QuickFit came during a particularly hectic period in my life when I couldn\'t make it to the gym regularly. I realized that what I needed wasn\'t another generic workout app, but something that could create truly personalized workouts based on what I actually had available at the moment.')}
              </p>
              
              <p>
                {t('Today, QuickFit helps thousands of people maintain their fitness journey, regardless of their circumstances. Whether you\'re a busy professional, a parent with limited time, or someone just starting their fitness journey, QuickFit is here to help you succeed.')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default About;
