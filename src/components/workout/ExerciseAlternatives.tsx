import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  duration?: string;
}

interface ExerciseAlternative {
  name: string;
  difficulty: string;
  description: string;
}

interface ExerciseAlternativesProps {
  exercises: Exercise[];
  equipment: string[];
}

const ExerciseAlternatives = ({ exercises, equipment }: ExerciseAlternativesProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [alternatives, setAlternatives] = useState<{ harder: ExerciseAlternative[]; easier: ExerciseAlternative[] } | null>(null);

  useEffect(() => {
    if (exercises.length > 0) {
      fetchAlternatives();
    }
  }, [exercises]);

  const fetchAlternatives = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('exercise-alternatives', {
        body: { exercises, equipment }
      });

      if (error) throw error;

      setAlternatives(data);
    } catch (error) {
      console.error('Error fetching alternatives:', error);
      toast({
        title: "Error",
        description: "Failed to generate exercise alternatives. Please try again.",
        variant: "destructive"
      });
      setAlternatives({ harder: [], easier: [] });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>AI Exercise Alternatives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-fitness-primary" />
            <span className="ml-3">Generating alternatives...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!alternatives) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>AI Exercise Alternatives</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          AI-powered suggestions for more or less challenging exercises
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="harder" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="harder" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              More Difficult
            </TabsTrigger>
            <TabsTrigger value="easier" className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Less Difficult
            </TabsTrigger>
          </TabsList>

          <TabsContent value="harder" className="mt-4 space-y-3">
            {alternatives.harder.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No harder alternatives available</p>
            ) : (
              alternatives.harder.map((exercise, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-fitness-primary" />
                      {exercise.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <div className="font-semibold text-fitness-primary mb-1">
                        Difficulty: {exercise.difficulty}
                      </div>
                      <p className="text-muted-foreground">{exercise.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="easier" className="mt-4 space-y-3">
            {alternatives.easier.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No easier alternatives available</p>
            ) : (
              alternatives.easier.map((exercise, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-green-600" />
                      {exercise.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <div className="font-semibold text-green-600 mb-1">
                        Difficulty: {exercise.difficulty}
                      </div>
                      <p className="text-muted-foreground">{exercise.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ExerciseAlternatives;
