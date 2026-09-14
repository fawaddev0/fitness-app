import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { BottomNavigationDock, NavTab } from '../components/BottomNavigationDock';
import { KineticColors } from '../constants/theme';

const LOGO_IMAGE =
  'https://lh3.googleusercontent.com/aida/AEtjO1UhM0H9GMRwYsuavz7YIObGponbKbVMRmYgoeU6kc20Qd0Si7Ktowar_g8PGyimjIX53AfQpvjJ2OSz_no6-cqG31wstMGGW46YEYIUb92leVWKV5DrDv94-IywY6PQ9zSkx1LxaOhOdcQ8JZdWF71QlYOgomIquEYzIUPhTWslc2_daCuAQ7Rr_Dgjf4_FQuCxWi6yUUTSXq0UFVpZL5hVir3dTfZL-5JYmgAUw6bffmW7nxZVrLDJjBb1';

const PROFILE_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAJzo618P-HtjycCJZawKnmhDL1zWFC7qVEdn8HrpQxsKCQD3QE4EaJ5Qr9tmKfZ_GHfRHE3bQCXLvEqfhL8XmiWmXou4MsKvhByZNnYcuodxEzYuY6KMEzR9mV5s2a3pwizGaFvYwj8fg676AJn3suOnVZlt_k-VjZGEemDVNysnnfkA1gpDWVfC8q3u61B4Pgkwt3OANfhu_YdyllRBZFcvpEIgcwDICw52cX7Inp46hz3buizgChFw';

const FILTER_CATEGORIES = [
  'All Tracks',
  'Hypertrophy',
  'Fat Loss',
  'Posture Correction',
  'Athletic Power',
];

export interface RoadmapItem {
  id: string;
  title: string;
  image: string;
  category: string;
  tags: string[];
  stats: {
    label1: string;
    value1: string;
    value1Color?: string;
    label2: string;
    value2: string;
    label3: string;
    value3: string;
  };
  progress?: {
    text: string;
    sessions: string;
    percentage: number;
  };
  specialCallout?: {
    icon: keyof typeof MaterialIcons.glyphMap;
    title: string;
    description: string;
  };
  topBadge?: {
    icon: keyof typeof MaterialIcons.glyphMap;
    text: string;
  };
  actionText: string;
  actionIcon: keyof typeof MaterialIcons.glyphMap;
  isPrimaryAction?: boolean;
}

