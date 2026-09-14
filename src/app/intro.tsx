import React from 'react';
import { useRouter } from 'expo-router';
import IntroScreen from '../screens/IntroScreen';

export default function IntroPage() {
  const router = useRouter();

  const handleComplete = () => {
    // Navigate to next screen / home once created
    router.replace('/home');
  };

  return <IntroScreen onComplete={handleComplete} />;
}
