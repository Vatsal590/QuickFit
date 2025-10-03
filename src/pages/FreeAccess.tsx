import PageContainer from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FreeAccessSection } from '@/components/referral/FreeAccessSection';

const FreeAccess = () => {
  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Free <span className="text-fitness-primary">Access</span>
          </h1>
        </div>

        <FreeAccessSection />

        <Card className="bg-gradient-to-br from-fitness-primary/10 to-fitness-secondary/10 border-fitness-primary/20">
          <CardContent className="p-6 text-center">
            <p className="text-lg font-medium text-foreground">
              Refer <span className="text-fitness-primary font-bold">3 people</span> to see Vatsal's workout and diet plan.
            </p>
            <p className="text-lg font-medium text-foreground mt-2">
              Refer <span className="text-fitness-primary font-bold">6 people</span> for access AND a call with him!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Meet the Founder</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <img 
                src="/lovable-uploads/vatsal-agarwala-founder.jpg" 
                alt="Vatsal Agarwala" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-fitness-primary mb-2">Vatsal Agarwala</h3>
              <p className="text-muted-foreground mb-4">Founder & CEO, Age 15</p>
            </div>
            
            <div className="text-left max-w-3xl mx-auto space-y-4 text-muted-foreground">
              <p>
                QuickFit was founded by Vatsal Agarwala, a 15-year-old from Luxembourg with a deep 
                passion for fitness and helping others get started.
              </p>
              
              <p>
                Vatsal's journey began at just 13 years old, training in his home garage using nothing 
                but bodyweight exercises and a pair of spare car tyres as makeshift equipment. Determined 
                to push further, he slowly added a dumbbell and a pull-up bar to his routine, teaching 
                himself discipline and creativity along the way.
              </p>
              
              <p>
                At 14, Vatsal finally stepped into a real gym, where he transformed his self-taught 
                discipline into structured training. Now, at 15, he has built QuickFit — an app designed 
                to make it easier, friendlier, and more personal for anyone to begin their fitness journey, 
                just like he did.
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
