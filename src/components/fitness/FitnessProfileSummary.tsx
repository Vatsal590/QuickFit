import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, User, Target, Calendar, Dumbbell, UtensilsCrossed, AlertCircle } from 'lucide-react';

interface FitnessProfileSummaryProps {
  profile: any;
  onContinue: () => void;
  onEdit: () => void;
}

const FitnessProfileSummary = ({ profile, onContinue, onEdit }: FitnessProfileSummaryProps) => {
  const bodyTypes = Array.isArray(profile.body_type) ? profile.body_type : [profile.body_type];
  const dietPreferences = profile.diet_preferences || [];
  const foodAllergies = profile.food_allergies || [];
  const tastePreferences = profile.taste_preferences || [];
  const equipment = profile.available_equipment || [];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 rounded-full p-3">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Profile Complete!</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Review your fitness profile below. When you're ready, we'll create your personalized 30-day workout plan.
        </p>
      </div>

      <div className="space-y-4">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-fitness-primary" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Height</p>
              <p className="font-semibold">{profile.height} cm</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Weight</p>
              <p className="font-semibold">{profile.weight} kg</p>
            </div>
            {profile.goal_weight && (
              <div>
                <p className="text-sm text-muted-foreground">Goal Weight</p>
                <p className="font-semibold">{profile.goal_weight} kg</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fitness Goal & Body Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-fitness-primary" />
              Fitness Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Fitness Goal</p>
              <Badge variant="secondary" className="capitalize text-base px-3 py-1">
                {profile.fitness_goal?.replace(/_/g, ' ')}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Body Type</p>
              <div className="flex flex-wrap gap-2">
                {bodyTypes.map((type: string) => (
                  <Badge key={type} variant="outline" className="capitalize">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workout Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-fitness-primary" />
              Workout Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Workout Days Per Week</p>
              <p className="font-semibold text-lg">{profile.workout_days_per_week} days</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Available Equipment</p>
              {equipment.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {equipment.map((item: string) => (
                    <Badge key={item} variant="secondary" className="capitalize">
                      <Dumbbell className="h-3 w-3 mr-1" />
                      {item}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Bodyweight only</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Nutrition Preferences */}
        {(dietPreferences.length > 0 || foodAllergies.length > 0 || tastePreferences.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5 text-fitness-primary" />
                Nutrition Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dietPreferences.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Diet Preferences</p>
                  <div className="flex flex-wrap gap-2">
                    {dietPreferences.map((pref: string) => (
                      <Badge key={pref} variant="outline">
                        {pref}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {foodAllergies.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Food Allergies</p>
                  <div className="flex flex-wrap gap-2">
                    {foodAllergies.map((allergy: string) => (
                      <Badge key={allergy} variant="destructive" className="capitalize">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {tastePreferences.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Cuisine Preferences</p>
                  <div className="flex flex-wrap gap-2">
                    {tastePreferences.map((taste: string) => (
                      <Badge key={taste} variant="secondary">
                        {taste}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onEdit}
          className="flex-1"
        >
          Edit Profile
        </Button>
        <Button
          onClick={onContinue}
          className="flex-1 bg-fitness-primary hover:bg-fitness-primary/90"
        >
          Generate 30-Day Plan
        </Button>
      </div>
    </div>
  );
};

export default FitnessProfileSummary;
