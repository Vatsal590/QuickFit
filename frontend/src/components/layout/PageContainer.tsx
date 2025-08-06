
import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer = ({ children }: PageContainerProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-gray-50 to-blue-100">
      <main className="flex-grow container mx-auto px-4 py-6 md:py-8">
        {children}
      </main>
      <footer className="bg-fitness-dark text-white py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© 2025 QuickFit. Sculpted by Vatsal Agarwala.</p>
          <div className="mt-2 space-x-4">
            <a href="/" className="text-white/70 hover:text-white transition-colors">
              Home
            </a>
            <a href="/privacy-policy" className="text-white/70 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="text-white/70 hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PageContainer;
