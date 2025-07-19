import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.10';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UserContext {
  id: string;
  email: string;
  lastUsed: string | null;
  workoutCount: number;
  lastWorkout: string | null;
  hasWorkoutPlan: boolean;
  hasCustomWorkouts: boolean;
}

const encouragementMessages = [
  "Ready to crush your fitness goals today?",
  "Your future self will thank you for working out today!",
  "Every workout brings you closer to your goals!",
  "Time to make today amazing with a quick workout!",
  "Your body is capable of amazing things. Let's prove it!",
  "Small steps today, big results tomorrow!",
  "Ready to feel energized and strong today?"
];

function getRandomEncouragement(): string {
  return encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
}

function getNotificationMessage(user: UserContext): string {
  const now = new Date();
  const lastUsed = user.lastUsed ? new Date(user.lastUsed) : null;
  const lastWorkout = user.lastWorkout ? new Date(user.lastWorkout) : null;
  
  // Check if they haven't worked out in a long time (more than 7 days)
  if (lastWorkout) {
    const daysSinceLastWorkout = Math.floor((now.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceLastWorkout > 7) {
      return "Haven't seen you in a while. Ready to workout today?";
    }
  }
  
  // Check if they've used it less than 3 times and stopped
  if (user.workoutCount > 0 && user.workoutCount < 3) {
    const daysSinceLastUsed = lastUsed ? Math.floor((now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60 * 24)) : 999;
    if (daysSinceLastUsed > 3) {
      return "You were on a workout streak before. Surely the workouts weren't too tiring, were they? Let's keep it going with your workout today!";
    }
  }
  
  // Check if they only use custom workouts but no 30-day plan
  if (user.hasCustomWorkouts && !user.hasWorkoutPlan) {
    return "You do know that you can create a free personalised 30 day plan? Try it out TODAY!";
  }
  
  // Default encouraging message
  return getRandomEncouragement();
}

async function getUserContexts(): Promise<UserContext[]> {
  // Get all users with their profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email, last_used');
    
  if (!profiles) return [];
  
  const userContexts: UserContext[] = [];
  
  for (const profile of profiles) {
    // Get workout count and last workout
    const { data: workouts } = await supabase
      .from('workouts')
      .select('created_at')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false });
    
    // Check if user has workout plans
    const { data: workoutPlans } = await supabase
      .from('workout_plans')
      .select('id')
      .eq('user_id', profile.id);
    
    const workoutCount = workouts?.length || 0;
    const lastWorkout = workouts && workouts.length > 0 ? workouts[0].created_at : null;
    const hasWorkoutPlan = (workoutPlans?.length || 0) > 0;
    const hasCustomWorkouts = workoutCount > 0;
    
    userContexts.push({
      id: profile.id,
      email: profile.email || '',
      lastUsed: profile.last_used,
      workoutCount,
      lastWorkout,
      hasWorkoutPlan,
      hasCustomWorkouts
    });
  }
  
  return userContexts;
}

async function sendPushNotification(user: UserContext, message: string): Promise<void> {
  // This is a placeholder for actual push notification implementation
  // You would typically use Web Push API, FCM, or another push service here
  console.log(`Sending notification to user ${user.email}: ${message}`);
  
  // For now, we'll just log the notification
  // In a real implementation, you would:
  // 1. Get the user's push subscription from a database
  // 2. Use Web Push API to send the notification
  // 3. Handle any errors and retry logic
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting daily notification job...');
    
    const userContexts = await getUserContexts();
    console.log(`Found ${userContexts.length} users to potentially notify`);
    
    const notifications = [];
    
    for (const user of userContexts) {
      if (!user.email) continue; // Skip users without email
      
      const message = getNotificationMessage(user);
      
      try {
        await sendPushNotification(user, message);
        notifications.push({
          userId: user.id,
          email: user.email,
          message,
          status: 'sent'
        });
      } catch (error) {
        console.error(`Failed to send notification to ${user.email}:`, error);
        notifications.push({
          userId: user.id,
          email: user.email,
          message,
          status: 'failed',
          error: error.message
        });
      }
    }
    
    console.log(`Notification job completed. Sent ${notifications.filter(n => n.status === 'sent').length}/${notifications.length} notifications`);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Daily notifications processed',
      stats: {
        total: notifications.length,
        sent: notifications.filter(n => n.status === 'sent').length,
        failed: notifications.filter(n => n.status === 'failed').length
      },
      notifications
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error) {
    console.error('Error in daily notifications:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);