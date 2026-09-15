import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { BottomNavigationDock, NavTab } from '../components/BottomNavigationDock';
import { KineticColors, Typography } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { getUserWorkouts } from '../data/workouts';
import { UserCreatedWorkout } from '../types/models';

const LOGO_IMAGE =
  'https://lh3.googleusercontent.com/aida/AEtjO1UhM0H9GMRwYsuavz7YIObGponbKbVMRmYgoeU6kc20Qd0Si7Ktowar_g8PGyimjIX53AfQpvjJ2OSz_no6-cqG31wstMGGW46YEYIUb92leVWKV5DrDv94-IywY6PQ9zSkx1LxaOhOdcQ8JZdWF71QlYOgomIquEYzIUPhTWslc2_daCuAQ7Rr_Dgjf4_FQuCxWi6yUUTSXq0UFVpZL5hVir3dTfZL-5JYmgAUw6bffmW7nxZVrLDJjBb1';

const PROFILE_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAJzo618P-HtjycCJZawKnmhDL1zWFC7qVEdn8HrpQxsKCQD3QE4EaJ5Qr9tmKfZ_GHfRHE3bQCXLvEqfhL8XmiWmXou4MsKvhByZNnYcuodxEzYuY6KMEzR9mV5s2a3pwizGaFvYwj8fg676AJn3suOnVZlt_k-VjZGEemDVNysnnfkA1gpDWVfC8q3u61B4Pgkwt3OANfhu_YdyllRBZFcvpEIgcwDICw52cX7Inp46hz3buizgChFw';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80';

interface HomeScreenProps {
  onAddWorkout?: () => void;
  onEditWorkout?: (workout: UserCreatedWorkout) => void;
  onStartWorkout?: (workout: UserCreatedWorkout) => void;
  onTabChange?: (tab: NavTab) => void;
  hideBottomDock?: boolean;
}

