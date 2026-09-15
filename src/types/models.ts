export interface UserProfile {
  id: string;
  created_at: string;
  fullname: string;
  streak?: number | null;
  weight?: number | null;
  height?: number | null;
  profile_picture?: string | null;
  completed_workouts?: number | null;
  has_onboarded: boolean;
}

export interface GlobalWorkout {
  id: string;
  created_at: string;
  title: string;
  image_url?: string | null;
}

export interface UserCreatedWorkout {
  id: string;
  created_at: string;
  workout_id: string;
  user_id: string;
  reps_count: number;
  sets_count: number;
  workouts?: GlobalWorkout; // Joined data
}
