
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Flame, Rocket } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface PremiumPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PremiumPlansModal = ({ isOpen, onClose }: PremiumPlansModalProps) => {
  const { user } = useAuth();

  const handleSubscribe = async (plan: 'premium' | 'ultra') => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    try {
      const price = plan === 'premium' ? 1499 : 1699; // €14.99 or €16.99 in cents
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan, price }
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      icon: <Sparkles className="h-6 w-6" />,
      features: [
        'Daily motivation',
        'Free fitness & wellness tips',
        'Community support'
      ],
      buttonText: 'Current Plan',
      buttonVariant: 'outline' as const,
      disabled: true
    },
    {
      name: 'Premium',
      price: '€14.99/month',
      icon: <Flame className="h-6 w-6" />,
      features: [
        'Everything in Basic, plus:',
        'Custom Workout Plan — made just for you',
        'Personalized Diet Plan — fits your body & goals',
        'Short Weekly Calls — quick, powerful chats to keep you on track'
      ],
      buttonText: 'Choose Premium',
      buttonVariant: 'default' as const,
      onSubscribe: () => handleSubscribe('premium')
    },
    {
      name: 'Ultra',
      price: '€16.99/month',
      icon: <Rocket className="h-6 w-6" />,
      features: [
        'Everything in Premium, plus:',
        'Access to My Personal Workouts — train exactly how I train',
        'Proven Lifestyle Tips — learn the mindset & habits to reach your goals faster',
        'Exclusive Advice — from fitness to productivity, for the whole you'
      ],
      buttonText: 'Choose Ultra',
      buttonVariant: 'default' as const,
      onSubscribe: () => handleSubscribe('ultra')
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-6">
            Choose Your Plan
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan, index) => (
            <div 
              key={plan.name}
              className={`p-6 rounded-lg border-2 ${
                index === 1 ? 'border-fitness-primary bg-fitness-primary/5' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                {plan.icon}
                <h3 className="text-xl font-bold">{plan.name}</h3>
              </div>
              
              <div className="text-2xl font-bold mb-4">{plan.price}</div>
              
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                variant={plan.buttonVariant}
                className="w-full"
                disabled={plan.disabled}
                onClick={plan.onSubscribe}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="text-2xl">👋</div>
            <div>
              <h4 className="font-bold text-lg mb-2">Meet Your Personal Coach:</h4>
              <p className="text-gray-700 mb-4">
                I'm not just your personal coach, but also a mentor. I've spent so much time in the gym that it can be called my second home. 
                I've had back and shoulder pains too. And I have gotten over that. This isn't about quick fixes — it's about building something real that actually lasts. 
                I'm here to make sure you don't do this alone.
              </p>
              <p className="font-semibold text-fitness-primary">
                Ready to start? Choose your plan and let's go. 💙
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumPlansModal;
