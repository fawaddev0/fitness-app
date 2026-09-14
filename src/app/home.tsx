import React from 'react';
import { useRouter } from 'expo-router';
import HomeScreen, { WorkoutItem } from '../screens/HomeScreen';
import { NavTab } from '../components/BottomNavigationDock';

export default function HomePage() {
  const router = useRouter();

  const handleAddWorkout = () => {
    router.push('/create-workout');
  };

  const handleEditWorkout = (workout: WorkoutItem) => {
    router.push({
      pathname: '/edit-workout',
      params: {
        id: workout.id,
        title: workout.title,
        sets: workout.sets,
        reps: workout.reps,
      },
    });
  };

  const handleStartWorkout = (workout: WorkoutItem) => {
    router.push({
      pathname: '/active-workout',
      params: {
        id: workout.id,
        title: workout.title,
        sets: workout.sets,
        reps: workout.reps,
      },
    });
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
