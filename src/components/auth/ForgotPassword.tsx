
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword = ({ onBack }: ForgotPasswordProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const { toast } = useToast();

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send password reset email using Supabase - redirect to main auth page
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth',
      });

      if (error) {
        throw error;
      }

      setEmailSent(true);
      toast({
        title: "Reset email sent!",
        description: "Check your email for password reset instructions.",
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
        <CardTitle className="text-2xl">
          {emailSent ? 'Check Your Email' : 'Reset Password'}
        </CardTitle>
        <CardDescription>
          {emailSent 
            ? 'We\'ve sent password reset instructions to your email address.'
            : 'Enter your email address and we\'ll send you a link to reset your password.'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!emailSent ? (
          <form onSubmit={handleSendReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
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
              Send Reset Email
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-sm text-gray-600 space-y-3">
              <p className="font-medium">📧 Check your email!</p>
              <p>We've sent you a password reset link. Click the link in your email to reset your password.</p>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs font-medium text-blue-800">What to do next:</p>
                <ol className="text-xs text-blue-700 mt-1 space-y-1">
                  <li>1. Check your email inbox (and spam folder)</li>
                  <li>2. Click the "Reset Password" link in the email</li>  
                  <li>3. You'll return here to set a new password</li>
                  <li>4. Then you can login with your new password</li>
                </ol>
              </div>
              <p className="text-xs">Don't see the email? Check your spam folder or try again.</p>
            </div>
            <div className="space-y-2">
              <Button 
                onClick={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
                variant="outline"
                className="w-full"
              >
                Try Different Email
              </Button>
              <Button 
                onClick={onBack}
                variant="ghost"
                className="w-full text-sm"
              >
                Back to Login
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ForgotPassword;