export default function HomeScreen({
  onAddWorkout,
  onEditWorkout,
  onStartWorkout,
  onTabChange,
  hideBottomDock = false,
}: HomeScreenProps) {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [workouts, setWorkouts] = useState<UserCreatedWorkout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUserWorkouts() {
      if (user) {
        const userWorkouts = await getUserWorkouts(user.id);
        setWorkouts(userWorkouts);
      }
      setIsLoading(false);
    }
    loadUserWorkouts();
  }, [user]);

  const handleTabSelect = (tab: NavTab) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Fixed Glassmorphic Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={{ uri: LOGO_IMAGE }} style={styles.headerLogo} resizeMode="contain" />
          <Text style={styles.headerTitle}>Home</Text>
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
        {/* Athlete Welcome Strip */}
        <View style={styles.welcomeSection}>
          <Text style={styles.dateLabel}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </Text>
          <Text style={styles.welcomeTitle}>Welcome back{userProfile?.fullname || 'Guest User'}</Text>
        </View>

        {/* Quick Metrics Row: Workouts & Streak */}
        <View style={styles.quickMetricsRow}>
          {/* Workouts Card */}
          <View style={styles.quickMetricCard}>
            <View style={styles.quickMetricHeader}>
              <Text style={styles.quickMetricLabel}>Workouts</Text>
              <MaterialIcons
                name="fitness-center"
                size={18}
                color={KineticColors.surfaceTint}
              />
            </View>
            <View style={styles.quickMetricBody}>
              <Text style={styles.quickMetricValue}>148</Text>
              <Text style={styles.quickMetricSub}>Total completed</Text>
            </View>
          </View>

          {/* Streak Card */}
          <View style={styles.quickMetricCard}>
            <View style={styles.quickMetricHeader}>
              <Text style={styles.quickMetricLabel}>Streak</Text>
              <MaterialIcons
                name="whatshot"
                size={18}
                color={KineticColors.secondary}
              />
            </View>
            <View style={styles.quickMetricBody}>
              <Text style={[styles.quickMetricValue, { color: KineticColors.secondary }]}>
                14 <Text style={styles.quickMetricUnit}>days</Text>
              </Text>
              <Text style={styles.quickMetricSub}>Active consistency</Text>
            </View>
          </View>
        </View>

        {/* My Workouts Section */}
        <View style={styles.workoutsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Workouts</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onAddWorkout}
              style={styles.addWorkoutBtn}
            >
              <MaterialIcons name="add" size={18} color="#293500" />
              <Text style={styles.addWorkoutText}>Add Workout</Text>
            </TouchableOpacity>
          </View>

          {/* Workout Cards */}
          <View style={styles.cardsContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color={KineticColors.primaryFixed} />
            ) : workouts.length === 0 ? (
              <Text style={{ color: KineticColors.onSurfaceVariant, textAlign: 'center', marginTop: 20 }}>
                No workouts created yet. Click "Add Workout" to create one.
              </Text>
            ) : (
              workouts.map((workout) => (
                <View key={workout.id} style={styles.workoutCard}>
                  {/* Card Top Info */}
                  <View style={styles.cardTopRow}>
                    <View style={styles.workoutThumbnailBox}>
                      <Image
                        source={{ uri: workout.workouts?.image_url || PLACEHOLDER_IMAGE }}
                        style={styles.workoutThumbnail}
                        resizeMode="cover"
                      />
                    </View>

                    <View style={styles.cardDetails}>
                      <Text style={styles.workoutTitle} numberOfLines={1}>
                        {workout.workouts?.title || 'Unknown Workout'}
                      </Text>
                      <View style={styles.chipRow}>
                        <View style={styles.chip}>
                          <Text style={styles.chipText}>{workout.sets_count} Sets</Text>
                        </View>
                        <View style={styles.chip}>
                          <Text style={styles.chipText}>{workout.reps_count} Reps</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Card Bottom Actions */}
                  <View style={styles.cardActionsRow}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => onEditWorkout?.(workout)}
                      style={styles.editBtn}
                    >
                      <MaterialIcons
                        name="tune"
                        size={18}
                        color={KineticColors.onSurface}
                      />
                      <Text style={styles.editBtnText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => onStartWorkout?.(workout)}
                      style={styles.startBtn}
                    >
                      <MaterialIcons name="play-arrow" size={18} color={KineticColors.primaryFixed} />
                      <Text style={styles.startBtnText}>Start</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Navigation Bar */}
      {!hideBottomDock && (
        <BottomNavigationDock
          activeTab={activeTab}
          onTabSelect={handleTabSelect}
        />
      )}
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
    paddingBottom: 160, // Ample clearance for floating bottom dock
  },
  welcomeSection: {
    marginBottom: 16,
  },
  dateLabel: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 11,
    lineHeight: 14,
    color: KineticColors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.88,
    marginBottom: 4,
  },
  welcomeTitle: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 24,
    lineHeight: 30,
    color: KineticColors.onSurface,
    letterSpacing: -0.24,
  },
  quickMetricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickMetricCard: {
    flex: 1,
    backgroundColor: KineticColors.surfaceContainer,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(50, 50, 50, 1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  quickMetricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quickMetricLabel: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 10,
    lineHeight: 13,
    color: KineticColors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  quickMetricBody: {
    gap: 2,
  },
  quickMetricValue: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 20,
    lineHeight: 26,
    color: KineticColors.onSurface,
  },
  quickMetricUnit: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    color: KineticColors.onSurfaceVariant,
  },
  quickMetricSub: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    lineHeight: 16,
    color: KineticColors.onSurfaceVariant,
  },
  workoutsSection: {
    gap: 16,
    marginTop: 30
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 18,
    lineHeight: 24,
    color: KineticColors.onSurface,
  },
  addWorkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: KineticColors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9999,
    gap: 4,
    shadowColor: KineticColors.primaryFixed,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 4,
  },
  addWorkoutText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 11,
    lineHeight: 14,
    color: '#293500',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  cardsContainer: {
    gap: 20,
  },
  workoutCard: {
    backgroundColor: KineticColors.surfaceContainer,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(50, 50, 50, 1)',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  workoutThumbnailBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: KineticColors.surfaceContainerHigh,
  },
  workoutThumbnail: {
    width: '100%',
    height: '100%',
  },
  cardDetails: {
    flex: 1,
    gap: 6,
  },
  workoutTitle: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 15,
    lineHeight: 20,
    color: KineticColors.onSurface,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chip: {
    backgroundColor: KineticColors.surfaceContainerHighest,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  chipText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 11,
    lineHeight: 14,
    color: KineticColors.onSurfaceVariant,
    letterSpacing: 0.2,
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 4,
  },
  editBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: 9999,
    backgroundColor: KineticColors.surfaceContainerHigh,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  editBtnText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 11,
    lineHeight: 14,
    color: KineticColors.onSurface,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  startBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: 9999,
    backgroundColor: KineticColors.surfaceContainerHigh,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  startBtnText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 11,
    lineHeight: 14,
    color: KineticColors.primaryFixed,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
