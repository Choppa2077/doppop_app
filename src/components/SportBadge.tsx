import { Text, View } from 'react-native';

import { colors, text } from '../theme';

type SportSlug = 'football' | 'volleyball' | 'basketball' | (string & {});

type SportBadgeProps = {
  sport: SportSlug;
  label?: string;
  size?: 'sm' | 'md';
};

const SPORT_META: Record<string, { emoji: string; label: string; tint: string }> = {
  football: { emoji: '⚽', label: 'Football', tint: '#1FB76A' },
  volleyball: { emoji: '🏐', label: 'Volleyball', tint: '#FFAA33' },
  basketball: { emoji: '🏀', label: 'Basketball', tint: '#E5484D' },
};

export function SportBadge({ sport, label, size = 'md' }: SportBadgeProps) {
  const meta = SPORT_META[sport] ?? {
    emoji: '🏆',
    label: label ?? sport,
    tint: colors.textMuted,
  };
  const displayLabel = label ?? meta.label;
  const isSm = size === 'sm';

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceMuted,
        paddingHorizontal: isSm ? 8 : 10,
        paddingVertical: isSm ? 3 : 5,
        borderRadius: 999,
        gap: 6,
      }}
    >
      <Text style={{ fontSize: isSm ? 12 : 14 }}>{meta.emoji}</Text>
      <Text
        style={[
          isSm ? text.micro : text.caption,
          { color: colors.textPrimary },
        ]}
      >
        {displayLabel}
      </Text>
    </View>
  );
}
