
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Dumbbell } from 'lucide-react';
import ForgotPassword from './ForgotPassword';
import PrivacyPolicy from '../legal/PrivacyPolicy';
import TermsOfConditions from '../legal/TermsOfConditions';
import { supabase } from '@/integrations/supabase/client';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfConditions, setShowTermsOfConditions] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  // Check if this is a password reset flow
  useEffect(() => {
    const checkSession = async () => {
      // Check URL parameters for reset mode
      const urlParams = new URLSearchParams(window.location.search);
      const hasResetParams = urlParams.get('type') === 'recovery' || 
                            urlParams.get('access_token') || 
                            urlParams.get('refresh_token') ||
                            urlParams.get('reset') === 'true';
      
      if (hasResetParams) {
        console.log('Password reset mode detected');
        setIsPasswordReset(true);
        setIsLogin(false); // Switch to password update mode
        
        // Clear any existing session to force password reset
        if (urlParams.get('type') === 'recovery') {
          try {
            await supabase.auth.signOut();
          } catch (error) {
            console.log('No existing session to clear');
          }
        }
      }
    };
    
    // Also listen for auth state changes to handle recovery flow
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        // If user gets signed in via recovery link, force them to reset password
        if (event === 'SIGNED_IN' && session?.user && window.location.search.includes('recovery')) {
          setIsPasswordReset(true);
          setIsLogin(false);
          
          // Extract email from session
          if (session.user.email) {
            setEmail(session.user.email);
          }
        }
      }
    );
    
    checkSession();
    
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      
      if (isPasswordReset) {
        // Handle password update for reset flow
        if (password !== confirmPassword) {
          toast({
            title: "Password mismatch",
            description: "Passwords do not match. Please try again.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          toast({
            title: "Password too short",
            description: "Password must be at least 6 characters long.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.updateUser({
          password: password
        });

        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Password updated successfully!",
            description: "You can now sign in with your new password.",
          });
          // Clear the reset flag and redirect to login
          setIsPasswordReset(false);
          setIsLogin(true);
          setPassword('');
          setConfirmPassword('');
          // Remove the reset parameter from URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } else if (isLogin) {
        result = await signIn(email, password);
        if (result.error) {
          toast({
            title: "Error",
            description: result.error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You've been signed in successfully.",
          });
          // Force immediate redirect to home page - no delays, no conditions
          window.location.replace('/home');
        }
      } else {
        result = await signUp(email, password, fullName);
        if (result.error) {
          toast({
            title: "Error",
            description: result.error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Success!",
            description: "Account created successfully. Please check your email to verify your account.",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/home`
        }
      });
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign in with Google.",
        variant: "destructive"
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 px-4">
        <ForgotPassword onBack={() => setShowForgotPassword(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-fitness-primary rounded-full p-3">
              <Dumbbell className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">
            {isPasswordReset ? 'Update Password' : isLogin ? t('Welcome Back') : t('Get Started')}
          </CardTitle>
          <CardDescription>
            {isPasswordReset ? 'Enter your new password below' : isLogin ? t('Sign in to your QuickFit account') : t('Create your QuickFit account')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">{t('Full Name')}</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder={t('Enter your full name')}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('Email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('Enter your email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t('Password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('Enter your password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs text-fitness-primary hover:underline"
                  >
                    {t('Forgot Password?')}
                  </button>
                </div>
              )}
            </div>
            
            {isPasswordReset && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            )}
            
            <Button
              type="submit" 
              className="w-full bg-fitness-primary hover:bg-fitness-primary/90"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPasswordReset ? 'Update Password' : isLogin ? t('Sign In') : t('Create Account')}
            </Button>
          </form>

          {!isPasswordReset && (
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
          )}

          {!isPasswordReset && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
            >
              {googleLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          )}

          {!isLogin && (
            <div className="mt-3 text-xs text-gray-500 text-center">
              {t('By creating an account, you accept our')}{' '}
              <button
                type="button"
                onClick={() => setShowPrivacyPolicy(true)}
                className="text-fitness-primary hover:underline"
              >
                {t('Privacy Policy')}
              </button>
              {' '}{t('and')}{' '}
              <button
                type="button"
                onClick={() => setShowTermsOfConditions(true)}
                className="text-fitness-primary hover:underline"
              >
                {t('Terms of Conditions')}
              </button>
            </div>
          )}
          
          {!isPasswordReset && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-fitness-primary hover:underline"
              >
                {isLogin 
                  ? t("Don't have an account? Sign up")
                  : t("Already have an account? Sign in")
                }
              </button>
            </div>
          )}
        </CardContent>
      </Card>

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
    </div>
  );
};

export default AuthForm;
