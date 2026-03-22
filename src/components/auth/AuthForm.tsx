import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Dumbbell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/contexts/TranslationContext';
import { isNativePlatform, generateNonce, hashNonce, nativeGoogleSignIn } from '@/utils/googleAuth';

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
  const nonceRef = useRef<string>('');
  const isNative = isNativePlatform();

  // Web: Google Identity Services initialization
  useEffect(() => {
    if (isNative) return; // Skip GIS on native platforms

    const initializeGoogle = async () => {
      if (window.google && googleButtonRef.current) {
        const nonce = generateNonce();
        nonceRef.current = nonce;
        const hashedNonce = await hashNonce(nonce);

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleWebCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          ux_mode: 'popup',
          itp_support: true,
          nonce: hashedNonce,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          width: 320,
        });

        window.google.accounts.id.prompt();
      }
    };

    if (window.google) {
      initializeGoogle();
    } else {
      const checkGoogle = setInterval(() => {
        if (window.google) {
          clearInterval(checkGoogle);
          initializeGoogle();
        }
      }, 100);
      return () => clearInterval(checkGoogle);
    }
  }, []);

  // Web: handle GIS credential response
  const handleWebCredentialResponse = async (response: { credential: string }) => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
        nonce: nonceRef.current,
      });

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to sign in with Google.', variant: 'destructive' });
    } finally {
      setGoogleLoading(false);
    }
  };

  // Native: handle Capacitor Google Sign-In
  const handleNativeGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const result = await nativeGoogleSignIn();
      if (!result) {
        toast({ title: 'Error', description: 'Google sign-in was cancelled.', variant: 'destructive' });
        return;
      }

      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: result.idToken,
      });

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to sign in with Google.', variant: 'destructive' });
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

      {/* Login Card */}
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
            <div className="flex justify-center">
              {googleLoading ? (
                <Button disabled className="w-full flex items-center justify-center gap-3 bg-background text-foreground border-2 border-border py-3 rounded-xl">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </Button>
              ) : isNative ? (
                // Native: Show a custom Google sign-in button that triggers Capacitor plugin
                <Button
                  onClick={handleNativeGoogleSignIn}
                  className="w-full flex items-center justify-center gap-3 bg-background text-foreground border-2 border-border py-3 rounded-xl hover:bg-accent"
                  variant="outline"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {t('Continue with Google')}
                </Button>
              ) : (
                // Web: Google Identity Services rendered button
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
