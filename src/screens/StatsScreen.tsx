import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Circle,
} from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import { BottomNavigationDock, NavTab } from '../components/BottomNavigationDock';
import { KineticColors } from '../constants/theme';

const LOGO_IMAGE =
  'https://lh3.googleusercontent.com/aida/AEtjO1UhM0H9GMRwYsuavz7YIObGponbKbVMRmYgoeU6kc20Qd0Si7Ktowar_g8PGyimjIX53AfQpvjJ2OSz_no6-cqG31wstMGGW46YEYIUb92leVWKV5DrDv94-IywY6PQ9zSkx1LxaOhOdcQ8JZdWF71QlYOgomIquEYzIUPhTWslc2_daCuAQ7Rr_Dgjf4_FQuCxWi6yUUTSXq0UFVpZL5hVir3dTfZL-5JYmgAUw6bffmW7nxZVrLDJjBb1';

const PROFILE_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAJzo618P-HtjycCJZawKnmhDL1zWFC7qVEdn8HrpQxsKCQD3QE4EaJ5Qr9tmKfZ_GHfRHE3bQCXLvEqfhL8XmiWmXou4MsKvhByZNnYcuodxEzYuY6KMEzR9mV5s2a3pwizGaFvYwj8fg676AJn3suOnVZlt_k-VjZGEemDVNysnnfkA1gpDWVfC8q3u61B4Pgkwt3OANfhu_YdyllRBZFcvpEIgcwDICw52cX7Inp46hz3buizgChFw';

const DATE_FILTERS = ['7 Days', '14 Days', '30 Days', 'All Time'];

interface DayData {
  day: string;
  short: string;
  reps: number;
  isPeak?: boolean;
}

const WEEK_DATA: DayData[] = [
  { day: 'Monday', short: 'M', reps: 180 },
  { day: 'Tuesday', short: 'T', reps: 240 },
  { day: 'Wednesday', short: 'W', reps: 0 },
  { day: 'Thursday', short: 'T', reps: 310, isPeak: true },
  { day: 'Friday', short: 'F', reps: 280 },
  { day: 'Saturday', short: 'S', reps: 210 },
  { day: 'Sunday', short: 'S', reps: 200 },
];

const MAX_REPS = 340;

interface StatsScreenProps {
  onTabChange?: (tab: NavTab) => void;
  hideBottomDock?: boolean;
}

