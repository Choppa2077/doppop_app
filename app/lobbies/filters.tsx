import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
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

export default function LobbyFiltersModal() {
  const filters = useFiltersStore((s) => s.lobby);
  const setLobbyFilter = useFiltersStore((s) => s.setLobbyFilter);
  const resetLobby = useFiltersStore((s) => s.resetLobby);

  const { data: cities } = useCities();
  const { data: sports } = useSports();
  const { data: footballTypes } = useFootballTypes();

  const selectedSport = sports?.find((s) => s.id === filters.sport);
  const isFootballSelected = selectedSport?.slug === 'football';

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
        <Pressable
          onPress={resetLobby}
          hitSlop={12}
          style={{ paddingHorizontal: 12 }}
        >
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
                  setLobbyFilter(
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
                    setLobbyFilter('sport', undefined);
                    setLobbyFilter('football_type', undefined);
                  } else {
                    setLobbyFilter('sport', s.id);
                    if (s.slug !== 'football') {
                      setLobbyFilter('football_type', undefined);
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
                    setLobbyFilter(
                      'football_type',
                      filters.football_type === ft.id ? undefined : ft.id,
                    )
                  }
                />
              ))}
            </View>
          </Section>
        ) : null}
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
        <Button
          label="Apply"
          variant="primary"
          fullWidth
          onPress={() => router.back()}
        />
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
