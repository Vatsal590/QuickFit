import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword = ({ onBack }: ForgotPasswordProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const { toast } = useToast();

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`
      });

      if (error) {
        throw error;
      }

      setEmailSent(true);
      
      toast({
        title: "Reset email sent!",
        description: "Check your email for a password reset link.",
      });
    } catch (error: any) {
      console.error('Error sending reset email:', error);
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
        
        <div className="flex justify-center mb-4">
          <Mail className="h-6 w-6 text-fitness-primary" />
        </div>
        
        <CardTitle className="text-2xl">
          {emailSent ? 'Check Your Email' : 'Reset Password'}
        </CardTitle>
        <CardDescription>
          {emailSent 
            ? 'We sent you a password reset link. Check your email and follow the instructions. It will redirect you to the login page. The password you enter there will be your new password.'
            : 'Enter your email address to receive a password reset link.'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!emailSent ? (
          <form onSubmit={handleSendResetEmail} className="space-y-4">
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
              Send Reset Link
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>Didn't receive the email? Check your spam folder or try again.</p>
            </div>
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setEmailSent(false)}
            >
              Try Different Email
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ForgotPassword;