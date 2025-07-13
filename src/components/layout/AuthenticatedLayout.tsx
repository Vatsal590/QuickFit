import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
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
  const { language, setLanguage, t } = useTranslation();
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
  }) : t('Unknown') || 'Unknown';

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
    <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* QuickFit Title */}
          <div className="text-center py-3 border-b border-gray-100">
            <h1 className="text-2xl md:text-3xl font-bold text-fitness-primary flex items-center justify-center gap-2">
              <img 
                src="/lovable-uploads/1c5d9536-3ab1-4377-bc37-da68da0ce646.png" 
                alt="QuickFit Logo" 
                className="w-8 h-8"
              />
              QuickFit
            </h1>
          </div>
          
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 md:space-x-8 flex-1 min-w-0">
              
              {/* Navigation - scrollable on mobile */}
              <nav className="flex space-x-2 md:space-x-4 overflow-x-auto scrollbar-hide flex-1 min-w-0">
                <Link to="/home" className="flex-shrink-0" onClick={trackUserActivity}>
                  <Button 
                    variant={isActive('/home') ? 'default' : 'ghost'} 
                    size="sm"
                    className={isActive('/home') ? 'bg-fitness-primary hover:bg-fitness-primary/90' : ''}
                  >
                    <Home className="h-4 w-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">{t('Home')}</span>
                  </Button>
                </Link>

                <Link to="/history" className="flex-shrink-0" onClick={trackUserActivity}>
                  <Button 
                    variant={isActive('/history') ? 'default' : 'ghost'} 
                    size="sm"
                    className={isActive('/history') ? 'bg-fitness-primary hover:bg-fitness-primary/90' : ''}
                  >
                    <History className="h-4 w-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">{t('History')}</span>
                  </Button>
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex-shrink-0" onClick={trackUserActivity}>
                    <User className="h-4 w-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">{t('Profile')}</span>
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-white" align="end">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.email}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {t('Member since')} {memberSince}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/about" className="flex items-center w-full" onClick={trackUserActivity}>
                      <Info className="h-4 w-4 mr-2" />
                      {t('About')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setShowProfileForm(true); trackUserActivity(); }}>
                    <Settings className="h-4 w-4 mr-2" />
                    {t('Customize')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setShowPrivacyPolicy(true); trackUserActivity(); }}>
                    <Shield className="h-4 w-4 mr-2" />
                    {t('Privacy Policy')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setShowTermsOfConditions(true); trackUserActivity(); }}>
                    <FileText className="h-4 w-4 mr-2" />
                    {t('Terms of Conditions')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { signOut(); trackUserActivity(); }}>
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('Sign Out')}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => { setShowDeleteDialog(true); trackUserActivity(); }}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t('Remove Account')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

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
            <AlertDialogTitle>{t('Delete Account')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('Are you sure you want to permanently delete your account? This action cannot be undone and will:')}
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>{t('Delete all your workout plans and history')}</li>
                <li>{t('Remove your fitness profile')}</li>
                <li>{t('Permanently delete your account')}</li>
                <li>{t('Prevent you from signing in with this email again')}</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t('Cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? t('Deleting...') : t('Delete Account')}
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
