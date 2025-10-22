import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface FoodPhotoUploadProps {
  onFoodLogged: () => void;
}

const FoodPhotoUpload: React.FC<FoodPhotoUploadProps> = ({ onFoodLogged }) => {
  const { user } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzedFoods, setAnalyzedFoods] = useState<any[]>([]);
  const [totals, setTotals] = useState<any>(null);
  const [mealType, setMealType] = useState<string>('');
  const [notes, setNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setSelectedImage(base64);
      await analyzeImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-food-image', {
        body: { imageData }
      });

      if (error) throw error;

      setAnalyzedFoods(data.foods || []);
      setTotals(data.totals || {});
      toast.success('Food analyzed successfully!');
    } catch (error: any) {
      console.error('Error analyzing food:', error);
      toast.error(error.message || 'Failed to analyze food image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveLog = async () => {
    if (!user || analyzedFoods.length === 0) return;

    try {
      const { error } = await supabase.from('food_logs').insert({
        user_id: user.id,
        image_url: selectedImage,
        foods: analyzedFoods,
        total_calories: totals.calories,
        total_protein: totals.protein,
        total_carbs: totals.carbs,
        total_fats: totals.fats,
        meal_type: mealType,
        notes: notes
      });

      if (error) throw error;

      toast.success('Meal logged successfully!');
      setSelectedImage(null);
      setAnalyzedFoods([]);
      setTotals(null);
      setMealType('');
      setNotes('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      onFoodLogged();
    } catch (error: any) {
      console.error('Error saving food log:', error);
      toast.error('Failed to save meal log');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Log Your Meal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="photo-upload">Upload Photo</Label>
          <div className="mt-2">
            <Input
              ref={fileInputRef}
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isAnalyzing}
              className="cursor-pointer"
            />
          </div>
        </div>

        {selectedImage && (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={selectedImage}
                alt="Selected food"
                className="w-full h-48 object-cover rounded-lg"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
            </div>

            {analyzedFoods.length > 0 && (
              <>
                <div className="space-y-2">
                  <h3 className="font-semibold">Detected Foods:</h3>
                  <div className="space-y-2">
                    {analyzedFoods.map((food, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg">
                        <div className="font-medium">{food.name}</div>
                        <div className="text-sm text-muted-foreground">Portion: {food.portion}</div>
                        <div className="text-sm grid grid-cols-4 gap-2 mt-1">
                          <span>🔥 {food.calories} cal</span>
                          <span>💪 {food.protein}g</span>
                          <span>🍞 {food.carbs}g</span>
                          <span>🥑 {food.fats}g</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-primary/10 rounded-lg">
                  <h3 className="font-semibold mb-2">Total Nutrition:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Calories</div>
                      <div className="text-lg font-bold">{Math.round(totals.calories)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Protein</div>
                      <div className="text-lg font-bold">{Math.round(totals.protein)}g</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Carbs</div>
                      <div className="text-lg font-bold">{Math.round(totals.carbs)}g</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Fats</div>
                      <div className="text-lg font-bold">{Math.round(totals.fats)}g</div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="meal-type">Meal Type</Label>
                  <Select value={mealType} onValueChange={setMealType}>
                    <SelectTrigger id="meal-type">
                      <SelectValue placeholder="Select meal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about this meal..."
                    rows={2}
                  />
                </div>

                <Button onClick={handleSaveLog} className="w-full" disabled={!mealType}>
                  Save Meal Log
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FoodPhotoUpload;
