import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CalendarIcon, Scale, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from '@/contexts/TranslationContext';

interface WeightEntry {
  id: string;
  weight: number;
  recorded_date: string;
  created_at: string;
}

const WeightTracker = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWeightEntries();
  }, [user]);

  const loadWeightEntries = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_date', { ascending: true });

      if (error) {
        console.error('Error loading weight entries:', error);
      } else {
        setWeightEntries(data || []);
      }
    } catch (error) {
      console.error('Error loading weight entries:', error);
    }
  };

  const deleteWeightEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('weight_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;

      toast({
        title: t('Entry deleted'),
        description: t('Weight entry has been deleted successfully.'),
      });
      
      loadWeightEntries();
    } catch (error) {
      console.error('Error deleting weight entry:', error);
      toast({
        title: t('Error'),
        description: t('Failed to delete weight entry. Please try again.'),
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !weight || !selectedDate) return;

    setLoading(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      
      // Check if entry already exists for this date
      const existingEntry = weightEntries.find(
        entry => entry.recorded_date === dateStr
      );

      if (existingEntry) {
        // Update existing entry
        const { error } = await supabase
          .from('weight_entries')
          .update({ weight: parseFloat(weight) })
          .eq('id', existingEntry.id);

        if (error) throw error;

        toast({
          title: "Weight updated",
          description: `Weight for ${format(selectedDate, 'PPP')} has been updated.`
        });
      } else {
        // Create new entry
        const { error } = await supabase
          .from('weight_entries')
          .insert({
            user_id: user.id,
            weight: parseFloat(weight),
            recorded_date: dateStr
          });

        if (error) throw error;

        toast({
          title: "Weight logged",
          description: `Weight for ${format(selectedDate, 'PPP')} has been recorded.`
        });
      }

      setWeight('');
      loadWeightEntries();
    } catch (error) {
      console.error('Error saving weight:', error);
      toast({
        title: "Error",
        description: "Failed to save weight entry. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const chartData = weightEntries.map(entry => ({
    date: format(new Date(entry.recorded_date), 'MMM dd'),
    weight: entry.weight,
    fullDate: entry.recorded_date
  }));

  // Get weight for selected date
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const selectedDateEntry = weightEntries.find(
    entry => entry.recorded_date === selectedDateStr
  );

  // Calculate trend
  const getTrend = () => {
    if (weightEntries.length < 2) return null;
    const latest = weightEntries[weightEntries.length - 1];
    const previous = weightEntries[weightEntries.length - 2];
    const diff = latest.weight - previous.weight;
    return diff;
  };

  const trend = getTrend();

  return (
    <div className="space-y-6">
      {/* Weight Entry Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            {t('Log Your Weight')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">{t('Date')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>{t('Pick a date')}</span>}
                    </Button>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                      className="pointer-events-auto"
                      disabled={(date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor="weight">{t('Weight (kg)')}</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="70.5"
                  value={selectedDateEntry ? selectedDateEntry.weight.toString() : weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
                />
              </div>
            </div>
            
            <Button type="submit" disabled={loading || !weight} className="w-full">
              {loading ? t('Saving...') : selectedDateEntry ? t('Update Weight') : t('Log Weight')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Weight Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{t('Weight Progress')}</CardTitle>
                {trend !== null && (
                  <div className="flex items-center gap-2 mt-2">
                    {trend > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : trend < 0 ? (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    ) : null}
                    <span className="text-sm text-muted-foreground">
                      {trend > 0 ? '+' : ''}{trend.toFixed(1)}kg from last entry
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis 
                    domain={['dataMin - 2', 'dataMax + 2']}
                    tickFormatter={(value) => `${value}kg`}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}kg`, t('Weight')]}
                    labelFormatter={(label) => `${t('Date')}: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Entries */}
      {weightEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {weightEntries.slice(-5).reverse().map((entry) => (
                <div key={entry.id} className="flex justify-between items-center p-2 bg-muted/50 rounded group">
                  <span>{format(new Date(entry.recorded_date), 'PPP')}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{entry.weight}kg</span>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Weight Entry</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this weight entry from {format(new Date(entry.recorded_date), 'PPP')}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteWeightEntry(entry.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WeightTracker;