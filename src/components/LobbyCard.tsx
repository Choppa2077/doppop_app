import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Avatar } from './Avatar';
import { SportBadge } from './SportBadge';
import { StatusPill } from './StatusPill';
import { colors, radii, shadows, text } from '../theme';
import type { LobbyListItem } from '../types/api';
import { formatLobbyTimeRange } from '../utils/format';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type LobbyCardProps = {
  lobby: LobbyListItem;
  onPress?: () => void;
  index?: number;
};

export function LobbyCard({ lobby, onPress, index = 0 }: LobbyCardProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const captainName =
    [lobby.captain.first_name, lobby.captain.last_name]
      .filter(Boolean)
      .join(' ') || lobby.captain.email;

  const seatsLeft = Math.max(0, lobby.max_players - lobby.participant_count);

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
          padding: 16,
          gap: 12,
          ...shadows.card,
        },
        animatedStyle,
      ]}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
          <SportBadge
            sport={lobby.sport.slug}
            label={lobby.sport.name}
            size="sm"
          />
          {lobby.football_type ? (
            <View
              style={{
                backgroundColor: colors.surfaceMuted,
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 999,
              }}
            >
              <Text style={[text.micro, { color: colors.textPrimary }]}>
                {lobby.football_type.name}
              </Text>
            </View>
          ) : null}
        </View>
        <StatusPill status={lobby.status} size="sm" />
      </View>

      <View style={{ gap: 2 }}>
        <Text
          style={[text.h2, { color: colors.textPrimary }]}
          numberOfLines={1}
        >
          {lobby.venue.name}
        </Text>
        <Text
          style={[text.caption, { color: colors.textMuted }]}
          numberOfLines={1}
        >
          {lobby.venue.sport_base_name} · {lobby.venue.city_name}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Ionicons name="time-outline" size={14} color={colors.textMuted} />
        <Text style={[text.bodyStrong, { color: colors.textPrimary }]}>
          {formatLobbyTimeRange(
            lobby.time_slot.starts_at,
            lobby.time_slot.ends_at,
          )}
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
        <View
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
        >
          <Avatar uri={lobby.captain.avatar_url} name={captainName} size={28} />
          <Text
            style={[text.caption, { color: colors.textMuted }]}
            numberOfLines={1}
          >
            {captainName}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Ionicons
            name="people-outline"
            size={14}
            color={
              seatsLeft === 0 ? colors.textMuted : colors.accent
            }
          />
          <Text
            style={[
              text.bodyStrong,
              {
                color: seatsLeft === 0 ? colors.textMuted : colors.accent,
              },
            ]}
          >
            {lobby.participant_count} / {lobby.max_players}
          </Text>
        </View>
      </View>
    </AnimatedPressable>
  );
}
