import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAutoPushNotifications = () => {
  const { user } = useAuth();

  // VAPID public key
  const VAPID_PUBLIC_KEY = 'BJthRQ5myDjc7NvUpIAtvbsZVSXGPIsWQdGquzqP-rqyKxTpJMU5nHmJdIJDzgJC_mMuuHXhJEhpGg5u0UqxJlw';

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const autoSubscribeUser = async () => {
    // Check if push notifications are supported
    if (!('serviceWorker' in navigator && 'PushManager' in window) || !user) {
      return;
    }

    try {
      // Check if user is already subscribed
      const { data: existingSubscription } = await supabase
        .from('push_subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingSubscription) {
        return; // Already subscribed
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      // Check current permission
      let permission = Notification.permission;
      
      // If permission is default, request it
      if (permission === 'default') {
        permission = await Notification.requestPermission();
      }

      // If permission is granted, subscribe
      if (permission === 'granted') {
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });

        // Save subscription to database
        const subscriptionData = subscription.toJSON();
        await supabase
          .from('push_subscriptions')
          .upsert({
            user_id: user.id,
            endpoint: subscriptionData.endpoint!,
            p256dh_key: subscriptionData.keys!.p256dh,
            auth_key: subscriptionData.keys!.auth
          });

        console.log('Push notifications automatically enabled for user');
      }
    } catch (error) {
      console.log('Could not auto-enable push notifications:', error);
      // Silently fail - don't show error to user
    }
  };

  useEffect(() => {
    if (user) {
      // Delay subscription to avoid blocking initial app load
      setTimeout(autoSubscribeUser, 2000);
    }
  }, [user]);
};