const ROADMAPS: RoadmapItem[] = [
  {
    id: '1',
    title: 'Chest & Upper Pec Hypertrophy',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCrcsWzYMkYvVhnghSCqyzOFv6vTe6xAEWiPn2Elvemk7U9k1oxjORSw-rjIwC2AzIBtVPLHs11rZAsAcOCxSjY257JP41hAejjrksKIZ3f2pdX0zgPC97JgSVeW9wxrnG-2wsO2xF1dAOQ1mWuzSJQ8VEPU2aNV5_dCNJhAuqvKaxWPdg18GI9eZNhmXb4EMMuR2x4YTUYvCbygtojW1ai_UGer2qNWWxwckPFPdRqggkTpZFCenfP9g',
    category: 'Hypertrophy',
    tags: ['#Chest', '#BenchPress', '#CableFly'],
    stats: {
      label1: 'Difficulty',
      value1: 'Intermediate',
      value1Color: KineticColors.primaryFixed,
      label2: 'Duration',
      value2: '8 Weeks',
      label3: 'Frequency',
      value3: '4 Days/Wk',
    },
    progress: {
      text: 'Week 3 of 8 • 42% Complete',
      sessions: '14/32 Sessions',
      percentage: 42,
    },
    actionText: 'Continue Roadmap',
    actionIcon: 'play-circle',
    isPrimaryAction: true,
  },
  {
    id: '2',
    title: 'Accelerated Fat Loss & Conditioning',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDAlmRZ-INL2H78aLqf3S8nOh2zYdLhfVILgcAXS11LI3V2tT23UJlSGQe7g2YyKdu4ajjYVovQOjVcmngSGbKiL2KRgVNCiqN6wYPkwldFc0UVMWv8zNXiVhBmVYEKMs1bCsjz1qrEc75DxZV0AJo5-B4LxR8SypyLt1aD4bSCEYAaruPSau-Tjpr0NMcbUo67oNU36WlA4g99NhT4Bib9psKACLWeMI60vxW8mnDq8VhyQx5DYX9LHA',
    category: 'Fat Loss',
    tags: ['#HIIT', '#FatBurn', '#Kettlebell'],
    stats: {
      label1: 'Level',
      value1: 'All Levels',
      value1Color: KineticColors.secondary,
      label2: 'Duration',
      value2: '6 Weeks',
      label3: 'Frequency',
      value3: '5 Days/Wk',
    },
    actionText: 'Start Scheduled Workout',
    actionIcon: 'arrow-forward',
  },
  {
    id: '3',
    title: '6-Pack Abs & Core Stabilization',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDyu7FG8tvAmHZy4tU30B8Hk79tkoNHjidhHxX4w5-vNSZcX8eGI36kUKExFTIgF8ziXaAfPhCnYNf0sFVd0_K_ClosocypZV38L97f2A6217xUAP3KSG5NIuILsUIsxVm8fgyOzOvOQLZVrKFXnh-sH9RQLRTCmpiNGSy2b1bzfQn2faJt2bs2VjHpL2Uv9tpGfwMkLRxx9bVV2zqYtzFy5kpD00mdJzxT_ghALw14ZWkHdot4tUMRYQ',
    category: 'Posture Correction',
    tags: ['#Core', '#Abs', '#Posture'],
    stats: {
      label1: 'Difficulty',
      value1: 'Beginner',
      label2: 'Duration',
      value2: '4 Weeks',
      label3: 'Frequency',
      value3: '3 Days/Wk',
    },
    actionText: 'View Program Syllabus',
    actionIcon: 'info',
  },
  {
    id: '4',
    title: 'Triceps Power & Horseshoe Density',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDCW3XYleEGBdZ7lGJ09qF3-52smk6d-zyiWFgKvx-cdLW3R54yjMVExWUVB176VsPIS4Lnht136vxMh8dogGNA-w184YQfZVf5scV5DF_CRsinHU-5G8Cm00KeDgtFw4Jfg2tx8M2_tbhaH7gl6zeEMe_eHJkbXsFopaQ882omWurVHA1frzqu0Cv0P12nJIDmQWZnQ-Ne88vKkpno4zeWui-TvlgS9uJiQZsACFvItNnwmlMOOBp3DA',
    category: 'Hypertrophy',
    tags: ['#Arms', '#Triceps', '#Dips'],
    topBadge: {
      icon: 'bolt',
      text: 'Hypertrophy Track',
    },
    specialCallout: {
      icon: 'sports-martial-arts',
      title: 'Arm Lockout Validator',
      description: 'Elbow lockout tracking & cable extension horizontal stability analysis.',
    },
    stats: {
      label1: 'Difficulty',
      value1: 'Intermediate',
      value1Color: KineticColors.primaryFixed,
      label2: 'Duration',
      value2: '5 Weeks',
      label3: 'Frequency',
      value3: '3 Days/Wk',
    },
    actionText: 'Enroll in Roadmap',
    actionIcon: 'add-circle',
  },
];

interface RoadmapScreenProps {
  onSelectRoadmap?: (roadmap: RoadmapItem) => void;
  onTabChange?: (tab: NavTab) => void;
  hideBottomDock?: boolean;
}

