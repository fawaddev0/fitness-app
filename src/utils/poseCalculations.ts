import { PostureJointAngles } from '../types/models';

export const CONNECTIONS: [number, number][] = [
  [11, 12],
  [11, 13], [13, 15],
  [12, 14], [14, 16],
  [11, 23], [12, 24],
  [23, 24],
  [23, 25], [25, 27],
  [24, 26], [26, 28],
];

export const JOINTS: number[] = [
  11, 12,
  13, 14,
  15, 16,
  23, 24,
  25, 26,
  27, 28,
];

export interface AngleDefinition {
  p1: number;
  p2: number;
  p3: number;
  label: string;
}

export const ALL_ANGLE_DEFINITIONS: Record<string, AngleDefinition> = {
  left_elbow_angle: { p1: 11, p2: 13, p3: 15, label: 'L-Elbow' },
  right_elbow_angle: { p1: 12, p2: 14, p3: 16, label: 'R-Elbow' },
  left_knee_angle: { p1: 23, p2: 25, p3: 27, label: 'L-Knee' },
  right_knee_angle: { p1: 24, p2: 26, p3: 28, label: 'R-Knee' },
  left_hip_angle: { p1: 11, p2: 23, p3: 25, label: 'L-Hip' },
  right_hip_angle: { p1: 12, p2: 24, p3: 26, label: 'R-Hip' },
  left_shoulder_angle: { p1: 23, p2: 11, p3: 13, label: 'L-Shoulder' },
  right_shoulder_angle: { p1: 24, p2: 12, p3: 14, label: 'R-Shoulder' },
};

/**
 * Calculates the interior angle at vertex `b` formed by ray vectors `ba` and `bc`.
 *
 * Math:
 *   θ = |atan2(cy - by, cx - bx) - atan2(ay - by, ax - bx)| * (180 / π)
 *   If θ > 180°, θ = 360° - θ to always yield the acute/obtuse interior angle.
 *
 * @param a First endpoint {x, y} in normalized coordinates [0, 1]
 * @param b Vertex point {x, y} in normalized coordinates [0, 1]
 * @param c Second endpoint {x, y} in normalized coordinates [0, 1]
 * @returns Joint angle in degrees [0.0, 180.0] rounded to 1 decimal place.
 */
export function calculateAngle(
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

/**
 * Computes real-time joint angles for all specified or active exercise landmarks.
 * Landmarks with low tracking visibility (< 0.35) are skipped to prevent false tracking.
 *
 * @param landmarks 33-point MediaPipe pose landmark array
 * @param targetKeys Optional list of specific joint angle keys to compute
 * @returns Dictionary mapping joint keys to computed degree values, or null if insufficient points.
 */
export function calculateLiveAngles(
  landmarks: any[],
  targetKeys?: string[]
): Record<string, number> | null {
  'worklet';
  if (!landmarks || landmarks.length < 29) return null;

  const keysToCompute =
    targetKeys && targetKeys.length > 0 ? targetKeys : Object.keys(ALL_ANGLE_DEFINITIONS);
  const result: Record<string, number> = {};

  for (let i = 0; i < keysToCompute.length; i++) {
    const key = keysToCompute[i];
    const def = ALL_ANGLE_DEFINITIONS[key];
    if (!def) continue;

    const p1 = landmarks[def.p1];
    const p2 = landmarks[def.p2];
    const p3 = landmarks[def.p3];

    if (!p1 || !p2 || !p3) continue;

    const v1 = p1.visibility ?? 1;
    const v2 = p2.visibility ?? 1;
    const v3 = p3.visibility ?? 1;
    if (v1 < 0.35 || v2 < 0.35 || v3 < 0.35) continue;

    result[key] = calculateAngle(p1, p2, p3);
  }

  return result;
}

export function parseJsonField<T>(field: any): T | null {
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

export interface RepetitionConfig {
  driverJoints: string[];
  topThreshold: number;
  bottomThreshold: number;
  targetTopAngle: number;
  targetBottomAngle: number;
  isDecreasingToBottom: boolean;
}

/**
 * Dynamically synthesizes the repetition configuration for any workout:
 * 1. Analyzes reference angles across exercise phases (`top` vs `bottom`).
 * 2. Identifies the primary driver joint exhibiting the highest Range of Motion (ROM = |top - bottom|).
 * 3. Applies a 2-gate hysteresis threshold:
 *    - Bottom Gate: Triggered at 35% of ROM from the bottom position.
 *    - Top Gate: Triggered at 25% of ROM from the starting top extension.
 *
 * This hysteresis prevents jitter near inflection points and accommodates natural anatomical variance.
 *
 * @param top Reference joint angles at the starting/top phase
 * @param bottom Reference joint angles at the contracted/bottom phase
 * @param workoutTitle Optional workout title used for intelligent kinematic fallbacks
 */
export function computeRepConfig(
  top: PostureJointAngles | null,
  bottom: PostureJointAngles | null,
  workoutTitle?: string
): RepetitionConfig {
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

  const bottomThreshold = isDecreasingToBottom
    ? bottomVal + rom * 0.35
    : bottomVal - rom * 0.35;

  const topThreshold = isDecreasingToBottom
    ? topVal - rom * 0.25
    : topVal + rom * 0.25;

  return {
    driverJoints,
    topThreshold,
    bottomThreshold,
    targetTopAngle: topVal,
    targetBottomAngle: bottomVal,
    isDecreasingToBottom,
  };
}
