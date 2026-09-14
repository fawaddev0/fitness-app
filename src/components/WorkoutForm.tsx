import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { KineticColors, AppRounded, AppSpacing } from '../constants/theme';

export const PROFILE_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAJzo618P-HtjycCJZawKnmhDL1zWFC7qVEdn8HrpQxsKCQD3QE4EaJ5Qr9tmKfZ_GHfRHE3bQCXLvEqfhL8XmiWmXou4MsKvhByZNnYcuodxEzYuY6KMEzR9mV5s2a3pwizGaFvYwj8fg676AJn3suOnVZlt_k-VjZGEemDVNysnnfkA1gpDWVfC8q3u61B4Pgkwt3OANfhu_YdyllRBZFcvpEIgcwDICw52cX7Inp46hz3buizgChFw';

export interface ExerciseOption {
  id: string;
  name: string;
  category: string;
  image: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

export const EXERCISE_OPTIONS: ExerciseOption[] = [
  {
    id: 'seated-shoulder-press',
    name: 'Seated Shoulder Press',
    category: 'Overhead • Anterior Deltoid',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCf8qnBidekATccEa2sDRBzjeucOmpENE3VVY1iheygmIf2sg6PZyhKz_tV-d6TLDfCy6VlKn6N-gUAmd7kZX4OLMBhyWE_AQkaR1-ke4nPVT58U3O9n18MYahOu_ulQ_KCDcKSx6DPwGvfSk0u3mM2uU-Y20wnq5Bpba4lfPG_fYFaddXi7ysy4AQ267E9FcyrjUP_tTHSAWoXM0YKygAzzi0HMJwY0cdw5MRLF0L-aY40E8dFJliU6Q',
    icon: 'sports-martial-arts',
  },
  {
    id: 'dumbbell-bicep-curls',
    name: 'Dumbbell Bicep Curls',
    category: 'Hypertrophy • Biceps Brachii',
    image:
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80',
    icon: 'fitness-center',
  },
  {
    id: 'barbell-back-squats',
    name: 'Barbell Back Squats',
    category: 'Compound • Quadriceps & Glutes',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCfjdYZJsDwIA0Yg5wKgFUV64-ATwINWmR5UOzE6Pk9y6N8fdEv-URM3keThQA5Sidxzz5m-0jSCMvToQ_5lEprF7SbvEVO7ALgr-OmYv4qQEyHvU8wFec7DxdkJ-ZqAlnYCtBm2o2frgBlanuXq1_cqynRwYCGzts4_usR_kJL6QbmcSBtM71Tanu8LUxltUVk8sOcc2AUsRVmdFbdY5XqDbmldtJGdhpcrijNAEZD_A8H7I26HG_LRg',
    icon: 'directions-run',
  },
  {
    id: 'deficit-push-ups',
    name: 'Deficit Push-ups',
    category: 'Bodyweight • Pectoralis Major',
    image:
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80',
    icon: 'sports-gymnastics',
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift',
    category: 'Kinetic Chain • Hamstrings',
    image:
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80',
    icon: 'fitness-center',
  },
  {
    id: 'cable-lateral-raises',
    name: 'Cable Lateral Raises',
    category: 'Isolation • Medial Deltoid',
    image:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80',
    icon: 'unfold-more',
  },
];

export interface WorkoutFormData {
  exercise: ExerciseOption;
  reps: number;
  sets: number;
  restSeconds: number;
}

export interface WorkoutFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<WorkoutFormData>;
  onBack?: () => void;
  onSubmit?: (data: WorkoutFormData) => void;
  onDelete?: () => void;
}

