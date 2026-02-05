/**
 * Cigar Club App Colors
 * Dark theme with gold accents - elegant and sophisticated
 */

const gold = '#D4AF37';
const darkBg = '#121212';
const darkerBg = '#0f0f0f';

export const Colors = {
  // Primary brand colors
  primary: gold,
  primaryLight: '#E5C76B',
  primaryDark: '#B8962E',

  // Background colors
  background: darkBg,
  backgroundDark: darkerBg,
  backgroundLight: '#1a1a1a',
  surface: '#1E1E1E',

  // Text colors
  text: '#E0E0E0',
  textSecondary: '#888888',
  textMuted: '#666666',
  textDark: '#555555',

  // Border colors
  border: '#333333',
  borderLight: '#444444',

  // Status colors
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',

  // Gradient colors
  gradientStart: 'transparent',
  gradientEnd: darkBg,

  // Shadow
  shadow: '#000000',

  // Tab bar
  tabIconDefault: '#666666',
  tabIconSelected: gold,
  tabBackground: 'rgba(18,18,18,0.95)',
  tabActiveBackground: 'rgba(212, 175, 55, 0.1)',
};

export const Fonts = {
  // iOS uses Didot for elegant serif, Android falls back to serif
  title: {
    fontFamily: 'serif',
  },
  body: {
    fontFamily: 'System',
  },
};

export const Shadows = {
  small: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  medium: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  large: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 20,
  },
  gold: {
    shadowColor: gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};
