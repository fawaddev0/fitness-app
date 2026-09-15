import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import EditWorkoutScreen from '../screens/EditWorkoutScreen';

export default function EditWorkoutPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    title?: string;
    sets?: string;
    reps?: string;
  }>();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/home');
    }
  };

  const handleSaveSuccess = () => {
    router.push('/home');
  };

  const handleDeleteSuccess = () => {
    router.push('/home');
  };

  return (
    <EditWorkoutScreen
      initialWorkout={{
        id: params.id,
        title: params.title,
        sets: params.sets,
        reps: params.reps,
      }}
      onBack={handleBack}
      onSaveSuccess={handleSaveSuccess}
      onDeleteSuccess={handleDeleteSuccess}
    />
  );
}
