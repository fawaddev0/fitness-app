import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { BottomNavigationDock, NavTab } from '../components/BottomNavigationDock';
import { KineticColors } from '../constants/theme';

const LOGO_IMAGE =
  'https://lh3.googleusercontent.com/aida/AEtjO1UhM0H9GMRwYsuavz7YIObGponbKbVMRmYgoeU6kc20Qd0Si7Ktowar_g8PGyimjIX53AfQpvjJ2OSz_no6-cqG31wstMGGW46YEYIUb92leVWKV5DrDv94-IywY6PQ9zSkx1LxaOhOdcQ8JZdWF71QlYOgomIquEYzIUPhTWslc2_daCuAQ7Rr_Dgjf4_FQuCxWi6yUUTSXq0UFVpZL5hVir3dTfZL-5JYmgAUw6bffmW7nxZVrLDJjBb1';

const PROFILE_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAJzo618P-HtjycCJZawKnmhDL1zWFC7qVEdn8HrpQxsKCQD3QE4EaJ5Qr9tmKfZ_GHfRHE3bQCXLvEqfhL8XmiWmXou4MsKvhByZNnYcuodxEzYuY6KMEzR9mV5s2a3pwizGaFvYwj8fg676AJn3suOnVZlt_k-VjZGEemDVNysnnfkA1gpDWVfC8q3u61B4Pgkwt3OANfhu_YdyllRBZFcvpEIgcwDICw52cX7Inp46hz3buizgChFw';

interface AccountScreenProps {
  onSignOut?: () => void;
  onTabChange?: (tab: NavTab) => void;
}

