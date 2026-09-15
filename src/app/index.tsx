import React from 'react';
import { useRouter } from 'expo-router';
import AuthScreen from '../screens/AuthScreen';

export default function IndexPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/intro');
  };

  return <AuthScreen onSuccess={handleSuccess} />;
}
