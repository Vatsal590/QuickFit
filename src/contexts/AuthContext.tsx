
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
    const tempPassword = localStorage.getItem('temp_new_password');
    let actualPassword = password;
    
    if (tempPassword) {
      try {
        const resetData = JSON.parse(tempPassword);
        if (resetData.email === email && resetData.password === password) {
          // User is trying to sign in with the new password
          // For demo purposes, we'll create a new account or update existing one
          console.log('Attempting sign-in with new password for:', email);
          
          // Try to sign up first (in case account doesn't exist)
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/`
            }
          });
          
          // If sign up fails because user exists, try regular sign in
          if (signUpError && signUpError.message.includes('already registered')) {
            // Clear temp password and proceed with regular sign in
            localStorage.removeItem('temp_new_password');
            const { error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });
            return { error };
          } else if (signUpError) {
            return { error: signUpError };
          } else {
            // Sign up successful, clear temp password
            localStorage.removeItem('temp_new_password');
            return { error: null };
          }
        }
      } catch (e) {
        console.error('Error parsing temp password:', e);
      }
    }
    
    // Regular sign in flow
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: actualPassword,
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
    // Store the new password temporarily for demo purposes
    localStorage.setItem('temp_new_password', JSON.stringify({ 
      email, 
      password: newPassword,
      timestamp: Date.now()
    }));
    
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
