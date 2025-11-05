import { supabase } from '@/integrations/supabase/client';

export interface UserActivity {
  action: string;
  page?: string;
  details?: Record<string, any>;
}

export class ActivityTracker {
  private static instance: ActivityTracker;
  private userId: string | null = null;

  private constructor() {
    this.initializeUser();
  }

  public static getInstance(): ActivityTracker {
    if (!ActivityTracker.instance) {
      ActivityTracker.instance = new ActivityTracker();
    }
    return ActivityTracker.instance;
  }

  private async initializeUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      this.userId = user?.id || null;
    } catch (error) {
      console.error('Failed to initialize user for activity tracking:', error);
    }
  }

  public async trackActivity(action: string, page?: string, details?: Record<string, any>) {
    try {
      // Ensure we have a user ID
      if (!this.userId) {
        const { data: { user } } = await supabase.auth.getUser();
        this.userId = user?.id || null;
      }

      if (!this.userId) {
        console.log('No authenticated user for activity tracking');
        return;
      }

      // Insert into user_activities table
      await supabase
        .from('user_activities')
        .insert({
          user_id: this.userId,
          action,
          page,
          details
        });

      // Update profiles table with last activity
      await supabase
        .from('profiles')
        .update({ 
          last_used: new Date().toISOString(),
          last_active: new Date().toISOString() 
        })
        .eq('id', this.userId);

      // Also call the database function for consistency
      await supabase.rpc('update_user_last_used');

      console.log('Activity tracked:', { action, page, details, userId: this.userId });
    } catch (error) {
      console.error('Failed to track activity:', error);
    }
  }

  public async trackButtonClick(buttonName: string, page?: string, additionalData?: Record<string, any>) {
    return this.trackActivity(`button_click_${buttonName}`, page, additionalData);
  }

  public async trackPageView(page: string) {
    return this.trackActivity('page_view', page);
  }

  public async trackWorkoutAction(action: string, workoutData?: Record<string, any>) {
    return this.trackActivity(`workout_${action}`, 'home', workoutData);
  }

  public async trackNavigation(from: string, to: string) {
    return this.trackActivity('navigation', undefined, { from, to });
  }
}

// Export a singleton instance
export const activityTracker = ActivityTracker.getInstance();