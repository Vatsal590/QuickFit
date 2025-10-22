import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';

const FoodLogsList = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchLogs();
    }
  }, [user]);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('food_logs')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setLogs(data || []);
    } catch (error: any) {
      console.error('Error fetching logs:', error);
      toast.error('Failed to load food logs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (logId: string) => {
    try {
      const { error } = await supabase.from('food_logs').delete().eq('id', logId);
      if (error) throw error;
      
      setLogs(logs.filter(log => log.id !== logId));
      toast.success('Meal log deleted');
    } catch (error: any) {
      console.error('Error deleting log:', error);
      toast.error('Failed to delete meal log');
    }
  };

  if (isLoading) {
    return <Card><CardContent className="p-6">Loading...</CardContent></Card>;
  }

  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No meals logged yet. Start by uploading a photo!
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Meals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="p-4 border rounded-lg space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold capitalize">{log.meal_type || 'Meal'}</div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(log.created_at), 'MMM d, yyyy h:mm a')}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(log.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {log.image_url && (
              <img
                src={log.image_url}
                alt="Meal"
                className="w-full h-32 object-cover rounded"
              />
            )}

            <div className="grid grid-cols-4 gap-2 text-sm">
              <div>
                <div className="text-muted-foreground">Calories</div>
                <div className="font-semibold">{Math.round(log.total_calories)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Protein</div>
                <div className="font-semibold">{Math.round(log.total_protein)}g</div>
              </div>
              <div>
                <div className="text-muted-foreground">Carbs</div>
                <div className="font-semibold">{Math.round(log.total_carbs)}g</div>
              </div>
              <div>
                <div className="text-muted-foreground">Fats</div>
                <div className="font-semibold">{Math.round(log.total_fats)}g</div>
              </div>
            </div>

            {log.notes && (
              <div className="text-sm text-muted-foreground italic">{log.notes}</div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default FoodLogsList;
