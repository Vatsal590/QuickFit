import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Dumbbell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/contexts/TranslationContext';

const GOOGLE_CLIENT_ID = '602471950477-h5kud4birt5a806m85u5ab8pd8d31ubr.apps.googleusercontent.com';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const AuthForm = () => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeGoogle = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          width: 320,
        });
      }
    };

    // Check if Google script is already loaded
    if (window.google) {
      initializeGoogle();
    } else {
      // Wait for script to load
      const checkGoogle = setInterval(() => {
        if (window.google) {
          clearInterval(checkGoogle);
          initializeGoogle();
        }
      }, 100);

      // Cleanup
      return () => clearInterval(checkGoogle);
    }
  }, []);

  const handleCredentialResponse = async (response: { credential: string }) => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
      });

      if (error) {
        toast({ 
          title: 'Error', 
          description: error.message, 
          variant: 'destructive' 
        });
      }
      // Navigation is handled automatically by PublicRoute detecting auth state change
    } catch (err) {
      toast({ 
        title: 'Error', 
        description: 'Failed to sign in with Google.', 
        variant: 'destructive' 
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/20 to-background overflow-hidden">
      {/* Apple-style floating orbs */}
      <div className="absolute w-72 h-72 bg-primary/10 rounded-full animate-float top-[-80px] left-[-50px] blur-3xl"></div>
      <div className="absolute w-80 h-80 bg-fitness-secondary/10 rounded-full animate-float bottom-[-100px] right-[-50px] blur-3xl" style={{ animationDelay: '3s' }}></div>
      <div className="absolute w-64 h-64 bg-fitness-accent/10 rounded-full animate-float top-1/3 right-[-60px] blur-3xl" style={{ animationDelay: '6s' }}></div>

      {/* Login Card with Apple Glass */}
      <div className="relative z-10 w-full max-w-sm">
        <Card className="glass-card border-none shadow-2xl">
          <CardHeader className="text-center py-8 bg-gradient-to-r from-primary to-fitness-secondary text-white rounded-t-2xl">
            <div className="inline-block mb-4 animate-bounce">
              <Dumbbell className="h-12 w-12 mx-auto text-white" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-wide">{t('Welcome to QuickFit')}</CardTitle>
            <CardDescription className="mt-2 text-white/90">
              {t('Sign in with Google to continue')}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 flex flex-col gap-6">
            {/* Google One Tap Button Container */}
            <div className="flex justify-center">
              {googleLoading ? (
                <Button disabled className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 border-2 border-gray-300 py-3 rounded-xl">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </Button>
              ) : (
                <div ref={googleButtonRef} className="flex justify-center" />
              )}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {t('By signing in, you agree to our')}{' '}
              <a href="/privacy-policy" className="text-primary underline">{t('Privacy Policy')}</a>{' '}
              {t('and')}{' '}
              <a href="/terms-of-conditions" className="text-primary underline">{t('Terms & Conditions')}</a>.
            </p>
          </CardContent>
        </Card>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 20s infinite; }
        .animation-delay-0 { animation-delay: 0s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-6000 { animation-delay: 6s; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }

        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 1s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default AuthForm;
