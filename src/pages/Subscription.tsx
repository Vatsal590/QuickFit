
import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import PricingCard from '../components/subscription/PricingCard';
import { useSubscription } from '../contexts/SubscriptionContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, FileText, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Subscription = () => {
  const { isSubscribed, subscriptionTier, createCheckoutSession, openCustomerPortal } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubscribe = async (tier: 'coach' | 'premium') => {
    try {
      // These would be your actual Stripe price IDs
      const priceIds = {
        coach: 'price_coach_monthly', // $15.99/month
        premium: 'price_premium_monthly' // $17.99/month
      };
      
      await createCheckoutSession(priceIds[tier]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleManageSubscription = async () => {
    try {
      await openCustomerPortal();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open subscription management. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Workouts
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Upgrade Your <span className="text-fitness-primary">Fitness Journey</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Take your fitness to the next level with personalized coaching and premium features.
              Get direct access to professional guidance tailored to your goals.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Free Plan */}
          <PricingCard
            title="Free Plan"
            price="0"
            description="Perfect for getting started"
            features={[
              "Unlimited workout generation",
              "Basic exercise library",
              "Workout history tracking",
              "Mobile app access"
            ]}
            onSubscribe={() => {}}
            isCurrentPlan={!isSubscribed}
          />

          {/* Coach Plan */}
          <PricingCard
            title="Personal Coach"
            price="15.99"
            description="Weekly coaching calls with Nina"
            features={[
              "Everything in Free Plan",
              "Weekly 1-on-1 coaching calls",
              "Goal setting and progress review",
              "Personalized workout adjustments",
              "Direct messaging support",
              "Priority customer support"
            ]}
            isPopular={true}
            onSubscribe={() => handleSubscribe('coach')}
            isCurrentPlan={isSubscribed && subscriptionTier === 'coach'}
          />

          {/* Premium Plan */}
          <PricingCard
            title="Premium Coach"
            price="17.99"
            description="Complete fitness transformation"
            features={[
              "Everything in Personal Coach",
              "In-depth fitness analysis",
              "Custom meal planning",
              "Body composition tracking",
              "Nutrition guidance",
              "Supplement recommendations",
              "24/7 chat support"
            ]}
            onSubscribe={() => handleSubscribe('premium')}
            isCurrentPlan={isSubscribed && subscriptionTier === 'premium'}
          />
        </div>

        {/* What You Get Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-center mb-8">What Makes Our Coaching Special</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-fitness-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-fitness-primary" />
              </div>
              <h3 className="font-semibold mb-2">Personal Attention</h3>
              <p className="text-gray-600 text-sm">
                Weekly one-on-one calls with Nina to discuss your progress, challenges, and adjust your fitness plan.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-fitness-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-fitness-primary" />
              </div>
              <h3 className="font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600 text-sm">
                Schedule your coaching calls at times that work for you. Evening, morning, or weekend slots available.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-fitness-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-fitness-primary" />
              </div>
              <h3 className="font-semibold mb-2">Custom Plans</h3>
              <p className="text-gray-600 text-sm">
                Get personalized meal plans and detailed fitness analysis based on your specific goals and lifestyle.
              </p>
            </div>
          </div>
        </div>

        {/* Manage Subscription */}
        {isSubscribed && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h3 className="font-semibold text-green-800 mb-2">
              You're subscribed to the {subscriptionTier === 'coach' ? 'Personal Coach' : 'Premium Coach'} plan
            </h3>
            <p className="text-green-700 mb-4">
              Enjoy your premium features and coaching sessions!
            </p>
            <Button
              onClick={handleManageSubscription}
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              Manage Subscription
            </Button>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default Subscription;
