import { type ReactNode } from 'react';
import { Pressable, type PressableProps, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { colors, radii, text } from '../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type SelectableCardProps = Omit<PressableProps, 'children'> & {
  selected: boolean;
  title: string;
  description?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
};

export function SelectableCard({
  selected,
  title,
  description,
  leading,
  trailing,
  onPressIn,
  onPressOut,
  style,
  ...rest
}: SelectableCardProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(e) => {
        scale.value = withSpring(0.98, { mass: 0.4, stiffness: 220 });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, { mass: 0.4, stiffness: 220 });
        onPressOut?.(e);
      }}
      style={[
        {
          backgroundColor: selected ? colors.accentSoft : colors.surface,
          borderRadius: radii.lg,
          borderWidth: 2,
          borderColor: selected ? colors.accent : colors.border,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        },
        animatedStyle,
        style as object,
      ]}
    >
      {leading ? <View>{leading}</View> : null}
      <View style={{ flex: 1, gap: 2 }}>
        <Text
          style={[
            text.bodyStrong,
            { color: selected ? colors.accent : colors.textPrimary },
          ]}
        >
          {title}
        </Text>
        {description ? (
          <Text style={[text.caption, { color: colors.textMuted }]}>
            {description}
          </Text>
        ) : null}
      </View>
      {trailing}
    </AnimatedPressable>
  );
}
