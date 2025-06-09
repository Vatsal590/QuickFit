
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Home, History, CreditCard, ShoppingBag, LogOut } from 'lucide-react';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  const { signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-fitness-primary">Welcome</h1>
              
              <nav className="flex space-x-4">
                <Link to="/">
                  <Button 
                    variant={isActive('/') ? 'default' : 'ghost'} 
                    size="sm"
                    className={isActive('/') ? 'bg-fitness-primary hover:bg-fitness-primary/90' : ''}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Button>
                </Link>
                
                <Link to="/history">
                  <Button 
                    variant={isActive('/history') ? 'default' : 'ghost'} 
                    size="sm"
                    className={isActive('/history') ? 'bg-fitness-primary hover:bg-fitness-primary/90' : ''}
                  >
                    <History className="h-4 w-4 mr-2" />
                    History
                  </Button>
                </Link>

                <Link to="/store">
                  <Button 
                    variant={isActive('/store') ? 'default' : 'ghost'} 
                    size="sm"
                    className={isActive('/store') ? 'bg-fitness-primary hover:bg-fitness-primary/90' : ''}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Store
                  </Button>
                </Link>
                
                <Link to="/subscription">
                  <Button 
                    variant={isActive('/subscription') ? 'default' : 'ghost'} 
                    size="sm"
                    className={isActive('/subscription') ? 'bg-fitness-primary hover:bg-fitness-primary/90' : ''}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Premium
                  </Button>
                </Link>
              </nav>
            </div>
            
            <Button 
              onClick={signOut}
              variant="outline" 
              size="sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
};

export default AuthenticatedLayout;
