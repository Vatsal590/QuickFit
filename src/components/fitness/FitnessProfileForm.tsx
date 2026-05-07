
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useFitnessProfile } from '../../hooks/useFitnessProfile';
import { useTranslation } from '@/contexts/TranslationContext';
import WorkoutPlanGenerator from './WorkoutPlanGenerator';
import { Target, Dumbbell, Calendar } from 'lucide-react';
import ectomorphImage from '@/assets/ectomorph-body-type.jpg';
import mesomorphImage from '@/assets/mesomorph-body-type.jpg';
import endomorphImage from '@/assets/endomorph-body-type.jpg';

import FitnessProfileSummary from './FitnessProfileSummary';

interface FitnessProfileFormProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanGenerated?: (plan: any) => void;
}

const FitnessProfileForm = ({ isOpen, onClose, onPlanGenerated }: FitnessProfileFormProps) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { profile, createProfile, updateProfile } = useFitnessProfile();
  const [showPlanGenerator, setShowPlanGenerator] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    goal_weight: '',
    fitness_goal: '',
    body_type: [] as string[],
    workout_days_per_week: '',
    available_equipment: [] as string[],
    diet_preferences: [] as string[],
    food_allergies: [] as string[],
    taste_preferences: [] as string[]
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        height: profile.height.toString(),
        weight: profile.weight.toString(),
        goal_weight: profile.goal_weight ? profile.goal_weight.toString() : '',
        fitness_goal: profile.fitness_goal,
        body_type: Array.isArray(profile.body_type) ? profile.body_type : [profile.body_type],
        workout_days_per_week: profile.workout_days_per_week.toString(),
        available_equipment: profile.available_equipment || [],
        diet_preferences: profile.diet_preferences || [],
        food_allergies: profile.food_allergies || [],
        taste_preferences: profile.taste_preferences || []
      });
    }
  }, [profile]);

  const equipmentOptions = [
    'none',
    'dumbbells',
    'barbell',
    'kettlebell',
    'resistance bands',
    'cable machine',
    'bench',
    'pull-up bar'
  ];

  const handleEquipmentChange = (equipment: string, checked: boolean) => {
    if (equipment === 'none') {
      setFormData(prev => ({
        ...prev,
        available_equipment: checked ? ['none'] : []
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        available_equipment: checked 
          ? [...prev.available_equipment.filter(e => e !== 'none'), equipment]
          : prev.available_equipment.filter(e => e !== equipment)
      }));
    }
  };

  const handleBodyTypeChange = (bodyType: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      body_type: checked 
        ? [...prev.body_type.filter(t => t !== bodyType), bodyType].slice(0, 2) // Max 2 selections
        : prev.body_type.filter(t => t !== bodyType)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.height || !formData.weight || !formData.goal_weight || !formData.fitness_goal || 
        formData.body_type.length === 0 || !formData.workout_days_per_week) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (formData.available_equipment.length === 0) {
      toast({
        title: "Equipment required",
        description: "Please select at least one equipment option",
        variant: "destructive"
      });
      return;
    }

    try {
      const profileData = {
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        goal_weight: parseFloat(formData.goal_weight),
        fitness_goal: formData.fitness_goal,
        body_type: formData.body_type,
        workout_days_per_week: parseInt(formData.workout_days_per_week),
        available_equipment: formData.available_equipment,
        diet_preferences: formData.diet_preferences,
        food_allergies: formData.food_allergies,
        taste_preferences: formData.taste_preferences
      };

      let savedProfileRecord: any;
      
      if (profile) {
        savedProfileRecord = await updateProfile(profileData);
        toast({
          title: "Profile updated",
          description: "Your fitness profile has been updated successfully!"
        });
      } else {
        savedProfileRecord = await createProfile(profileData);
        toast({
          title: "Profile created",
          description: "Your fitness profile has been created! You can now generate personalized workout plans."
        });
      }
      
      // Normalize and use the saved profile (ensures we have the new profile id on first try)
      const normalizedProfile = {
        ...savedProfileRecord,
        body_type: Array.isArray(savedProfileRecord?.body_type)
          ? savedProfileRecord.body_type
          : (() => { try { return JSON.parse(savedProfileRecord?.body_type ?? '[]'); } catch { return profileData.body_type; } })(),
        diet_preferences: savedProfileRecord?.diet_preferences ?? profileData.diet_preferences ?? [],
        food_allergies: savedProfileRecord?.food_allergies ?? profileData.food_allergies ?? [],
        taste_preferences: savedProfileRecord?.taste_preferences ?? profileData.taste_preferences ?? []
      };
      
      // Set the updated profile and show summary page
      setUpdatedProfile(normalizedProfile);
      setShowSummary(true);
      
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSummaryEdit = () => {
    setShowSummary(false);
  };

  const handleSummaryContinue = () => {
    setShowSummary(false);
    setShowPlanGenerator(true);
  };

  const handlePlanGeneratorClose = () => {
    setShowPlanGenerator(false);
    setShowSummary(false);
    onClose();
  };

  const handlePlanGenerated = (plan: any) => {
    if (onPlanGenerated) {
      onPlanGenerated(plan);
    }
    setShowPlanGenerator(false);
    setShowSummary(false);
    onClose();
  };

  return (
    <>
      {/* Fitness Profile Form */}
      <Dialog open={isOpen && !showSummary && !showPlanGenerator} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{profile ? t('Update Your Fitness Profile') : t('Create Your Fitness Profile')}</DialogTitle>
            <DialogDescription>
              {t('Tell us about yourself to get personalized 30-day workout plans')}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('Basic Information')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="height">{t('Height (cm)')}</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="170"
                      value={formData.height}
                      onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">{t('Current Weight (kg)')}</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="70"
                      value={formData.weight}
                      onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="goal_weight">{t('Goal Weight (kg)')}</Label>
                    <Input
                      id="goal_weight"
                      type="number"
                      placeholder="75"
                      value={formData.goal_weight}
                      onChange={(e) => setFormData(prev => ({ ...prev, goal_weight: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fitness Goal */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {t('Fitness Goal')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={formData.fitness_goal} onValueChange={(value) => setFormData(prev => ({ ...prev, fitness_goal: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('Select your primary goal')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="muscle_gain">{t('Muscle Gain')}</SelectItem>
                    <SelectItem value="fat_loss">{t('Fat Loss')}</SelectItem>
                    <SelectItem value="athlete_training">{t('Train Like an Athlete')}</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Body Type */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('Body Type')}</CardTitle>
                <CardDescription>
                  {t('Most people fall into 2 categories, not just one. Select up to 2 body types that best describe you.')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      value: 'ectomorph',
                      title: t('Ectomorph'),
                      description: t('Naturally thin, fast metabolism, difficulty gaining weight'),
                      image: ectomorphImage
                    },
                    {
                      value: 'mesomorph',
                      title: t('Mesomorph'),
                      description: t('Athletic build, gains muscle easily, balanced metabolism'),
                      image: mesomorphImage
                    },
                    {
                      value: 'endomorph',
                      title: t('Endomorph'),
                      description: t('Rounder physique, slower metabolism, gains weight easily'),
                      image: endomorphImage
                    }
                  ].map((type) => (
                    <div key={type.value} className="relative">
                      <button
                        type="button"
                        onClick={() => handleBodyTypeChange(type.value, !formData.body_type.includes(type.value))}
                        disabled={!formData.body_type.includes(type.value) && formData.body_type.length >= 2}
                        className={`p-4 rounded-lg border-2 text-left transition-all w-full ${
                          formData.body_type.includes(type.value)
                            ? 'border-fitness-primary bg-fitness-primary/5' 
                            : formData.body_type.length >= 2
                            ? 'border-gray-200 opacity-50 cursor-not-allowed'
                            : 'border-gray-200 hover:border-fitness-primary/50'
                        }`}
                      >
                        <div className="w-16 h-20 mx-auto mb-2 overflow-hidden rounded">
                          <img 
                            src={type.image} 
                            alt={type.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="font-medium">{type.title}</h4>
                        <p className="text-sm text-gray-500">{type.description}</p>
                      </button>
                      {formData.body_type.includes(type.value) && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-fitness-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Workout Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {t('Workout Schedule')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="workout-days">{t('Days per week you can work out')}</Label>
                <Select value={formData.workout_days_per_week} onValueChange={(value) => setFormData(prev => ({ ...prev, workout_days_per_week: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('Select workout frequency')} />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                      <SelectItem key={days} value={days.toString()}>
                        {days === 1 ? t('1 day per week') : `${days} ${t('days per week')}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Diet Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('Diet Preferences')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">{t('Dietary Restrictions')}</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {['Vegetarian', 'Vegan', 'Ketogenic', 'Paleo', 'Lactose Intolerant', 'Gluten-Free'].map((diet) => (
                      <div key={diet} className="flex items-center space-x-2">
                        <Checkbox
                          id={`diet-${diet}`}
                          checked={formData.diet_preferences.includes(diet)}
                          onCheckedChange={(checked) => {
                            setFormData(prev => ({
                              ...prev,
                              diet_preferences: checked 
                                ? [...prev.diet_preferences, diet]
                                : prev.diet_preferences.filter(d => d !== diet)
                            }));
                          }}
                        />
                        <Label htmlFor={`diet-${diet}`} className="text-sm font-normal">
                          {t(diet)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">{t('Food Allergies')}</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {['Nuts', 'Dairy', 'Eggs', 'Shellfish', 'Soy', 'Wheat', 'Fish', 'Sesame'].map((allergy) => (
                      <div key={allergy} className="flex items-center space-x-2">
                        <Checkbox
                          id={`allergy-${allergy}`}
                          checked={formData.food_allergies.includes(allergy)}
                          onCheckedChange={(checked) => {
                            setFormData(prev => ({
                              ...prev,
                              food_allergies: checked 
                                ? [...prev.food_allergies, allergy]
                                : prev.food_allergies.filter(a => a !== allergy)
                            }));
                          }}
                        />
                        <Label htmlFor={`allergy-${allergy}`} className="text-sm font-normal">
                          {t(allergy)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">{t('Cuisine Preferences')}</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {['American', 'Italian', 'Indian', 'Mexican', 'Japanese', 'Mediterranean', 'Thai'].map((cuisine) => (
                      <div key={cuisine} className="flex items-center space-x-2">
                        <Checkbox
                          id={cuisine}
                          checked={formData.taste_preferences.includes(cuisine)}
                          onCheckedChange={(checked) => {
                            setFormData(prev => ({
                              ...prev,
                              taste_preferences: checked 
                                ? [...prev.taste_preferences, cuisine]
                                : prev.taste_preferences.filter(c => c !== cuisine)
                            }));
                          }}
                        />
                        <Label htmlFor={cuisine} className="text-sm font-normal">
                          {t(cuisine)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Equipment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Dumbbell className="h-5 w-5" />
                  {t('Available Equipment')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {equipmentOptions.map((equipment) => (
                    <div key={equipment} className="flex items-center space-x-2">
                      <Checkbox
                        id={equipment}
                        checked={formData.available_equipment.includes(equipment)}
                        onCheckedChange={(checked) => handleEquipmentChange(equipment, checked as boolean)}
                      />
                      <Label htmlFor={equipment} className="text-sm font-normal capitalize">
                        {equipment === 'none' ? t('No Equipment') : t(equipment.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()))}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                {t('Cancel')}
              </Button>
              <Button type="submit" className="flex-1 bg-fitness-primary hover:bg-fitness-primary/90">
                {profile ? t('Update Profile') : t('Create Profile')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Profile Summary Page */}
      <Dialog open={showSummary} onOpenChange={() => setShowSummary(false)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {updatedProfile && (
            <FitnessProfileSummary
              profile={updatedProfile}
              onEdit={handleSummaryEdit}
              onContinue={handleSummaryContinue}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Workout Plan Generator Dialog */}
      {updatedProfile && (
        <WorkoutPlanGenerator
          isOpen={showPlanGenerator}
          onClose={handlePlanGeneratorClose}
          profile={updatedProfile}
          onPlanGenerated={handlePlanGenerated}
        />
      )}
    </>
  );
};

export default FitnessProfileForm;

