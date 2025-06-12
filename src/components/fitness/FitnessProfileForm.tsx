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
import WorkoutPlanGenerator from './WorkoutPlanGenerator';
import { Target, Dumbbell, Calendar } from 'lucide-react';

interface FitnessProfileFormProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanGenerated?: (plan: any) => void;
}

const FitnessProfileForm = ({ isOpen, onClose, onPlanGenerated }: FitnessProfileFormProps) => {
  const { toast } = useToast();
  const { profile, createProfile, updateProfile } = useFitnessProfile();
  const [showPlanGenerator, setShowPlanGenerator] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    fitness_goal: '',
    body_type: '',
    workout_days_per_week: '',
    available_equipment: [] as string[]
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        height: profile.height.toString(),
        weight: profile.weight.toString(),
        fitness_goal: profile.fitness_goal,
        body_type: profile.body_type,
        workout_days_per_week: profile.workout_days_per_week.toString(),
        available_equipment: profile.available_equipment || []
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.height || !formData.weight || !formData.fitness_goal || 
        !formData.body_type || !formData.workout_days_per_week) {
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
        fitness_goal: formData.fitness_goal,
        body_type: formData.body_type,
        workout_days_per_week: parseInt(formData.workout_days_per_week),
        available_equipment: formData.available_equipment
      };

      let savedProfile;
      
      if (profile) {
        savedProfile = await updateProfile(profileData);
        toast({
          title: "Profile updated",
          description: "Your fitness profile has been updated successfully!"
        });
      } else {
        savedProfile = await createProfile(profileData);
        toast({
          title: "Profile created",
          description: "Your fitness profile has been created! You can now generate personalized workout plans."
        });
      }
      
      // Set the updated profile and show plan generator
      setUpdatedProfile({ ...profile, ...profileData });
      setShowPlanGenerator(true);
      
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePlanGeneratorClose = () => {
    setShowPlanGenerator(false);
    onClose();
  };

  const handlePlanGenerated = (plan: any) => {
    if (onPlanGenerated) {
      onPlanGenerated(plan);
    }
    setShowPlanGenerator(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen && !showPlanGenerator} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{profile ? 'Update' : 'Create'} Your Fitness Profile</DialogTitle>
            <DialogDescription>
              Tell us about yourself to get personalized 30-day workout plans
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="170"
                      value={formData.height}
                      onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="70"
                      value={formData.weight}
                      onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
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
                  Fitness Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={formData.fitness_goal} onValueChange={(value) => setFormData(prev => ({ ...prev, fitness_goal: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                    <SelectItem value="fat_loss">Fat Loss</SelectItem>
                    <SelectItem value="athlete_training">Train Like an Athlete</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Body Type */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Body Type</CardTitle>
                <CardDescription>Choose the body type that best describes you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      value: 'ectomorph',
                      title: 'Ectomorph',
                      description: 'Naturally thin, fast metabolism, difficulty gaining weight',
                      image: '🧍‍♂️'
                    },
                    {
                      value: 'mesomorph',
                      title: 'Mesomorph',
                      description: 'Athletic build, gains muscle easily, balanced metabolism',
                      image: '💪'
                    },
                    {
                      value: 'endomorph',
                      title: 'Endomorph',
                      description: 'Rounder physique, slower metabolism, gains weight easily',
                      image: '🧍‍♀️'
                    }
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, body_type: type.value }))}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        formData.body_type === type.value 
                          ? 'border-fitness-primary bg-fitness-primary/5' 
                          : 'border-gray-200 hover:border-fitness-primary/50'
                      }`}
                    >
                      <div className="text-2xl mb-2">{type.image}</div>
                      <h4 className="font-medium">{type.title}</h4>
                      <p className="text-sm text-gray-500">{type.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Workout Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Workout Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="workout-days">Days per week you can work out</Label>
                <Select value={formData.workout_days_per_week} onValueChange={(value) => setFormData(prev => ({ ...prev, workout_days_per_week: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select workout frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                      <SelectItem key={days} value={days.toString()}>
                        {days} day{days > 1 ? 's' : ''} per week
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Available Equipment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Dumbbell className="h-5 w-5" />
                  Available Equipment
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
                        {equipment === 'none' ? 'No Equipment' : equipment.replace('_', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-fitness-primary hover:bg-fitness-primary/90">
                {profile ? 'Update Profile' : 'Create Profile'}
              </Button>
            </div>
          </form>
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
