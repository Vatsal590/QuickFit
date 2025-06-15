import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Home, History, User, Settings, LogOut, Menu, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FitnessProfileForm from '@/components/fitness/FitnessProfileForm';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [showProfileForm, setShowProfileForm] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Format the member since date
  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Unknown';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* QuickFit Title */}
          <div className="text-center py-3 border-b border-gray-100">
            <h1 className="text-2xl md:text-3xl font-bold text-fitness-primary">
              QuickFit
            </h1>
          </div>
          
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 md:space-x-8 flex-1 min-w-0">
              <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
                <img 
                  src="/lovable-uploads/1c5d9536-3ab1-4377-bc37-da68da0ce646.png" 
                  alt="QuickFit Logo" 
                  className="w-8 h-8"
                />
              </Link>
              
              {/* Navigation - scrollable on mobile */}
              <nav className="flex space-x-2 md:space-x-4 overflow-x-auto scrollbar-hide flex-1 min-w-0">
                <Link to="/" className="flex-shrink-0">
                  <Button 
                    variant={isActive('/') ? 'default' : 'ghost'} 
                    size="sm"
                    className={isActive('/') ? 'bg-fitness-primary hover:bg-fitness-primary/90' : ''}
                  >
                    <Home className="h-4 w-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Home</span>
                  </Button>
                </Link>
                
                {/* Menu Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex-shrink-0">
                      <Menu className="h-4 w-4 mr-1 md:mr-2" />
                      <span className="hidden sm:inline">Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 bg-white" align="start">
                    <DropdownMenuItem asChild>
                      <Link to="/history" className="flex items-center w-full">
                        <History className="h-4 w-4 mr-2" />
                        History
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowProfileForm(true)}>
                      <Settings className="h-4 w-4 mr-2" />
                      Customize
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex-shrink-0">
                    <User className="h-4 w-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Profile</span>
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-white" align="end">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.email}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Member since {memberSince}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
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

      {/* Floating Chatbot Button */}
      <React.Suspense fallback={null}>
        {/* Dynamically import to avoid SSR issues if needed */}
        {typeof window !== "undefined" ? (
          <div>
            {/* Keep Chatbot client-side only */}
            {React.createElement(require("../chat/Chatbot").default)}
          </div>
        ) : null}
      </React.Suspense>
    </div>
  );
};

export default AuthenticatedLayout;
