
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Crown, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  const { user, signOut } = useAuth();
  const { isSubscribed, subscriptionTier } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You've been signed out successfully.",
      });
      window.location.href = '/auth';
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-xl font-bold text-fitness-primary hover:bg-transparent"
              >
                QuickFit
              </Button>
            </div>

            <nav className="hidden md:flex items-center space-x-4">
              <Button
                variant={location.pathname === '/' ? 'default' : 'ghost'}
                onClick={() => navigate('/')}
                size="sm"
              >
                Workouts
              </Button>
              <Button
                variant={location.pathname === '/history' ? 'default' : 'ghost'}
                onClick={() => navigate('/history')}
                size="sm"
                className="flex items-center"
              >
                <History className="h-4 w-4 mr-2" />
                History
              </Button>
              <Button
                variant={location.pathname === '/subscription' ? 'default' : 'ghost'}
                onClick={() => navigate('/subscription')}
                size="sm"
                className="flex items-center"
              >
                <Crown className="h-4 w-4 mr-2" />
                {isSubscribed ? 'Premium' : 'Upgrade'}
              </Button>
            </nav>
            
            <div className="flex items-center space-x-4">
              {isSubscribed && (
                <div className="hidden sm:flex items-center bg-fitness-primary/10 text-fitness-primary px-3 py-1 rounded-full text-xs font-medium">
                  <Crown className="h-3 w-3 mr-1" />
                  {subscriptionTier === 'coach' ? 'Personal Coach' : 'Premium Coach'}
                </div>
              )}
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{user?.email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main>{children}</main>
    </div>
  );
};

export default AuthenticatedLayout;
