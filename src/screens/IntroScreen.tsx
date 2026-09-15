import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { KineticColors, Typography } from '../constants/theme';

const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBU-hAPWNEfRQJvGNxazkBILXBugBbkHMo2jykvaYTH10-zQnVLM6r3Xu0Z4s-K-5HZx283TcQLAJ_BDBIW3gBZWOzN2dko_HrnD5xFZusqCVRLyCElefHuZDZbnX5MkV-plWyrQed0nedqYgnM9jxktzu2jKvKgMV1WfXPbX5pXN8ub4KIcWYnoV7svs7hMDBQF1Yt5iwkc2ft12SjukSVsp2HzK6AiOwsefyLzWyfRkGr_7IdpZ_9xU7_hcG10ouherI';

interface IntroStep {
  stepNumber: string;
  title: string;
  subtitle: string;
  mainIcon: keyof typeof MaterialIcons.glyphMap;
  cardTitle: string;
  cardDescription: string;
  features: Array<{
    icon: keyof typeof MaterialIcons.glyphMap;
    label: string;
    tag: string;
    tagHighlight?: boolean;
  }>;
}

const INTRO_STEPS: IntroStep[] = [
  {
    stepNumber: '1. Add Your Workout',
    title: '1. Add Your Workout',
    subtitle: 'Custom Routines & Target Sets',
    mainIcon: 'fitness-center',
    cardTitle: 'Routine Blueprint',
    cardDescription:
      'Create or select tailored training routines with customized sets, target reps, and structured rest intervals suited to your goals.',
    features: [
      {
        icon: 'tune',
        label: 'Quick Routine Builder',
        tag: 'READY',
      },
      {
        icon: 'format-list-numbered',
        label: 'Smart Sets & Reps Stepper',
        tag: 'AUTO',
      },
      {
        icon: 'timer',
        label: 'Auto Rest Timer',
        tag: 'HAPTIC',
      },
    ],
  },
  {
    stepNumber: '2. Workout in Front of Camera',
    title: '2. Workout in Front of Camera',
    subtitle: 'Live Computer Vision Guidance',
    mainIcon: 'videocam',
    cardTitle: 'MediaPipe Kinematics',
    cardDescription:
      'Tracks 33 skeletal joints in real-time with zero wearable hardware, validating squat depth, joint angles, and counting reps out loud.',
    features: [
      {
        icon: 'hub',
        label: '33 Skeletal Nodes Tracked',
        tag: '60 FPS',
        tagHighlight: true,
      },
      {
        icon: 'straighten',
        label: 'Real-Time Form Auditing',
        tag: '<5MS LATENCY',
        tagHighlight: true,
      },
      {
        icon: 'record-voice-over',
        label: 'Audio Rep Counter',
        tag: 'VOICE',
        tagHighlight: true,
      },
    ],
  },
  {
    stepNumber: '3. Keep Track of Your Stats',
    title: '3. Keep Track of Your Stats',
    subtitle: 'Precision Biometric Telemetry',
    mainIcon: 'insights',
    cardTitle: 'Biometric Telemetry',
    cardDescription:
      'Automated posture scores, weekly rep output curves, lumbar alignment history, and actionable AI coach tips after every workout.',
    features: [
      {
        icon: 'show-chart',
        label: 'Form Trajectory Curve',
        tag: '98.4% ACC',
        tagHighlight: true,
      },
      {
        icon: 'verified',
        label: 'Biomechanical Accuracy Score',
        tag: 'SCORE: 94',
        tagHighlight: true,
      },
      {
        icon: 'calendar-month',
        label: 'Daily Rep Frequency',
        tag: 'WEEKLY VIEW',
        tagHighlight: true,
      },
    ],
  },
];

interface IntroScreenProps {
  onComplete?: () => void;
  isUpdating?: boolean;
}

