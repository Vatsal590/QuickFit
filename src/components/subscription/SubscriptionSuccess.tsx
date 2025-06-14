
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Crown, Mail } from 'lucide-react';

interface SubscriptionSuccessProps {
  plan: string;
  onClose: () => void;
}

const SubscriptionSuccess = ({ plan, onClose }: SubscriptionSuccessProps) => {
  const planName = plan === 'premium' ? 'Premium' : 'Ultra';
  
  return (
    <div className="space-y-6">
      {/* Contact Information Banner */}
      <div className="bg-fitness-primary/10 border border-fitness-primary/20 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-fitness-primary" />
          <div>
            <h3 className="font-semibold text-fitness-primary">Contact Your Personal Coach</h3>
            <p className="text-sm text-gray-700">
              Email <strong>vatsal.agarwala123@gmail.com</strong> to discuss your goals and get your custom diet and workout plan.
            </p>
          </div>
        </div>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            Welcome to {planName}!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Your subscription has been activated successfully. You now have access to all {planName} features.
          </p>
          
          <div className="bg-fitness-primary/10 p-4 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="h-5 w-5 text-fitness-primary" />
              <span className="font-semibold text-fitness-primary">{planName} Plan Active</span>
            </div>
            <p className="text-sm text-gray-600">
              Start exploring your personalized fitness journey!
            </p>
          </div>
          
          <Button onClick={onClose} className="w-full">
            Get Started
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionSuccess;
