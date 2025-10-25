
import React from 'react';
import { Instagram } from 'lucide-react';

interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer = ({ children }: PageContainerProps) => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 -z-10"></div>
      
      {/* Floating orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-fitness-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-fitness-secondary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-fitness-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 relative animate-fade-in">
        {children}
      </main>
      
      <footer className="relative bg-fitness-dark text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-base font-semibold mb-3">© 2025 QuickFit. Sculpted by Vatsal Agarwala.</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/70">
            <a href="/" className="hover:text-white transition-colors duration-300 font-medium">
              Home
            </a>
            <a href="/privacy-policy" className="hover:text-white transition-colors duration-300 font-medium">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="hover:text-white transition-colors duration-300 font-medium">
              Terms of Service
            </a>
            <a 
              href="https://www.instagram.com/quickfit.dev/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-300 font-medium flex items-center gap-1"
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PageContainer;
