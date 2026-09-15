import React from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import AuthScreen from '../screens/AuthScreen';
import { useAuth } from '../context/AuthContext';
import { KineticColors } from '../constants/theme';

export default function IndexPage() {
  const router = useRouter();
  const { isLoading, session } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: KineticColors.surface, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={KineticColors.primaryFixed} />
      </View>
    );
  }

  // If the user is logged in, AuthContext's useEffect will redirect them to /home or /intro.
  // We return an empty view here so the login screen doesn't flash before the redirect happens.
  if (session) {
    return <View style={{ flex: 1, backgroundColor: KineticColors.surface }} />;
  }

  const handleSuccess = () => {
    router.push('/intro');
  };

  return <AuthScreen onSuccess={handleSuccess} />;
}
