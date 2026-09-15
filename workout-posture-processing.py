"""
Extract reference posture data from images for the fitness app MVP.

ONE-TIME SETUP:
    pip install mediapipe opencv-python
    curl -o pose_landmarker.task -L https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task

Folder structure expected:
    reference_images/
        squat/
            top.jpg
            bottom.jpg
        pushup/
            top.jpg
            bottom.jpg
        plank/
            hold.jpg
        lunge/
            top.jpg
            bottom.jpg

Each exercise = one folder. Each image inside = one "phase" of that exercise
(e.g. top/bottom of a squat). The filename (minus extension) becomes the phase name.

Output: reference_poses.json -> ready to insert into Supabase.

Usage:
    python extract_reference_poses.py

Note: this uses MediaPipe's current Tasks API (PoseLandmarker), not the old
mp.solutions.pose API — that legacy API was removed in mediapipe 0.10.30+.
If you're on an older mediapipe (<0.10.30) the solutions API still works,
but this script targets current versions so it won't break on your next
`pip install --upgrade`.
"""

import cv2 as cv
import mediapipe as mp
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python import vision as mp_vision
import numpy as np
import json
from pathlib import Path

INPUT_DIR = "assets/workout-images"
OUTPUT_FILE = "reference_poses.json"
MODEL_PATH = "pose_landmarker.task"

# MediaPipe Pose landmark indices we care about for joint angle calculations.
# Full 33-point list: https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker
LANDMARK_NAMES = {
    11: "left_shoulder", 12: "right_shoulder",
    13: "left_elbow", 14: "right_elbow",
    15: "left_wrist", 16: "right_wrist",
    23: "left_hip", 24: "right_hip",
    25: "left_knee", 26: "right_knee",
    27: "left_ankle", 28: "right_ankle",
}

# (point_a, vertex, point_c) -> angle at the vertex, in degrees.
# Add/remove based on which exercises you're supporting.
ANGLE_DEFINITIONS = {
    "left_elbow_angle": ("left_shoulder", "left_elbow", "left_wrist"),
    "right_elbow_angle": ("right_shoulder", "right_elbow", "right_wrist"),
    "left_knee_angle": ("left_hip", "left_knee", "left_ankle"),
    "right_knee_angle": ("right_hip", "right_knee", "right_ankle"),
    "left_hip_angle": ("left_shoulder", "left_hip", "left_knee"),
    "right_hip_angle": ("right_shoulder", "right_hip", "right_knee"),
}


def calculate_angle(a, b, c):
    """Angle at point b, formed by a-b-c. Returns degrees 0-180."""
    a, b, c = np.array(a), np.array(b), np.array(c)
    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)
    if angle > 180.0:
        angle = 360 - angle
    return round(float(angle), 2)


def build_landmarker(model_path):
    base_options = mp_python.BaseOptions(model_asset_path=model_path)
    options = mp_vision.PoseLandmarkerOptions(
        base_options=base_options,
        running_mode=mp_vision.RunningMode.IMAGE,
        num_poses=1,
        min_pose_detection_confidence=0.5,
    )
    return mp_vision.PoseLandmarker.create_from_options(options)


def extract_landmarks(image_path, landmarker):
    """Run MediaPipe on one image, return dict of named landmarks (x, y, z, visibility)."""
    img_bgr = cv.imread(str(image_path))
    if img_bgr is None:
        raise FileNotFoundError(f"Could not read image: {image_path}")

    img_rgb = cv.cvtColor(img_bgr, cv.COLOR_BGR2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=img_rgb)

    result = landmarker.detect(mp_image)

    if not result.pose_landmarks:
        return None

    pose = result.pose_landmarks[0]  # first detected person
    landmarks = {}
    for idx, name in LANDMARK_NAMES.items():
        lm = pose[idx]
        landmarks[name] = {
            "x": round(lm.x, 4),
            "y": round(lm.y, 4),
            "z": round(lm.z, 4),
            "visibility": round(lm.visibility, 4),
        }
    return landmarks


def compute_angles(landmarks):
    """Compute all defined joint angles from a landmarks dict. Skips angles with missing points."""
    angles = {}
    for angle_name, (p1, p2, p3) in ANGLE_DEFINITIONS.items():
        if p1 in landmarks and p2 in landmarks and p3 in landmarks:
            a = (landmarks[p1]["x"], landmarks[p1]["y"])
            b = (landmarks[p2]["x"], landmarks[p2]["y"])
            c = (landmarks[p3]["x"], landmarks[p3]["y"])
            angles[angle_name] = calculate_angle(a, b, c)
    return angles


def main():
    input_path = Path(INPUT_DIR)
    if not input_path.exists():
        print(f"'{INPUT_DIR}/' not found. Create it with one subfolder per exercise, "
              f"each containing reference images (see docstring at top of this script).")
        return

    if not Path(MODEL_PATH).exists():
        print(f"'{MODEL_PATH}' not found. Download it first:\n"
              f"  curl -o {MODEL_PATH} -L "
              f"https://storage.googleapis.com/mediapipe-models/pose_landmarker/"
              f"pose_landmarker_full/float16/latest/pose_landmarker_full.task")
        return

    landmarker = build_landmarker(MODEL_PATH)

    reference_data = []
    skipped = []

    for exercise_dir in sorted(input_path.iterdir()):
        if not exercise_dir.is_dir():
            continue
        exercise_name = exercise_dir.name

        for image_file in sorted(exercise_dir.glob("*")):
            if image_file.suffix.lower() not in [".jpg", ".jpeg", ".png"]:
                continue

            phase_name = image_file.stem  # "top", "bottom", "hold", etc.
            landmarks = extract_landmarks(image_file, landmarker)

            if landmarks is None:
                skipped.append(str(image_file))
                continue

            angles = compute_angles(landmarks)

            reference_data.append({
                "exercise": exercise_name,
                "phase": phase_name,
                "landmarks": landmarks,
                "joint_angles": angles,
                "source_image": image_file.name,
            })

            print(f"  {exercise_name}/{phase_name}: {len(angles)} angles computed")

    landmarker.close()

    with open(OUTPUT_FILE, "w") as f:
        json.dump(reference_data, f, indent=2)

    print(f"\nDone. {len(reference_data)} poses extracted -> {OUTPUT_FILE}")
    if skipped:
        print(f"Skipped (no pose detected): {skipped}")


if __name__ == "__main__":
    main()