import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { qk } from '../../src/api/keys';
import { getLobby } from '../../src/api/lobbies';
import { Avatar } from '../../src/components/Avatar';
import { Card } from '../../src/components/Card';
import { EmptyState } from '../../src/components/EmptyState';
import { Skeleton } from '../../src/components/Skeleton';
import { colors, radii, text } from '../../src/theme';
import { formatLobbyTimeRange } from '../../src/utils/format';

// Placeholder lobby details. The full state machine, captain transfer modal,
// and overlap modal land in step 9.
export default function LobbyDetailsPlaceholder() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lobbyId = Number(id);

  const { data: lobby, isLoading, isError } = useQuery({
    queryKey: qk.lobby(lobbyId),
    queryFn: () => getLobby(lobbyId),
    enabled: Number.isFinite(lobbyId),
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 8,
          gap: 4,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={colors.textPrimary}
          />
        </Pressable>
        <Text style={[text.h2, { color: colors.textPrimary }]}>Lobby</Text>
      </View>

      {isLoading ? (
        <View style={{ padding: 20, gap: 12 }}>
          <Skeleton height={120} radius={radii.lg} />
          <Skeleton height={80} radius={radii.lg} />
        </View>
      ) : isError || !lobby ? (
        <EmptyState
          icon="cloud-offline-outline"
          title="Couldn't load lobby"
          cta={{ label: 'Go back', onPress: () => router.back() }}
        />
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 32 }}
        >
          <Card>
            <View style={{ gap: 4 }}>
              <Text
                style={[
                  text.micro,
                  {
                    color: colors.accent,
                    textTransform: 'uppercase',
                    letterSpacing: 1.2,
                  },
                ]}
              >
                {lobby.status}
              </Text>
              <Text style={[text.h1, { color: colors.textPrimary }]}>
                {lobby.venue.name}
              </Text>
              <Text style={[text.body, { color: colors.textMuted }]}>
                {formatLobbyTimeRange(
                  lobby.time_slot.starts_at,
                  lobby.time_slot.ends_at,
                )}
              </Text>
              <Text style={[text.body, { color: colors.textMuted }]}>
                {lobby.participant_count} / {lobby.max_players} players
              </Text>
            </View>
          </Card>

          <Card>
            <Text
              style={[
                text.micro,
                {
                  color: colors.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: 1.2,
                  marginBottom: 12,
                },
              ]}
            >
              Players
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              {lobby.participants.map((p) => {
                const name =
                  [p.user.first_name, p.user.last_name]
                    .filter(Boolean)
                    .join(' ') || p.user.email;
                return (
                  <View
                    key={p.id}
                    style={{ alignItems: 'center', gap: 6, width: 64 }}
                  >
                    <Avatar
                      uri={p.user.avatar_url}
                      name={name}
                      size={48}
                    />
                    <Text
                      style={[
                        text.micro,
                        { color: colors.textPrimary },
                      ]}
                      numberOfLines={1}
                    >
                      {p.user.first_name || name}
                      {p.is_captain ? ' · 👑' : ''}
                    </Text>
                  </View>
                );
              })}
            </View>
          </Card>

          <Card>
            <Text
              style={[text.caption, { color: colors.textMuted }]}
            >
              Full CTA + captain transfer + overlap modal land in step 9.
            </Text>
          </Card>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
