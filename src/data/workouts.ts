import { supabase } from '../utils/supabase';
import { GlobalWorkout, UserCreatedWorkout, PostureLandmark } from '../types/models';

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

export async function getWorkoutById(workoutId: string): Promise<GlobalWorkout | null> {
  try {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('id', workoutId)
      .single();

    if (error) {
      console.warn('Error fetching workout details:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Failed to get workout by id:', err);
    return null;
  }
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
  setsCount: number,
  restSeconds: number = 45
): Promise<UserCreatedWorkout | null> {
  const { data, error } = await supabase
    .from('user_created_workouts')
    .insert([
      {
        user_id: userId,
        workout_id: workoutId,
        reps_count: repsCount,
        sets_count: setsCount,
        rest_seconds: restSeconds,
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

export async function getPosturesLandmarks(workoutId?: string): Promise<PostureLandmark[]> {
  try {
    let query = supabase.from('postures_landmarks').select('*');
    if (workoutId) {
      query = query.eq('workout_id', workoutId);
    }
    const { data, error } = await query;
    if (error) {
      console.warn('Error fetching postures_landmarks from Supabase:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('Network error fetching postures_landmarks:', err);
    return [];
  }
}
