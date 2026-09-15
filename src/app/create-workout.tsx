import React from 'react';
import { useRouter } from 'expo-router';
import CreateWorkoutScreen from '../screens/CreateWorkoutScreen';

export default function CreateWorkoutPage() {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/home');
    }
  };

  const handleCreateSuccess = () => {
    router.push('/home');
  };

  return (
    <CreateWorkoutScreen
      onBack={handleBack}
      onCreateSuccess={handleCreateSuccess}
    />
  );
}
