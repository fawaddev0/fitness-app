import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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

export function BottomNavigationDock({
  activeTab,
  onTabSelect,
}: BottomNavigationDockProps) {
  const insets = useSafeAreaInsets();
  const bottomMargin = Math.max(insets.bottom, 12) + 14;

  return (
    <View style={[styles.floatingContainer, { bottom: bottomMargin }]}>
      <View style={styles.dock}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.8}
              onPress={() => onTabSelect(tab.id)}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
            >
              <MaterialIcons
                name={tab.icon}
                size={25}
                color={isActive ? '#121316' : 'rgba(227, 226, 230, 0.45)'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  isActive ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
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
    maxWidth: 380,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(18, 19, 22, 0.94)',
    borderRadius: 20,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderWidth: 1.2,
    borderColor: 'rgba(128, 128, 128, 0.28)',
    boxShadow: '0 0 16px rgba(212, 254, 66, 0)',
    elevation: 12,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    minHeight: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    gap: 3,
  },
  tabButtonActive: {
    backgroundColor: KineticColors.surfaceTint,
    shadowColor: KineticColors.primaryFixed,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 6,
  },
  tabLabel: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  tabLabelActive: {
    color: '#121316',
  },
  tabLabelInactive: {
    color: 'rgba(227, 226, 230, 0.45)',
  },
});
