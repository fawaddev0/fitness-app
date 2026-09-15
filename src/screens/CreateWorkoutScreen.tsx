import React, { useState, useEffect } from 'react';
import { Alert, View, ActivityIndicator } from 'react-native';
import { WorkoutForm, WorkoutFormData } from '../components/WorkoutForm';
import { getGlobalWorkouts, createUserWorkout } from '../data/workouts';
import { GlobalWorkout } from '../types/models';
import { useAuth } from '../context/AuthContext';
import { KineticColors } from '../constants/theme';

export interface CreateWorkoutScreenProps {
  onBack?: () => void;
  onCreateSuccess?: (workout: WorkoutFormData) => void;
}

export default function CreateWorkoutScreen({
  onBack,
  onCreateSuccess,
}: CreateWorkoutScreenProps) {
  const { user } = useAuth();
  const [globalWorkouts, setGlobalWorkouts] = useState<GlobalWorkout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadWorkouts() {
      const workouts = await getGlobalWorkouts();
      setGlobalWorkouts(workouts);
      setIsLoading(false);
    }
    loadWorkouts();
  }, []);

  const handleCreateSubmit = async (data: WorkoutFormData) => {
    if (!user || !data.exercise) return;

    const result = await createUserWorkout(
      user.id,
      data.exercise.id,
      data.reps,
      data.sets
    );

    if (result) {
      Alert.alert(
        'Workout Created',
        `"${data.exercise.title}" with ${data.sets} sets x ${data.reps} reps has been added to your workouts!`,
        [
          {
            text: 'OK',
            onPress: () => {
              if (onCreateSuccess) {
                onCreateSuccess(data);
              } else if (onBack) {
                onBack();
              }
            },
          },
        ]
      );
    } else {
      Alert.alert('Error', 'Failed to save workout. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: KineticColors.surface, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={KineticColors.primaryFixed} />
      </View>
    );
  }

  return (
    <WorkoutForm
      mode="create"
      options={globalWorkouts}
      initialData={{
        exercise: globalWorkouts.length > 0 ? globalWorkouts[0] : null,
        reps: 12,
        sets: 11,
        restSeconds: 60,
      }}
      onBack={onBack}
      onSubmit={handleCreateSubmit}
    />
  );
}
