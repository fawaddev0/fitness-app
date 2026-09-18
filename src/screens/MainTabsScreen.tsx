import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  BackHandler,
} from 'react-native';
import { useRouter } from 'expo-router';
import HomeScreen from './HomeScreen';
import { UserCreatedWorkout } from '../types/models';
import RoadmapScreen, { RoadmapItem } from './RoadmapScreen';
import StatsScreen from './StatsScreen';
import AccountScreen from './AccountScreen';
import { BottomNavigationDock, NavTab } from '../components/BottomNavigationDock';
import { KineticColors } from '../constants/theme';

const TAB_INDEX_MAP: Record<NavTab, number> = {
  home: 0,
  roadmaps: 1,
  stats: 2,
  account: 3,
};

interface MainTabsScreenProps {
  initialTab?: NavTab;
}

export default function MainTabsScreen({ initialTab = 'home' }: MainTabsScreenProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<NavTab>(initialTab);
  const [tabHistory, setTabHistory] = useState<NavTab[]>([initialTab]);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  const activeIndex = TAB_INDEX_MAP[activeTab] ?? 0;
  const slideAnim = useRef(new Animated.Value(-activeIndex * screenWidth)).current;

  // Track window dimension changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });
    return () => subscription.remove();
  }, []);

  // Handle Android hardware back button press: navigate through tab history before exiting
  useEffect(() => {
    const onHardwareBack = () => {
      if (tabHistory.length > 1) {
        setTabHistory((prev) => {
          const next = [...prev];
          next.pop(); // remove current tab
          const prevTab = next[next.length - 1] ?? 'home';
          setActiveTab(prevTab);
          return next;
        });
        return true; // handled
      } else if (activeTab !== 'home') {
        setActiveTab('home');
        setTabHistory(['home']);
        return true; // handled
      }
      return false; // let OS handle back (exit app or root)
    };

    const backSubscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onHardwareBack
    );
    return () => backSubscription.remove();
  }, [activeTab, tabHistory]);

  // Instant native 60fps horizontal slide with zero delay
  useEffect(() => {
    const targetOffset = -activeIndex * screenWidth;
    Animated.spring(slideAnim, {
      toValue: targetOffset,
      useNativeDriver: true,
      damping: 20,
      mass: 0.35,
      stiffness: 300,
      overshootClamping: true,
    }).start();
  }, [activeIndex, screenWidth, slideAnim]);

  const handleTabSelect = useCallback((tab: NavTab) => {
    setActiveTab(tab);
    setTabHistory((prev) => (prev[prev.length - 1] === tab ? prev : [...prev, tab]));
  }, []);

  // Workout Actions
  const handleAddWorkout = useCallback(() => {
    router.push('/create-workout');
  }, [router]);

  const handleEditWorkout = useCallback((workout: UserCreatedWorkout) => {
    router.push({
      pathname: '/edit-workout',
      params: {
        id: workout.id,
        workoutId: workout.workout_id,
        title: workout.workouts?.title || 'Workout',
        sets: workout.sets_count,
        reps: workout.reps_count,
        restSeconds: workout.rest_seconds || workout.workouts?.rest_seconds || 45,
      },
    });
  }, [router]);

  const handleStartWorkout = useCallback((workout: UserCreatedWorkout) => {
    router.push({
      pathname: '/active-workout',
      params: {
        id: workout.id,
        workoutId: workout.workout_id,
        title: workout.workouts?.title || 'Workout',
        sets: workout.sets_count,
        reps: workout.reps_count,
        restSeconds: workout.rest_seconds || workout.workouts?.rest_seconds || 45,
      },
    });
  }, [router]);

  const handleSelectRoadmap = useCallback((roadmap: RoadmapItem) => {
    console.log('Selected roadmap:', roadmap.title);
  }, []);

  const handleSignOut = useCallback(() => {
    router.replace('/');
  }, [router]);

  // Memoize screen instances so changing tabs does zero JS re-rendering
  const homeScreenMemo = useMemo(
    () => (
      <HomeScreen
        onAddWorkout={handleAddWorkout}
        onEditWorkout={handleEditWorkout}
        onStartWorkout={handleStartWorkout}
        onTabChange={handleTabSelect}
        hideBottomDock={true}
      />
    ),
    [handleAddWorkout, handleEditWorkout, handleStartWorkout, handleTabSelect]
  );

  const roadmapScreenMemo = useMemo(
    () => (
      <RoadmapScreen
        onSelectRoadmap={handleSelectRoadmap}
        onTabChange={handleTabSelect}
        hideBottomDock={true}
      />
    ),
    [handleSelectRoadmap, handleTabSelect]
  );

  const statsScreenMemo = useMemo(
    () => (
      <StatsScreen
        onTabChange={handleTabSelect}
        hideBottomDock={true}
      />
    ),
    [handleTabSelect]
  );

  const accountScreenMemo = useMemo(
    () => (
      <AccountScreen
        onSignOut={handleSignOut}
        onTabChange={handleTabSelect}
        hideBottomDock={true}
      />
    ),
    [handleSignOut, handleTabSelect]
  );

  return (
    <View style={styles.rootContainer}>
      {/* Sliding Horizontal Screens Viewport */}
      <Animated.View
        style={[
          styles.pagesRow,
          {
            width: screenWidth * 4,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={[styles.pageWrapper, { width: screenWidth }]}>
          {homeScreenMemo}
        </View>

        <View style={[styles.pageWrapper, { width: screenWidth }]}>
          {roadmapScreenMemo}
        </View>

        <View style={[styles.pageWrapper, { width: screenWidth }]}>
          {statsScreenMemo}
        </View>

        <View style={[styles.pageWrapper, { width: screenWidth }]}>
          {accountScreenMemo}
        </View>
      </Animated.View>

      {/* Single, Persistent Floating Bottom Navigation Dock */}
      <BottomNavigationDock
        activeTab={activeTab}
        onTabSelect={handleTabSelect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: KineticColors.surface,
    overflow: 'hidden',
  },
  pagesRow: {
    flex: 1,
    flexDirection: 'row',
  },
  pageWrapper: {
    flexShrink: 0,
    height: '100%',
  },
});
