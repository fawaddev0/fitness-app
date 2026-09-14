import React from 'react';
import { useRouter } from 'expo-router';
import LoginScreen from '../screens/LoginScreen';

export default function IndexPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.replace('/intro');
  };

  return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
}
