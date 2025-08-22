import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, authHelpers, dbHelpers, Profile } from '../lib/supabase';

export interface AuthUser extends User {
  profile?: Profile;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { session, error } = await authHelpers.getSession();
        if (error) throw error;
        
        setSession(session);
        
        if (session?.user) {
          // Get user profile
          const { data: profile, error: profileError } = await dbHelpers.getProfile(session.user.id);
          if (profileError) {
            console.error('Error fetching profile:', profileError);
          }
          
          setUser({
            ...session.user,
            profile: profile || undefined
          });
        }
      } catch (err) {
        console.error('Error getting initial session:', err);
        setError(err instanceof Error ? err.message : 'Authentication error');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setError(null);
        
        if (session?.user) {
          // Get user profile
          const { data: profile, error: profileError } = await dbHelpers.getProfile(session.user.id);
          if (profileError) {
            console.error('Error fetching profile:', profileError);
          }
          
          setUser({
            ...session.user,
            profile: profile || undefined
          });
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, userData: { username: string; full_name: string; sport?: string; skill_level?: string; location?: string }) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await authHelpers.signUp(email, password, userData);
      if (error) throw error;
      
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign up failed';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await authHelpers.signIn(email, password);
      if (error) throw error;
      
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await authHelpers.signOut();
      if (error) throw error;
      
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign out failed';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user
  };
};