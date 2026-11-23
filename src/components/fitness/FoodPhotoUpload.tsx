import React, { useState, useRef, useEffect } from 'react';
import { rememberFact } from '@/lib/memory';
import { setCoachContext, compactContext } from '@/lib/coachContext';
import { Camera, Upload, Loader2, Trash2, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';

interface FoodPhotoUploadProps {
  onFoodLogged: () => void;
}

const FoodPhotoUpload: React.FC<FoodPhotoUploadProps> = ({ onFoodLogged }) => {
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzedFoods, setAnalyzedFoods] = useState<any[]>([]);
  const [totals, setTotals] = useState<any>(null);
  const [healthSuggestions, setHealthSuggestions] = useState<string[]>([]);
  const [mealType, setMealType] = useState<string>('');
  const [notes, setNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setCoachContext('food', analyzedFoods.length ? { source: 'food-photo', status: 'estimated, not logged', foods: compactContext(analyzedFoods), totals, mealType, notes, healthSuggestions } : null);
  }, [analyzedFoods, totals, mealType, notes, healthSuggestions]);
  useEffect(() => () => setCoachContext('food', null), []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error(t('Please select an image file'));
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
    toast.loading(t('Analyzing your food... This may take a moment'), { id: 'analyzing' });
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-food-image', {
        body: { imageData, language }
      });

      if (error) throw error;

      setAnalyzedFoods(data.foods || []);
      setHealthSuggestions(data.healthSuggestions || []);
      
      // Save scanned food to database immediately (even if not logged)
      if (user && data.foods && data.foods.length > 0) {
        const totalsData = data.foods.reduce(
          (acc: any, food: any) => ({
            calories: acc.calories + (parseFloat(food.calories) || 0),
            protein: acc.protein + (parseFloat(food.protein) || 0),
            carbs: acc.carbs + (parseFloat(food.carbs) || 0),
            fats: acc.fats + (parseFloat(food.fats) || 0),
          }),
          { calories: 0, protein: 0, carbs: 0, fats: 0 }
        );

        await supabase.from('scanned_foods').insert({
          user_id: user.id,
          image_url: imageData,
          foods: data.foods,
          total_calories: totalsData.calories,
          total_protein: totalsData.protein,
          total_carbs: totalsData.carbs,
          total_fats: totalsData.fats,
          logged: false
        });
      }
      
      toast.dismiss('analyzing');
      toast.success(t('Food analyzed successfully!'));
    } catch (error: any) {
      console.error('Error analyzing food:', error);
      toast.dismiss('analyzing');
      toast.error(t('Hmm...Maybe try uploading a different picture?'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (analyzedFoods.length > 0) {
      const newTotals = analyzedFoods.reduce(
        (acc, food) => ({
          calories: acc.calories + (parseFloat(food.calories) || 0),
          protein: acc.protein + (parseFloat(food.protein) || 0),
          carbs: acc.carbs + (parseFloat(food.carbs) || 0),
          fats: acc.fats + (parseFloat(food.fats) || 0),
          sodium: acc.sodium + (parseFloat(food.sodium) || 0),
          calcium: acc.calcium + (parseFloat(food.calcium) || 0),
          iron: acc.iron + (parseFloat(food.iron) || 0),
          fiber: acc.fiber + (parseFloat(food.fiber) || 0),
          sugar: acc.sugar + (parseFloat(food.sugar) || 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fats: 0, sodium: 0, calcium: 0, iron: 0, fiber: 0, sugar: 0 }
      );
      setTotals(newTotals);
    }
  }, [analyzedFoods]);

  const updateFood = (index: number, field: string, value: string) => {
    setAnalyzedFoods(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeFood = (index: number) => {
    setAnalyzedFoods(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveLog = async () => {
    if (!user || analyzedFoods.length === 0) return;

    try {
      const { data: logData, error } = await supabase.from('food_logs').insert({
        user_id: user.id,
        image_url: selectedImage,
        foods: analyzedFoods,
        total_calories: totals?.calories || 0,
        total_protein: totals?.protein || 0,
        total_carbs: totals?.carbs || 0,
        total_fats: totals?.fats || 0,
        meal_type: mealType,
        notes: notes
      }).select().single();

      if (error) throw error;

      // Update scanned_foods to mark as logged
      await supabase.from('scanned_foods')
        .update({ logged: true, food_log_id: logData.id })
        .eq('user_id', user.id)
        .eq('logged', false)
        .order('created_at', { ascending: false })
        .limit(1);

      const names = analyzedFoods.map((f: any) => f.name).filter(Boolean).join(', ');
      setCoachContext('food', { source: 'food-photo', status: 'logged; nutrition estimates', foods: compactContext(analyzedFoods), totals, mealType, notes }, true);
      rememberFact('meal', `Logged ${mealType || 'meal'}: ${names} (about ${Math.round(totals?.calories || 0)} kcal)${notes ? `. Note: ${notes}` : ''}`.slice(0, 1000));
      toast.success(t('Meal logged successfully!'));
      resetForm();
      onFoodLogged();
    } catch (error: any) {
      console.error('Error saving food log:', error);
      toast.error(t('Failed to save meal log'));
    }
  };

  const resetForm = () => {
    setSelectedImage(null);
    setAnalyzedFoods([]);
    setTotals(null);
    setHealthSuggestions([]);
    setMealType('');
    setNotes('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          {t('Log Your Meal')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="photo-upload">{t('Upload Photo')}</Label>
            <div className="mt-2">
              <Input
                ref={fileInputRef}
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={isAnalyzing}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
              >
                <Upload className="h-4 w-4 mr-2" />
                {t('Choose File')}
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="camera-capture">{t('Take Photo')}</Label>
            <div className="mt-2">
              <Input
                ref={cameraInputRef}
                id="camera-capture"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                disabled={isAnalyzing}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => cameraInputRef.current?.click()}
                disabled={isAnalyzing}
              >
                <Camera className="h-4 w-4 mr-2" />
                {t('Take Photo')}
              </Button>
            </div>
          </div>
        </div>

        {selectedImage && (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={selectedImage}
                alt={t('Selected food')}
                className="w-full h-48 object-cover rounded-lg"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 glass rounded-lg flex flex-col items-center justify-center gap-3">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <div className="text-center space-y-1">
                    <p className="font-semibold text-foreground">{t('Analyzing your food...')}</p>
                    <p className="text-sm text-muted-foreground">{t('This may take a moment')}</p>
                  </div>
                </div>
              )}
            </div>

            {isAnalyzing ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="space-y-2">
                  <div className="h-24 bg-muted rounded-lg"></div>
                  <div className="h-24 bg-muted rounded-lg"></div>
                </div>
                <div className="h-32 bg-muted rounded-lg"></div>
              </div>
            ) : analyzedFoods.length > 0 && (
              <>
                <div className="space-y-2">
                  <h3 className="font-semibold">{t('Detected Foods (Edit as needed)')}:</h3>
                  <div className="space-y-3">
                    {analyzedFoods.map((food, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="flex-1 space-y-2">
                            <div>
                              <Label className="text-xs">{t('Food Name')}</Label>
                              <Input
                                value={food.name}
                                onChange={(e) => updateFood(index, 'name', e.target.value)}
                                className="h-8"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">{t('Portion')}</Label>
                              <Input
                                value={food.portion}
                                onChange={(e) => updateFood(index, 'portion', e.target.value)}
                                className="h-8"
                              />
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFood(index)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <div>
                            <Label className="text-xs">{t('Calories')}</Label>
                            <Input
                              type="number"
                              value={food.calories}
                              onChange={(e) => updateFood(index, 'calories', e.target.value)}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">{t('Protein')} (g)</Label>
                            <Input
                              type="number"
                              value={food.protein}
                              onChange={(e) => updateFood(index, 'protein', e.target.value)}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">{t('Carbs')} (g)</Label>
                            <Input
                              type="number"
                              value={food.carbs}
                              onChange={(e) => updateFood(index, 'carbs', e.target.value)}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">{t('Fats')} (g)</Label>
                            <Input
                              type="number"
                              value={food.fats}
                              onChange={(e) => updateFood(index, 'fats', e.target.value)}
                              className="h-8"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {totals && (
                  <div className="p-4 bg-primary/10 rounded-lg space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">{t('Macronutrients')}:</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">{t('Calories')}</div>
                          <div className="text-lg font-bold">{Math.round(totals.calories)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">{t('Protein')}</div>
                          <div className="text-lg font-bold">{Math.round(totals.protein)}g</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">{t('Carbs')}</div>
                          <div className="text-lg font-bold">{Math.round(totals.carbs)}g</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">{t('Fats')}</div>
                          <div className="text-lg font-bold">{Math.round(totals.fats)}g</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{t('Micronutrients')}:</h3>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-3 text-sm">
                        <div>
                          <div className="text-muted-foreground">{t('Sodium')}</div>
                          <div className="text-lg font-bold">{Math.round(totals.sodium)}mg</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">{t('Calcium')}</div>
                          <div className="text-lg font-bold">{Math.round(totals.calcium)}mg</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">{t('Iron')}</div>
                          <div className="text-lg font-bold">{Math.round(totals.iron * 10) / 10}mg</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">{t('Fiber')}</div>
                          <div className="text-lg font-bold">{Math.round(totals.fiber)}g</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">{t('Sugar')}</div>
                          <div className="text-lg font-bold">{Math.round(totals.sugar)}g</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {healthSuggestions.length > 0 && (
                  <div className="p-4 bg-accent/20 border border-accent/30 rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-accent-foreground">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      {t('Make It Healthier')}
                    </h3>
                    <ul className="space-y-2">
                      {healthSuggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary font-medium">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <Label htmlFor="meal-type">{t('Meal Type')}</Label>
                  <Select value={mealType} onValueChange={setMealType}>
                    <SelectTrigger id="meal-type">
                      <SelectValue placeholder={t('Select meal type')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">{t('Breakfast')}</SelectItem>
                      <SelectItem value="lunch">{t('Lunch')}</SelectItem>
                      <SelectItem value="dinner">{t('Dinner')}</SelectItem>
                      <SelectItem value="snack">{t('Snack')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">{t('Notes (optional)')}</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t('Add any notes about this meal...')}
                    rows={2}
                  />
                </div>

                <Button onClick={handleSaveLog} className="w-full" disabled={!mealType}>
                  {t('Save Meal Log')}
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
