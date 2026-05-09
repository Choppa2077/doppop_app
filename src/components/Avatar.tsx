import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { colors, fontFamilies } from '../theme';

type AvatarProps = {
  uri?: string | null;
  name?: string | null;
  size?: number;
};

const FALLBACK_PALETTE = [
  '#5B5BFF',
  '#1FB76A',
  '#FFAA33',
  '#E5484D',
  '#7B61FF',
  '#FF6FB5',
  '#3DB7E0',
  '#FF8A4C',
];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ uri, name, size = 40 }: AvatarProps) {
  const radius = size / 2;

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: colors.surfaceMuted,
        }}
        contentFit="cover"
        transition={200}
      />
    );
  }

  const fallbackName = name?.trim() || '?';
  const bg = FALLBACK_PALETTE[hashString(fallbackName) % FALLBACK_PALETTE.length];
  const initials = initialsFor(fallbackName);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontFamily: fontFamilies.displayBold,
          color: '#FFFFFF',
          fontSize: Math.round(size * 0.4),
        }}
      >
        {initials}
      </Text>
    </View>
  );
}
