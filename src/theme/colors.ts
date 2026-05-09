export const colors = {
  bg: '#FAFAF7',
  surface: '#FFFFFF',
  surfaceMuted: '#F2F2EE',
  border: '#E6E6E0',
  textPrimary: '#0A0A0A',
  textMuted: '#6B6B66',
  accent: '#5B5BFF',
  accentSoft: '#EBEBFF',
  success: '#1FB76A',
  warning: '#FFAA33',
  danger: '#E5484D',
  overlay: 'rgba(0,0,0,0.6)',
} as const;

export type ColorToken = keyof typeof colors;
