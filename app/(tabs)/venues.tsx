import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '../../src/components/EmptyState';
import { VenueCard } from '../../src/components/VenueCard';
import { VenueCardSkeleton } from '../../src/components/Skeleton';
import { useVenues } from '../../src/hooks/useVenues';
import {
  activeFilterCount,
  useFiltersStore,
} from '../../src/stores/filtersStore';
import { colors, text } from '../../src/theme';

export default function VenuesScreen() {
  const filters = useFiltersStore((s) => s.venue);
  const filterCount = activeFilterCount(filters);

  const { data, isLoading, isError, refetch, isRefetching } =
    useVenues(filters);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const venues = data?.results ?? [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 8,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={[text.display, { color: colors.textPrimary }]}>
          Venues
        </Text>
        <Pressable
          onPress={() => router.push('/venues/filters')}
          hitSlop={8}
          style={({ pressed }) => ({
            width: 44,
            height: 44,
            borderRadius: 999,
            backgroundColor:
              filterCount > 0 ? colors.accent : colors.surfaceMuted,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={filterCount > 0 ? '#FFFFFF' : colors.textPrimary}
          />
          {filterCount > 0 ? (
            <View
              style={{
                position: 'absolute',
                top: -2,
                right: -2,
                minWidth: 18,
                height: 18,
                borderRadius: 999,
                backgroundColor: colors.danger,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 4,
                borderWidth: 2,
                borderColor: colors.bg,
              }}
            >
              <Text
                style={[
                  text.micro,
                  { color: '#FFFFFF', fontSize: 10 },
                ]}
              >
                {filterCount}
              </Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      {isLoading ? (
        <View style={{ paddingHorizontal: 20, gap: 16 }}>
          <VenueCardSkeleton />
          <VenueCardSkeleton />
          <VenueCardSkeleton />
        </View>
      ) : isError ? (
        <EmptyState
          icon="cloud-offline-outline"
          title="Couldn't load venues"
          description="Check your connection and try again."
          cta={{ label: 'Retry', onPress: () => refetch() }}
        />
      ) : venues.length === 0 ? (
        <EmptyState
          title="No venues match"
          description={
            filterCount > 0
              ? 'Try clearing some filters.'
              : 'No active venues yet.'
          }
        />
      ) : (
        <FlatList
          data={venues}
          keyExtractor={(v) => String(v.id)}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 24,
            gap: 16,
          }}
          renderItem={({ item }) => (
            <VenueCard
              venue={item}
              onPress={() => router.push(`/venues/${item.id}`)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing || isRefetching}
              onRefresh={onRefresh}
              tintColor={colors.accent}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
