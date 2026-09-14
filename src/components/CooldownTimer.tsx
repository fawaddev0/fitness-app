import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import { KineticColors, AppRounded } from '../constants/theme';

interface CooldownTimerProps {
  initialDurationSeconds?: number;
  currentSet: number;
  totalSets: number;
  nextExerciseName?: string;
  onComplete: () => void;
  onSkip: () => void;
}

const TIMER_SIZE = 240;
const STROKE_WIDTH = 10;
const RADIUS = (TIMER_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function CooldownTimer({
  initialDurationSeconds = 60,
  currentSet,
  totalSets,
  nextExerciseName,
  onComplete,
  onSkip,
}: CooldownTimerProps) {
  const [totalDuration, setTotalDuration] = useState(initialDurationSeconds);
  const [timeLeft, setTimeLeft] = useState(initialDurationSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onComplete]);

  const handleAdd15s = () => {
    setTimeLeft((prev) => prev + 15);
    setTotalDuration((prev) => Math.max(prev, timeLeft + 15));
  };

  const progress = totalDuration > 0 ? timeLeft / totalDuration : 0;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Rest Badge Header */}
      <View style={styles.badgeWrapper}>
        <MaterialIcons
          name="timer"
          size={16}
          color={KineticColors.secondary}
        />
        <Text style={styles.badgeText}>REST & RECOVER</Text>
      </View>

      {/* Circular SVG Timer */}
      <View style={styles.timerCircleWrapper}>
        <Svg width={TIMER_SIZE} height={TIMER_SIZE} style={styles.svg}>
          {/* Background Track Circle */}
          <Circle
            cx={TIMER_SIZE / 2}
            cy={TIMER_SIZE / 2}
            r={RADIUS}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={STROKE_WIDTH}
            fill="transparent"
          />

          {/* Animated Primary Progress Outline */}
          <Circle
            cx={TIMER_SIZE / 2}
            cy={TIMER_SIZE / 2}
            r={RADIUS}
            stroke={KineticColors.primaryFixed}
            strokeWidth={STROKE_WIDTH}
            fill="transparent"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${TIMER_SIZE / 2} ${TIMER_SIZE / 2})`}
          />
        </Svg>

        {/* Center Digital Countdown */}
        <View style={styles.centerContent}>
          <Text style={styles.timeDigits}>{formatTime(timeLeft)}</Text>
          <Text style={styles.timeSecondsLabel}>{timeLeft}s remaining</Text>
        </View>
      </View>

      {/* Up Next Set Indicator */}
      <View style={styles.upNextCard}>
        <Text style={styles.upNextLabel}>UP NEXT</Text>
        <Text style={styles.upNextTitle}>
          Set {currentSet + 1} of {totalSets}
        </Text>
        {nextExerciseName ? (
          <Text style={styles.upNextSubtitle}>{nextExerciseName}</Text>
        ) : null}
      </View>

      {/* Action Controls */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleAdd15s}
          style={styles.addTimeBtn}
        >
          <MaterialIcons
            name="more-time"
            size={18}
            color={KineticColors.onSurface}
          />
          <Text style={styles.addTimeBtnText}>+15s</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.88}
          onPress={onSkip}
          style={styles.skipBtn}
        >
          <MaterialIcons
            name="skip-next"
            size={20}
            color={KineticColors.onPrimary}
          />
          <Text style={styles.skipBtnText}>Skip Rest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 20,
    backgroundColor: 'rgba(18, 19, 22, 0.94)',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    width: '92%',
    maxWidth: 360,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  badgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: AppRounded.full,
    backgroundColor: KineticColors.surfaceContainerHigh,
  },
  badgeText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 11,
    letterSpacing: 0.88,
    color: KineticColors.secondary,
    textTransform: 'uppercase',
  },
  timerCircleWrapper: {
    width: TIMER_SIZE,
    height: TIMER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 4,
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  timeDigits: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 44,
    lineHeight: 48,
    color: KineticColors.onSurface,
    letterSpacing: -1,
  },
  timeSecondsLabel: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    color: KineticColors.onSurfaceVariant,
  },
  upNextCard: {
    alignItems: 'center',
    backgroundColor: KineticColors.surfaceContainerLow,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
    width: '100%',
    gap: 2,
  },
  upNextLabel: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 10,
    letterSpacing: 0.88,
    color: KineticColors.onSurfaceVariant,
  },
  upNextTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: KineticColors.onSurface,
  },
  upNextSubtitle: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    color: KineticColors.onSurfaceVariant,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    marginTop: 4,
  },
  addTimeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    backgroundColor: KineticColors.surfaceContainerHigh,
    borderRadius: AppRounded.full,
  },
  addTimeBtnText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 15,
    color: KineticColors.onSurface,
  },
  skipBtn: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    backgroundColor: KineticColors.primaryFixed,
    borderRadius: AppRounded.full,
    shadowColor: KineticColors.primaryFixed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  skipBtnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 15,
    color: KineticColors.onPrimary,
  },
});
