import React from 'react';
import { Alert } from 'react-native';
import {
  WorkoutForm,
  WorkoutFormData,
  EXERCISE_OPTIONS,
} from '../components/WorkoutForm';

export interface EditWorkoutScreenProps {
  initialWorkout?: {
    id?: string;
    title?: string;
    sets?: string | number;
    reps?: string | number;
    restSeconds?: number;
  };
  onBack?: () => void;
  onSaveSuccess?: (workout: WorkoutFormData) => void;
  onDeleteSuccess?: () => void;
}

export default function EditWorkoutScreen({
  initialWorkout,
  onBack,
  onSaveSuccess,
  onDeleteSuccess,
}: EditWorkoutScreenProps) {
  // Find matching initial exercise option or default to first
  const initialExercise =
    EXERCISE_OPTIONS.find((e) =>
      initialWorkout?.title
        ? e.name.toLowerCase().includes(initialWorkout.title.toLowerCase()) ||
          initialWorkout.title.toLowerCase().includes(e.name.toLowerCase())
        : false
    ) || EXERCISE_OPTIONS[0];

  const parseNumber = (val: string | number | undefined, defaultVal: number) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? defaultVal : parsed;
    }
    return defaultVal;
  };

  const initialReps = parseNumber(initialWorkout?.reps, 12);
  const initialSets = parseNumber(initialWorkout?.sets, 11);
  const initialRest = initialWorkout?.restSeconds ?? 60;

  const handleSaveSubmit = (data: WorkoutFormData) => {
    Alert.alert(
      'Changes Saved',
      `Changes to "${data.exercise.name}" (${data.sets} sets, ${data.reps} reps, ${data.restSeconds}s rest) have been saved.`,
      [
        {
          text: 'OK',
          onPress: () => {
            if (onSaveSuccess) {
              onSaveSuccess(data);
            } else if (onBack) {
              onBack();
            }
          },
        },
      ]
    );
  };

  const handleDeletePress = () => {
    Alert.alert(
      'Delete Exercise',
      'Are you sure you want to delete this exercise from your workout routine?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (onDeleteSuccess) {
              onDeleteSuccess();
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
      mode="edit"
      initialData={{
        exercise: initialExercise,
        reps: initialReps,
        sets: initialSets,
        restSeconds: initialRest,
      }}
      onBack={onBack}
      onSubmit={handleSaveSubmit}
      onDelete={handleDeletePress}
    />
  );
}
