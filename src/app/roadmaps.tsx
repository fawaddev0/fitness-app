import React from 'react';
import { useRouter } from 'expo-router';
import RoadmapScreen from '../screens/RoadmapScreen';
import { NavTab } from '../components/BottomNavigationDock';

export default function RoadmapsPage() {
  const router = useRouter();

  const handleTabChange = (tab: NavTab) => {
    if (tab === 'home') router.push('/home');
    if (tab === 'stats') router.push('/stats');
    if (tab === 'account') router.push('/account');
  };

  return (
    <RoadmapScreen
      onTabChange={handleTabChange}
      onSelectRoadmap={(roadmap) => {
        console.log('Selected roadmap:', roadmap.title);
      }}
    />
  );
}
