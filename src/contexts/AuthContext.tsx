
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
    // Check if there's a temporary password reset for this email
    const tempCredentials = localStorage.getItem('temp_reset_credentials') || localStorage.getItem('temp_new_password');
    
    if (tempCredentials) {
      try {
        const resetData = JSON.parse(tempCredentials);
        if (resetData.email === email && resetData.password === password) {
          console.log('Attempting sign-in with reset password for:', email);
          
          // Clear the temporary credentials first
          localStorage.removeItem('temp_reset_credentials');
          localStorage.removeItem('temp_new_password');
          
          // Try to sign in with the new password
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (!error) {
            return { error: null };
          }
          
          // If sign in fails, try to create a new account
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/home`
            }
          });
          
          return { error: signUpError };
        }
      } catch (e) {
        console.error('Error parsing temp credentials:', e);
        // Clean up invalid data
        localStorage.removeItem('temp_reset_credentials');
        localStorage.removeItem('temp_new_password');
      }
    }
    
    // Regular sign in flow
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
  };

  const resetPassword = async (email: string, newPassword: string) => {
    try {
      // First, try to sign up the user with the new password (this creates the account if it doesn't exist)
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: newPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/home`
        }
      });

      // If user already exists, we need to update their password
      if (signUpError && signUpError.message.includes('already registered')) {
        // Store the new credentials for immediate use
        localStorage.setItem('temp_reset_credentials', JSON.stringify({ 
          email, 
          password: newPassword,
          timestamp: Date.now()
        }));
        return { error: null };
      } else if (signUpError) {
        return { error: signUpError };
      } else {
        // New user created successfully
        localStorage.removeItem('temp_reset_credentials');
        return { error: null };
      }
    } catch (error) {
      return { error };
    }
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
