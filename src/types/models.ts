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
  rest_seconds?: number | null;
}

export interface UserCreatedWorkout {
  id: string;
  created_at: string;
  workout_id: string;
  user_id: string;
  reps_count: number;
  sets_count: number;
  rest_seconds?: number | null;
  workouts?: GlobalWorkout; // Joined data
}

export interface LandmarkCoordinate {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export interface PostureJointAngles {
  left_hip_angle?: number;
  right_hip_angle?: number;
  left_knee_angle?: number;
  right_knee_angle?: number;
  left_elbow_angle?: number;
  right_elbow_angle?: number;
  [key: string]: number | undefined;
}

export interface PostureLandmark {
  id: number;
  created_at: string;
  phase: 'top' | 'bottom' | 'hold' | string;
  landmarks: Record<string, LandmarkCoordinate>;
  workout_id: string;
  joint_agles: PostureJointAngles;
}

