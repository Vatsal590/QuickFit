
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

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfConditions, setShowTermsOfConditions] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  // Check for temporary password reset on component mount
  useEffect(() => {
    const tempPassword = localStorage.getItem('temp_new_password');
    if (tempPassword) {
      try {
        const { email: resetEmail } = JSON.parse(tempPassword);
        console.log('Temporary password found for:', resetEmail);
        // Pre-fill the email field
        setEmail(resetEmail);
      } catch (e) {
        console.error('Error parsing temp password:', e);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      
      if (isLogin) {
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
          window.location.href = '/';
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
            {isLogin ? t('Welcome Back') : t('Get Started')}
          </CardTitle>
          <CardDescription>
            {isLogin ? t('Sign in to your QuickFit account') : t('Create your QuickFit account')}
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t('Password')}</Label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs text-fitness-primary hover:underline"
                  >
                    {t('Forgot Password?')}
                  </button>
                )}
              </div>
              <Input
                id="password"
                type="password"
                placeholder={t('Enter your password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            
            <Button
              type="submit" 
              className="w-full bg-fitness-primary hover:bg-fitness-primary/90"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? t('Sign In') : t('Create Account')}
            </Button>
          </form>

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