export default function AccountScreen({
  onSignOut,
  onTabChange,
}: AccountScreenProps) {
  const handleSignOutPress = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => onSignOut?.(),
      },
    ]);
  };

  const handleTabSelect = (tab: NavTab) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={{ uri: LOGO_IMAGE }} style={styles.headerLogo} resizeMode="contain" />
          <Text style={styles.headerTitle}>Account</Text>
        </View>
        <TouchableOpacity activeOpacity={0.8} style={styles.profileBtn}>
          <Image source={{ uri: PROFILE_IMAGE }} style={styles.profileAvatar} />
        </TouchableOpacity>
      </View>

      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Hero Bento Card */}
        <View style={styles.profileCard}>
          {/* Ambient Glow */}
          <View style={styles.ambientGlow} />

          <View style={styles.profileCardContent}>
            {/* Avatar with Gradient Halo */}
            <View style={styles.avatarWrapper}>
              <LinearGradient
                colors={[KineticColors.primaryFixed, KineticColors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarGradientRing}
              >
                <Image source={{ uri: PROFILE_IMAGE }} style={styles.avatarImage} />
              </LinearGradient>
              <View style={styles.verifiedBadge}>
                <MaterialIcons
                  name="verified"
                  size={16}
                  color={KineticColors.primaryFixed}
                />
              </View>
            </View>

            {/* User Info */}
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Alex Morgan</Text>
              <Text style={styles.userEmail}>alex.morgan@fitness.ai</Text>
            </View>
          </View>
        </View>

        {/* Biometric & Physical Details Grid */}
        <View style={styles.metricsGrid}>
          {/* Height Card */}
          <View style={styles.metricCard}>
            <View style={styles.metricCardHeader}>
              <Text style={styles.metricLabel}>Height</Text>
              <MaterialIcons
                name="height"
                size={18}
                color={KineticColors.surfaceTint}
              />
            </View>
            <View style={styles.metricBody}>
              <Text style={styles.metricValue}>
                178 <Text style={styles.metricUnit}>cm</Text>
              </Text>
              <Text style={styles.metricSub}>5 ft 10 in</Text>
            </View>
          </View>

          {/* Weight Card */}
          <View style={styles.metricCard}>
            <View style={styles.metricCardHeader}>
              <Text style={styles.metricLabel}>Weight</Text>
              <MaterialIcons
                name="monitor-weight"
                size={18}
                color={KineticColors.primaryFixed}
              />
            </View>
            <View style={styles.metricBody}>
              <Text style={styles.metricValue}>
                74.5 <Text style={styles.metricUnit}>kg</Text>
              </Text>
              <Text style={styles.metricSub}>Target: 75.0 kg</Text>
            </View>
          </View>

          {/* Workouts Completed Card */}
          <View style={styles.metricCard}>
            <View style={styles.metricCardHeader}>
              <Text style={styles.metricLabel}>Workouts</Text>
              <MaterialIcons
                name="fitness-center"
                size={18}
                color={KineticColors.surfaceTint}
              />
            </View>
            <View style={styles.metricBody}>
              <Text style={styles.metricValue}>148</Text>
              <Text style={styles.metricSub}>Total completed</Text>
            </View>
          </View>

          {/* Streak Card */}
          <View style={styles.metricCard}>
            <View style={styles.metricCardHeader}>
              <Text style={styles.metricLabel}>Streak</Text>
              <MaterialIcons
                name="whatshot"
                size={18}
                color={KineticColors.secondary}
              />
            </View>
            <View style={styles.metricBody}>
              <Text style={[styles.metricValue, { color: KineticColors.secondary }]}>
                14 <Text style={styles.metricUnit}>days</Text>
              </Text>
              <Text style={styles.metricSub}>Active consistency</Text>
            </View>
          </View>
        </View>

        {/* Sign Out Action Button */}
        <View style={styles.signOutContainer}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSignOutPress}
            style={styles.signOutBtn}
          >
            <MaterialIcons
              name="logout"
              size={20}
              color={KineticColors.onErrorContainer}
            />
            <Text style={styles.signOutText}>Sign Out of Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating Bottom Navigation Dock */}
      <BottomNavigationDock activeTab="account" onTabSelect={handleTabSelect} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: KineticColors.surface,
  },
  header: {
    height: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(18, 19, 22, 0.85)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerLogo: {
    width: 32,
    height: 32,
  },
  headerTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 18,
    lineHeight: 24,
    color: KineticColors.onSurface,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  profileBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(212, 254, 66, 0.4)',
  },
  profileAvatar: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 160,
    gap: 20,
  },
  profileCard: {
    position: 'relative',
    backgroundColor: KineticColors.surfaceContainer,
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 5,
  },
  ambientGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(201, 242, 54, 0.08)',
  },
  profileCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    zIndex: 10,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarGradientRing: {
    width: 78,
    height: 78,
    borderRadius: 39,
    padding: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: KineticColors.primaryFixed,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 37,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: KineticColors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: KineticColors.surfaceContainer,
  },
  userInfo: {
    flex: 1,
    gap: 3,
  },
  userName: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 20,
    lineHeight: 26,
    color: KineticColors.onSurface,
    letterSpacing: -0.3,
  },
  userEmail: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    lineHeight: 18,
    color: KineticColors.onSurfaceVariant,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: '48%',
    backgroundColor: KineticColors.surfaceContainer,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  metricCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricLabel: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 10,
    lineHeight: 13,
    color: KineticColors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  metricBody: {
    gap: 2,
  },
  metricValue: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 20,
    lineHeight: 26,
    color: KineticColors.onSurface,
  },
  metricUnit: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    color: KineticColors.onSurfaceVariant,
  },
  metricSub: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    lineHeight: 16,
    color: KineticColors.onSurfaceVariant,
  },
  signOutContainer: {
    paddingTop: 8,
  },
  signOutBtn: {
    width: '100%',
    minHeight: 52,
    borderRadius: 9999,
    backgroundColor: KineticColors.errorContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  signOutText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 15,
    lineHeight: 20,
    color: KineticColors.onErrorContainer,
    letterSpacing: 0.2,
  },
});
