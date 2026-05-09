import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { SportBadge } from './SportBadge';
import { StatusPill } from './StatusPill';
import { colors, radii, shadows, text } from '../theme';
import type { LobbyListItem } from '../types/api';
import { formatLobbyTimeRange, formatTimeUntil } from '../utils/format';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ActiveLobbyCardProps = {
  lobby: LobbyListItem;
  isCaptain: boolean;
  onPress?: () => void;
};

export function ActiveLobbyCard({
  lobby,
  isCaptain,
  onPress,
}: ActiveLobbyCardProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const seatsLeft = Math.max(0, lobby.max_players - lobby.participant_count);

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.97, { mass: 0.4, stiffness: 220 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { mass: 0.4, stiffness: 220 });
      }}
      style={[
        {
          width: 280,
          backgroundColor: colors.surface,
          borderRadius: radii.lg,
          padding: 16,
          gap: 10,
          borderWidth: 2,
          borderColor: colors.accent,
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
        <StatusPill status={lobby.status} size="sm" />
        {isCaptain ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              backgroundColor: colors.accentSoft,
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 999,
            }}
          >
            <Ionicons name="ribbon" size={11} color={colors.accent} />
            <Text style={[text.micro, { color: colors.accent }]}>
              Captain
            </Text>
          </View>
        ) : null}
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
          {lobby.venue.city_name}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          marginTop: 2,
        }}
      >
        <SportBadge
          sport={lobby.sport.slug}
          label={lobby.sport.name}
          size="sm"
        />
        <View
          style={{
            backgroundColor: colors.accent,
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 999,
          }}
        >
          <Text style={[text.micro, { color: '#FFFFFF' }]}>
            {formatTimeUntil(lobby.time_slot.starts_at)}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 4,
        }}
      >
        <Text
          style={[text.caption, { color: colors.textMuted }]}
          numberOfLines={1}
        >
          {formatLobbyTimeRange(
            lobby.time_slot.starts_at,
            lobby.time_slot.ends_at,
          )}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons
            name="people-outline"
            size={14}
            color={seatsLeft === 0 ? colors.textMuted : colors.accent}
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
