export const Colors = {
  primary: '#C2185B',
  primaryDark: '#880E4F',
  primaryLight: '#F8BBD0',
  secondary: '#000000',
  background: '#FFFFFF',
  accent: '#F8F8F8',
  text: '#1A1A1A',
  textMuted: '#888888',
  white: '#FFFFFF',
  priceStrike: '#AAAAAA',
  heroBg: '#FCE4EC',
  gold: '#FFD700',
  stripBg: '#C2185B',
} as const;

export type ColorKey = keyof typeof Colors;
