import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import { KineticColors } from '@/constants/theme';
import { AuthProvider } from '@/context/AuthContext';

SplashScreen.preventAutoHideAsync().catch(() => {});
SystemUI.setBackgroundColorAsync(KineticColors.surface).catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(KineticColors.surface).catch(() => {});
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: KineticColors.surface,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color={KineticColors.primaryFixed} />
      </View>
    );
  }

  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: KineticColors.surface },
          animation: 'ios_from_right',
          presentation: 'card',
          gestureEnabled: true,
          animationMatchesGesture: true,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="intro" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="home" options={{ headerShown: false, animation: 'ios_from_right' }} />
        <Stack.Screen name="roadmaps" options={{ headerShown: false, animation: 'ios_from_right' }} />
        <Stack.Screen name="stats" options={{ headerShown: false, animation: 'ios_from_right' }} />
        <Stack.Screen name="account" options={{ headerShown: false, animation: 'ios_from_right' }} />
        <Stack.Screen name="create-workout" options={{ headerShown: false, animation: 'ios_from_right' }} />
        <Stack.Screen name="edit-workout" options={{ headerShown: false, animation: 'ios_from_right' }} />
        <Stack.Screen name="active-workout" options={{ headerShown: false, animation: 'ios_from_right' }} />
      </Stack>
    </AuthProvider>
  );
}
