import React from 'react';
import { StyleSheet } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import Svg, { Path } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps } from 'react-native-reanimated';
import {
  usePoseDetection,
  RunningMode,
  Delegate,
} from 'react-native-mediapipe-posedetection';

const AnimatedPath = Animated.createAnimatedComponent(Path);

// Upper Body ONLY (Shoulders, Arms, Forearms, Torso, Hips) - No legs/feet
const CONNECTIONS: [number, number][] = [
  [11, 12], // Shoulders
  [11, 13], [13, 15], // Left Arm (Shoulder -> Elbow -> Wrist)
  [12, 14], [14, 16], // Right Arm (Shoulder -> Elbow -> Wrist)
  [11, 23], [12, 24], // Torso (Shoulders -> Hips)
  [23, 24], // Hips
];

export default function ActiveWorkoutScreen() {
  const device = useCameraDevice('front');
  const poses = useSharedValue<any[][]>([]);
  const size = useSharedValue({ w: 1, h: 1 });

  const poseDetection = usePoseDetection(
    {
      onResults: (result: any) => {
        poses.value = result?.results?.[0]?.landmarks ?? result?.landmarks ?? [];
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
        <AnimatedPath animatedProps={animatedProps} stroke="lime" strokeWidth={3} fill="none" />
      </Svg>
    </>
  );
}