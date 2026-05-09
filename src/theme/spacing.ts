export const spacing = {
  '0.5': 4,
  '1': 8,
  '1.5': 12,
  '2': 16,
  '2.5': 20,
  '3': 24,
  '4': 32,
  '5': 40,
  '7': 56,
} as const;

export const radii = {
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  full: 999,
} as const;

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
} as const;

export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radii;
