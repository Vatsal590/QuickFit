import { Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export const PushNotificationToggle = () => {
  const { isSupported, isSubscribed, isLoading, subscribeUser, unsubscribeUser } = usePushNotifications();

  if (!isSupported) {
    return (
      <div className="text-sm text-muted-foreground">
        Push notifications not supported in this browser
      </div>
    );
  }

  const handleToggle = async () => {
    if (isSubscribed) {
      await unsubscribeUser();
    } else {
      await subscribeUser();
    }
  };

  return (
    <Button
      variant={isSubscribed ? "default" : "outline"}
      onClick={handleToggle}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isSubscribed ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
      {isLoading ? 'Loading...' : isSubscribed ? 'Disable Notifications' : 'Enable Notifications'}
    </Button>
  );
};