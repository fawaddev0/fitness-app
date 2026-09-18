import React, { useState, useEffect, useRef, useMemo } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import Svg, { Path } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps } from 'react-native-reanimated';
import {
  usePoseDetection,
  RunningMode,
  Delegate,
} from 'react-native-mediapipe-posedetection';
import { supabase } from '../utils/supabase';
import { getPosturesLandmarks } from '../data/workouts';
import { GlobalWorkout, PostureLandmark, PostureJointAngles } from '../types/models';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export interface ActiveWorkoutScreenProps {
  workoutId?: string;
  workoutTitle?: string;
  targetSets?: number;
  targetReps?: number;
  restDuration?: number;
  onBack?: () => void;
  onFinish?: () => void;
}

// Full Body Skeleton Connections
const CONNECTIONS: [number, number][] = [
  [11, 12], // Shoulders
  [11, 13], [13, 15], // Left Arm (Shoulder -> Elbow -> Wrist)
  [12, 14], [14, 16], // Right Arm (Shoulder -> Elbow -> Wrist)
  [11, 23], [12, 24], // Torso (Shoulders -> Hips)
  [23, 24], // Hips
  [23, 25], [25, 27], // Left Leg (Hip -> Knee -> Ankle)
  [24, 26], [26, 28], // Right Leg (Hip -> Knee -> Ankle)
];

// Major Joint Landmark Indices to render prominent dots on
const JOINTS: number[] = [
  11, 12, // Shoulders
  13, 14, // Elbows
  15, 16, // Wrists
  23, 24, // Hips
  25, 26, // Knees
  27, 28, // Ankles
];

// Angle Definitions: Maps joint angle keys to Landmark triplets and friendly labels
export const ALL_ANGLE_DEFINITIONS: Record<
  string,
  { p1: number; p2: number; p3: number; label: string }
> = {
  left_elbow_angle: { p1: 11, p2: 13, p3: 15, label: 'L-Elbow' },
  right_elbow_angle: { p1: 12, p2: 14, p3: 16, label: 'R-Elbow' },
  left_knee_angle: { p1: 23, p2: 25, p3: 27, label: 'L-Knee' },
  right_knee_angle: { p1: 24, p2: 26, p3: 28, label: 'R-Knee' },
  left_hip_angle: { p1: 11, p2: 23, p3: 25, label: 'L-Hip' },
  right_hip_angle: { p1: 12, p2: 24, p3: 26, label: 'R-Hip' },
  left_shoulder_angle: { p1: 23, p2: 11, p3: 13, label: 'L-Shoulder' },
  right_shoulder_angle: { p1: 24, p2: 12, p3: 14, label: 'R-Shoulder' },
};

function calculateAngle(
  a: { x: number; y: number },
  b: { x: number; y: number },
  c: { x: number; y: number }
): number {
  'worklet';
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) {
    angle = 360.0 - angle;
  }
  return Math.round(angle * 10) / 10;
}

function parseJsonField<T>(field: any): T | null {
  if (!field) return null;
  if (typeof field === 'object') return field as T;
  if (typeof field === 'string') {
    try {
      return JSON.parse(field) as T;
    } catch {
      return null;
    }
  }
  return null;
}

interface RepetitionConfig {
  driverJoints: string[];
  topThreshold: number;
  bottomThreshold: number;
  isDecreasingToBottom: boolean;
}

