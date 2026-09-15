import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';
import { useRouter, useSegments } from 'expo-router';
import { getUserProfile } from '../data/users';
import { UserProfile } from '../types/models';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, fullName: string) => Promise<any>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  const fetchAndSetProfile = async (userId: string) => {
    const profile = await getUserProfile(userId);
    setUserProfile(profile);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchAndSetProfile(session.user.id).then(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchAndSetProfile(session.user.id).then(() => setIsLoading(false));
      } else {
        setIsLoading(false);
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    // In Expo Router, the root index.tsx is represented by an empty segments array or ['index']
    const isLoginScreen = !segments[0] || segments[0] === 'index';
    const hasOnboarded = !!userProfile?.has_onboarded;
    
    if (!session && !isLoginScreen) {
      // Redirect to login if unauthenticated and trying to access protected route
      router.replace('/');
    } else if (session && isLoginScreen) {
      // Redirect away from login if authenticated
      if (hasOnboarded) {
        router.replace('/home');
      } else {
        router.replace('/intro');
      }
    } else if (session && segments[0] === 'intro' && hasOnboarded) {
      // Don't let onboarded users see the intro screen
      router.replace('/home');
    }
  }, [session, isLoading, segments, userProfile]);

  const refreshUserProfile = async () => {
    if (user) {
      await fetchAndSetProfile(user.id);
    }
  };

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    return await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          fullname: fullName,
        }
      }
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, userProfile, isLoading, signIn, signUp, signOut, refreshUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
