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
