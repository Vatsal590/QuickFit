
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
          
          // Check if this was a password reset login and force redirect to home
          const userEmail = session.user.email;
          if (userEmail && localStorage.getItem(`user_password_${userEmail}`)) {
            console.log('Password reset login detected, forcing redirect to home');
            setTimeout(() => {
              window.location.href = '/home';
            }, 200);
          }
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
    // Check if there's a reset password for this specific email
    const resetPasswordData = localStorage.getItem(`user_password_${email}`);
    
    if (resetPasswordData) {
      try {
        const passwordInfo = JSON.parse(resetPasswordData);
        
        // If user is trying to use the NEW password
        if (passwordInfo.password === password && passwordInfo.isReset) {
          console.log('Using reset password for:', email);
          
          // Try to sign up first (create account if doesn't exist)
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/home`
            }
          });
          
          // If account already exists, try regular sign in
          if (signUpError && signUpError.message.includes('already registered')) {
            const { error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });
            
            if (!error) {
              // Successfully signed in with reset password
              return { error: null };
            } else {
              return { error };
            }
          } else if (!signUpError) {
            // New account created successfully
            return { error: null };
          } else {
            return { error: signUpError };
          }
        } else {
          // User is trying to use an OLD password - block this
          return { 
            error: { 
              message: "Invalid login credentials. Please use your new password or reset your password again." 
            }
          };
        }
      } catch (e) {
        console.error('Error parsing reset password data:', e);
        localStorage.removeItem(`user_password_${email}`);
      }
    }
    
    // Regular sign in flow (no password reset for this email)
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
      // Store the new password as the ONLY valid password for this email
      localStorage.setItem(`user_password_${email}`, JSON.stringify({ 
        password: newPassword,
        timestamp: Date.now(),
        isReset: true
      }));
      
      // Clear any old authentication state
      await supabase.auth.signOut();
      
      // Try to create a new account with these credentials
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password: newPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/home`
        }
      });
      
      // If user already exists, that's fine - we'll handle it in signIn
      if (signUpError && !signUpError.message.includes('already registered')) {
        return { error: signUpError };
      }
      
      return { error: null };
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
