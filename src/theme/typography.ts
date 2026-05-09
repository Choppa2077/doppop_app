import type { TextStyle } from 'react-native';

export const fontFamilies = {
  displayBold: 'SpaceGrotesk_700Bold',
  bodyMedium: 'DMSans_500Medium',
  bodySemibold: 'DMSans_600SemiBold',
} as const;

export const text = {
  display: {
    fontFamily: fontFamilies.displayBold,
    fontSize: 32,
    lineHeight: 38,
  },
  h1: {
    fontFamily: fontFamilies.displayBold,
    fontSize: 24,
    lineHeight: 30,
  },
  h2: {
    fontFamily: fontFamilies.displayBold,
    fontSize: 20,
    lineHeight: 26,
  },
  body: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 16,
    lineHeight: 22,
  },
  bodyStrong: {
    fontFamily: fontFamilies.bodySemibold,
    fontSize: 16,
    lineHeight: 22,
  },
  caption: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
  },
  micro: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 11,
    lineHeight: 14,
  },
} satisfies Record<string, TextStyle>;

export type TextVariant = keyof typeof text;
