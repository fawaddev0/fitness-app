import React from 'react';
import { useRouter } from 'expo-router';
import AccountScreen from '../screens/AccountScreen';
import { NavTab } from '../components/BottomNavigationDock';

export default function AccountPage() {
  const router = useRouter();

  const handleTabChange = (tab: NavTab) => {
    if (tab === 'home') router.push('/home');
    if (tab === 'roadmaps') router.push('/roadmaps');
    if (tab === 'stats') router.push('/stats');
  };

  const handleSignOut = () => {
    // Navigate back to login
    router.replace('/');
  };

  return (
    <AccountScreen
      onTabChange={handleTabChange}
      onSignOut={handleSignOut}
    />
  );
}