export function WorkoutForm({
  mode,
  initialData,
  onBack,
  onSubmit,
  onDelete,
}: WorkoutFormProps) {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseOption>(
    initialData?.exercise || EXERCISE_OPTIONS[0]
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [reps, setReps] = useState(initialData?.reps ?? 12);
  const [sets, setSets] = useState(initialData?.sets ?? 11);
  const [restSeconds, setRestSeconds] = useState(initialData?.restSeconds ?? 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleAdjustReps = (delta: number) => {
    setReps((prev) => Math.max(1, Math.min(99, prev + delta)));
  };

  const handleAdjustSets = (delta: number) => {
    setSets((prev) => Math.max(1, Math.min(20, prev + delta)));
  };

  const handleAdjustRest = (delta: number) => {
    setRestSeconds((prev) => Math.max(15, Math.min(300, prev + delta)));
  };

  const handleSelectExercise = (item: ExerciseOption) => {
    setSelectedExercise(item);
    setDropdownOpen(false);
  };

  const handlePrimaryPress = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedSuccess(true);

      const formData: WorkoutFormData = {
        exercise: selectedExercise,
        reps,
        sets,
        restSeconds,
      };

      setTimeout(() => {
        setSubmittedSuccess(false);
        if (onSubmit) {
          onSubmit(formData);
        }
      }, 800);
    }, 500);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Fixed Glassmorphic Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onBack}
            style={styles.backButton}
            accessibilityLabel="Go back"
          >
            <MaterialIcons
              name="arrow-back-ios-new"
              size={18}
              color={KineticColors.onSurface}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>WORKOUT FORM</Text>
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
        keyboardShouldPersistTaps="handled"
      >
        {/* Exercise Selector Module */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>SELECTED MOVEMENT</Text>

          {/* Trigger Button */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => setDropdownOpen(!dropdownOpen)}
            style={[
              styles.exerciseSelectBtn,
              dropdownOpen && styles.exerciseSelectBtnActive,
            ]}
          >
            <View style={styles.selectedExerciseInfo}>
              <View style={styles.thumbnailWrapper}>
                <Image
                  source={{ uri: selectedExercise.image }}
                  style={styles.exerciseThumbnail}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(13, 14, 17, 0.8)']}
                  style={styles.thumbnailGradient}
                />
              </View>
              <View style={styles.exerciseTextColumn}>
                <Text style={styles.exerciseName} numberOfLines={1}>
                  {selectedExercise.name}
                </Text>
                <Text style={styles.exerciseCategory} numberOfLines={1}>
                  {selectedExercise.category}
                </Text>
              </View>
            </View>

            <View style={styles.chevronWrapper}>
              <MaterialIcons
                name={dropdownOpen ? 'expand-less' : 'expand-more'}
                size={22}
                color={KineticColors.primaryFixed}
              />
            </View>
          </TouchableOpacity>

          {/* Dropdown Menu Drawer */}
          {dropdownOpen && (
            <View style={styles.dropdownContainer}>
              {EXERCISE_OPTIONS.map((item) => {
                const isSelected = item.id === selectedExercise.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.7}
                    onPress={() => handleSelectExercise(item)}
                    style={[
                      styles.dropdownItem,
                      isSelected && styles.dropdownItemSelected,
                    ]}
                  >
                    <View style={styles.dropdownItemLeft}>
                      <MaterialIcons
                        name={item.icon}
                        size={20}
                        color={
                          isSelected
                            ? KineticColors.primaryFixed
                            : KineticColors.onSurfaceVariant
                        }
                      />
                      <View style={styles.dropdownItemTextCol}>
                        <Text
                          style={[
                            styles.dropdownItemTitle,
                            isSelected && styles.dropdownItemTitleSelected,
                          ]}
                          numberOfLines={1}
                        >
                          {item.name}
                        </Text>
                        <Text style={styles.dropdownItemCategory} numberOfLines={1}>
                          {item.category}
                        </Text>
                      </View>
                    </View>

                    {isSelected && (
                      <MaterialIcons
                        name="check-circle"
                        size={18}
                        color={KineticColors.primaryFixed}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Steppers Bento Grid: Reps & Sets */}
        <View style={styles.bentoGrid}>
          {/* Target Reps Card */}
          <View style={styles.bentoCard}>
            <View style={styles.bentoHeader}>
              <Text style={styles.bentoLabel}>TARGET REPS</Text>
              <MaterialIcons
                name="repeat"
                size={18}
                color={KineticColors.primaryFixed}
              />
            </View>

            <View style={styles.bentoValueContainer}>
              <Text style={styles.bentoValue}>{reps}</Text>
            </View>

            <View style={styles.stepperPill}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleAdjustReps(-1)}
                style={styles.stepperBtnSecondary}
                accessibilityLabel="Decrease reps"
              >
                <MaterialIcons
                  name="remove"
                  size={20}
                  color={KineticColors.onSurface}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleAdjustReps(1)}
                style={styles.stepperBtnPrimary}
                accessibilityLabel="Increase reps"
              >
                <MaterialIcons
                  name="add"
                  size={20}
                  color={KineticColors.onPrimary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Total Sets Card */}
          <View style={styles.bentoCard}>
            <View style={styles.bentoHeader}>
              <Text style={styles.bentoLabel}>TOTAL SETS</Text>
              <MaterialIcons
                name="layers"
                size={18}
                color={KineticColors.secondary}
              />
            </View>

            <View style={styles.bentoValueContainer}>
              <Text style={styles.bentoValue}>{sets}</Text>
            </View>

            <View style={styles.stepperPill}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleAdjustSets(-1)}
                style={styles.stepperBtnSecondary}
                accessibilityLabel="Decrease sets"
              >
                <MaterialIcons
                  name="remove"
                  size={20}
                  color={KineticColors.onSurface}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleAdjustSets(1)}
                style={styles.stepperBtnPrimary}
                accessibilityLabel="Increase sets"
              >
                <MaterialIcons
                  name="add"
                  size={20}
                  color={KineticColors.onPrimary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Rest Duration Row Card */}
        <View style={styles.restCard}>
          <View style={styles.restLeft}>
            <View style={styles.restIconWrapper}>
              <MaterialIcons
                name="timer"
                size={20}
                color={KineticColors.secondary}
              />
            </View>
            <View style={styles.restTextContainer}>
              <Text style={styles.restTitle}>Rest Duration</Text>
              <Text style={styles.restSubtitle}>Interval between consecutive sets</Text>
            </View>
          </View>

          <View style={styles.restStepperPill}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleAdjustRest(-15)}
              style={styles.restStepperBtnSecondary}
              accessibilityLabel="Decrease rest duration"
            >
              <MaterialIcons
                name="remove"
                size={18}
                color={KineticColors.onSurface}
              />
            </TouchableOpacity>

            <Text style={styles.restValueText}>{restSeconds}s</Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleAdjustRest(15)}
              style={styles.restStepperBtnPrimary}
              accessibilityLabel="Increase rest duration"
            >
              <MaterialIcons
                name="add"
                size={18}
                color={KineticColors.onPrimary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Interactive Actions */}
        <View style={styles.actionsContainer}>
          {mode === 'create' ? (
            /* Create Mode: Single "Create Workout" Button */
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handlePrimaryPress}
              style={[
                styles.primaryCtaBtn,
                (isSubmitting || submittedSuccess) && styles.primaryCtaBtnActive,
              ]}
            >
              {isSubmitting ? (
                <>
                  <ActivityIndicator size="small" color={KineticColors.onPrimary} />
                  <Text style={styles.primaryCtaText}>Creating Workout...</Text>
                </>
              ) : submittedSuccess ? (
                <>
                  <MaterialIcons
                    name="check-circle"
                    size={22}
                    color={KineticColors.onPrimary}
                  />
                  <Text style={styles.primaryCtaText}>Workout Created!</Text>
                </>
              ) : (
                <>
                  <MaterialIcons
                    name="add-circle"
                    size={22}
                    color={KineticColors.onPrimary}
                  />
                  <Text style={styles.primaryCtaText}>Create Workout</Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            /* Edit Mode: Cancel + Save on one row, and Delete below */
            <View style={styles.editButtonsStack}>
              <View style={styles.editActionsRow}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={onBack}
                  style={styles.cancelBtn}
                >
                  <MaterialIcons
                    name="close"
                    size={20}
                    color={KineticColors.onSurface}
                  />
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.88}
                  onPress={handlePrimaryPress}
                  style={[
                    styles.primaryCtaBtn,
                    styles.editSaveBtn,
                    (isSubmitting || submittedSuccess) && styles.primaryCtaBtnActive,
                  ]}
                >
                  {isSubmitting ? (
                    <>
                      <ActivityIndicator size="small" color={KineticColors.onPrimary} />
                      <Text style={styles.primaryCtaText}>Saving...</Text>
                    </>
                  ) : submittedSuccess ? (
                    <>
                      <MaterialIcons
                        name="check-circle"
                        size={22}
                        color={KineticColors.onPrimary}
                      />
                      <Text style={styles.primaryCtaText}>Saved!</Text>
                    </>
                  ) : (
                    <>
                      <MaterialIcons
                        name="save"
                        size={22}
                        color={KineticColors.onPrimary}
                      />
                      <Text style={styles.primaryCtaText}>Save</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={onDelete}
                style={styles.deleteBtn}
              >
                <MaterialIcons
                  name="delete-forever"
                  size={20}
                  color={KineticColors.error}
                />
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: KineticColors.surface,
  },
  header: {
    height: 64,
    paddingHorizontal: AppSpacing.margin,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(18, 19, 22, 0.85)',
    zIndex: 50,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    minWidth: 44,
    minHeight: 44,
    borderRadius: AppRounded.full,
    backgroundColor: 'rgba(41, 42, 45, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
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
    width: 32,
    height: 32,
    borderRadius: AppRounded.full,
    overflow: 'hidden',
  },
  profileAvatar: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
    backgroundColor: KineticColors.surface,
  },
  scrollContent: {
    paddingHorizontal: AppSpacing.margin,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 20,
  },
  sectionContainer: {
    gap: 8,
  },
  sectionLabel: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.88,
    color: KineticColors.onSurfaceVariant,
    textTransform: 'uppercase',
    paddingHorizontal: 4,
  },
  exerciseSelectBtn: {
    backgroundColor: KineticColors.surfaceContainer,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseSelectBtnActive: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  selectedExerciseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  thumbnailWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: KineticColors.surfaceContainerHighest,
  },
  exerciseThumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailGradient: {
    ...StyleSheet.absoluteFill,
  },
  exerciseTextColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  exerciseName: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 17,
    lineHeight: 22,
    color: KineticColors.onSurface,
  },
  exerciseCategory: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    lineHeight: 16,
    color: KineticColors.onSurfaceVariant,
    marginTop: 2,
  },
  chevronWrapper: {
    width: 32,
    height: 32,
    borderRadius: AppRounded.full,
    backgroundColor: KineticColors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  dropdownContainer: {
    backgroundColor: KineticColors.surfaceContainerHigh,
    borderRadius: 16,
    padding: 8,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    marginTop: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: KineticColors.surfaceContainer,
  },
  dropdownItemSelected: {
    backgroundColor: 'rgba(212, 254, 66, 0.12)',
    borderColor: 'rgba(212, 254, 66, 0.3)',
    borderWidth: 1,
  },
  dropdownItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  dropdownItemTextCol: {
    flex: 1,
  },
  dropdownItemTitle: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 14,
    lineHeight: 20,
    color: KineticColors.onSurface,
  },
  dropdownItemTitleSelected: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: KineticColors.primaryFixed,
  },
  dropdownItemCategory: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 11,
    lineHeight: 15,
    color: KineticColors.onSurfaceVariant,
  },
  bentoGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  bentoCard: {
    flex: 1,
    backgroundColor: KineticColors.surfaceContainer,
    borderRadius: 16,
    padding: 14,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 160,
  },
  bentoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bentoLabel: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.88,
    textTransform: 'uppercase',
    color: KineticColors.onSurfaceVariant,
  },
  bentoValueContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  bentoValue: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -0.8,
    color: KineticColors.onSurface,
  },
  stepperPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: KineticColors.surfaceContainerLow,
    borderRadius: AppRounded.full,
    padding: 4,
    marginTop: 8,
  },
  stepperBtnSecondary: {
    width: 40,
    height: 40,
    borderRadius: AppRounded.full,
    backgroundColor: KineticColors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnPrimary: {
    width: 40,
    height: 40,
    borderRadius: AppRounded.full,
    backgroundColor: KineticColors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restCard: {
    backgroundColor: KineticColors.surfaceContainer,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  restLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  restIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: AppRounded.full,
    backgroundColor: KineticColors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restTextContainer: {
    flex: 1,
  },
  restTitle: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    lineHeight: 22,
    color: KineticColors.onSurface,
  },
  restSubtitle: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    lineHeight: 16,
    color: KineticColors.onSurfaceVariant,
    marginTop: 2,
  },
  restStepperPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: KineticColors.surfaceContainerLow,
    borderRadius: AppRounded.full,
    padding: 4,
  },
  restStepperBtnSecondary: {
    width: 36,
    height: 36,
    borderRadius: AppRounded.full,
    backgroundColor: KineticColors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restValueText: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.2,
    color: KineticColors.onSurface,
    minWidth: 54,
    textAlign: 'center',
  },
  restStepperBtnPrimary: {
    width: 36,
    height: 36,
    borderRadius: AppRounded.full,
    backgroundColor: KineticColors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsContainer: {
    paddingTop: 8,
    marginTop: 4,
  },
  editButtonsStack: {
    gap: 12,
    width: '100%',
  },
  editActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: KineticColors.surfaceContainerHigh,
    borderRadius: AppRounded.full,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cancelBtnText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    lineHeight: 22,
    color: KineticColors.onSurface,
    letterSpacing: -0.2,
  },
  primaryCtaBtn: {
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
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  editSaveBtn: {
    flex: 1,
    width: 'auto',
  },
  primaryCtaBtnActive: {
    opacity: 0.92,
  },
  primaryCtaText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 17,
    lineHeight: 24,
    color: KineticColors.onPrimary,
    letterSpacing: -0.2,
  },
  deleteBtn: {
    width: '100%',
    backgroundColor: KineticColors.surfaceContainerHigh,
    borderRadius: AppRounded.full,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteBtnText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    lineHeight: 22,
    color: KineticColors.error,
    letterSpacing: -0.2,
  },
});
