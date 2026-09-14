import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Animated,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { GoogleIcon } from '../components/GoogleIcon';
import { KineticColors, Typography } from '../constants/theme';

const { width } = Dimensions.get('window');

const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuASAqhdNqUQFcunsNPUkzKMkh33HSleXYKm1s7oOAyRz4MWCszXHxtViIKt9XkXoFJTKIOtH6mQA-x4ucbBr44NjrPo9yFoKnLe7QAgrIuAYT_sg7isB5UkM2HAp9CqY1SK4L83ndmEER9Dn2LPgiZP6U2Nct73OADZ3_NU9FPikTVqZI5QH7uaptX-Pl2janEC5-pQwqxEFRT3f5RpgDsJ4X3DeR6B0lG4UFOcWP9qQLrgf2843iRM8g';

const LOGO_IMAGE =
  'https://lh3.googleusercontent.com/aida/AEtjO1UhM0H9GMRwYsuavz7YIObGponbKbVMRmYgoeU6kc20Qd0Si7Ktowar_g8PGyimjIX53AfQpvjJ2OSz_no6-cqG31wstMGGW46YEYIUb92leVWKV5DrDv94-IywY6PQ9zSkx1LxaOhOdcQ8JZdWF71QlYOgomIquEYzIUPhTWslc2_daCuAQ7Rr_Dgjf4_FQuCxWi6yUUTSXq0UFVpZL5hVir3dTfZL-5JYmgAUw6bffmW7nxZVrLDJjBb1';

interface LoginScreenProps {
  onLoginSuccess?: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handleGoogleLogin = () => {
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Hero Card Container */}
        <View style={styles.heroCard}>
          <Image source={{ uri: HERO_IMAGE }} style={styles.heroImage} resizeMode="cover" />

          {/* Top Gradient */}
          <LinearGradient
            colors={['rgba(18, 19, 22, 0.85)', 'rgba(18, 19, 22, 0.2)', 'transparent']}
            style={styles.topGradient}
          />

          {/* Bottom Blend Gradient */}
          <LinearGradient
            colors={['transparent', 'rgba(18, 19, 22, 0.65)', '#121316']}
            locations={[0, 0.55, 1]}
            style={styles.bottomGradient}
          />

          {/* Centered Logo & Title Block */}
          <View style={styles.heroContent}>
            {/* Logo Avatar with Halo Glow */}
            <View style={styles.logoWrapper}>
              <View style={styles.glowHalo} />
              <Image source={{ uri: LOGO_IMAGE }} style={styles.logoImage} />
              <View style={styles.boltBadge}>
                <MaterialIcons name="bolt" size={13} color={KineticColors.primaryFixed} />
              </View>
            </View>

            {/* Title Header */}
            <View style={styles.titleRow}>
              <Text style={styles.titlePrefix}>PoseFit</Text>
              <Text style={styles.titleSuffix}>AI</Text>
            </View>

            {/* Subtitle */}
            <Text style={styles.subtitle}>
              Live Posture Tracking & Real-Time Rep Counter
            </Text>
          </View>
        </View>

        {/* Action Button Section */}
        <View style={styles.actionSection}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%' }}>
            <Pressable
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={handleGoogleLogin}
              style={({ pressed }) => [
                styles.googleButton,
                pressed && styles.googleButtonPressed,
              ]}
            >
              <View style={styles.googleButtonLeft}>
                <View style={styles.googleIconContainer}>
                  <GoogleIcon size={16} />
                </View>
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </View>
              <MaterialIcons
                name="arrow-forward"
                size={20}
                color={KineticColors.onSurfaceVariant}
              />
            </Pressable>
          </Animated.View>
        </View>

        {/* Footer & Trust Badges */}
        <View style={styles.footerSection}>
          {/* Trust Chips */}
          <View style={styles.trustBadgePill}>
            <View style={styles.trustItem}>
              <MaterialIcons
                name="check-circle"
                size={14}
                color={KineticColors.primaryFixedDim}
              />
              <Text style={styles.trustText}>Zero Sensor Setup</Text>
            </View>

            <View style={styles.dotSeparator} />

            <View style={styles.trustItem}>
              <MaterialIcons
                name="shield"
                size={14}
                color={KineticColors.secondary}
              />
              <Text style={styles.trustText}>On-Device CV</Text>
            </View>
          </View>

          {/* Legal Disclaimer */}
          <Text style={styles.legalText}>
            By continuing, you agree to our{' '}
            <Text
              style={styles.legalLink}
              onPress={() => openLink('https://example.com/terms')}
            >
              Terms of Service
            </Text>{' '}
            &{' '}
            <Text
              style={styles.legalLink}
              onPress={() => openLink('https://example.com/privacy')}
            >
              Privacy Policy
            </Text>
            .
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: KineticColors.surface,
  },
  container: {
    flex: 1,
    backgroundColor: KineticColors.surface,
    paddingHorizontal: 20,
    justifyContent: 'center',
    width: '100%',
  },
  heroCard: {
    position: 'relative',
    width: '100%',
    height: 320,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    backgroundColor: KineticColors.surfaceContainerLowest,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 10,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 220,
  },
  heroContent: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  logoWrapper: {
    position: 'relative',
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowHalo: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: KineticColors.primaryContainer,
    opacity: 0.4,
    transform: [{ scale: 1.15 }],
  },
  logoImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: KineticColors.surfaceContainerLowest,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  boltBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: KineticColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: KineticColors.surface,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 6,
  },
  titlePrefix: {
    ...Typography.headlineLg,
    color: KineticColors.onSurface,
    letterSpacing: -0.64,
  },
  titleSuffix: {
    ...Typography.displayHeroMobile,
    color: KineticColors.primaryFixed,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 12,
    lineHeight: 16,
    color: KineticColors.onSurfaceVariant,
    maxWidth: 260,
    marginTop: 2,
    textAlign: 'center',
  },
  actionSection: {
    width: '100%',
    paddingHorizontal: 4,
    gap: 12,
  },
  googleButton: {
    width: '100%',
    height: 56,
    borderRadius: 9999,
    backgroundColor: KineticColors.surfaceContainerHigh,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  googleButtonPressed: {
    backgroundColor: KineticColors.surfaceBright,
  },
  googleButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  googleIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: KineticColors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: {
    ...Typography.headlineSm,
    color: KineticColors.primary,
  },
  footerSection: {
    marginTop: 24,
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  trustBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: KineticColors.surfaceContainerLow,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  trustText: {
    ...Typography.bodySm,
    color: KineticColors.onSurface,
    fontSize: 12,
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: KineticColors.surfaceVariant,
  },
  legalText: {
    ...Typography.bodySm,
    color: KineticColors.onSurfaceVariant,
    maxWidth: 290,
    lineHeight: 18,
    textAlign: 'center',
  },
  legalLink: {
    color: KineticColors.primary,
    textDecorationLine: 'underline',
    textDecorationColor: KineticColors.outlineVariant,
  },
});
