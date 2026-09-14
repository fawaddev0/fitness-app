import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { KineticColors, AppRounded } from '../constants/theme';
import { CooldownTimer } from '../components/CooldownTimer';

export interface ActiveWorkoutScreenProps {
  workoutTitle?: string;
  targetSets?: number;
  targetReps?: number;
  restDuration?: number;
  onBack?: () => void;
  onFinish?: () => void;
}

export default function ActiveWorkoutScreen({
  workoutTitle = 'Seated Shoulder Press',
  targetSets = 4,
  targetReps = 12,
  restDuration = 60,
  onBack,
  onFinish,
}: ActiveWorkoutScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('front');

  // Workout Session State
  const [sessionState, setSessionState] = useState<'adjusting' | 'active' | 'resting' | 'completed'>('adjusting');
  const [currentSet, setCurrentSet] = useState(1);
  const [currentReps, setCurrentReps] = useState(0);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isPoseAligned, setIsPoseAligned] = useState(false);

  // Active workout timer clock
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (sessionState === 'active' || sessionState === 'resting') {
      interval = setInterval(() => {
        setSessionSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionState]);

  // Simulate body alignment calibration during adjustment phase
  useEffect(() => {
    if (sessionState === 'adjusting') {
      const timer = setTimeout(() => {
        setIsPoseAligned(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [sessionState]);

  const handleStartWorkout = () => {
    setSessionState('active');
  };

  const handleIncrementRep = () => {
    if (sessionState !== 'active') return;

    if (currentReps + 1 >= targetReps) {
      setCurrentReps(targetReps);
      handleFinishSet();
    } else {
      setCurrentReps((prev) => prev + 1);
    }
  };

  const handleFinishSet = () => {
    if (currentSet >= targetSets) {
      setSessionState('completed');
    } else {
      setSessionState('resting');
    }
  };

  const handleCooldownComplete = () => {
    setCurrentSet((prev) => prev + 1);
    setCurrentReps(0);
    setSessionState('active');
  };

  const handleToggleCamera = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const handleBackPress = () => {
    if (sessionState === 'active' || sessionState === 'resting') {
      Alert.alert(
        'Exit Workout?',
        'Are you sure you want to end this workout session? Your progress will be saved.',
        [
          { text: 'Resume', style: 'cancel' },
          {
            text: 'End Workout',
            style: 'destructive',
            onPress: () => onBack?.(),
          },
        ]
      );
    } else {
      onBack?.();
    }
  };

  const formatSessionTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Top Floating Glassmorphic Header */}
      <View style={styles.topHeader}>
        {/* Back Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleBackPress}
          style={styles.backButton}
          accessibilityLabel="Go back"
        >
          <MaterialIcons
            name="arrow-back-ios-new"
            size={18}
            color={KineticColors.onSurface}
          />
        </TouchableOpacity>

        {/* Center Workout Title & Live Timer Pill */}
        <View style={styles.workoutPill}>
          <Text style={styles.workoutPillTitle} numberOfLines={1}>
            {workoutTitle}
          </Text>
          <View style={styles.workoutPillTimer}>
            <View style={styles.timerDot} />
            <Text style={styles.timerText}>{formatSessionTime(sessionSeconds)}</Text>
          </View>
        </View>

        {/* Camera Flip Action */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleToggleCamera}
          style={styles.cameraToggleBtn}
          accessibilityLabel="Flip camera"
        >
          <MaterialIcons
            name="flip-camera-ios"
            size={20}
            color={KineticColors.onSurface}
          />
        </TouchableOpacity>
      </View>

      {/* Main Full-Height Rounded Camera Viewport Container */}
      <View style={styles.cameraContainer}>
        {permission?.granted ? (
          <CameraView
            style={StyleSheet.absoluteFill}
            facing={facing}
          />
        ) : (
          /* Permission Request Fallback */
          <View style={styles.permissionFallback}>
            <MaterialIcons
              name="videocam"
              size={48}
              color={KineticColors.primaryFixed}
            />
            <Text style={styles.permissionTitle}>Camera Access Required</Text>
            <Text style={styles.permissionSubtitle}>
              Grant front camera access to track your body posture, reps, and workout alignment in real-time.
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={requestPermission}
              style={styles.grantPermissionBtn}
            >
              <Text style={styles.grantPermissionText}>Enable Camera</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Biomechanical Corner Brackets & Grid Framing Overlay */}
        <View style={styles.framingOverlay} pointerEvents="none">
          <View style={[styles.cornerBracket, styles.bracketTopLeft]} />
          <View style={[styles.cornerBracket, styles.bracketTopRight]} />
          <View style={[styles.cornerBracket, styles.bracketBottomLeft]} />
          <View style={[styles.cornerBracket, styles.bracketBottomRight]} />
        </View>

        {/* Phase 1: Adjusting / Alignment Mode Overlay */}
        {sessionState === 'adjusting' && (
          <View style={styles.adjustmentOverlay}>
            <LinearGradient
              colors={['rgba(18, 19, 22, 0.4)', 'rgba(18, 19, 22, 0.85)']}
              style={StyleSheet.absoluteFill}
            />

            <View style={styles.alignmentContent}>
              {/* Status Badge */}
              <View
                style={[
                  styles.alignmentBadge,
                  isPoseAligned && styles.alignmentBadgeReady,
                ]}
              >
                <MaterialIcons
                  name={isPoseAligned ? 'check-circle' : 'accessibility-new'}
                  size={18}
                  color={
                    isPoseAligned
                      ? KineticColors.primaryFixed
                      : KineticColors.secondary
                  }
                />
                <Text
                  style={[
                    styles.alignmentBadgeText,
                    isPoseAligned && styles.alignmentBadgeTextReady,
                  ]}
                >
                  {isPoseAligned
                    ? 'AI Pose Tracking Ready'
                    : 'Adjust Body in Frame'}
                </Text>
              </View>

              <Text style={styles.alignmentHeading}>
                {isPoseAligned
                  ? 'Great Form! Ready when you are.'
                  : 'Step back so full torso is visible'}
              </Text>

              <View style={styles.targetSpecsRow}>
                <View style={styles.targetSpec}>
                  <Text style={styles.targetSpecLabel}>TARGET SETS</Text>
                  <Text style={styles.targetSpecValue}>{targetSets}</Text>
                </View>
                <View style={styles.targetSpecDivider} />
                <View style={styles.targetSpec}>
                  <Text style={styles.targetSpecLabel}>TARGET REPS</Text>
                  <Text style={styles.targetSpecValue}>{targetReps}</Text>
                </View>
                <View style={styles.targetSpecDivider} />
                <View style={styles.targetSpec}>
                  <Text style={styles.targetSpecLabel}>REST INTERVAL</Text>
                  <Text style={styles.targetSpecValue}>{restDuration}s</Text>
                </View>
              </View>

              {/* Start Workout Button */}
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={handleStartWorkout}
                style={styles.startWorkoutBtn}
              >
                <MaterialIcons
                  name="play-arrow"
                  size={24}
                  color={KineticColors.onPrimary}
                />
                <Text style={styles.startWorkoutBtnText}>Start Workout</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Phase 2: Live Active Workout Tracking HUD */}
        {sessionState === 'active' && (
          <View style={styles.activeHudOverlay} pointerEvents="box-none">
            {/* Top Indicator */}
            <View style={styles.liveSetBadge}>
              <Text style={styles.liveSetBadgeText}>
                SET {currentSet} OF {targetSets}
              </Text>
            </View>

            {/* Bottom Controls Dock */}
            <View style={styles.bottomDockContainer}>
              {/* Reps Progress HUD Card */}
              <View style={styles.repCounterCard}>
                <View style={styles.repCounterHeader}>
                  <Text style={styles.repCounterLabel}>CURRENT REPS</Text>
                  <Text style={styles.repCounterRatio}>
                    {currentReps} <Text style={styles.repTargetDim}>/ {targetReps}</Text>
                  </Text>
                </View>

                {/* Progress Fill Bar */}
                <View style={styles.progressBarTrack}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${Math.min(100, (currentReps / targetReps) * 100)}%` },
                    ]}
                  />
                </View>
              </View>

              {/* Action Buttons Row */}
              <View style={styles.dockActionsRow}>
                {/* Rep Increment Button */}
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={handleIncrementRep}
                  style={styles.countRepBtn}
                >
                  <MaterialIcons
                    name="add"
                    size={22}
                    color={KineticColors.onPrimary}
                  />
                  <Text style={styles.countRepBtnText}>Count Rep</Text>
                </TouchableOpacity>

                {/* Finish Set Button */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleFinishSet}
                  style={styles.finishSetBtn}
                >
                  <MaterialIcons
                    name="check"
                    size={20}
                    color={KineticColors.onSurface}
                  />
                  <Text style={styles.finishSetBtnText}>Finish Set</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Phase 3: Cooldown Timer Modal / Overlay */}
        {sessionState === 'resting' && (
          <View style={styles.cooldownOverlay}>
            <CooldownTimer
              initialDurationSeconds={restDuration}
              currentSet={currentSet}
              totalSets={targetSets}
              nextExerciseName={workoutTitle}
              onComplete={handleCooldownComplete}
              onSkip={handleCooldownComplete}
            />
          </View>
        )}
      </View>

      {/* Phase 4: Workout Completed Celebration Modal */}
      <Modal
        visible={sessionState === 'completed'}
        transparent
        animationType="fade"
      >
        <View style={styles.completionModalBackdrop}>
          <View style={styles.completionCard}>
            <View style={styles.trophyWrapper}>
              <MaterialIcons
                name="emoji-events"
                size={40}
                color={KineticColors.primaryFixed}
              />
            </View>

            <Text style={styles.completionTitle}>Workout Completed!</Text>
            <Text style={styles.completionSubtitle}>
              Sensational effort on {workoutTitle}. All sets successfully tracked and logged.
            </Text>

            {/* Recap Stats Bento */}
            <View style={styles.statsRecapGrid}>
              <View style={styles.recapStatBox}>
                <Text style={styles.recapStatLabel}>TOTAL SETS</Text>
                <Text style={styles.recapStatValue}>{targetSets}</Text>
              </View>
              <View style={styles.recapStatBox}>
                <Text style={styles.recapStatLabel}>TOTAL REPS</Text>
                <Text style={styles.recapStatValue}>
                  {targetSets * targetReps}
                </Text>
              </View>
              <View style={styles.recapStatBox}>
                <Text style={styles.recapStatLabel}>DURATION</Text>
                <Text style={styles.recapStatValue}>
                  {formatSessionTime(sessionSeconds)}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => {
                if (onFinish) onFinish();
                else if (onBack) onBack();
              }}
              style={styles.doneBtn}
            >
              <Text style={styles.doneBtnText}>Finish & Return Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: KineticColors.surface,
  },
  topHeader: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 50,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: AppRounded.full,
    backgroundColor: 'rgba(41, 42, 45, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(31, 31, 35, 0.85)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: AppRounded.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    maxWidth: '65%',
  },
  workoutPillTitle: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
    color: KineticColors.onSurface,
    flexShrink: 1,
  },
  workoutPillTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: KineticColors.surfaceContainerHigh,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: AppRounded.full,
  },
  timerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: KineticColors.primaryFixed,
  },
  timerText: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 12,
    color: KineticColors.onSurface,
  },
  cameraToggleBtn: {
    width: 44,
    height: 44,
    borderRadius: AppRounded.full,
    backgroundColor: 'rgba(41, 42, 45, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#0d0e11',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  permissionFallback: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
    backgroundColor: KineticColors.surfaceContainer,
  },
  permissionTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 20,
    color: KineticColors.onSurface,
    textAlign: 'center',
  },
  permissionSubtitle: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: KineticColors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
  grantPermissionBtn: {
    backgroundColor: KineticColors.primaryFixed,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: AppRounded.full,
    marginTop: 8,
  },
  grantPermissionText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 15,
    color: KineticColors.onPrimary,
  },
  framingOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 10,
  },
  cornerBracket: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: 'rgba(212, 254, 66, 0.4)',
  },
  bracketTopLeft: {
    top: 20,
    left: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 10,
  },
  bracketTopRight: {
    top: 20,
    right: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 10,
  },
  bracketBottomLeft: {
    bottom: 20,
    left: 20,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 10,
  },
  bracketBottomRight: {
    bottom: 20,
    right: 20,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 10,
  },
  adjustmentOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 20,
    justifyContent: 'flex-end',
    padding: 24,
  },
  alignmentContent: {
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  alignmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(41, 42, 45, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: AppRounded.full,
    borderWidth: 1,
    borderColor: 'rgba(100, 217, 199, 0.3)',
  },
  alignmentBadgeReady: {
    borderColor: 'rgba(212, 254, 66, 0.4)',
  },
  alignmentBadgeText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 12,
    letterSpacing: 0.8,
    color: KineticColors.secondary,
    textTransform: 'uppercase',
  },
  alignmentBadgeTextReady: {
    color: KineticColors.primaryFixed,
  },
  alignmentHeading: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    color: KineticColors.onSurface,
    textAlign: 'center',
  },
  targetSpecsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(31, 31, 35, 0.85)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
  },
  targetSpec: {
    alignItems: 'center',
    flex: 1,
  },
  targetSpecLabel: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 10,
    letterSpacing: 0.8,
    color: KineticColors.onSurfaceVariant,
  },
  targetSpecValue: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 18,
    color: KineticColors.onSurface,
    marginTop: 2,
  },
  targetSpecDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  startWorkoutBtn: {
    width: '100%',
    backgroundColor: KineticColors.primaryFixed,
    borderRadius: AppRounded.full,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: KineticColors.primaryFixed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  startWorkoutBtnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 17,
    color: KineticColors.onPrimary,
  },
  activeHudOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 20,
    justifyContent: 'space-between',
    padding: 16,
  },
  liveSetBadge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(31, 31, 35, 0.85)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: AppRounded.full,
    borderWidth: 1,
    borderColor: 'rgba(212, 254, 66, 0.3)',
  },
  liveSetBadgeText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 12,
    letterSpacing: 0.88,
    color: KineticColors.primaryFixed,
  },
  bottomDockContainer: {
    gap: 12,
    width: '100%',
  },
  repCounterCard: {
    backgroundColor: 'rgba(31, 31, 35, 0.92)',
    borderRadius: 20,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  repCounterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  repCounterLabel: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 11,
    letterSpacing: 0.88,
    color: KineticColors.onSurfaceVariant,
  },
  repCounterRatio: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 24,
    color: KineticColors.onSurface,
  },
  repTargetDim: {
    fontSize: 16,
    color: KineticColors.onSurfaceVariant,
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: KineticColors.primaryFixed,
    borderRadius: 4,
  },
  dockActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  countRepBtn: {
    flex: 1.3,
    backgroundColor: KineticColors.primaryFixed,
    borderRadius: AppRounded.full,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: KineticColors.primaryFixed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  countRepBtnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: KineticColors.onPrimary,
  },
  finishSetBtn: {
    flex: 1,
    backgroundColor: KineticColors.surfaceContainerHigh,
    borderRadius: AppRounded.full,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  finishSetBtnText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 15,
    color: KineticColors.onSurface,
  },
  cooldownOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(18, 19, 22, 0.85)',
  },
  completionModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  completionCard: {
    backgroundColor: KineticColors.surfaceContainer,
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  trophyWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(212, 254, 66, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 22,
    color: KineticColors.onSurface,
    textAlign: 'center',
  },
  completionSubtitle: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: KineticColors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
  statsRecapGrid: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginVertical: 4,
  },
  recapStatBox: {
    flex: 1,
    backgroundColor: KineticColors.surfaceContainerLow,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    alignItems: 'center',
    gap: 4,
  },
  recapStatLabel: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 9,
    letterSpacing: 0.8,
    color: KineticColors.onSurfaceVariant,
  },
  recapStatValue: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 16,
    color: KineticColors.onSurface,
  },
  doneBtn: {
    width: '100%',
    backgroundColor: KineticColors.primaryFixed,
    borderRadius: AppRounded.full,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  doneBtnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: KineticColors.onPrimary,
  },
});
