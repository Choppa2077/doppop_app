import { type ReactNode } from 'react';
import {
  Pressable,
  type PressableProps,
  View,
  type ViewProps,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { colors, radii, shadows } from '../theme';

type BaseProps = {
  children: ReactNode;
  padded?: boolean;
};

type StaticCardProps = BaseProps & ViewProps & { onPress?: never };
type PressableCardProps = BaseProps &
  Omit<PressableProps, 'children'> & {
    onPress: PressableProps['onPress'];
  };

type CardProps = StaticCardProps | PressableCardProps;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Card({ children, padded = true, ...rest }: CardProps) {
  const baseStyle = {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: padded ? 16 : 0,
    ...shadows.card,
  };

  if ('onPress' in rest && rest.onPress) {
    return <PressableCard baseStyle={baseStyle} {...(rest as PressableCardProps)}>{children}</PressableCard>;
  }

  return (
    <View {...(rest as ViewProps)} style={[baseStyle, (rest as ViewProps).style]}>
      {children}
    </View>
  );
}

function PressableCard({
  children,
  baseStyle,
  onPressIn,
  onPressOut,
  style,
  ...rest
}: PressableCardProps & { baseStyle: object }) {
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
      style={[baseStyle, animatedStyle, style as object]}
    >
      {children}
    </AnimatedPressable>
  );
}
