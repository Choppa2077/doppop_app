import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { colors, text } from '../theme';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

type ButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: Variant;
  loading?: boolean;
  fullWidth?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const variantStyles: Record<
  Variant,
  { container: ViewStyle; label: { color: string } }
> = {
  primary: {
    container: { backgroundColor: colors.accent },
    label: { color: '#FFFFFF' },
  },
  secondary: {
    container: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    label: { color: colors.textPrimary },
  },
  danger: {
    container: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.danger,
    },
    label: { color: colors.danger },
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    label: { color: colors.textPrimary },
  },
};

export function Button({
  label,
  variant = 'primary',
  loading = false,
  fullWidth = false,
  disabled,
  onPressIn,
  onPressOut,
  ...rest
}: ButtonProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const styles = variantStyles[variant];
  const isDisabled = disabled || loading;

  return (
    <AnimatedPressable
      {...rest}
      disabled={isDisabled}
      onPressIn={(e) => {
        scale.value = withSpring(0.97, { mass: 0.4, stiffness: 220 });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, { mass: 0.4, stiffness: 220 });
        onPressOut?.(e);
      }}
      style={[
        {
          height: 56,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 24,
          opacity: isDisabled ? 0.5 : 1,
          width: fullWidth ? '100%' : undefined,
        },
        styles.container,
        animatedStyle,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={styles.label.color} />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[text.bodyStrong, styles.label]}>{label}</Text>
        </View>
      )}
    </AnimatedPressable>
  );
}
