import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, Mail, Key, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword = ({ onBack }: ForgotPasswordProps) => {
  const [step, setStep] = useState(1); // 1: email, 2: code, 3: password
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [expectedCode, setExpectedCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call our edge function to send verification code
      const { data, error } = await supabase.functions.invoke('send-reset-code', {
        body: { email }
      });

      if (error) {
        throw error;
      }

      console.log('Reset code response:', data);
      // Store the expected code (in production this would be handled server-side)
      setExpectedCode(data.code);
      setStep(2);
      
      toast({
        title: "Code sent!",
        description: "Check your email for the 6-digit verification code.",
      });
    } catch (error: any) {
      console.error('Error sending reset code:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send verification code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode !== expectedCode) {
      toast({
        title: "Invalid code",
        description: "The verification code you entered is incorrect. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setStep(3);
    toast({
      title: "Code verified!",
      description: "Now you can set your new password.",
    });
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Call our edge function to reset the password
      const { data, error } = await supabase.functions.invoke('reset-password', {
        body: { 
          email, 
          newPassword, 
          verificationCode 
        }
      });

      if (error) {
        throw error;
      }

      console.log('Password reset response:', data);
      
      toast({
        title: "Password reset successful!",
        description: "You can now sign in with your new password.",
      });
      
      // Go back to login form
      onBack();
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to reset password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStepIcon = () => {
    switch (step) {
      case 1: return <Mail className="h-6 w-6 text-fitness-primary" />;
      case 2: return <Key className="h-6 w-6 text-fitness-primary" />;
      case 3: return <CheckCircle className="h-6 w-6 text-fitness-primary" />;
      default: return <Mail className="h-6 w-6 text-fitness-primary" />;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Reset Password';
      case 2: return 'Enter Verification Code';
      case 3: return 'Set New Password';
      default: return 'Reset Password';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return 'Enter your email address to get started';
      case 2: return 'Enter the 6-digit code sent to your email';
      case 3: return 'Create your new password';
      default: return 'Enter your email address to get started';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <button
          onClick={onBack}
          className="flex items-center text-fitness-primary hover:text-fitness-primary/80 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sign In
        </button>
        
        <div className="flex justify-center mb-4">
          {getStepIcon()}
        </div>
        
        <CardTitle className="text-2xl">
          {getStepTitle()}
        </CardTitle>
        <CardDescription>
          {getStepDescription()}
        </CardDescription>
        
        {/* Step indicator */}
        <div className="flex justify-center space-x-2 mt-4">
          {[1, 2, 3].map((stepNum) => (
            <div
              key={stepNum}
              className={`w-2 h-2 rounded-full ${
                stepNum <= step ? 'bg-fitness-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email Address</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-fitness-primary hover:bg-fitness-primary/90"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Verification Code
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verification-code">Verification Code</Label>
              <Input
                id="verification-code"
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                className="text-center text-2xl font-mono tracking-widest"
                required
              />
              <p className="text-xs text-gray-500 text-center">
                Check your email for the 6-digit code
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-fitness-primary hover:bg-fitness-primary/90"
              disabled={verificationCode.length !== 6}
            >
              Verify Code
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setStep(1)}
            >
              Use Different Email
            </Button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              Reset Password
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default ForgotPassword;