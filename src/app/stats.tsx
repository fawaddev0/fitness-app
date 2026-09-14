import React from 'react';
import { useRouter } from 'expo-router';
import StatsScreen from '../screens/StatsScreen';
import { NavTab } from '../components/BottomNavigationDock';

export default function StatsPage() {
  const router = useRouter();

  const handleTabChange = (tab: NavTab) => {
    if (tab === 'home') router.push('/home');
    if (tab === 'roadmaps') router.push('/roadmaps');
    if (tab === 'account') router.push('/account');
  };

  return <StatsScreen onTabChange={handleTabChange} />;
}
