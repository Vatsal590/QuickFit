
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
            {t('About QuickFit')}
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            {t('About QuickFit Intro')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-fitness-primary">{t('Our Mission')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {t('Our Mission Description')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-fitness-primary">{t('What Makes Us Different')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-600 space-y-2">
                <li>• {t('Instant workout generation based on your available time')}</li>
                <li>• {t('Equipment-flexible routines from bodyweight to full gym')}</li>
                <li>• {t('30-day structured workout plans')}</li>
                <li>• {t('AI-powered fitness coaching and support')}</li>
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
              <h3 className="text-xl font-semibold text-fitness-primary mb-2">Vatsal Agarwala</h3>
              <p className="text-gray-500 mb-4">{t('Founder & CEO, Age 15')}</p>
            </div>
            
            <div className="text-left max-w-3xl mx-auto space-y-4 text-gray-600">
              <p>{t('About Founder Paragraph 1')}</p>
              <p>{t('About Founder Paragraph 2')}</p>
              <p>{t('About Founder Paragraph 3')}</p>
              <p className="text-fitness-primary font-medium text-center mt-6">
                {t('About Founder Closing')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default About;
