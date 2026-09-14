import React from 'react';
import { useRouter } from 'expo-router';
import HomeScreen, { WorkoutItem } from '../screens/HomeScreen';
import { NavTab } from '../components/BottomNavigationDock';

export default function HomePage() {
  const router = useRouter();

  const handleAddWorkout = () => {
    console.log('Add workout clicked');
  };

  const handleEditWorkout = (workout: WorkoutItem) => {
    console.log('Edit workout:', workout.title);
  };

  const handleStartWorkout = (workout: WorkoutItem) => {
    console.log('Start workout:', workout.title);
  };

  const handleTabChange = (tab: NavTab) => {
    if (tab === 'roadmaps') router.push('/roadmaps');
    if (tab === 'stats') router.push('/stats');
    if (tab === 'account') router.push('/account');
  };

  return (
    <HomeScreen
      onAddWorkout={handleAddWorkout}
      onEditWorkout={handleEditWorkout}
      onStartWorkout={handleStartWorkout}
      onTabChange={handleTabChange}
    />
  );
}
