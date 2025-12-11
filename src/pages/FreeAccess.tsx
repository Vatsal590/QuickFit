import PageContainer from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FreeAccessSection } from '@/components/referral/FreeAccessSection';

const FreeAccess = () => {
  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Unlock <span className="text-fitness-primary">Vatsal's Plans</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Get exclusive access to Vatsal's personal workout and diet plans that helped him achieve his transformation
          </p>
        </div>

        <FreeAccessSection />

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Meet the Founder</CardTitle>
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
            <p className="text-muted-foreground mb-4">Founder & CEO, Age 15</p>
            
            <div className="text-left max-w-3xl mx-auto space-y-4 text-muted-foreground">
              <p>
                QuickFit was created by Vatsal Agarwala, a 15-year-old student in Luxembourg. Vatsal began his fitness journey at the age of 13. After trying multiple fitness apps, watching countless YouTube videos, and reading numerous fitness articles, he ended up even more confused. However, the best thing he did was not giving up. He did what suited his body, pushed to the limits, ate healthy, and the result is above. That's why he created QuickFit - to help people stay active and healthy, whether they're beginners, office goers or anyone for that matter.
              </p>
              
              <p className="text-fitness-primary font-medium text-center mt-6">
                QuickFit isn't just an app; it's a reflection of Vatsal's belief that anyone, anywhere, 
                with any resources can start getting stronger and healthier today.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default FreeAccess;