function computeRepConfig(
  top: PostureJointAngles | null,
  bottom: PostureJointAngles | null,
  workoutTitle?: string
): RepetitionConfig {
  // Default fallback for Squats (knee flexion)
  let driverJoints = ['left_knee_angle', 'right_knee_angle'];
  let topVal = 175;
  let bottomVal = 70;

  const titleLower = (workoutTitle || '').toLowerCase();
  if (
    titleLower.includes('push') ||
    titleLower.includes('press') ||
    titleLower.includes('curl')
  ) {
    driverJoints = ['left_elbow_angle', 'right_elbow_angle'];
    topVal = 170;
    bottomVal = 85;
  }

  // If workout reference poses exist in DB, find the joint with maximum range of motion (ROM)
  if (top && bottom) {
    let maxDelta = 0;
    let foundKeys: string[] = [];

    for (const key of Object.keys(top)) {
      const tVal = top[key];
      const bVal = bottom[key];
      if (typeof tVal === 'number' && typeof bVal === 'number') {
        const delta = Math.abs(tVal - bVal);
        if (delta > maxDelta && delta >= 25) {
          maxDelta = delta;
          topVal = tVal;
          bottomVal = bVal;

          if (key.startsWith('left_')) {
            foundKeys = [key, key.replace('left_', 'right_')];
          } else if (key.startsWith('right_')) {
            foundKeys = [key.replace('right_', 'left_'), key];
          } else {
            foundKeys = [key];
          }
        }
      }
    }

    if (foundKeys.length > 0) {
      driverJoints = foundKeys;
    }
  }

  const isDecreasingToBottom = bottomVal < topVal;
  const rom = Math.abs(topVal - bottomVal);

  // Bottom threshold: user reaches within 35% of bottom position ROM
  const bottomThreshold = isDecreasingToBottom
    ? bottomVal + rom * 0.35
    : bottomVal - rom * 0.35;

  // Top threshold: user returns to within 25% of top starting position ROM
  const topThreshold = isDecreasingToBottom
    ? topVal - rom * 0.25
    : topVal + rom * 0.25;

  return {
    driverJoints,
    topThreshold,
    bottomThreshold,
    isDecreasingToBottom,
  };
}

