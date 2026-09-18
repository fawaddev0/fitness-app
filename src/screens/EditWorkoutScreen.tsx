import React, { useState, useEffect } from 'react';
import { Alert, View, ActivityIndicator } from 'react-native';
import {
  WorkoutForm,
  WorkoutFormData,
} from '../components/WorkoutForm';
import { getGlobalWorkouts } from '../data/workouts';
import { GlobalWorkout } from '../types/models';
import { KineticColors } from '../constants/theme';

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

  // Find matching initial exercise option or default to first
  const initialExercise =
    globalWorkouts.find((e) =>
      initialWorkout?.title
        ? e.title.toLowerCase().includes(initialWorkout.title.toLowerCase()) ||
          initialWorkout.title.toLowerCase().includes(e.title.toLowerCase())
        : false
    ) || (globalWorkouts.length > 0 ? globalWorkouts[0] : null);

  const handleSaveSubmit = (data: WorkoutFormData) => {
    const exerciseTitle = data.exercise?.title || 'Exercise';
    Alert.alert(
      'Changes Saved',
      `Changes to "${exerciseTitle}" (${data.sets} sets, ${data.reps} reps, ${data.restSeconds}s rest) have been saved.`,
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

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: KineticColors.surface, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={KineticColors.primaryFixed} />
      </View>
    );
  }

  return (
    <WorkoutForm
      mode="edit"
      options={globalWorkouts}
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
