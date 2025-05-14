
import React from 'react';
import { Dumbbell } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-fitness-primary" />
          <span className="font-bold text-xl text-fitness-dark">QuickFit</span>
        </Link>
        <nav>
          <ul className="flex gap-6">
            <li>
              <Link 
                to="/" 
                className="text-gray-600 hover:text-fitness-primary transition-colors font-medium"
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/history" 
                className="text-gray-600 hover:text-fitness-primary transition-colors font-medium"
              >
                History
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