export default function ActiveWorkoutScreen({
  workoutId,
  workoutTitle = 'Workout Session',
  targetSets = 4,
  targetReps = 12,
  restDuration = 45,
  onBack,
  onFinish,
}: ActiveWorkoutScreenProps) {
  const device = useCameraDevice('front');
  const poses = useSharedValue<any[][]>([]);
  const size = useSharedValue({ w: 1, h: 1 });

  // Reps count & active session state
  const [reps, setReps] = useState<number>(0);
  const [currentSet, setCurrentSet] = useState<number>(1);

  // Loaded workout & posture data state
  const [workout, setWorkout] = useState<GlobalWorkout | null>(null);
  const [postures, setPostures] = useState<PostureLandmark[]>([]);
  const [topAngles, setTopAngles] = useState<PostureJointAngles | null>(null);
  const [bottomAngles, setBottomAngles] = useState<PostureJointAngles | null>(null);
  const [parsedAnglesByPhase, setParsedAnglesByPhase] = useState<Record<string, PostureJointAngles>>({});
  const [isLoadingWorkout, setIsLoadingWorkout] = useState<boolean>(true);

  // Repetition state machine references (kept in refs for fast frame checks)
  const repStateRef = useRef<'top' | 'bottom'>('top');
  const lastRepTimeRef = useRef<number>(0);

  // Compute active exercise configuration
  const exerciseConfig = useMemo(() => {
    return computeRepConfig(topAngles, bottomAngles, workout?.title || workoutTitle);
  }, [topAngles, bottomAngles, workout?.title, workoutTitle]);

  const exerciseConfigRef = useRef<RepetitionConfig>(exerciseConfig);
  useEffect(() => {
    exerciseConfigRef.current = exerciseConfig;
  }, [exerciseConfig]);

  // 1. Fetch Workout Data & Reference Postures by Workout ID
  useEffect(() => {
    async function loadWorkoutData() {
      setIsLoadingWorkout(true);
      try {
        if (workoutId) {
          // Fetch workout details from Supabase
          const { data: workoutData, error: workoutError } = await supabase
            .from('workouts')
            .select('*')
            .eq('id', workoutId)
            .single();

          if (workoutError) {
            console.warn('Error fetching workout details:', workoutError.message);
          } else if (workoutData) {
            setWorkout(workoutData);
            console.log('✅ Loaded Workout:', workoutData.title);
          }

          // Fetch reference postures and angles for this workout
          const landmarkData = await getPosturesLandmarks(workoutId);
          setPostures(landmarkData);

          const anglesMap: Record<string, PostureJointAngles> = {};
          let extractedTop: PostureJointAngles | null = null;
          let extractedBottom: PostureJointAngles | null = null;

          landmarkData.forEach((row) => {
            const angles = parseJsonField<PostureJointAngles>(row.joint_angles || (row as any).joint_agles);
            if (angles) {
              const phaseKey = (row.phase || '').trim().toLowerCase();
              anglesMap[phaseKey] = angles;
              if (phaseKey === 'top') {
                extractedTop = angles;
              } else if (phaseKey === 'bottom') {
                extractedBottom = angles;
              }
              console.log(`📍 Phase [${row.phase}] Target Angles:`, JSON.stringify(angles));
            }
          });

          setTopAngles(extractedTop);
          setBottomAngles(extractedBottom);
          setParsedAnglesByPhase(anglesMap);
          console.log('🎯 Stored States -> Top Angles:', extractedTop, 'Bottom Angles:', extractedBottom);
        }
      } catch (err) {
        console.error('Failed to load workout data by id:', err);
      } finally {
        setIsLoadingWorkout(false);
      }
    }

    loadWorkoutData();
  }, [workoutId]);

  const poseDetection = usePoseDetection(
    {
      onResults: (result: any) => {
        const rawLandmarks = result?.results?.[0]?.landmarks ?? result?.landmarks ?? [];
        poses.value = rawLandmarks;

        // Real-Time Repetition Evaluation
        if (rawLandmarks && rawLandmarks.length > 0) {
          const pose = rawLandmarks[0];
          if (pose) {
            const config = exerciseConfigRef.current;
            let sumAngle = 0;
            let validJointCount = 0;

            for (let i = 0; i < config.driverJoints.length; i++) {
              const jointKey = config.driverJoints[i];
              const def = ALL_ANGLE_DEFINITIONS[jointKey];
              if (!def) continue;

              const p1 = pose[def.p1];
              const p2 = pose[def.p2];
              const p3 = pose[def.p3];

              if (
                p1 &&
                p2 &&
                p3 &&
                (p1.visibility ?? 1) >= 0.35 &&
                (p2.visibility ?? 1) >= 0.35 &&
                (p3.visibility ?? 1) >= 0.35
              ) {
                const angle = calculateAngle(p1, p2, p3);
                sumAngle += angle;
                validJointCount++;
              }
            }

            if (validJointCount > 0) {
              const currentDriverAngle = sumAngle / validJointCount;
              const currentState = repStateRef.current;
              const now = Date.now();

              if (currentState === 'top') {
                const reachedBottom = config.isDecreasingToBottom
                  ? currentDriverAngle <= config.bottomThreshold
                  : currentDriverAngle >= config.bottomThreshold;

                if (reachedBottom) {
                  repStateRef.current = 'bottom';
                }
              } else if (currentState === 'bottom') {
                const reachedTop = config.isDecreasingToBottom
                  ? currentDriverAngle >= config.topThreshold
                  : currentDriverAngle <= config.topThreshold;

                if (reachedTop) {
                  // Guard against double-triggers with 400ms min interval
                  if (now - lastRepTimeRef.current > 400) {
                    lastRepTimeRef.current = now;
                    setReps((prev) => prev + 1);
                  }
                  repStateRef.current = 'top';
                }
              }
            }
          }
        }
      },
      onError: (e) => console.error(e.message),
    },
    RunningMode.LIVE_STREAM,
    'pose_landmarker_lite.task',
    {
      numPoses: 1,
      minPoseDetectionConfidence: 0.5,
      minPosePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
      delegate: Delegate.GPU,
      fpsMode: 10,
    }
  );

  // Skeleton Connections (Bones) Path
  const animatedProps = useAnimatedProps(() => {
    'worklet';
    const { w, h } = size.value;
    const list = poses.value;
    if (!list || list.length === 0) return { d: '' };

    const pose = list[0];
    if (!pose) return { d: '' };

    let d = '';
    for (let c = 0; c < CONNECTIONS.length; c++) {
      const p1 = pose[CONNECTIONS[c][0]];
      const p2 = pose[CONNECTIONS[c][1]];
      if (!p1 || !p2) continue;

      // Filter out off-screen or occluded joints
      const v1 = p1.visibility ?? 1;
      const v2 = p2.visibility ?? 1;
      if (v1 < 0.35 || v2 < 0.35) continue;

      // 90° portrait rotation + front-camera mirror mapping
      const x1 = (1 - p1.y) * w;
      const y1 = (1 - p1.x) * h;
      const x2 = (1 - p2.y) * w;
      const y2 = (1 - p2.x) * h;

      d += `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)} `;
    }

    return { d };
  });

  // Joint Landmark Dots Path
  const animatedJointsProps = useAnimatedProps(() => {
    'worklet';
    const { w, h } = size.value;
    const list = poses.value;
    if (!list || list.length === 0) return { d: '' };

    const pose = list[0];
    if (!pose) return { d: '' };

    let d = '';
    const r = 5.5; // Radius of joint circle

    for (let i = 0; i < JOINTS.length; i++) {
      const lm = pose[JOINTS[i]];
      if (!lm) continue;

      const v = lm.visibility ?? 1;
      if (v < 0.35) continue;

      // 90° portrait rotation + front-camera mirror mapping
      const cx = (1 - lm.y) * w;
      const cy = (1 - lm.x) * h;

      // Draw SVG circle using two arc commands
      d += `M${(cx - r).toFixed(1)} ${cy.toFixed(1)} a${r},${r} 0 1,0 ${(r * 2).toFixed(1)},0 a${r},${r} 0 1,0 ${(-r * 2).toFixed(1)},0 `;
    }

    return { d };
  });

  if (!device) return null;

  return (
    <>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        pixelFormat="rgb"
        isActive
        frameProcessor={poseDetection.frameProcessor}
        onLayout={(e) => {
          poseDetection.cameraViewLayoutChangeHandler(e);
          const { width, height } = e.nativeEvent.layout;
          size.value = { w: width, h: height };
        }}
      />
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        {/* Skeleton Bones / Lines */}
        <AnimatedPath
          animatedProps={animatedProps}
          stroke="#CEFE34"
          strokeWidth={3.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Joint Dots */}
        <AnimatedPath
          animatedProps={animatedJointsProps}
          fill="#FFFFFF"
          stroke="#CEFE34"
          strokeWidth={2}
        />
      </Svg>

      {/* Top Header & Reps Count Cell */}
      <View style={styles.topContainer}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.backButtonText}>✕</Text>
          </TouchableOpacity>
        )}

        {/* Reps Count Cell */}
        <View style={styles.repsCell}>
          <View style={styles.repsHeader}>
            <Text style={styles.repsLabel}>REPS</Text>
            <View style={styles.setBadge}>
              <Text style={styles.setText}>SET {currentSet}/{targetSets}</Text>
            </View>
          </View>
          <View style={styles.repsValueRow}>
            <Text style={styles.repsNumber}>{reps}</Text>
            <Text style={styles.repsTarget}>/{targetReps}</Text>
          </View>
        </View>
      </View>

      {/* Loading Overlay while fetching Workout data */}
      {isLoadingWorkout && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#CEFE34" />
          <Text style={styles.loadingText}>Loading workout data...</Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    position: 'absolute',
    top: 54,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(18, 19, 22, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  repsCell: {
    backgroundColor: 'rgba(18, 19, 22, 0.90)',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(206, 254, 52, 0.35)',
    minWidth: 140,
    alignItems: 'center',
  },
  repsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 2,
    gap: 8,
  },
  repsLabel: {
    color: '#CEFE34',
    fontSize: 11,
    fontFamily: 'SpaceGrotesk_700Bold',
    letterSpacing: 1.2,
  },
  setBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  setText: {
    color: '#8E8E93',
    fontSize: 10,
    fontWeight: '700',
  },
  repsValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  repsNumber: {
    color: '#FFFFFF',
    fontSize: 38,
    fontFamily: 'SpaceGrotesk_700Bold',
    lineHeight: 44,
  },
  repsTarget: {
    color: '#8E8E93',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 2,
  },
  loadingContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(18, 19, 22, 0.85)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  loadingText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
});