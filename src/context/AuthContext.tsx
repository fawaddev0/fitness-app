import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';
import { useRouter, useSegments } from 'expo-router';
import { getUserProfile, createUserProfile } from '../data/users';
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

  async function handleSessionData(session: Session | null) {
    if (!session?.user) {
      setSession(null);
      setUser(null);
      setUserProfile(null);
      setIsLoading(false);
      return;
    }

    const profile = await getUserProfile(session.user.id);

    if (profile) {
      setSession(session);
      setUser(session.user);
      setUserProfile(profile);
    } else {
      // Profile missing! Invalid state, clear session
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setUserProfile(null);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSessionData(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Only process sign out or token refresh here, or if session changed.
      // We don't want to double fetch on mount since getSession handles it.
      if (_event !== 'INITIAL_SESSION') {
        handleSessionData(session);
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
      router.replace('/');
    } else if (session && isLoginScreen) {
      if (hasOnboarded) {
        router.replace('/home');
      } else {
        router.replace('/intro');
      }
    } else if (session && segments[0] === 'intro' && hasOnboarded) {
      router.replace('/home');
    }
  }, [session, isLoading, segments, userProfile]);

  async function refreshUserProfile() {
    if (session?.user) {
      await handleSessionData(session);
    }
  }

  async function signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password });
  }

  async function signUp(email: string, password: string, fullName: string) {
    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          fullname: fullName,
        }
      }
    });

    if (response.data?.user && !response.error) {
      // Create a user profile with default values upon signup
      await createUserProfile({
        id: response.data.user.id,
        fullname: fullName,
        has_onboarded: false,
      });
      // Refresh the local profile state so the router redirects correctly
      await handleSessionData(response.data.session);
    }

    return response;
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

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