export default function RoadmapScreen({
  onSelectRoadmap,
  onTabChange,
  hideBottomDock = false,
}: RoadmapScreenProps) {
  const [selectedFilter, setSelectedFilter] = useState('All Tracks');
  const [activeTab, setActiveTab] = useState<NavTab>('roadmaps');

  const filteredRoadmaps =
    selectedFilter === 'All Tracks'
      ? ROADMAPS
      : ROADMAPS.filter(
          (r) => r.category.toLowerCase() === selectedFilter.toLowerCase()
        );

  const handleTabSelect = (tab: NavTab) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={{ uri: LOGO_IMAGE }} style={styles.headerLogo} resizeMode="contain" />
          <Text style={styles.headerTitle}>Roadmaps</Text>
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
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Training Roadmaps</Text>
          <Text style={styles.pageSubtitle}>
            AI-guided periodized tracks calibrated to your posture telemetry & strength level.
          </Text>
        </View>

        {/* Filter Pills Carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {FILTER_CATEGORIES.map((cat) => {
            const isSelected = selectedFilter === cat;
            return (
              <TouchableOpacity
                key={cat}
                activeOpacity={0.8}
                onPress={() => setSelectedFilter(cat)}
                style={[
                  styles.filterPill,
                  isSelected && styles.filterPillSelected,
                ]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    isSelected && styles.filterPillTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Roadmap Cards List */}
        <View style={styles.cardsList}>
          {filteredRoadmaps.map((item) => (
            <View key={item.id} style={styles.card}>
              {/* Media Header */}
              <View style={styles.cardMedia}>
                <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
                <LinearGradient
                  colors={['transparent', 'rgba(27, 27, 31, 0.45)', KineticColors.surfaceContainerLow]}
                  locations={[0, 0.5, 1]}
                  style={styles.mediaGradient}
                />

                {/* Top Badge if any */}
                {item.topBadge && (
                  <View style={styles.topBadgeContainer}>
                    <MaterialIcons
                      name={item.topBadge.icon}
                      size={14}
                      color={KineticColors.primaryFixed}
                    />
                    <Text style={styles.topBadgeText}>{item.topBadge.text}</Text>
                  </View>
                )}

                {/* Card Title on Image */}
                <View style={styles.mediaTitleContainer}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                </View>
              </View>

              {/* Card Body */}
              <View style={styles.cardBody}>
                {/* Special Feature Callout if any */}
                {item.specialCallout && (
                  <View style={styles.specialCallout}>
                    <View style={styles.specialIconBox}>
                      <MaterialIcons
                        name={item.specialCallout.icon}
                        size={18}
                        color={KineticColors.secondary}
                      />
                    </View>
                    <View style={styles.specialTextBox}>
                      <Text style={styles.specialTitle}>{item.specialCallout.title}</Text>
                      <Text style={styles.specialDesc} numberOfLines={2}>
                        {item.specialCallout.description}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Tags Row */}
                <View style={styles.tagsRow}>
                  {item.tags.map((tag, tIdx) => (
                    <View key={tIdx} style={styles.tagBadge}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>

                {/* 3-Column Stats Grid */}
                <View style={styles.statsGrid}>
                  <View style={styles.statCell}>
                    <Text style={styles.statLabel}>{item.stats.label1}</Text>
                    <Text
                      style={[
                        styles.statValue,
                        item.stats.value1Color && { color: item.stats.value1Color },
                      ]}
                    >
                      {item.stats.value1}
                    </Text>
                  </View>

                  <View style={styles.statCell}>
                    <Text style={styles.statLabel}>{item.stats.label2}</Text>
                    <Text style={styles.statValue}>{item.stats.value2}</Text>
                  </View>

                  <View style={styles.statCell}>
                    <Text style={styles.statLabel}>{item.stats.label3}</Text>
                    <Text style={styles.statValue}>{item.stats.value3}</Text>
                  </View>
                </View>

                {/* Progress Module if active */}
                {item.progress && (
                  <View style={styles.progressModule}>
                    <View style={styles.progressTextRow}>
                      <Text style={styles.progressLabel}>{item.progress.text}</Text>
                      <Text style={styles.progressSessions}>{item.progress.sessions}</Text>
                    </View>
                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${item.progress.percentage}%` },
                        ]}
                      />
                    </View>
                  </View>
                )}

                {/* Action CTA Button */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => onSelectRoadmap?.(item)}
                  style={[
                    styles.actionBtn,
                    item.isPrimaryAction ? styles.actionBtnPrimary : styles.actionBtnSecondary,
                  ]}
                >
                  <Text
                    style={[
                      styles.actionBtnText,
                      item.isPrimaryAction
                        ? styles.actionBtnTextPrimary
                        : styles.actionBtnTextSecondary,
                    ]}
                  >
                    {item.actionText}
                  </Text>
                  <MaterialIcons
                    name={item.actionIcon}
                    size={20}
                    color={
                      item.isPrimaryAction
                        ? KineticColors.onPrimary
                        : KineticColors.onSurface
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Bottom Navigation Dock */}
      {!hideBottomDock && (
        <BottomNavigationDock
          activeTab={activeTab}
          onTabSelect={handleTabSelect}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: KineticColors.surface,
  },
  header: {
    height: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(18, 19, 22, 0.85)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerLogo: {
    width: 32,
    height: 32,
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
    width: 34,
    height: 34,
    borderRadius: 17,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(212, 254, 66, 0.4)',
  },
  profileAvatar: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 160,
  },
  titleSection: {
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 20,
    gap: 6,
  },
  pageTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 28,
    lineHeight: 34,
    color: KineticColors.onSurface,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: KineticColors.onSurfaceVariant,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    gap: 10,
    paddingBottom: 22,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 9999,
    backgroundColor: KineticColors.surfaceContainerHigh,
  },
  filterPillSelected: {
    backgroundColor: KineticColors.primaryFixed,
    shadowColor: KineticColors.primaryFixed,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 4,
  },
  filterPillText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 11,
    lineHeight: 14,
    color: KineticColors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  filterPillTextSelected: {
    color: '#121316',
  },
  cardsList: {
    paddingHorizontal: 20,
    gap: 24,
  },
  card: {
    borderRadius: 20,
    backgroundColor: KineticColors.surfaceContainerLow,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  cardMedia: {
    position: 'relative',
    width: '100%',
    height: 176,
    backgroundColor: KineticColors.surfaceContainerHighest,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  mediaGradient: {
    position: 'absolute',
    inset: 0,
  },
  topBadgeContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: 'rgba(13, 14, 17, 0.85)',
  },
  topBadgeText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 10,
    lineHeight: 12,
    color: KineticColors.primaryFixed,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  mediaTitleContainer: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
  },
  cardTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 20,
    lineHeight: 26,
    color: KineticColors.onSurface,
    letterSpacing: -0.3,
  },
  cardBody: {
    padding: 18,
    gap: 16,
  },
  specialCallout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: KineticColors.surfaceContainer,
  },
  specialIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(26, 162, 145, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  specialTextBox: {
    flex: 1,
    gap: 2,
  },
  specialTitle: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 11,
    lineHeight: 14,
    color: KineticColors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  specialDesc: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    lineHeight: 16,
    color: KineticColors.onSurfaceVariant,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: KineticColors.surfaceContainerHigh,
  },
  tagText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 11,
    lineHeight: 14,
    color: KineticColors.onSurfaceVariant,
    letterSpacing: 0.4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statCell: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: KineticColors.surfaceContainer,
    gap: 4,
  },
  statLabel: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 10,
    lineHeight: 12,
    color: KineticColors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
    lineHeight: 17,
    color: KineticColors.onSurface,
  },
  progressModule: {
    gap: 8,
    paddingTop: 4,
  },
  progressTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 10,
    lineHeight: 13,
    color: KineticColors.onSurface,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressSessions: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 12,
    lineHeight: 16,
    color: KineticColors.primaryFixed,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: KineticColors.surfaceContainerHighest,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: KineticColors.primaryFixed,
    borderRadius: 3,
  },
  actionBtn: {
    width: '100%',
    minHeight: 48,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionBtnPrimary: {
    backgroundColor: KineticColors.primaryFixed,
    shadowColor: KineticColors.primaryFixed,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 4,
  },
  actionBtnSecondary: {
    backgroundColor: KineticColors.surfaceContainerHighest,
  },
  actionBtnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.2,
  },
  actionBtnTextPrimary: {
    color: KineticColors.onPrimary,
  },
  actionBtnTextSecondary: {
    color: KineticColors.onSurface,
  },
});
