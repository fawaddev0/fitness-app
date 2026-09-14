import React from 'react';
import { Alert } from 'react-native';
import {
  WorkoutForm,
  WorkoutFormData,
  EXERCISE_OPTIONS,
} from '../components/WorkoutForm';

export interface CreateWorkoutScreenProps {
  onBack?: () => void;
  onCreateSuccess?: (workout: WorkoutFormData) => void;
}

export default function CreateWorkoutScreen({
  onBack,
  onCreateSuccess,
}: CreateWorkoutScreenProps) {
  const handleCreateSubmit = (data: WorkoutFormData) => {
    Alert.alert(
      'Workout Created',
      `"${data.exercise.name}" with ${data.sets} sets x ${data.reps} reps has been added to your workouts!`,
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
  };

  return (
    <WorkoutForm
      mode="create"
      initialData={{
        exercise: EXERCISE_OPTIONS[0],
        reps: 12,
        sets: 11,
        restSeconds: 60,
      }}
      onBack={onBack}
      onSubmit={handleCreateSubmit}
    />
  );
}
