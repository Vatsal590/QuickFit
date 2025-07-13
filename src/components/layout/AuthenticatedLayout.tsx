import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Home, History, User, Settings, LogOut, Menu, ChevronDown, Shield, FileText, Trash2, Info } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import FitnessProfileForm from '@/components/fitness/FitnessProfileForm';
import PrivacyPolicy from '@/components/legal/PrivacyPolicy';
import TermsOfConditions from '@/components/legal/TermsOfConditions';

// ----- LAZY LOAD CHATBOT -----
const Chatbot = React.lazy(() => import("../chat/Chatbot"));

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

// Update user activity in profiles table
const updateUserActivity = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ 
          last_used: new Date().toISOString(),
          last_active: new Date().toISOString() 
        })
        .eq('id', user.id);
      console.log('User activity tracked');
    }
  } catch (error) {
    console.error('Failed to track user activity:', error);
  }
};

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfConditions, setShowTermsOfConditions] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Track user activity whenever they interact with buttons
  const trackUserActivity = async () => {
    await updateUserActivity();
  };

  // Listen for external events to open fitness profile form
  React.useEffect(() => {
    const handleOpenFitnessProfileForm = () => {
      setShowProfileForm(true);
    };

    window.addEventListener('openFitnessProfileForm', handleOpenFitnessProfileForm);
    return () => {
      window.removeEventListener('openFitnessProfileForm', handleOpenFitnessProfileForm);
    };
  }, []);
  //.

  // Format the member since date
  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Unknown';

  const handleDeleteAccount = async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No valid session found');
      }

      const response = await fetch('/functions/v1/delete-user-account', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete account');
      }

      toast({
        title: "Account Deleted",
        description: "Your account and all data have been permanently deleted.",
      });

      // Sign out and redirect
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      {/* Professional Navigation Header */}
      <header className="glass-effect border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Brand Section */}
          <div className="text-center py-6 border-b border-border/30">
            <div className="flex items-center justify-center gap-3 animate-fade-in-up">
              <div className="relative">
                <img 
                  src="/lovable-uploads/1c5d9536-3ab1-4377-bc37-da68da0ce646.png" 
                  alt="QuickFit Logo" 
                  className="w-10 h-10 animate-pulse-glow"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-20 blur-xl"></div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                QuickFit
              </h1>
            </div>
            <p className="text-muted-foreground mt-2 text-sm animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              Professional Fitness Solutions
            </p>
          </div>
          
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-6 flex-1">
              
              {/* Modern Navigation */}
              <nav className="flex space-x-2 overflow-x-auto scrollbar-hide">
                <Link to="/home" className="flex-shrink-0" onClick={trackUserActivity}>
                  <Button 
                    variant={isActive('/home') ? 'default' : 'glass'} 
                    size="lg"
                    className="animate-slide-in-right"
                  >
                    <Home className="h-5 w-5 mr-3" />
                    <span>Dashboard</span>
                  </Button>
                </Link>

                <Link to="/history" className="flex-shrink-0" onClick={trackUserActivity}>
                  <Button 
                    variant={isActive('/history') ? 'default' : 'glass'} 
                    size="lg"
                    className="animate-slide-in-right" 
                    style={{animationDelay: '0.1s'}}
                  >
                    <History className="h-5 w-5 mr-3" />
                    <span>Analytics</span>
                  </Button>
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Professional Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="glass" 
                    size="lg" 
                    className="animate-scale-in hover:shadow-glow"
                    onClick={trackUserActivity}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="hidden md:inline font-medium">Account</span>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 glass-effect border border-border/50 shadow-xl" align="end">
                  <div className="p-6 bg-gradient-secondary rounded-t-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {user?.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Member since {memberSince}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <DropdownMenuItem asChild className="rounded-lg p-3 hover:bg-accent/50">
                      <Link to="/about" className="flex items-center w-full" onClick={trackUserActivity}>
                        <Info className="h-5 w-5 mr-3 text-primary" />
                        <span className="font-medium">About QuickFit</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => { setShowProfileForm(true); trackUserActivity(); }}
                      className="rounded-lg p-3 hover:bg-accent/50"
                    >
                      <Settings className="h-5 w-5 mr-3 text-primary" />
                      <span className="font-medium">Customize Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => { setShowPrivacyPolicy(true); trackUserActivity(); }}
                      className="rounded-lg p-3 hover:bg-accent/50"
                    >
                      <Shield className="h-5 w-5 mr-3 text-primary" />
                      <span className="font-medium">Privacy Policy</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => { setShowTermsOfConditions(true); trackUserActivity(); }}
                      className="rounded-lg p-3 hover:bg-accent/50"
                    >
                      <FileText className="h-5 w-5 mr-3 text-primary" />
                      <span className="font-medium">Terms & Conditions</span>
                    </DropdownMenuItem>
                    
                    <div className="h-px bg-border my-2"></div>
                    
                    <DropdownMenuItem 
                      onClick={() => { signOut(); trackUserActivity(); }}
                      className="rounded-lg p-3 hover:bg-accent/50"
                    >
                      <LogOut className="h-5 w-5 mr-3 text-primary" />
                      <span className="font-medium">Sign Out</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => { setShowDeleteDialog(true); trackUserActivity(); }}
                      className="rounded-lg p-3 hover:bg-destructive/10 text-destructive"
                    >
                      <Trash2 className="h-5 w-5 mr-3" />
                      <span className="font-medium">Delete Account</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Professional Layout */}
      <main className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 pointer-events-none"></div>
        <div className="relative z-10">
          {children}
        </div>
      </main>

      {/* Customize Form Modal */}
      <FitnessProfileForm 
        isOpen={showProfileForm}
        onClose={() => setShowProfileForm(false)}
      />

      {/* Privacy Policy Modal */}
      <PrivacyPolicy 
        isOpen={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
      />

      {/* Terms of Conditions Modal */}
      <TermsOfConditions 
        isOpen={showTermsOfConditions}
        onClose={() => setShowTermsOfConditions(false)}
      />

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete your account? This action cannot be undone and will:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Delete all your workout plans and history</li>
                <li>Remove your fitness profile</li>
                <li>Permanently delete your account</li>
                <li>Prevent you from signing in with this email again</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Floating Chatbot Button - dynamically loaded */}
      <React.Suspense fallback={null}>
        <Chatbot />
      </React.Suspense>
    </div>
  );
};

export default AuthenticatedLayout;
