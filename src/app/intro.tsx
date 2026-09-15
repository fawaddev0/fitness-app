import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import IntroScreen from '../screens/IntroScreen';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../data/users';

export default function IntroPage() {
  const router = useRouter();
  const { user, refreshUserProfile } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleComplete = async () => {
    if (isUpdating) return;
    setIsUpdating(true);

    if (user) {
      const success = await updateUserProfile(user.id, { has_onboarded: true });

      if (success) {
        await refreshUserProfile();
      }
    }

    setIsUpdating(false);
    router.push('/home');
  };

  return <IntroScreen onComplete={handleComplete} />;
}
