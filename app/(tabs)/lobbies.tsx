import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActiveLobbyCard } from '../../src/components/ActiveLobbyCard';
import { EmptyState } from '../../src/components/EmptyState';
import { LobbyCard } from '../../src/components/LobbyCard';
import { Skeleton } from '../../src/components/Skeleton';
import { useMe } from '../../src/hooks/useMe';
import {
  useActiveLobbies,
  useLobbies,
} from '../../src/hooks/useLobbies';
import {
  activeFilterCount,
  useFiltersStore,
} from '../../src/stores/filtersStore';
import { colors, radii, text } from '../../src/theme';

export default function LobbiesScreen() {
  const filters = useFiltersStore((s) => s.lobby);
  const filterCount = activeFilterCount(filters);

  const { data: me } = useMe();
  const activeQuery = useActiveLobbies();
  const lobbiesQuery = useLobbies(filters);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([activeQuery.refetch(), lobbiesQuery.refetch()]);
    } finally {
      setRefreshing(false);
    }
  }, [activeQuery, lobbiesQuery]);

  const activeLobbies = activeQuery.data ?? [];
  const openLobbies = lobbiesQuery.data?.results ?? [];

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
          Lobbies
        </Text>
        <Pressable
          onPress={() => router.push('/lobbies/filters')}
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
                style={[text.micro, { color: '#FFFFFF', fontSize: 10 }]}
              >
                {filterCount}
              </Text>
            </View>
          ) : null}
        </Pressable>
      </View>

      <FlatList
        data={openLobbies}
        keyExtractor={(l) => String(l.id)}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 24,
          gap: 12,
        }}
        ListHeaderComponent={
          <View style={{ gap: 16, paddingBottom: 4 }}>
            {activeLobbies.length > 0 ? (
              <View style={{ gap: 12, marginTop: 4 }}>
                <SectionLabel>Your active lobbies</SectionLabel>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 12, paddingRight: 4 }}
                >
                  {activeLobbies.map((lobby) => {
                    const isCaptain = me?.id === lobby.captain.id;
                    return (
                      <ActiveLobbyCard
                        key={lobby.id}
                        lobby={lobby}
                        isCaptain={isCaptain}
                        onPress={() =>
                          router.push(`/lobbies/${lobby.id}`)
                        }
                      />
                    );
                  })}
                </ScrollView>
              </View>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                marginTop: activeLobbies.length > 0 ? 8 : 0,
              }}
            >
              <SectionLabel>Open lobbies</SectionLabel>
              {filterCount > 0 ? (
                <Text
                  style={[text.caption, { color: colors.textMuted }]}
                >
                  {filterCount} filter{filterCount > 1 ? 's' : ''}
                </Text>
              ) : null}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <LobbyCard
            lobby={item}
            onPress={() => router.push(`/lobbies/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          lobbiesQuery.isLoading ? (
            <View style={{ gap: 12 }}>
              <Skeleton height={140} radius={radii.lg} />
              <Skeleton height={140} radius={radii.lg} />
              <Skeleton height={140} radius={radii.lg} />
            </View>
          ) : lobbiesQuery.isError ? (
            <EmptyState
              icon="cloud-offline-outline"
              title="Couldn't load lobbies"
              description="Check your connection and try again."
              cta={{ label: 'Retry', onPress: () => lobbiesQuery.refetch() }}
            />
          ) : (
            <EmptyState
              icon="people-outline"
              title="No lobbies yet"
              description={
                filterCount > 0
                  ? 'Try clearing some filters.'
                  : 'Browse venues and create one.'
              }
              cta={
                filterCount === 0
                  ? {
                      label: 'Browse venues',
                      onPress: () => router.push('/(tabs)/venues'),
                    }
                  : undefined
              }
            />
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={
              refreshing ||
              activeQuery.isRefetching ||
              lobbiesQuery.isRefetching
            }
            onRefresh={onRefresh}
            tintColor={colors.accent}
          />
        }
      />
    </SafeAreaView>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
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
      {children}
    </Text>
  );
}
