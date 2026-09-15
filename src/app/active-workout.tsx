import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ActiveWorkoutScreen from '../screens/ActiveWorkoutScreen';

export default function ActiveWorkoutPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    title?: string;
    sets?: string;
    reps?: string;
    restSeconds?: string;
  }>();

  const parseNumber = (val: string | undefined, defaultVal: number) => {
    if (!val) return defaultVal;
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? defaultVal : parsed;
  };

  const workoutTitle = params.title || 'Seated Shoulder Press';
  const targetSets = parseNumber(params.sets, 4);
  const targetReps = parseNumber(params.reps, 12);
  const restDuration = parseNumber(params.restSeconds, 60);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/home');
    }
  };

  const handleFinish = () => {
    router.push('/home');
  };

  return (
    <ActiveWorkoutScreen
      workoutTitle={workoutTitle}
      targetSets={targetSets}
      targetReps={targetReps}
      restDuration={restDuration}
      onBack={handleBack}
      onFinish={handleFinish}
    />
  );
}
