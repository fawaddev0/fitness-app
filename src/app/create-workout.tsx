import React from 'react';
import { useRouter } from 'expo-router';
import CreateWorkoutScreen from '../screens/CreateWorkoutScreen';

export default function CreateWorkoutPage() {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home');
    }
  };

  const handleCreateSuccess = () => {
    router.replace('/home');
  };

  return (
    <CreateWorkoutScreen
      onBack={handleBack}
      onCreateSuccess={handleCreateSuccess}
    />
  );
}
