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
import { getWorkoutById, getPosturesLandmarks } from '../data/workouts';
import { GlobalWorkout, PostureJointAngles } from '../types/models';
import {
  CONNECTIONS,
  JOINTS,
  ALL_ANGLE_DEFINITIONS,
  calculateAngle,
  parseJsonField,
  computeRepConfig,
  RepetitionConfig,
} from '../utils/poseCalculations';

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

  const [reps, setReps] = useState<number>(0);
  const [currentSet, setCurrentSet] = useState<number>(1);

  const [workout, setWorkout] = useState<GlobalWorkout | null>(null);
  const [topAngles, setTopAngles] = useState<PostureJointAngles | null>(null);
  const [bottomAngles, setBottomAngles] = useState<PostureJointAngles | null>(null);
  const [isLoadingWorkout, setIsLoadingWorkout] = useState<boolean>(true);

  const repStateRef = useRef<'top' | 'bottom'>('top');
  const lastRepTimeRef = useRef<number>(0);

  const exerciseConfig = useMemo(() => {
    return computeRepConfig(topAngles, bottomAngles, workout?.title || workoutTitle);
  }, [topAngles, bottomAngles, workout?.title, workoutTitle]);

  const exerciseConfigRef = useRef<RepetitionConfig>(exerciseConfig);
  useEffect(() => {
    exerciseConfigRef.current = exerciseConfig;
  }, [exerciseConfig]);

  useEffect(() => {
    async function loadWorkoutData() {
      setIsLoadingWorkout(true);
      try {
        if (workoutId) {
          const workoutData = await getWorkoutById(workoutId);
          if (workoutData) {
            setWorkout(workoutData);
          }

          const landmarkData = await getPosturesLandmarks(workoutId);
          let extractedTop: PostureJointAngles | null = null;
          let extractedBottom: PostureJointAngles | null = null;

          landmarkData.forEach((row) => {
            const angles = parseJsonField<PostureJointAngles>(row.joint_angles || (row as any).joint_agles);
            if (angles) {
              const phaseKey = (row.phase || '').trim().toLowerCase();
              if (phaseKey === 'top') {
                extractedTop = angles;
              } else if (phaseKey === 'bottom') {
                extractedBottom = angles;
              }
            }
          });

          setTopAngles(extractedTop);
          setBottomAngles(extractedBottom);
        }
      } catch (err) {
        console.error('Failed to load workout data by id:', err);
      } finally {
        setIsLoadingWorkout(false);
      }
    }

    loadWorkoutData();
  }, [workoutId]);

  /**
   * MediaPipe Pose Detection TurboModule integration.
   * Runs model inference in LIVE_STREAM mode on the GPU.
   * Frame results update shared values on the UI worklet thread and evaluate rep state.
   */
  const poseDetection = usePoseDetection(
    {
      onResults: (result: any) => {
        const rawLandmarks = result?.results?.[0]?.landmarks ?? result?.landmarks ?? [];
        poses.value = rawLandmarks;

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

  /**
   * Generates SVG path string connecting skeleton landmarks on the UI worklet thread.
   * Transforms MediaPipe landscape camera sensor coordinates into portrait front-camera screen coordinates:
   *   x_screen = (1 - y_norm) * screen_width
   *   y_screen = (1 - x_norm) * screen_height
   */
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

      const v1 = p1.visibility ?? 1;
      const v2 = p2.visibility ?? 1;
      if (v1 < 0.35 || v2 < 0.35) continue;

      const x1 = (1 - p1.y) * w;
      const y1 = (1 - p1.x) * h;
      const x2 = (1 - p2.y) * w;
      const y2 = (1 - p2.x) * h;

      d += `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)} `;
    }

    return { d };
  });

  /**
   * Generates SVG circle sub-paths for prominent joint dots using arc commands.
   * Evaluated entirely in worklet context without bridging overhead.
   */
  const animatedJointsProps = useAnimatedProps(() => {
    'worklet';
    const { w, h } = size.value;
    const list = poses.value;
    if (!list || list.length === 0) return { d: '' };

    const pose = list[0];
    if (!pose) return { d: '' };

    let d = '';
    const r = 5.5;

    for (let i = 0; i < JOINTS.length; i++) {
      const lm = pose[JOINTS[i]];
      if (!lm) continue;

      const v = lm.visibility ?? 1;
      if (v < 0.35) continue;

      const cx = (1 - lm.y) * w;
      const cy = (1 - lm.x) * h;

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
        <AnimatedPath
          animatedProps={animatedProps}
          stroke="#CEFE34"
          strokeWidth={3.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <AnimatedPath
          animatedProps={animatedJointsProps}
          fill="#FFFFFF"
          stroke="#CEFE34"
          strokeWidth={2}
        />
      </Svg>

      <View style={styles.topContainer}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.backButtonText}>✕</Text>
          </TouchableOpacity>
        )}

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