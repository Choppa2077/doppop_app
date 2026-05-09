import { useEffect } from 'react';
import { type DimensionValue, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '../theme';

type SkeletonProps = {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  style?: object;
};

export function Skeleton({
  width = '100%',
  height = 16,
  radius = 8,
  style,
}: SkeletonProps) {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 800 }),
      -1,
      true,
    );
  }, [opacity]);

  const animated = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: colors.surfaceMuted,
        },
        animated,
        style,
      ]}
    />
  );
}

export function VenueCardSkeleton() {
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 20,
        overflow: 'hidden',
      }}
    >
      <Skeleton width="100%" height={180} radius={0} />
      <View style={{ padding: 16, gap: 10 }}>
        <Skeleton width="70%" height={20} />
        <Skeleton width="50%" height={14} />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Skeleton width={70} height={22} radius={999} />
          <Skeleton width={50} height={22} radius={999} />
        </View>
      </View>
    </View>
  );
}
