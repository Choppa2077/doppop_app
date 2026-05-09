import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '../../src/components/Card';
import { EmptyState } from '../../src/components/EmptyState';
import { RatingPill } from '../../src/components/RatingPill';
import { Skeleton } from '../../src/components/Skeleton';
import { SportBadge } from '../../src/components/SportBadge';
import { useVenue } from '../../src/hooks/useVenues';
import { useVenueSlots } from '../../src/hooks/useVenueSlots';
import { colors, radii, text } from '../../src/theme';
import type { TimeSlot } from '../../src/types/api';
import {
  buildNextDays,
  formatDayLabel,
  formatPrice,
  formatTimeRange,
  isoDateOnly,
} from '../../src/utils/format';

export default function VenueDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const venueId = Number(id);

  const { data: venue, isLoading, isError } = useVenue(venueId);

  const today = useMemo(() => new Date(), []);
  const days = useMemo(() => buildNextDays(14, today), [today]);
  const [selectedDate, setSelectedDate] = useState<string>(isoDateOnly(today));

  const slotsQuery = useVenueSlots(venueId, selectedDate);

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
        <BackButton />
        <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
          <Skeleton width="100%" height={220} radius={radii.lg} />
          <Skeleton width="60%" height={28} />
          <Skeleton width="40%" height={16} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (isError || !venue) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
        <BackButton />
        <EmptyState
          icon="cloud-offline-outline"
          title="Couldn't load venue"
          description="Try again in a moment."
          cta={{ label: 'Go back', onPress: () => router.back() }}
        />
      </SafeAreaView>
    );
  }

  const photo = venue.photo_url ?? venue.sport_base.photo_url;
  const address = venue.sport_base.address;

  const openMaps = () => {
    const q = encodeURIComponent(
      `${venue.sport_base.name}, ${address}, ${venue.sport_base.city.name}`,
    );
    const url =
      Platform.OS === 'ios'
        ? `http://maps.apple.com/?q=${q}`
        : `https://www.google.com/maps/search/?api=1&query=${q}`;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View
          style={{
            height: 280,
            backgroundColor: colors.surfaceMuted,
            position: 'relative',
          }}
        >
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
                size={48}
                color={colors.textMuted}
              />
            </View>
          )}
          <LinearGradient
            colors={['rgba(0,0,0,0.55)', 'transparent', 'rgba(0,0,0,0.7)']}
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
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 12,
                paddingTop: 8,
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
              <RatingPill rating={venue.rating} />
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
            <Text
              style={[
                text.display,
                { color: '#FFFFFF', fontSize: 28, lineHeight: 34 },
              ]}
              numberOfLines={2}
            >
              {venue.name}
            </Text>
            <Text style={[text.body, { color: 'rgba(255,255,255,0.85)' }]}>
              {venue.sport_base.name} · {venue.sport_base.city.name}
            </Text>
          </View>
        </View>

        {/* Info row */}
        <View style={{ padding: 20, gap: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <SportBadge
              sport={venue.sport.slug}
              label={venue.sport.name}
              size="sm"
            />
            {venue.football_type ? (
              <View
                style={{
                  backgroundColor: colors.surfaceMuted,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 999,
                }}
              >
                <Text style={[text.caption, { color: colors.textPrimary }]}>
                  {venue.football_type.name}
                </Text>
              </View>
            ) : null}
            <View
              style={{
                backgroundColor: colors.accentSoft,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 999,
              }}
            >
              <Text style={[text.caption, { color: colors.accent }]}>
                {formatPrice(venue.price_per_hour)} ₸/hour
              </Text>
            </View>
          </View>

          <Pressable onPress={openMaps}>
            {({ pressed }) => (
              <Card padded style={{ opacity: pressed ? 0.7 : 1 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 999,
                      backgroundColor: colors.accentSoft,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="location" size={20} color={colors.accent} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[text.bodyStrong, { color: colors.textPrimary }]}>
                      {address}
                    </Text>
                    <Text style={[text.caption, { color: colors.textMuted }]}>
                      Tap to open in maps
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.textMuted}
                  />
                </View>
              </Card>
            )}
          </Pressable>

          {venue.sport_base.description ? (
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
                {venue.sport_base.description}
              </Text>
            </View>
          ) : null}

          {/* Date selector */}
          <View style={{ gap: 12 }}>
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
              Pick a date
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {days.map((d) => {
                const iso = isoDateOnly(d);
                const isSelected = iso === selectedDate;
                return (
                  <Pressable
                    key={iso}
                    onPress={() => setSelectedDate(iso)}
                    style={{
                      width: 64,
                      paddingVertical: 12,
                      borderRadius: radii.md,
                      backgroundColor: isSelected
                        ? colors.accent
                        : colors.surface,
                      borderWidth: 1.5,
                      borderColor: isSelected ? colors.accent : colors.border,
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Text
                      style={[
                        text.micro,
                        {
                          color: isSelected ? '#FFFFFF' : colors.textMuted,
                          textTransform: 'uppercase',
                          letterSpacing: 1,
                        },
                      ]}
                    >
                      {formatDayLabel(d, today)}
                    </Text>
                    <Text
                      style={[
                        text.h2,
                        {
                          color: isSelected ? '#FFFFFF' : colors.textPrimary,
                          fontSize: 22,
                          lineHeight: 26,
                        },
                      ]}
                    >
                      {d.getDate()}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Time slots */}
          <View style={{ gap: 12, marginTop: 4 }}>
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
              Time slots
            </Text>
            {slotsQuery.isLoading ? (
              <View style={{ gap: 8 }}>
                <Skeleton height={56} radius={radii.md} />
                <Skeleton height={56} radius={radii.md} />
                <Skeleton height={56} radius={radii.md} />
              </View>
            ) : slotsQuery.isError ? (
              <Text style={[text.body, { color: colors.textMuted }]}>
                Couldn't load slots.
              </Text>
            ) : !slotsQuery.data || slotsQuery.data.length === 0 ? (
              <Card>
                <Text style={[text.body, { color: colors.textMuted }]}>
                  No slots available for this day.
                </Text>
              </Card>
            ) : (
              <View style={{ gap: 8 }}>
                {slotsQuery.data.map((slot) => (
                  <SlotRow
                    key={slot.id}
                    slot={slot}
                    onPress={() => {
                      // Lobby creation lands in step 7. For now, just no-op
                      // on free slots; taken/blocked slots stay disabled.
                    }}
                  />
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function SlotRow({
  slot,
  onPress,
}: {
  slot: TimeSlot;
  onPress: () => void;
}) {
  const isPast = new Date(slot.starts_at).getTime() < Date.now();
  const disabled = slot.is_blocked || slot.is_taken || isPast;

  let badgeText: string = 'Free';
  let badgeBg: string = colors.success;
  let badgeFg: string = '#FFFFFF';

  if (isPast) {
    badgeText = 'Past';
    badgeBg = colors.surfaceMuted;
    badgeFg = colors.textMuted;
  } else if (slot.is_blocked) {
    badgeText = 'Blocked';
    badgeBg = colors.surfaceMuted;
    badgeFg = colors.textMuted;
  } else if (slot.is_taken) {
    badgeText = 'Taken';
    badgeBg = colors.surfaceMuted;
    badgeFg = colors.textMuted;
  }

  return (
    <Pressable onPress={disabled ? undefined : onPress} disabled={disabled}>
      {({ pressed }) => (
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: radii.md,
            borderWidth: 1,
            borderColor: colors.border,
            paddingVertical: 14,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            opacity: disabled ? 0.6 : pressed ? 0.7 : 1,
          }}
        >
          <Text style={[text.bodyStrong, { color: colors.textPrimary }]}>
            {formatTimeRange(slot.starts_at, slot.ends_at)}
          </Text>
          <View
            style={{
              backgroundColor: badgeBg,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 999,
            }}
          >
            <Text style={[text.caption, { color: badgeFg }]}>{badgeText}</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}

function BackButton() {
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
