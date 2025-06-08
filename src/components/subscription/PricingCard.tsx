
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, Star } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  onSubscribe: () => void;
  isCurrentPlan?: boolean;
}

const PricingCard = ({ 
  title, 
  price, 
  description, 
  features, 
  isPopular, 
  onSubscribe, 
  isCurrentPlan 
}: PricingCardProps) => {
  return (
    <Card className={`relative ${isPopular ? 'border-fitness-primary shadow-lg scale-105' : ''} ${isCurrentPlan ? 'border-green-500' : ''}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-fitness-primary text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Star className="h-3 w-3" />
            Most Popular
          </div>
        </div>
      )}
      
      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Crown className="h-3 w-3" />
            Your Plan
          </div>
        </div>
      )}

      <CardHeader className="text-center">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">${price}</span>
          <span className="text-gray-500">/month</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <Button 
          onClick={onSubscribe}
          className={`w-full ${isPopular ? 'bg-fitness-primary hover:bg-fitness-primary/90' : ''}`}
          variant={isCurrentPlan ? 'outline' : isPopular ? 'default' : 'outline'}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? 'Current Plan' : 'Subscribe Now'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
