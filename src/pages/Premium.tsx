import PageContainer from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Check } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

const Premium = () => {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* QuickFit Pro Card */}
        <div className="flex justify-center">
          <Card className="relative overflow-hidden border-2 border-amber-500 shadow-lg shadow-amber-500/10 max-w-md w-full">
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center text-xs font-bold py-1">
              <Crown className="h-3 w-3 inline mr-1" />
              {t('RECOMMENDED')}
            </div>
            <CardHeader className="pb-4 pt-8">
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-500" />
                QuickFit Pro
              </CardTitle>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-bold">€6.99</span>
                <span className="text-muted-foreground text-sm">/mo</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  {t('Get a workout and diet plan made for you, by Vatsal himself')}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  {t('1-on-1 call with Vatsal')}
                </li>
              </ul>
              <Button
                asChild
                size="lg"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 shadow-lg"
              >
                <a
                  href="https://buy.stripe.com/cNidRa8FTdql0I694Zds402"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('Get Pro Access')}
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Founder Section */}
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

export default Premium;
