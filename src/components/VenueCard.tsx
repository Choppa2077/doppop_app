import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { RatingPill } from './RatingPill';
import { SportBadge } from './SportBadge';
import { colors, radii, shadows, text } from '../theme';
import { formatPrice } from '../utils/format';
import type { Venue } from '../types/api';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type VenueCardProps = {
  venue: Venue;
  onPress?: () => void;
  index?: number;
};

export function VenueCard({ venue, onPress, index = 0 }: VenueCardProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const photo = venue.photo_url ?? venue.sport_base.photo_url;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.98, { mass: 0.4, stiffness: 220 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { mass: 0.4, stiffness: 220 });
      }}
      entering={FadeInDown.delay(index * 30).duration(280)}
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: radii.lg,
          overflow: 'hidden',
          ...shadows.card,
        },
        animatedStyle,
      ]}
    >
      <View style={{ aspectRatio: 16 / 9, backgroundColor: colors.surfaceMuted }}>
        {photo ? (
          <Image
            source={{ uri: photo }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons
              name="image-outline"
              size={36}
              color={colors.textMuted}
            />
          </View>
        )}
        <View
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
          }}
        >
          <RatingPill rating={venue.rating} />
        </View>
      </View>
      <View style={{ padding: 16, gap: 8 }}>
        <View style={{ gap: 2 }}>
          <Text
            style={[text.h2, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {venue.name}
          </Text>
          <Text
            style={[text.caption, { color: colors.textMuted }]}
            numberOfLines={1}
          >
            {venue.sport_base.name} · {venue.sport_base.city.name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 4,
          }}
        >
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <SportBadge
              sport={venue.sport.slug}
              label={venue.sport.name}
              size="sm"
            />
            {venue.football_type ? (
              <View
                style={{
                  backgroundColor: colors.surfaceMuted,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 999,
                  justifyContent: 'center',
                }}
              >
                <Text style={[text.micro, { color: colors.textPrimary }]}>
                  {venue.football_type.name}
                </Text>
              </View>
            ) : null}
          </View>
          <Text style={[text.bodyStrong, { color: colors.textPrimary }]}>
            {formatPrice(venue.price_per_hour)} ₸/hr
          </Text>
        </View>
      </View>
    </AnimatedPressable>
  );
}
