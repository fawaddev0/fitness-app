import { supabase } from '../utils/supabase';
import { UserProfile } from '../types/models';

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  return data;
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId);

  if (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
  return true;
}

export async function createUserProfile(profile: Partial<UserProfile>): Promise<boolean> {
  const { error } = await supabase
    .from('users')
    .insert([profile]);

  if (error) {
    console.error('Error creating user profile:', error);
    return false;
  }
  return true;
}

