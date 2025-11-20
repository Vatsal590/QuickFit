
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Clock, Dumbbell, Activity, Heart, AlertTriangle } from 'lucide-react';
import { MuscleGroup, Equipment, IntensityLevel, TimeFrame, WorkoutFormData, BodyPain } from '@/types';

interface WorkoutFormProps {
  onSubmit: (formData: WorkoutFormData) => void;
  previousWorkouts?: string[];
}

const WorkoutForm = ({ onSubmit, previousWorkouts = [] }: WorkoutFormProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<WorkoutFormData>({
    time: 30,
    equipment: ["none"],
    muscleGroups: ["full body"],
    intensity: "moderate",
    bodyPains: []
  });

  const timeOptions: TimeFrame[] = [10, 20, 30, 45, 60];
  
  const equipmentOptions: { value: Equipment; label: string }[] = [
    { value: "none", label: "No Equipment" },
    { value: "dumbbells", label: "Dumbbells" },
    { value: "barbell", label: "Barbell" },
    { value: "kettlebell", label: "Kettlebell" },
    { value: "resistance bands", label: "Resistance Bands" },
    { value: "cable machine", label: "Cable Machine" },
    { value: "pull-up bar", label: "Pull-up Bar" }
  ];
  
  const muscleGroupOptions: { value: MuscleGroup; label: string }[] = [
    { value: "chest", label: "Chest" },
    { value: "back", label: "Back" },
    { value: "shoulders", label: "Shoulders" },
    { value: "legs", label: "Legs" },
    { value: "biceps", label: "Biceps" },
    { value: "triceps", label: "Triceps" },
    { value: "core", label: "Core" },
    { value: "full body", label: "Full Body" },
    { value: "cardio", label: "Cardio" }
  ];
  
  const intensityOptions: { value: IntensityLevel; label: string; description: string }[] = [
    { 
      value: "light", 
      label: "Light", 
      description: "Recovery or beginner friendly workout" 
    },
    { 
      value: "moderate", 
      label: "Moderate", 
      description: "Standard workout with balanced effort" 
    },
    { 
      value: "intense", 
      label: "Intense", 
      description: "Challenging workout with higher intensity" 
    }
  ];

  const bodyPainOptions: { value: BodyPain; label: string }[] = [
    { value: "knee pain", label: "Knee Pain" },
    { value: "shoulder pain", label: "Shoulder Pain" },
    { value: "hip pain", label: "Hip Pain" },
    { value: "lower back pain", label: "Lower Back Pain" },
    { value: "wrist pain", label: "Wrist Pain" },
    { value: "ankle pain", label: "Ankle Pain" }
  ];

  const handleTimeChange = (time: TimeFrame) => {
    setFormData(prev => ({ ...prev, time }));
  };

  const toggleEquipment = (equipment: Equipment) => {
    setFormData(prev => {
      // If it's "none", deselect all other options
      if (equipment === "none") {
        return { ...prev, equipment: prev.equipment.includes("none") ? [] : ["none"] };
      } else {
        // If not "none", remove "none" from selection and toggle the selected equipment
        const updatedEquipment = prev.equipment.filter(e => e !== "none");
        
        if (updatedEquipment.includes(equipment)) {
          return { 
            ...prev, 
            equipment: updatedEquipment.filter(e => e !== equipment) 
          };
        } else {
          return { ...prev, equipment: [...updatedEquipment, equipment] };
        }
      }
    });
  };

  const toggleMuscleGroup = (muscleGroup: MuscleGroup) => {
    setFormData(prev => {
      // If "full body" is selected, deselect other options
      if (muscleGroup === "full body") {
        return { 
          ...prev, 
          muscleGroups: prev.muscleGroups.includes("full body") ? [] : ["full body"] 
        };
      } else {
        // If not "full body", remove "full body" from selection and toggle the selected muscle group
        const updatedMuscleGroups = prev.muscleGroups.filter(mg => mg !== "full body");
        
        if (updatedMuscleGroups.includes(muscleGroup)) {
          return { 
            ...prev, 
            muscleGroups: updatedMuscleGroups.filter(mg => mg !== muscleGroup) 
          };
        } else {
          return { ...prev, muscleGroups: [...updatedMuscleGroups, muscleGroup] };
        }
      }
    });
  };

  const setIntensity = (intensity: IntensityLevel) => {
    setFormData(prev => ({ ...prev, intensity }));
  };

  const toggleBodyPain = (pain: BodyPain) => {
    setFormData(prev => {
      const currentPains = prev.bodyPains || [];
      if (currentPains.includes(pain)) {
        return { 
          ...prev, 
          bodyPains: currentPains.filter(p => p !== pain) 
        };
      } else {
        return { 
          ...prev, 
          bodyPains: [...currentPains, pain] 
        };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (formData.equipment.length === 0) {
      toast({
        title: "Equipment required",
        description: "Select at least one equipment option",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.muscleGroups.length === 0) {
      toast({
        title: "Muscle group required",
        description: "Select at least one muscle group to train",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Create Your Workout</CardTitle>
        <CardDescription>
          Tell us what you have available and we'll generate the perfect workout for you
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Time Available */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-fitness-primary" />
              <h3 className="font-medium text-lg">Time Available</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {timeOptions.map(time => (
                <Button
                  key={time}
                  type="button"
                  variant={formData.time === time ? "default" : "outline"}
                  onClick={() => handleTimeChange(time)}
                  className={formData.time === time ? "bg-fitness-primary hover:bg-fitness-primary/90" : ""}
                >
                  {time} min
                </Button>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Equipment */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-fitness-primary" />
              <h3 className="font-medium text-lg">Available Equipment</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {equipmentOptions.map(({ value, label }) => (
                <Button
                  key={value}
                  type="button"
                  variant={formData.equipment.includes(value) ? "default" : "outline"}
                  onClick={() => toggleEquipment(value)}
                  className={formData.equipment.includes(value) ? "bg-fitness-primary hover:bg-fitness-primary/90" : ""}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Muscle Groups */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-fitness-primary" />
              <h3 className="font-medium text-lg">What to Train Today</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {muscleGroupOptions.map(({ value, label }) => (
                <Button
                  key={value}
                  type="button"
                  variant={formData.muscleGroups.includes(value) ? "default" : "outline"}
                  onClick={() => toggleMuscleGroup(value)}
                  className={formData.muscleGroups.includes(value) ? "bg-fitness-primary hover:bg-fitness-primary/90" : ""}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Body Pains */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-fitness-primary" />
              <h3 className="font-medium text-lg">Any Body Pains?</h3>
            </div>
            <p className="text-sm text-gray-600">
              Select any areas where you experience pain. We'll customize your workout to avoid aggravating these areas.
            </p>
            <div className="flex flex-wrap gap-2">
              {bodyPainOptions.map(({ value, label }) => (
                <Button
                  key={value}
                  type="button"
                  variant={(formData.bodyPains || []).includes(value) ? "default" : "outline"}
                  onClick={() => toggleBodyPain(value)}
                  className={(formData.bodyPains || []).includes(value) ? "bg-fitness-primary hover:bg-fitness-primary/90" : ""}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Intensity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-fitness-primary" />
              <h3 className="font-medium text-lg">Workout Intensity</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {intensityOptions.map(({ value, label, description }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setIntensity(value)}
                  className={`
                    p-4 rounded-lg border-2 text-left transition-all
                    ${formData.intensity === value 
                      ? 'border-fitness-primary bg-fitness-primary/5' 
                      : 'border-gray-200 hover:border-fitness-primary/50'}
                  `}
                >
                  <h4 className="font-medium">{label}</h4>
                  <p className="text-sm text-gray-500">{description}</p>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-fitness-primary hover:bg-fitness-primary/90 text-white"
          >
            Generate Workout
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default WorkoutForm;