export default function IntroScreen({ onComplete, isUpdating = false }: IntroScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const btnScaleAnim = useRef(new Animated.Value(1)).current;

  const step = INTRO_STEPS[currentStep];
  const isLastStep = currentStep === INTRO_STEPS.length - 1;

  const animateTransition = (nextIndex: number) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -8,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentStep(nextIndex);
      slideAnim.setValue(8);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex === currentStep || stepIndex < 0 || stepIndex >= INTRO_STEPS.length) return;
    animateTransition(stepIndex);
  };

  const handleNext = () => {
    if (isUpdating) return;
    if (!isLastStep) {
      animateTransition(currentStep + 1);
    } else {
      if (onComplete) {
        onComplete();
      }
    }
  };

  const handleSkip = () => {
    animateTransition(INTRO_STEPS.length - 1);
  };

  const handlePressIn = () => {
    Animated.spring(btnScaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(btnScaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Visual Section */}
        <View style={styles.heroCard}>
          <Image source={{ uri: HERO_IMAGE }} style={styles.heroImage} resizeMode="cover" />

          {/* Vignette Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(18, 19, 22, 0.4)', '#121316']}
            locations={[0, 0.5, 1]}
            style={styles.heroGradient}
          />

          {/* Interactive Step Progress Indicators */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarWrapper}>
              {INTRO_STEPS.map((_, idx) => (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.7}
                  onPress={() => goToStep(idx)}
                  style={[
                    styles.progressBar,
                    idx <= currentStep ? styles.progressBarActive : styles.progressBarInactive,
                  ]}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Dynamic Step Content Panel */}
        <View style={styles.contentContainer}>
          <Animated.View
            style={[
              styles.stepPanel,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Step Header */}
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
            </View>

            {/* Step Card Container */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>
                  <MaterialIcons name={step.mainIcon} size={26} color={KineticColors.primaryFixed} />
                </View>
                <View style={styles.cardHeaderText}>
                  <Text style={styles.cardTitle}>{step.cardTitle}</Text>
                  <Text style={styles.cardDescription}>{step.cardDescription}</Text>
                </View>
              </View>

              {/* Feature List */}
              <View style={styles.featureList}>
                {step.features.map((item, fIdx) => (
                  <View key={fIdx} style={styles.featureRow}>
                    <MaterialIcons
                      name={item.icon}
                      size={18}
                      color={KineticColors.primaryFixed}
                    />
                    <Text style={styles.featureLabel}>{item.label}</Text>
                    <Text
                      style={[
                        styles.featureTag,
                        item.tagHighlight && styles.featureTagHighlight,
                      ]}
                    >
                      {item.tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Bottom Interactive Controls */}
        <View style={styles.bottomControls}>
          <Animated.View style={{ transform: [{ scale: btnScaleAnim }], width: '100%' }}>
            <Pressable
              disabled={isUpdating}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={handleNext}
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && !isUpdating && styles.primaryBtnPressed,
                isUpdating && { opacity: 0.8 },
              ]}
            >
              {isUpdating ? (
                <ActivityIndicator color={KineticColors.onPrimary} />
              ) : (
                <>
                  <Text style={styles.primaryBtnText}>
                    {isLastStep ? 'Get Started' : 'Next Step'}
                  </Text>
                  <MaterialIcons
                    name={isLastStep ? 'check-circle' : 'arrow-forward'}
                    size={20}
                    color={KineticColors.onPrimary}
                  />
                </>
              )}
            </Pressable>
          </Animated.View>

          {!isLastStep ? (
            <TouchableOpacity activeOpacity={0.7} onPress={handleSkip} style={styles.skipBtn}>
              <Text style={styles.skipBtnText}>Skip Introduction</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.skipBtnPlaceholder} />
          )}
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
    justifyContent: 'space-between',
  },
  heroCard: {
    position: 'relative',
    width: '100%',
    height: 230,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
    backgroundColor: KineticColors.surfaceContainerLowest,
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
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  progressBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    maxWidth: 240,
  },
  progressBar: {
    height: 6,
    flex: 1,
    borderRadius: 3,
  },
  progressBarActive: {
    backgroundColor: KineticColors.primaryFixed,
  },
  progressBarInactive: {
    backgroundColor: KineticColors.surfaceVariant,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    justifyContent: 'center',
  },
  stepPanel: {
    width: '100%',
  },
  stepHeader: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 26,
    lineHeight: 32,
    color: KineticColors.primary,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  stepSubtitle: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
    lineHeight: 18,
    color: KineticColors.primaryFixed,
    marginTop: 3,
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  card: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: KineticColors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'rgba(68, 73, 52, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: KineticColors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: 'rgba(212, 254, 66, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    lineHeight: 22,
    color: '#ffffff',
    letterSpacing: -0.2,
  },
  cardDescription: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    lineHeight: 18,
    color: KineticColors.onSurfaceVariant,
    marginTop: 3,
  },
  featureList: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(52, 53, 56, 0.6)',
    gap: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(31, 31, 35, 0.7)',
  },
  featureLabel: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 12,
    lineHeight: 16,
    color: KineticColors.onSurface,
    flex: 1,
  },
  featureTag: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 10,
    lineHeight: 13,
    color: KineticColors.outline,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  featureTagHighlight: {
    color: KineticColors.primaryFixed,
  },
  bottomControls: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
    alignItems: 'center',
  },
  primaryBtn: {
    width: '100%',
    height: 56,
    borderRadius: 9999,
    backgroundColor: KineticColors.primaryFixed,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#c9f236',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryBtnPressed: {
    opacity: 0.92,
  },
  primaryBtnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    lineHeight: 22,
    color: KineticColors.onPrimary,
    letterSpacing: -0.2,
  },
  skipBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipBtnPlaceholder: {
    height: 36,
  },
  skipBtnText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
    lineHeight: 20,
    color: KineticColors.onSurfaceVariant,
  },
});
