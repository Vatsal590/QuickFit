import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.10';
import webpush from 'npm:web-push@3.6.7';
import { Resend } from 'npm:resend@4.0.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const resendApiKey = Deno.env.get('RESEND_API_KEY')!;

// VAPID keys for Web Push
const VAPID_PUBLIC_KEY = 'BJthRQ5myDjc7NvUpIAtvbsZVSXGPIsWQdGquzqP-rqyKxTpJMU5nHmJdIJDzgJC_mMuuHXhJEhpGg5u0UqxJlw';
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!;

// Configure web-push
webpush.setVapidDetails(
  'mailto:support@quickfit.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = new Resend(resendApiKey);

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

async function sendEmailNotification(user: UserContext, message: string): Promise<void> {
  try {
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%); padding: 40px 20px; text-align: center; }
            .logo { color: white; font-size: 32px; font-weight: bold; margin: 0; }
            .content { padding: 40px 20px; }
            .message { font-size: 18px; color: #333; line-height: 1.6; margin-bottom: 30px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="logo">💪 QuickFit</h1>
            </div>
            <div class="content">
              <p class="message">${message}</p>
              <p style="text-align: center;">
                <a href="https://quickfit.lovable.app/home" class="cta-button">Start Your Workout</a>
              </p>
              <p style="color: #666; margin-top: 30px;">
                Keep crushing your fitness goals! Every workout counts. 🔥
              </p>
            </div>
            <div class="footer">
              <p>QuickFit - Your Personal Fitness Companion</p>
              <p>Stay strong, stay consistent! 💪</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { error } = await resend.emails.send({
      from: 'QuickFit <onboarding@resend.dev>',
      to: [user.email],
      subject: "Don't forget your QuickFit workout for today!",
      html: emailHtml,
    });

    if (error) {
      console.error(`Failed to send email to ${user.email}:`, error);
      throw error;
    }

    console.log(`Email sent successfully to ${user.email}`);
  } catch (error) {
    console.error(`Error sending email notification to ${user.email}:`, error);
    throw error;
  }
}

async function sendPushNotification(user: UserContext, message: string): Promise<void> {
  try {
    // Get user's push subscriptions
    const { data: subscriptions } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', user.id);

    if (!subscriptions || subscriptions.length === 0) {
      console.log(`No push subscriptions found for user ${user.email}`);
      return;
    }

    const notificationPayload = JSON.stringify({
      title: 'QuickFit Reminder',
      body: message,
      icon: '/favicon.ico',
      badge: '/favicon.ico'
    });

    // Send notifications to all user's subscriptions
    const promises = subscriptions.map(async (subscription) => {
      try {
        const pushSubscription = {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh_key,
            auth: subscription.auth_key
          }
        };

        await webpush.sendNotification(pushSubscription, notificationPayload);
        console.log(`Push notification sent successfully to ${user.email}`);
      } catch (error) {
        console.error(`Failed to send push notification to subscription ${subscription.id}:`, error);
        
        // If subscription is invalid (410 error), remove it from database
        if (error.statusCode === 410) {
          await supabase
            .from('push_subscriptions')
            .delete()
            .eq('id', subscription.id);
          console.log(`Removed invalid subscription ${subscription.id}`);
        }
        throw error;
      }
    });

    await Promise.allSettled(promises);
  } catch (error) {
    console.error(`Error sending push notification to ${user.email}:`, error);
    throw error;
  }
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
      
      const message = "Don't forget your QuickFit workout for today!";
      
      try {
        // Send both email and push notifications
        await Promise.allSettled([
          sendEmailNotification(user, message),
          sendPushNotification(user, message)
        ]);
        
        notifications.push({
          userId: user.id,
          email: user.email,
          message,
          status: 'sent'
        });
      } catch (error) {
        console.error(`Failed to send notifications to ${user.email}:`, error);
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