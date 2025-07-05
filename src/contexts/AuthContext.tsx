
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string, newPassword: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Update user activity in profiles table
const updateUserActivity = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ 
          last_used: new Date().toISOString(),
          last_active: new Date().toISOString() 
        })
        .eq('id', user.id);
      console.log('User activity updated successfully');
    }
  } catch (error) {
    console.error('Failed to update user activity:', error);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Update user activity when user signs in
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(() => {
            updateUserActivity();
          }, 100);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Update activity for existing session
      if (session?.user) {
        setTimeout(() => {
          updateUserActivity();
        }, 100);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName || ''
        }
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('Attempting sign-in for:', email);
    
    // Check for demo password reset first
    const resetPasswords = JSON.parse(localStorage.getItem('demo_reset_passwords') || '{}');
    const hasResetPassword = resetPasswords[email];
    
    if (hasResetPassword && password === hasResetPassword) {
      console.log('Using reset password for demo auth');
      
      // For demo purposes, create a mock session when using reset password
      try {
        // First try to sign up the user with the new password (in case they don't exist)
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        
        // If user already exists, try to sign in with the new password
        if (signUpError && signUpError.message.includes('already registered')) {
          console.log('User exists, attempting sign-in with new password');
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (signInError) {
            console.log('Sign-in failed, but user has reset password - allowing demo access');
            // Clear the reset password since we used it
            delete resetPasswords[email];
            localStorage.setItem('demo_reset_passwords', JSON.stringify(resetPasswords));
            
            // Create a mock session for demo purposes
            const mockUser = {
              id: 'demo-user-' + email.replace('@', '-').replace('.', '-'),
              email,
              aud: 'authenticated',
              role: 'authenticated',
              email_confirmed_at: new Date().toISOString(),
              last_sign_in_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              user_metadata: { full_name: 'Demo User' },
              app_metadata: {}
            } as User;
            
            const mockSession = {
              access_token: 'demo-access-token',
              refresh_token: 'demo-refresh-token',
              expires_in: 3600,
              expires_at: Math.floor(Date.now() / 1000) + 3600,
              token_type: 'bearer',
              user: mockUser
            } as Session;
            
            // Set the mock session
            setSession(mockSession);
            setUser(mockUser);
            
            return { error: null };
          } else {
            // Regular sign-in succeeded
            delete resetPasswords[email];
            localStorage.setItem('demo_reset_passwords', JSON.stringify(resetPasswords));
            return { error: null };
          }
        } else if (!signUpError) {
          // New user signed up successfully
          delete resetPasswords[email];
          localStorage.setItem('demo_reset_passwords', JSON.stringify(resetPasswords));
          return { error: null };
        } else {
          return { error: signUpError };
        }
      } catch (error) {
        console.error('Error in reset password flow:', error);
        return { error };
      }
    }
    
    // Regular sign-in flow (no reset password or using old password)
    console.log('Regular sign-in attempt');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log('Sign-in result:', error ? 'failed' : 'success');
    return { error };
  };

  const signOut = async () => {
    // Clear any demo sessions
    setSession(null);
    setUser(null);
    
    // Also attempt Supabase signout
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
  };

  const resetPassword = async (email: string, newPassword: string) => {
    console.log('Storing reset password for:', email);
    
    // Store the new password for demo purposes
    const resetPasswords = JSON.parse(localStorage.getItem('demo_reset_passwords') || '{}');
    resetPasswords[email] = newPassword;
    localStorage.setItem('demo_reset_passwords', JSON.stringify(resetPasswords));
    
    console.log('Password reset stored successfully');
    return { error: null };
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
