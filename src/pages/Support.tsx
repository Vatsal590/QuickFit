import { Heart, Code, Palette, Megaphone, Bot, ExternalLink } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/contexts/TranslationContext";

const Support = () => {
  const { t } = useTranslation();

  const supportReasons = [
    {
      icon: Code,
      titleKey: "Better Workout Logic",
      descriptionKey: "Making the workout algorithms smarter and more personalized for your fitness journey"
    },
    {
      icon: Palette,
      titleKey: "Improving UI/UX",
      descriptionKey: "Creating a more beautiful and intuitive experience for all users"
    },
    {
      icon: Megaphone,
      titleKey: "Publicity & Marketing",
      descriptionKey: "Spreading the word to help more people achieve their fitness goals"
    },
    {
      icon: Bot,
      titleKey: "AI Functions",
      descriptionKey: "Ensuring our AI features work properly and continue to improve"
    }
  ];

  const handleDonate = () => {
    window.open("https://www.gofundme.com/f/15-year-old-creates-an-ai-fitness-website", "_blank");
  };

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <Heart className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">{t('Support QuickFit')}</h1>
          <p className="text-lg text-muted-foreground">
            {t('Every donation makes a big difference! Your support helps us continue building the best free fitness platform for beginners.')}
          </p>
        </div>

        <Button 
          size="lg" 
          variant="gradient"
          className="text-lg px-8 py-6"
          onClick={handleDonate}
        >
          <Heart className="mr-2 h-5 w-5" />
          {t('Donate on GoFundMe')}
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>

        <div className="pt-8">
          <h2 className="text-xl font-semibold mb-6">{t('How Your Donation Helps')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supportReasons.map((reason, index) => (
              <Card key={index} className="glass-card text-left">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <reason.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{t(reason.titleKey)}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{t(reason.descriptionKey)}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted-foreground pt-4">
          {t('Thank you for believing in QuickFit!')} 💪
        </p>
      </div>
    </PageContainer>
  );
};

export default Support;
