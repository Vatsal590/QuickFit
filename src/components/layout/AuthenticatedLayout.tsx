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

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showFitnessProfile, setShowFitnessProfile] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfConditions, setShowTermsOfConditions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase.functions.invoke('delete-user-account');
      
      if (error) {
        console.error('Account deletion error:', error);
        toast({
          title: "Account deletion failed",
          description: error.message || "Please try again later.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Your account has been successfully deleted",
          description: "You will be redirected to the landing page.",
        });
        
        // Sign out and redirect
        await signOut();
      }
    } catch (error: any) {
      console.error('Account deletion error:', error);
      toast({
        title: "Account deletion failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const isActivePath = (path: string) => {
    if (path === '/home') {
      return location.pathname === '/' || location.pathname === '/home';
    }
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/home" className="text-2xl font-bold text-fitness-primary">
                QuickFit
              </Link>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex space-x-1">
              <Link to="/home">
                <Button 
                  variant={isActivePath('/home') ? "default" : "ghost"} 
                  size="sm"
                  className={isActivePath('/home') ? "bg-fitness-primary hover:bg-fitness-primary/90" : ""}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link to="/history">
                <Button 
                  variant={isActivePath('/history') ? "default" : "ghost"} 
                  size="sm"
                  className={isActivePath('/history') ? "bg-fitness-primary hover:bg-fitness-primary/90" : ""}
                >
                  <History className="h-4 w-4 mr-2" />
                  History
                </Button>
              </Link>
              <Link to="/about">
                <Button 
                  variant={isActivePath('/about') ? "default" : "ghost"} 
                  size="sm"
                  className={isActivePath('/about') ? "bg-fitness-primary hover:bg-fitness-primary/90" : ""}
                >
                  <Info className="h-4 w-4 mr-2" />
                  About
                </Button>
              </Link>
            </nav>

            {/* User Menu */}
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span className="hidden sm:inline">{user?.email}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setShowFitnessProfile(true)}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowPrivacyPolicy(true)}>
                    <Shield className="mr-2 h-4 w-4" />
                    Privacy Policy
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowTermsOfConditions(true)}>
                    <FileText className="mr-2 h-4 w-4" />
                    Terms of Conditions
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t bg-gray-50">
          <div className="flex justify-around py-2">
            <Link to="/home">
              <Button 
                variant={isActivePath('/home') ? "default" : "ghost"} 
                size="sm"
                className={`flex flex-col items-center h-auto py-2 px-3 ${
                  isActivePath('/home') ? "bg-fitness-primary hover:bg-fitness-primary/90 text-white" : ""
                }`}
              >
                <Home className="h-4 w-4 mb-1" />
                <span className="text-xs">Home</span>
              </Button>
            </Link>
            <Link to="/history">
              <Button 
                variant={isActivePath('/history') ? "default" : "ghost"} 
                size="sm"
                className={`flex flex-col items-center h-auto py-2 px-3 ${
                  isActivePath('/history') ? "bg-fitness-primary hover:bg-fitness-primary/90 text-white" : ""
                }`}
              >
                <History className="h-4 w-4 mb-1" />
                <span className="text-xs">History</span>
              </Button>
            </Link>
            <Link to="/about">
              <Button 
                variant={isActivePath('/about') ? "default" : "ghost"} 
                size="sm"
                className={`flex flex-col items-center h-auto py-2 px-3 ${
                  isActivePath('/about') ? "bg-fitness-primary hover:bg-fitness-primary/90 text-white" : ""
                }`}
              >
                <Info className="h-4 w-4 mb-1" />
                <span className="text-xs">About</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Dialogs */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <FitnessProfileForm
        isOpen={showFitnessProfile}
        onClose={() => setShowFitnessProfile(false)}
      />

      <PrivacyPolicy
        isOpen={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
      />

      <TermsOfConditions
        isOpen={showTermsOfConditions}
        onClose={() => setShowTermsOfConditions(false)}
      />
    </div>
  );
};

export default AuthenticatedLayout;