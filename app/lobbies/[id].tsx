import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { isApiError } from '../../src/api/client';
import { qk } from '../../src/api/keys';
import { joinLobby, leaveLobby } from '../../src/api/lobbies';
import { Avatar } from '../../src/components/Avatar';
import { Button } from '../../src/components/Button';
import { CaptainTransferSheet } from '../../src/components/CaptainTransferSheet';
import { Card } from '../../src/components/Card';
import { ConfirmDialog } from '../../src/components/ConfirmDialog';
import { EmptyState } from '../../src/components/EmptyState';
import { OverlapModal } from '../../src/components/OverlapModal';
import { Skeleton } from '../../src/components/Skeleton';
import { SportBadge } from '../../src/components/SportBadge';
import { StatusPill } from '../../src/components/StatusPill';
import { useLobby } from '../../src/hooks/useLobbies';
import { useMe } from '../../src/hooks/useMe';
import { colors, radii, text } from '../../src/theme';
import {
  formatLobbyTimeRange,
  formatLongDate,
  formatTimeRange,
  formatTimeUntil,
} from '../../src/utils/format';
import { getLobbyAction } from '../../src/utils/lobbyAction';
import { toast } from '../../src/utils/toast';

export default function LobbyDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lobbyId = Number(id);
  const queryClient = useQueryClient();
  const { data: me } = useMe();
  const { data: lobby, isLoading, isError } = useLobby(lobbyId);

  const [transferOpen, setTransferOpen] = useState(false);
  const [aloneConfirmOpen, setAloneConfirmOpen] = useState(false);
  const [overlapLobbyId, setOverlapLobbyId] = useState<number | null>(null);
  const [overlapOpen, setOverlapOpen] = useState(false);

  // Tick once a minute so "in 2h 14m" stays roughly correct.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const join = useMutation({
    mutationFn: () => joinLobby(lobbyId),
    onSuccess: (updated) => {
      queryClient.setQueryData(qk.lobby(lobbyId), updated);
      queryClient.invalidateQueries({ queryKey: qk.activeLobbies() });
      queryClient.invalidateQueries({ queryKey: ['lobbies'] });
    },
    onError: (err) => {
      if (isApiError(err) && err.code === 'time_overlap') {
        const conflictingId = err.extra?.conflicting_lobby_id;
        setOverlapLobbyId(
          typeof conflictingId === 'number' ? conflictingId : null,
        );
        setOverlapOpen(true);
        return;
      }
      const message = isApiError(err) ? err.detail : 'Could not join lobby';
      toast.error(message);
    },
  });

  const leave = useMutation({
    mutationFn: (newCaptainId?: number) =>
      leaveLobby(lobbyId, {
        new_captain_id: newCaptainId ?? null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.lobby(lobbyId) });
      queryClient.invalidateQueries({ queryKey: qk.activeLobbies() });
      queryClient.invalidateQueries({ queryKey: ['lobbies'] });
      setTransferOpen(false);
      setAloneConfirmOpen(false);
      router.back();
    },
    onError: (err) => {
      const message = isApiError(err) ? err.detail : 'Could not leave lobby';
      toast.error(message);
      setTransferOpen(false);
      setAloneConfirmOpen(false);
    },
  });

  if (isLoading) return <LoadingState />;

  if (isError || !lobby) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
        <BackChip />
        <EmptyState
          icon="cloud-offline-outline"
          title="Couldn't load lobby"
          description="Try again in a moment."
          cta={{ label: 'Go back', onPress: () => router.back() }}
        />
      </SafeAreaView>
    );
  }

  const action = getLobbyAction(lobby, me);
  const captainName =
    [lobby.captain.first_name, lobby.captain.last_name]
      .filter(Boolean)
      .join(' ') || lobby.captain.email;
  const otherParticipants = lobby.participants.filter(
    (p) => p.user.id !== lobby.captain.id,
  );
  const venuePhoto = null; // venue photos aren't part of the lobby payload; the
  // lobby's venue ref is `LobbyVenueRef` which only carries names. The hero
  // can still render with a gradient over a tinted surface.

  const startsIn = formatTimeUntil(lobby.time_slot.starts_at, now);
  const startsAt = new Date(lobby.time_slot.starts_at);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View
          style={{
            height: 240,
            backgroundColor: colors.accent,
            position: 'relative',
          }}
        >
          {venuePhoto ? (
            <Image
              source={{ uri: venuePhoto }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <LinearGradient
              colors={['#5B5BFF', '#3D3DD1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ flex: 1 }}
            />
          )}
          <LinearGradient
            colors={['rgba(0,0,0,0.35)', 'transparent', 'rgba(0,0,0,0.55)']}
            locations={[0, 0.4, 1]}
            style={{ position: 'absolute', inset: 0 }}
            pointerEvents="none"
          />
          <SafeAreaView
            edges={['top']}
            style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
          >
            <View
              style={{
                paddingHorizontal: 12,
                paddingTop: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Pressable
                onPress={() => router.back()}
                hitSlop={12}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  backgroundColor: 'rgba(255,255,255,0.92)',
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
              <StatusPill status={lobby.status} />
            </View>
          </SafeAreaView>
          <View
            style={{
              position: 'absolute',
              left: 20,
              right: 20,
              bottom: 20,
              gap: 6,
            }}
          >
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <SportBadge
                sport={lobby.sport.slug}
                label={lobby.sport.name}
                size="sm"
              />
              {lobby.football_type ? (
                <View
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.85)',
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
            <Text
              style={[
                text.display,
                { color: '#FFFFFF', fontSize: 28, lineHeight: 34 },
              ]}
              numberOfLines={2}
            >
              {lobby.venue.name}
            </Text>
            <Text style={[text.body, { color: 'rgba(255,255,255,0.85)' }]}>
              {lobby.venue.sport_base_name} · {lobby.venue.city_name}
            </Text>
          </View>
        </View>

        <View style={{ padding: 20, gap: 20 }}>
          {/* Time block */}
          <Card>
            <View style={{ gap: 6 }}>
              <Text
                style={[
                  text.micro,
                  {
                    color: colors.textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: 1.2,
                  },
                ]}
              >
                When
              </Text>
              <Text
                style={[text.h1, { color: colors.textPrimary }]}
                numberOfLines={2}
              >
                {formatLobbyTimeRange(
                  lobby.time_slot.starts_at,
                  lobby.time_slot.ends_at,
                  now,
                )}
              </Text>
              <Text style={[text.caption, { color: colors.textMuted }]}>
                {formatLongDate(startsAt)} ·{' '}
                {formatTimeRange(
                  lobby.time_slot.starts_at,
                  lobby.time_slot.ends_at,
                )}
              </Text>
              {lobby.status === 'open' || lobby.status === 'confirmed' ? (
                <View
                  style={{
                    alignSelf: 'flex-start',
                    marginTop: 8,
                    backgroundColor: colors.accentSoft,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 999,
                  }}
                >
                  <Text style={[text.caption, { color: colors.accent }]}>
                    Starts {startsIn}
                  </Text>
                </View>
              ) : null}
            </View>
          </Card>

          {/* Players */}
          <View style={{ gap: 12 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={[
                  text.micro,
                  {
                    color: colors.textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: 1.2,
                  },
                ]}
              >
                Players
              </Text>
              <Text style={[text.bodyStrong, { color: colors.textPrimary }]}>
                {lobby.participant_count} / {lobby.max_players}
              </Text>
            </View>
            <Card>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 16,
                }}
              >
                {lobby.participants.map((p) => {
                  const name =
                    [p.user.first_name, p.user.last_name]
                      .filter(Boolean)
                      .join(' ') || p.user.email;
                  return (
                    <Pressable
                      key={p.id}
                      onPress={() => toast.show(name)}
                      style={{ alignItems: 'center', gap: 6, width: 64 }}
                    >
                      <View>
                        <Avatar
                          uri={p.user.avatar_url}
                          name={name}
                          size={52}
                        />
                        {p.is_captain ? (
                          <View
                            style={{
                              position: 'absolute',
                              bottom: -2,
                              right: -2,
                              width: 22,
                              height: 22,
                              borderRadius: 999,
                              backgroundColor: colors.accent,
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderWidth: 2,
                              borderColor: colors.surface,
                            }}
                          >
                            <Ionicons
                              name="ribbon"
                              size={11}
                              color="#FFFFFF"
                            />
                          </View>
                        ) : null}
                      </View>
                      <Text
                        style={[text.micro, { color: colors.textPrimary }]}
                        numberOfLines={1}
                      >
                        {p.user.first_name || name.split(' ')[0]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </Card>
          </View>

          {/* Description */}
          {lobby.description ? (
            <View style={{ gap: 8 }}>
              <Text
                style={[
                  text.micro,
                  {
                    color: colors.textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: 1.2,
                  },
                ]}
              >
                About
              </Text>
              <Text style={[text.body, { color: colors.textPrimary }]}>
                {lobby.description}
              </Text>
            </View>
          ) : null}

          {/* Captain card */}
          <View style={{ gap: 8 }}>
            <Text
              style={[
                text.micro,
                {
                  color: colors.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: 1.2,
                },
              ]}
            >
              Captain
            </Text>
            <Card>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <Avatar
                  uri={lobby.captain.avatar_url}
                  name={captainName}
                  size={48}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[text.bodyStrong, { color: colors.textPrimary }]}
                    numberOfLines={1}
                  >
                    {captainName}
                  </Text>
                  <Text
                    style={[text.caption, { color: colors.textMuted }]}
                    numberOfLines={1}
                  >
                    {lobby.captain.email}
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        </View>
      </ScrollView>

      {/* Sticky bottom CTA */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.bg,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        <SafeAreaView edges={['bottom']}>
          <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 }}>
            <CtaRegion
              action={action}
              onJoin={() => join.mutate()}
              joinLoading={join.isPending}
              onLeave={() => leave.mutate(undefined)}
              leaveLoading={leave.isPending}
              onCaptainLeave={() => {
                if (otherParticipants.length === 0) {
                  setAloneConfirmOpen(true);
                } else {
                  setTransferOpen(true);
                }
              }}
            />
          </View>
        </SafeAreaView>
      </View>

      {/* Modals */}
      <CaptainTransferSheet
        visible={transferOpen}
        candidates={otherParticipants}
        loading={leave.isPending}
        onConfirm={(newCaptainId) => leave.mutate(newCaptainId)}
        onClose={() => setTransferOpen(false)}
      />
      <ConfirmDialog
        visible={aloneConfirmOpen}
        title="Cancel this lobby?"
        description="You're the only one in here, so leaving will cancel the lobby."
        confirmLabel="Leave and cancel"
        cancelLabel="Stay"
        destructive
        loading={leave.isPending}
        onConfirm={() => leave.mutate(undefined)}
        onClose={() => setAloneConfirmOpen(false)}
      />
      <OverlapModal
        visible={overlapOpen}
        conflictingLobbyId={overlapLobbyId}
        onView={(conflictId) => {
          setOverlapOpen(false);
          router.replace(`/lobbies/${conflictId}`);
        }}
        onClose={() => setOverlapOpen(false)}
      />
    </View>
  );
}

function CtaRegion({
  action,
  onJoin,
  joinLoading,
  onLeave,
  leaveLoading,
  onCaptainLeave,
}: {
  action: ReturnType<typeof getLobbyAction>;
  onJoin: () => void;
  joinLoading: boolean;
  onLeave: () => void;
  leaveLoading: boolean;
  onCaptainLeave: () => void;
}) {
  if (action.kind === 'join') {
    return (
      <Button
        label="Join lobby"
        variant="primary"
        fullWidth
        loading={joinLoading}
        onPress={onJoin}
      />
    );
  }
  if (action.kind === 'lobby_full') {
    return <Button label="Lobby is full" variant="ghost" fullWidth disabled />;
  }
  if (action.kind === 'leave') {
    return (
      <Button
        label="Leave lobby"
        variant="danger"
        fullWidth
        loading={leaveLoading}
        onPress={onLeave}
      />
    );
  }
  if (action.kind === 'captain_leave') {
    return (
      <Button
        label="Leave (transfer captain)"
        variant="danger"
        fullWidth
        loading={leaveLoading}
        onPress={onCaptainLeave}
      />
    );
  }
  // locked
  const message =
    action.reason === 'confirmed'
      ? 'Lobby is locked'
      : action.reason === 'cancelled'
      ? 'This lobby was cancelled'
      : 'This lobby is over';
  return (
    <View
      style={{
        backgroundColor: colors.surfaceMuted,
        paddingVertical: 14,
        borderRadius: radii.md,
        alignItems: 'center',
      }}
    >
      <Text style={[text.bodyStrong, { color: colors.textMuted }]}>
        {message}
      </Text>
    </View>
  );
}

function LoadingState() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <BackChip />
      <View style={{ padding: 20, gap: 16 }}>
        <Skeleton height={220} radius={radii.lg} />
        <Skeleton height={80} radius={radii.lg} />
        <Skeleton height={120} radius={radii.lg} />
      </View>
    </SafeAreaView>
  );
}

function BackChip() {
  return (
    <View style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
      <Pressable
        onPress={() => router.back()}
        hitSlop={12}
        style={{
          width: 40,
          height: 40,
          borderRadius: 999,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
      </Pressable>
    </View>
  );
}

