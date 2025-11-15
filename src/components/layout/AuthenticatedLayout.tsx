import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
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
import { AppSidebar } from "./AppSidebar";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import FitnessProfileForm from '@/components/fitness/FitnessProfileForm';
import PrivacyPolicy from '@/components/legal/PrivacyPolicy';
import TermsOfConditions from '@/components/legal/TermsOfConditions';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Trash2, User, Shield, FileText } from 'lucide-react';
import Chatbot from '@/components/chat/Chatbot';
import { MenuIcon } from '@/components/ui/menu-icon';
import { ReferralCongrats } from '@/components/referral/ReferralCongrats';
import { RewardCongrats } from '@/components/referral/RewardCongrats';
import { useRewardPoints } from '@/hooks/useRewardPoints';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <AuthenticatedContent>
        {children}
      </AuthenticatedContent>
    </SidebarProvider>
  );
};

const AuthenticatedContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { toggleSidebar } = useSidebar();
  const [showFitnessProfile, setShowFitnessProfile] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsConditions, setShowTermsConditions] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { showCongrats, setShowCongrats } = useRewardPoints();

  const getDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No valid session found');
      }

      const response = await fetch('https://tlliijookodviezygwqk.supabase.co/functions/v1/delete-user-account', {
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
      setShowDeleteDialog(false);
    }
  };

  // Listen for fitness profile form event
  React.useEffect(() => {
    const handleOpenFitnessProfile = () => {
      setShowFitnessProfile(true);
    };

    window.addEventListener('openFitnessProfileForm', handleOpenFitnessProfile);
    return () => {
      window.removeEventListener('openFitnessProfileForm', handleOpenFitnessProfile);
    };
  }, []);

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-background border-b border-border h-16 flex items-center justify-between px-4 
             fixed top-0 left-0 right-0 z-50 pt-[env(safe-area-inset-top)]">
          <div className="flex items-center gap-4">
            <Button 
              onClick={toggleSidebar}
              variant="outline"
              size="icon"
              className="flex items-center justify-center h-10 w-10 border-2 border-fitness-primary/30 hover:bg-fitness-primary/10 hover:border-fitness-primary transition-all"
              aria-label="Toggle menu"
            >
              <MenuIcon className="h-6 w-6 text-fitness-primary" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2">
            <img 
              src="/lovable-uploads/1c5d9536-3ab1-4377-bc37-da68da0ce646.png" 
              alt="QuickFit Logo" 
              className="w-8 h-8"
            />
            <h1 className="text-xl md:text-2xl font-bold text-fitness-primary">QuickFit</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background border border-border z-50" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{getDisplayName()}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowFitnessProfile(true)}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowPrivacyPolicy(true)}>
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Privacy Policy</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowTermsConditions(true)}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Terms of Service</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete Account</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto mt-16">
          {children}
        </main>
      </div>

      {/* Dialogs */}
      <Dialog open={showFitnessProfile} onOpenChange={setShowFitnessProfile}>
        <DialogContent className="bg-background border border-border">
          <DialogHeader>
            <DialogTitle>Fitness Profile</DialogTitle>
            <DialogDescription>
              Update your fitness information to get better workout recommendations.
            </DialogDescription>
          </DialogHeader>
          <FitnessProfileForm isOpen={showFitnessProfile} onClose={() => setShowFitnessProfile(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showPrivacyPolicy} onOpenChange={setShowPrivacyPolicy}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-background border border-border">
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
          </DialogHeader>
          <PrivacyPolicy isOpen={showPrivacyPolicy} onClose={() => setShowPrivacyPolicy(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showTermsConditions} onOpenChange={setShowTermsConditions}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-background border border-border">
          <DialogHeader>
            <DialogTitle>Terms of Service</DialogTitle>
          </DialogHeader>
          <TermsOfConditions isOpen={showTermsConditions} onClose={() => setShowTermsConditions(false)} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-background border border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Chatbot */}
      <Chatbot />
      
      {/* Referral Congrats */}
      <ReferralCongrats />
      
      {/* Reward Congrats */}
      <RewardCongrats open={showCongrats} onOpenChange={setShowCongrats} />
    </div>
  );
};

export default AuthenticatedLayout;
