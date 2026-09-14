import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  LayoutChangeEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { KineticColors } from '../constants/theme';

export type NavTab = 'home' | 'roadmaps' | 'stats' | 'account';

interface BottomNavigationDockProps {
  activeTab: NavTab;
  onTabSelect: (tab: NavTab) => void;
}

interface TabConfig {
  id: NavTab;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

const TABS: TabConfig[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'roadmaps', label: 'Roadmaps', icon: 'alt-route' },
  { id: 'stats', label: 'Stats', icon: 'insights' },
  { id: 'account', label: 'Account', icon: 'person' },
];

const DOCK_MAX_WIDTH = 380;
const DOCK_PADDING = 4;

// Module-level persistent tracker to maintain smooth continuous sliding across screen mounts
let globalLastTabIndex = 0;

export function BottomNavigationDock({
  activeTab,
  onTabSelect,
}: BottomNavigationDockProps) {
  const insets = useSafeAreaInsets();
  const bottomMargin = Math.max(insets.bottom, 12) + 14;

  const windowWidth = Dimensions.get('window').width;
  const initialDockWidth = Math.min(windowWidth - 40, DOCK_MAX_WIDTH);
  const [dockWidth, setDockWidth] = useState(initialDockWidth);

  const activeIndex = Math.max(
    0,
    TABS.findIndex((tab) => tab.id === activeTab)
  );

  const availableWidth = Math.max(0, dockWidth - DOCK_PADDING * 2);
  const tabWidth = availableWidth / TABS.length;

  // Initialize at previous known tab index so sliding across screens is seamless
  const initialTranslateX = globalLastTabIndex * tabWidth;
  const translateX = useRef(new Animated.Value(initialTranslateX)).current;
  const pillScale = useRef(new Animated.Value(1)).current;

  // Counter-translation value for the inner masked layer
  const invertedTranslateX = useRef(Animated.multiply(translateX, -1)).current;

  // Animate pill whenever activeIndex or tabWidth changes
  useEffect(() => {
    const targetX = activeIndex * tabWidth;

    Animated.parallel([
      Animated.spring(translateX, {
        toValue: targetX,
        useNativeDriver: true,
        damping: 20,
        mass: 0.35,
        stiffness: 300,
        overshootClamping: true,
      }),
      Animated.sequence([
        Animated.timing(pillScale, {
          toValue: 0.95,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.spring(pillScale, {
          toValue: 1,
          damping: 14,
          stiffness: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      globalLastTabIndex = activeIndex;
    });

    globalLastTabIndex = activeIndex;
  }, [activeIndex, tabWidth, translateX, pillScale]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const newWidth = e.nativeEvent.layout.width;
    if (newWidth > 0 && Math.abs(newWidth - dockWidth) > 1) {
      setDockWidth(newWidth);
    }
  };

  const handleTabPress = (tabId: NavTab) => {
    if (tabId === activeTab) return;
    globalLastTabIndex = activeIndex;
    onTabSelect(tabId);
  };

  return (
    <View style={[styles.floatingContainer, { bottom: bottomMargin }]}>
      <View style={styles.dock} onLayout={handleLayout}>
        {/* Layer 1: Inactive Base Layer (Muted Icons & Text) */}
        <View style={styles.baseTabsRow}>
          {TABS.map((tab) => (
            <View key={tab.id} style={styles.tabItem}>
              <MaterialIcons
                name={tab.icon}
                size={24}
                color="rgba(227, 226, 230, 0.45)"
              />
              <Text style={styles.tabLabelInactive}>{tab.label}</Text>
            </View>
          ))}
        </View>

        {/* Layer 2: Sliding Optical Mask Pill (Dark Icons & Text on Lime Background) */}
        <Animated.View
          style={[
            styles.slidingPillMask,
            {
              width: tabWidth,
              transform: [{ translateX }, { scale: pillScale }],
            },
          ]}
          pointerEvents="none"
        >
          <Animated.View
            style={[
              styles.activeInnerRow,
              {
                width: availableWidth,
                transform: [{ translateX: invertedTranslateX }],
              },
            ]}
          >
            {TABS.map((tab) => (
              <View key={tab.id} style={styles.tabItem}>
                <MaterialIcons
                  name={tab.icon}
                  size={24}
                  color="#121316"
                />
                <Text style={styles.tabLabelActive}>{tab.label}</Text>
              </View>
            ))}
          </Animated.View>
        </Animated.View>

        {/* Layer 3: Interactive Touch Handlers */}
        <View style={styles.touchOverlayRow}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.8}
              onPress={() => handleTabPress(tab.id)}
              style={styles.touchTarget}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 50,
  },
  dock: {
    width: '100%',
    maxWidth: DOCK_MAX_WIDTH,
    height: 62,
    backgroundColor: 'rgba(18, 19, 22, 0.95)',
    borderRadius: 22,
    padding: DOCK_PADDING,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  baseTabsRow: {
    ...StyleSheet.absoluteFill,
    left: DOCK_PADDING,
    right: DOCK_PADDING,
    top: DOCK_PADDING,
    bottom: DOCK_PADDING,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  slidingPillMask: {
    position: 'absolute',
    left: DOCK_PADDING,
    top: DOCK_PADDING,
    bottom: DOCK_PADDING,
    backgroundColor: KineticColors.primaryFixed,
    borderRadius: 18,
    shadowColor: KineticColors.primaryFixed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
    overflow: 'hidden',
    zIndex: 2,
  },
  activeInnerRow: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  touchOverlayRow: {
    ...StyleSheet.absoluteFill,
    left: DOCK_PADDING,
    right: DOCK_PADDING,
    top: DOCK_PADDING,
    bottom: DOCK_PADDING,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 3,
  },
  touchTarget: {
    flex: 1,
    height: '100%',
  },
  tabItem: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    gap: 3,
  },
  tabLabelActive: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#121316',
  },
  tabLabelInactive: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: 'rgba(227, 226, 230, 0.45)',
  },
});