export default function StatsScreen({
  onTabChange,
  hideBottomDock = false,
}: StatsScreenProps) {
  const [selectedFilter, setSelectedFilter] = useState('7 Days');
  const [selectedDayIndex, setSelectedDayIndex] = useState(3); // Thursday peak selected by default
  const [activeTab, setActiveTab] = useState<NavTab>('stats');

  const selectedDay = WEEK_DATA[selectedDayIndex];

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'PoseFit AI - 98.0% Form Accuracy & 1,420 Reps this week!',
      });
    } catch {}
  };

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
          <Text style={styles.headerTitle}>Stats</Text>
        </View>
        <TouchableOpacity activeOpacity={0.8} style={styles.profileBtn}>
          <Image source={{ uri: PROFILE_IMAGE }} style={styles.profileAvatar} />
        </TouchableOpacity>
      </View>

      {/* Main Scroll Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title & Action Bar */}
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Stats & Performance</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleShare}
            style={styles.shareBtn}
          >
            <MaterialIcons
              name="share"
              size={20}
              color={KineticColors.primaryFixed}
            />
          </TouchableOpacity>
        </View>

        {/* Date Range Filter Pills */}
        <View style={styles.dateFilterPillContainer}>
          {DATE_FILTERS.map((filter) => {
            const isSelected = selectedFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                activeOpacity={0.8}
                onPress={() => setSelectedFilter(filter)}
                style={[
                  styles.dateFilterBtn,
                  isSelected && styles.dateFilterBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.dateFilterText,
                    isSelected && styles.dateFilterTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Chart Card 1: Weekly Rep Output */}
        <View style={styles.chartCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <MaterialIcons
                name="bar-chart"
                size={22}
                color={KineticColors.primaryFixed}
              />
              <View>
                <Text style={styles.cardTitle}>Weekly Rep Output</Text>
                <Text style={styles.cardSubtitle}>Daily volume across 7 calendar days</Text>
              </View>
            </View>

            <View style={styles.peakBadge}>
              <View style={styles.pulsingDot} />
              <Text style={styles.peakBadgeText}>Peak: Thu</Text>
            </View>
          </View>

          {/* Bar Chart Graphics */}
          <View style={styles.barsArea}>
            <View style={styles.barsRow}>
              {WEEK_DATA.map((item, idx) => {
                const isSelected = selectedDayIndex === idx;
                const heightPercent =
                  item.reps === 0 ? 8 : Math.max(16, (item.reps / MAX_REPS) * 120);

                return (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.8}
                    onPress={() => setSelectedDayIndex(idx)}
                    style={styles.barCol}
                  >
                    {/* Floating Rep Count */}
                    <Text
                      style={[
                        styles.barValText,
                        isSelected && styles.barValTextSelected,
                      ]}
                    >
                      {item.reps === 0 ? 'Rest' : item.reps}
                    </Text>

                    {/* Bar Pillar */}
                    <View
                      style={[
                        styles.barTrack,
                        { height: heightPercent },
                        isSelected ? styles.barActive : styles.barInactive,
                      ]}
                    />

                    {/* Day Letter */}
                    <Text
                      style={[
                        styles.dayLabel,
                        isSelected && styles.dayLabelSelected,
                      ]}
                    >
                      {item.short}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Selected Day Readout */}
          <View style={styles.dayReadoutRow}>
            <Text style={styles.readoutDay}>{selectedDay.day} Session</Text>
            <Text style={styles.readoutReps}>
              {selectedDay.reps === 0 ? 'Rest Day' : `${selectedDay.reps} Reps Completed`}
            </Text>
          </View>
        </View>

        {/* Chart Card 2: Live Form Accuracy & Posture Score Trend */}
        <View style={styles.chartCard}>
          <View style={styles.cardHeader}>
            <View>
              <View style={styles.trajectoryHeader}>
                <MaterialIcons
                  name="show-chart"
                  size={18}
                  color={KineticColors.secondary}
                />
                <Text style={styles.trajectoryLabel}>Form Trajectory</Text>
              </View>
              <Text style={styles.cardTitle}>Live Posture Score Trend</Text>
            </View>

            <View style={styles.peakScoreRight}>
              <Text style={styles.peakScoreVal}>98.0%</Text>
              <Text style={styles.peakScoreLabel}>Peak Form</Text>
            </View>
          </View>

          {/* SVG Waveform Graphic */}
          <View style={styles.svgWaveContainer}>
            <Svg
              width="100%"
              height="120"
              viewBox="0 0 320 100"
              preserveAspectRatio="none"
            >
              <Defs>
                <SvgLinearGradient id="cyberGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor="#c9f236" stopOpacity="0.32" />
                  <Stop offset="70%" stopColor="#64d9c7" stopOpacity="0.08" />
                  <Stop offset="100%" stopColor="#1f1f23" stopOpacity="0" />
                </SvgLinearGradient>
                <SvgLinearGradient id="neonStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#64d9c7" />
                  <Stop offset="50%" stopColor="#aed50c" />
                  <Stop offset="100%" stopColor="#c9f236" />
                </SvgLinearGradient>
              </Defs>

              {/* Shaded Area Under Curve */}
              <Path
                d="M0,75 Q35,60 70,68 T140,42 T210,35 T260,20 T320,12 L320,100 L0,100 Z"
                fill="url(#cyberGlow)"
              />

              {/* Neon Waveform Stroke */}
              <Path
                d="M0,75 Q35,60 70,68 T140,42 T210,35 T260,20 T320,12"
                stroke="url(#neonStroke)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />

              {/* Peak Point Dots */}
              <Circle cx="260" cy="20" r="4.5" fill="#121316" stroke="#c9f236" strokeWidth="3" />
              <Circle cx="320" cy="12" r="7" fill="#c9f236" opacity="0.3" />
              <Circle cx="320" cy="12" r="4.5" fill="#ffffff" stroke="#c9f236" strokeWidth="2.5" />
            </Svg>
          </View>

          {/* Session Milestones */}
          <View style={styles.sessionMilestones}>
            <Text style={styles.milestoneText}>Session #1 (88%)</Text>
            <Text style={styles.milestoneText}>Session #5 (93%)</Text>
            <Text style={styles.milestoneHighlight}>Session #10 (98%)</Text>
          </View>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 160,
    gap: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 24,
    lineHeight: 30,
    color: KineticColors.onSurface,
    letterSpacing: -0.4,
  },
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: KineticColors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  dateFilterPillContainer: {
    flexDirection: 'row',
    backgroundColor: KineticColors.surfaceContainerLow,
    padding: 4,
    borderRadius: 9999,
    gap: 4,
  },
  dateFilterBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
  },
  dateFilterBtnActive: {
    backgroundColor: KineticColors.primaryFixed,
    shadowColor: KineticColors.primaryFixed,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  dateFilterText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 11,
    lineHeight: 14,
    color: KineticColors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  dateFilterTextActive: {
    color: '#121316',
  },
  chartCard: {
    backgroundColor: KineticColors.surfaceContainer,
    borderRadius: 20,
    padding: 18,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 17,
    lineHeight: 22,
    color: KineticColors.onSurface,
  },
  cardSubtitle: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    lineHeight: 16,
    color: KineticColors.onSurfaceVariant,
    marginTop: 2,
  },
  peakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: KineticColors.surfaceContainerHigh,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    gap: 6,
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: KineticColors.primaryFixed,
  },
  peakBadgeText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 10,
    lineHeight: 13,
    color: KineticColors.onSurface,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  barsArea: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 150,
    paddingHorizontal: 4,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  barValText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 10,
    lineHeight: 12,
    color: KineticColors.onSurfaceVariant,
    opacity: 0.6,
  },
  barValTextSelected: {
    color: KineticColors.primaryFixed,
    opacity: 1,
  },
  barTrack: {
    width: '100%',
    maxWidth: 26,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
  },
  barActive: {
    backgroundColor: KineticColors.primaryFixed,
    shadowColor: KineticColors.primaryFixed,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 6,
  },
  barInactive: {
    backgroundColor: KineticColors.surfaceVariant,
  },
  dayLabel: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 11,
    lineHeight: 14,
    color: KineticColors.onSurfaceVariant,
  },
  dayLabelSelected: {
    color: KineticColors.primaryFixed,
  },
  dayReadoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  readoutDay: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
    color: KineticColors.onSurface,
  },
  readoutReps: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 13,
    color: KineticColors.primaryFixed,
    letterSpacing: 0.2,
  },
  trajectoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  trajectoryLabel: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 10,
    lineHeight: 13,
    color: KineticColors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  peakScoreRight: {
    alignItems: 'flex-end',
  },
  peakScoreVal: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 20,
    lineHeight: 24,
    color: KineticColors.secondary,
  },
  peakScoreLabel: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 11,
    lineHeight: 14,
    color: KineticColors.onSurfaceVariant,
  },
  svgWaveContainer: {
    width: '100%',
    height: 120,
    paddingTop: 8,
  },
  sessionMilestones: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  milestoneText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 10,
    lineHeight: 13,
    color: KineticColors.onSurfaceVariant,
    letterSpacing: 0.4,
  },
  milestoneHighlight: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 10,
    lineHeight: 13,
    color: KineticColors.primaryFixed,
    letterSpacing: 0.4,
  },
});
