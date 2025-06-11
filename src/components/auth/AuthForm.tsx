
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Dumbbell, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();

  // Check if this is a password reset callback
  useEffect(() => {
    const handlePasswordReset = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (data?.session) {
        // Check if this session is from a password reset
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');
        
        if (type === 'recovery') {
          setIsPasswordReset(true);
          setIsLogin(false);
          setIsForgotPassword(false);
        }
      }
    };

    handlePasswordReset();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      
      if (isPasswordReset) {
        // Handle password reset
        if (newPassword !== confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        if (newPassword.length < 6) {
          toast({
            title: "Error",
            description: "Password must be at least 6 characters long.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.updateUser({
          password: newPassword
        });

        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Password updated!",
            description: "Your password has been successfully updated. You are now logged in.",
          });
          window.location.href = '/';
        }
      } else if (isForgotPassword) {
        result = await resetPassword(email);
        if (result.error) {
          toast({
            title: "Error",
            description: result.error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Password reset email sent",
            description: "Check your email for instructions to reset your password.",
          });
          setIsForgotPassword(false);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-fitness-primary rounded-full p-3">
              <Dumbbell className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">
            {isPasswordReset 
              ? 'Set New Password'
              : isForgotPassword 
                ? 'Reset Password' 
                : isLogin 
                  ? 'Welcome Back' 
                  : 'Get Started'
            }
          </CardTitle>
          <CardDescription>
            {isPasswordReset
              ? 'Enter your new password below'
              : isForgotPassword 
                ? 'Enter your email to receive reset instructions'
                : isLogin 
                  ? 'Sign in to your QuickFit account' 
                  : 'Create your QuickFit account'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isPasswordReset ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
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
              </>
            ) : (
              <>
                {!isLogin && !isForgotPassword && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                {!isForgotPassword && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                )}
              </>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-fitness-primary hover:bg-fitness-primary/90"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPasswordReset 
                ? 'Update Password'
                : isForgotPassword 
                  ? 'Send Reset Email' 
                  : isLogin 
                    ? 'Sign In' 
                    : 'Sign Up'
              }
            </Button>
          </form>
          
          <div className="mt-4 text-center space-y-2">
            {isPasswordReset ? (
              <button
                type="button"
                onClick={() => {
                  setIsPasswordReset(false);
                  setIsLogin(true);
                }}
                className="text-sm text-fitness-primary hover:underline flex items-center justify-center mx-auto"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Back to sign in
              </button>
            ) : isForgotPassword ? (
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="text-sm text-fitness-primary hover:underline flex items-center justify-center mx-auto"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Back to sign in
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-fitness-primary hover:underline"
                >
                  {isLogin 
                    ? "Don't have an account? Sign up" 
                    : "Already have an account? Sign in"
                  }
                </button>
                {isLogin && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-sm text-fitness-primary hover:underline"
                    >
                      Forgot your password?
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
