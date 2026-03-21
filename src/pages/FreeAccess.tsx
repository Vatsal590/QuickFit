import PageContainer from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FreeAccessSection } from '@/components/referral/FreeAccessSection';
import { useTranslation } from '@/contexts/TranslationContext';

const FreeAccess = () => {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto space-y-8">

        <FreeAccessSection />

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">{t('Meet the Founder')}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="w-full mb-6 rounded-xl shadow-md overflow-hidden">
              <img 
                src="/lovable-uploads/vatsal-agarwala-founder.jpg" 
                alt="Vatsal Agarwala - Founder of QuickFit" 
                className="w-full h-auto object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold text-fitness-primary mb-2">Vatsal Agarwala</h3>
            <p className="text-muted-foreground mb-4">{t('Founder & CEO')}</p>
            
            <div className="text-left max-w-3xl mx-auto space-y-4 text-muted-foreground">
              <p>
                {t("Hi, I'm Vatsal Agarwala, the founder and CEO of QuickFit. I've dedicated myself to transforming how people approach fitness. My journey began when I realized that most fitness apps were either too complicated, too expensive, or simply didn't deliver results.")}
              </p>
              <p>
                {t("I created QuickFit to solve these problems - combining AI-powered workout generation, personalized diet plans, and real-time tracking into one seamless experience.")}
              </p>
              <p>
                {t("What makes QuickFit different is our commitment to making fitness accessible to everyone. Whether you're just starting out or you're an experienced athlete, our AI adapts to your unique needs, equipment, and goals.")}
              </p>
              
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default FreeAccess;
