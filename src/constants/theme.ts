import { Platform, TextStyle } from 'react-native';

export const KineticColors = {
  surface: '#121316',
  surfaceDim: '#121316',
  surfaceBright: '#38393c',
  surfaceContainerLowest: '#0d0e11',
  surfaceContainerLow: '#1b1b1f',
  surfaceContainer: '#1f1f23',
  surfaceContainerHigh: '#292a2d',
  surfaceContainerHighest: '#343538',
  onSurface: '#e3e2e6',
  onSurfaceVariant: '#c5c9ae',
  inverseSurface: '#e3e2e6',
  inverseOnSurface: '#2f3034',
  outline: '#8f937b',
  outlineVariant: '#444934',
  surfaceTint: '#aed50c',
  primary: '#ffffff',
  onPrimary: '#293500',
  primaryContainer: '#D4FE42',
  onPrimaryContainer: '#576c00',
  inversePrimary: '#526600',
  secondary: '#64d9c7',
  onSecondary: '#003731',
  secondaryContainer: '#1aa291',
  onSecondaryContainer: '#00302a',
  tertiary: '#ffffff',
  onTertiary: '#670414',
  tertiaryContainer: '#ffdad9',
  onTertiaryContainer: '#af3d43',
  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',
  onErrorContainer: '#ffdad6',
  primaryFixed: '#D4FE42',
  primaryFixedDim: '#aed50c',
  onPrimaryFixed: '#171e00',
  onPrimaryFixedVariant: '#3d4d00',
  secondaryFixed: '#82f6e3',
  secondaryFixedDim: '#64d9c7',
  onSecondaryFixed: '#00201c',
  onSecondaryFixedVariant: '#005047',
  tertiaryFixed: '#ffdad9',
  tertiaryFixedDim: '#ffb3b2',
  onTertiaryFixed: '#410008',
  onTertiaryFixedVariant: '#861f28',
  background: '#121316',
  onBackground: '#e3e2e6',
  surfaceVariant: '#343538',
} as const;

export const Typography: Record<string, TextStyle> = {
  displayHero: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 56,
    lineHeight: 60,
    letterSpacing: -1.68,
  },
  displayHeroMobile: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -0.8,
  },
  headlineLg: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.64,
  },
  headlineMd: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.24,
  },
  headlineSm: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodyLg: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMd: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  bodySm: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    lineHeight: 16,
  },
  labelNumeric: {
    fontFamily: 'SpaceGrotesk_600SemiBold',
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  labelCaps: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.88,
    textTransform: 'uppercase',
  },
};

export const AppRounded = {
  sm: 8,
  default: 16,
  md: 24,
  lg: 32,
  xl: 48,
  full: 9999,
} as const;

export const AppSpacing = {
  gutter: 16,
  margin: 20,
  spaceXs: 4,
  spaceSm: 8,
  spaceMd: 16,
  spaceLg: 24,
  spaceXl: 32,
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Colors = {
  light: {
    ...KineticColors,
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    ...KineticColors,
    text: '#ffffff',
    background: '#121316',
    backgroundElement: '#1b1b1f',
    backgroundSelected: '#292a2d',
    textSecondary: '#c5c9ae',
  },
};

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
