import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Dumbbell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AuthForm = () => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/home`,
          queryParams: { prompt: 'select_account' }
        }
      });
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to sign in with Google.', variant: 'destructive' });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 via-white to-green-50 overflow-hidden">
      {/* Dynamic Background Blobs */}
      <div className="absolute w-72 h-72 bg-fitness-primary/20 rounded-full animate-blob animation-delay-0 top-[-80px] left-[-50px]"></div>
      <div className="absolute w-80 h-80 bg-green-400/20 rounded-full animate-blob animation-delay-3000 bottom-[-100px] right-[-50px]"></div>
      <div className="absolute w-64 h-64 bg-blue-400/10 rounded-full animate-blob animation-delay-6000 top-1/3 right-[-60px]"></div>

      {/* Particle dots */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className={`absolute bg-white/30 rounded-full w-2 h-2 animate-pulse`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 5}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Floating shapes */}
      <div className="absolute w-32 h-32 bg-purple-300/20 rounded-full animate-float left-10 top-20"></div>
      <div className="absolute w-24 h-24 bg-pink-300/20 rounded-full animate-float right-16 bottom-32"></div>
      <div className="absolute w-20 h-20 bg-yellow-300/15 rounded-full animate-float left-1/2 top-40"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-sm">
        <Card className="border-0 backdrop-blur-md bg-white/60 shadow-2xl rounded-3xl">
          <CardHeader className="text-center py-8 bg-gradient-to-r from-fitness-primary to-green-400 text-white rounded-t-3xl">
            <div className="inline-block mb-4 animate-bounce">
              <Dumbbell className="h-12 w-12 mx-auto text-white" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-wide">Welcome to QuickFit</CardTitle>
            <CardDescription className="mt-2 text-white/90">
              Sign in with Google to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 flex flex-col gap-6">
            <Button
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 border-2 border-gray-300 shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all py-3 rounded-xl font-semibold text-lg"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
            >
              {googleLoading && <Loader2 className="h-5 w-5 animate-spin" />}
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </Button>
            <p className="text-center text-sm text-gray-600">
              By signing in, you agree to our{' '}
              <a href="/privacy-policy" className="text-fitness-primary underline">Privacy Policy</a>{' '}
              and{' '}
              <a href="/terms-of-conditions" className="text-fitness-primary underline">Terms & Conditions</a>.
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
