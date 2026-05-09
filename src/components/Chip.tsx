import { type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { colors, text } from '../theme';

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  leading?: ReactNode;
  size?: 'sm' | 'md';
};

export function Chip({
  label,
  selected = false,
  onPress,
  leading,
  size = 'md',
}: ChipProps) {
  const isSm = size === 'sm';
  const inner = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: isSm ? 10 : 14,
        paddingVertical: isSm ? 6 : 8,
        borderRadius: 999,
        borderWidth: 1.5,
        borderColor: selected ? colors.accent : colors.border,
        backgroundColor: selected ? colors.accentSoft : colors.surface,
      }}
    >
      {leading}
      <Text
        style={[
          isSm ? text.caption : text.bodyStrong,
          { color: selected ? colors.accent : colors.textPrimary },
        ]}
      >
        {label}
      </Text>
    </View>
  );

  if (!onPress) return inner;
  return (
    <Pressable onPress={onPress} hitSlop={6}>
      {({ pressed }) => (
        <View style={{ opacity: pressed ? 0.6 : 1 }}>{inner}</View>
      )}
    </Pressable>
  );
}
