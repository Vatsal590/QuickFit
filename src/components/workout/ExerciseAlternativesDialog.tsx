import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

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

interface ExerciseAlternativesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  exercises: Exercise[];
  equipment: string[];
}

const ExerciseAlternativesDialog = ({ isOpen, onClose, exercises, equipment }: ExerciseAlternativesDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [alternatives, setAlternatives] = useState<{ harder: ExerciseAlternative[]; easier: ExerciseAlternative[] } | null>(null);

  useEffect(() => {
    if (isOpen && exercises.length > 0) {
      fetchAlternatives();
    }
  }, [isOpen, exercises]);

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Exercise Difficulty Alternatives</DialogTitle>
          <DialogDescription>
            AI-powered suggestions for more or less challenging exercises
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-fitness-primary" />
            <span className="ml-3">Generating alternatives...</span>
          </div>
        ) : alternatives ? (
          <ScrollArea className="h-[500px] pr-4">
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
          </ScrollArea>
        ) : null}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseAlternativesDialog;
