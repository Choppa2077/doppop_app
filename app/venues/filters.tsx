import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../src/components/Button';
import { Chip } from '../../src/components/Chip';
import {
  useCities,
  useFootballTypes,
  useSports,
} from '../../src/hooks/useReferenceData';
import { useFiltersStore } from '../../src/stores/filtersStore';
import { colors, text } from '../../src/theme';

export default function VenueFiltersModal() {
  const filters = useFiltersStore((s) => s.venue);
  const setVenueFilter = useFiltersStore((s) => s.setVenueFilter);
  const setVenueRating = useFiltersStore((s) => s.setVenueRating);
  const resetVenue = useFiltersStore((s) => s.resetVenue);

  const { data: cities } = useCities();
  const { data: sports } = useSports();
  const { data: footballTypes } = useFootballTypes();

  // Local rating state so dragging is responsive; commit on apply.
  const [minR, setMinR] = useState<number>(filters.min_rating ?? 0);
  const [maxR, setMaxR] = useState<number>(filters.max_rating ?? 5);

  useEffect(() => {
    setMinR(filters.min_rating ?? 0);
    setMaxR(filters.max_rating ?? 5);
  }, [filters.min_rating, filters.max_rating]);

  const selectedSport = sports?.find((s) => s.id === filters.sport);
  const isFootballSelected = selectedSport?.slug === 'football';

  const apply = () => {
    if (minR <= 0 && maxR >= 5) {
      setVenueRating(undefined, undefined);
    } else {
      setVenueRating(minR, maxR);
    }
    router.back();
  };

  const reset = () => {
    resetVenue();
    setMinR(0);
    setMaxR(5);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 12,
          paddingVertical: 8,
        }}
      >
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
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={[text.h2, { color: colors.textPrimary }]}>Filters</Text>
        <Pressable onPress={reset} hitSlop={12} style={{ paddingHorizontal: 12 }}>
          <Text style={[text.bodyStrong, { color: colors.accent }]}>
            Reset
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 24,
          gap: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Section title="City">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {cities?.map((c) => (
              <Chip
                key={c.id}
                label={c.name}
                selected={filters.city === c.id}
                onPress={() =>
                  setVenueFilter(
                    'city',
                    filters.city === c.id ? undefined : c.id,
                  )
                }
              />
            ))}
          </View>
        </Section>

        <Section title="Sport">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {sports?.map((s) => (
              <Chip
                key={s.id}
                label={s.name}
                selected={filters.sport === s.id}
                onPress={() => {
                  if (filters.sport === s.id) {
                    setVenueFilter('sport', undefined);
                    setVenueFilter('football_type', undefined);
                  } else {
                    setVenueFilter('sport', s.id);
                    if (s.slug !== 'football') {
                      setVenueFilter('football_type', undefined);
                    }
                  }
                }}
              />
            ))}
          </View>
        </Section>

        {isFootballSelected ? (
          <Section title="Football type">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {footballTypes?.map((ft) => (
                <Chip
                  key={ft.id}
                  label={ft.name}
                  selected={filters.football_type === ft.id}
                  onPress={() =>
                    setVenueFilter(
                      'football_type',
                      filters.football_type === ft.id ? undefined : ft.id,
                    )
                  }
                />
              ))}
            </View>
          </Section>
        ) : null}

        <Section title="Rating">
          <View style={{ gap: 8 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={[text.caption, { color: colors.textMuted }]}>
                Min
              </Text>
              <Text style={[text.bodyStrong, { color: colors.textPrimary }]}>
                {minR.toFixed(1)}
              </Text>
            </View>
            <Slider
              minimumValue={0}
              maximumValue={5}
              step={0.1}
              value={minR}
              onValueChange={(v) => {
                const next = Math.min(v, maxR);
                setMinR(Number(next.toFixed(1)));
              }}
              minimumTrackTintColor={colors.accent}
              maximumTrackTintColor={colors.surfaceMuted}
              thumbTintColor={colors.accent}
            />
          </View>
          <View style={{ gap: 8, marginTop: 12 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={[text.caption, { color: colors.textMuted }]}>
                Max
              </Text>
              <Text style={[text.bodyStrong, { color: colors.textPrimary }]}>
                {maxR.toFixed(1)}
              </Text>
            </View>
            <Slider
              minimumValue={0}
              maximumValue={5}
              step={0.1}
              value={maxR}
              onValueChange={(v) => {
                const next = Math.max(v, minR);
                setMaxR(Number(next.toFixed(1)));
              }}
              minimumTrackTintColor={colors.accent}
              maximumTrackTintColor={colors.surfaceMuted}
              thumbTintColor={colors.accent}
            />
          </View>
        </Section>
      </ScrollView>

      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 16,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.bg,
        }}
      >
        <Button label="Apply" variant="primary" fullWidth onPress={apply} />
      </View>
    </SafeAreaView>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
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
        {title}
      </Text>
      {children}
    </View>
  );
}
