import { supabase } from '../utils/supabase';
import { GlobalWorkout, UserCreatedWorkout } from '../types/models';

export async function getGlobalWorkouts(): Promise<GlobalWorkout[]> {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching global workouts:', error);
    return [];
  }
  return data || [];
}

export async function getUserWorkouts(userId: string): Promise<UserCreatedWorkout[]> {
  const { data, error } = await supabase
    .from('user_created_workouts')
    .select('*, workouts(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user workouts:', error);
    return [];
  }
  return data || [];
}

export async function createUserWorkout(
  userId: string,
  workoutId: string,
  repsCount: number,
  setsCount: number
): Promise<UserCreatedWorkout | null> {
  const { data, error } = await supabase
    .from('user_created_workouts')
    .insert([
      {
        user_id: userId,
        workout_id: workoutId,
        reps_count: repsCount,
        sets_count: setsCount,
      }
    ])
    .select('*, workouts(*)')
    .single();

  if (error) {
    console.error('Error creating user workout:', error);
    return null;
  }
  return data;
}
