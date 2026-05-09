import { router } from 'expo-router';
import { Text, View } from 'react-native';

import {
  FAVORITE_SPORTS,
  FAVORITE_SPORT_LABELS,
  type FavoriteSport,
} from '../../src/constants/parameters';
import { OnboardingScreen } from '../../src/components/OnboardingScreen';
import { SelectableCard } from '../../src/components/SelectableCard';
import { useOnboardingStore } from '../../src/stores/onboardingStore';

const SPORT_EMOJI: Record<FavoriteSport, string> = {
  football: '⚽',
  volleyball: '🏐',
  basketball: '🏀',
};

const SPORT_DESCRIPTIONS: Record<FavoriteSport, string> = {
  football: 'Mini or big — your call',
  volleyball: 'Indoor and beach',
  basketball: '5-on-5 or pickup',
};

export default function FavoriteSportScreen() {
  const value = useOnboardingStore((s) => s.favoriteSport);
  const setValue = useOnboardingStore((s) => s.setFavoriteSport);

  return (
    <OnboardingScreen
      step={1}
      total={6}
      title="Pick your sport"
      subtitle="What do you want to play first?"
      ctaDisabled={!value}
      onCta={() => router.push('/(onboarding)/skill-level')}
    >
      <View style={{ gap: 12 }}>
        {FAVORITE_SPORTS.map((sport) => (
          <SelectableCard
            key={sport}
            selected={value === sport}
            onPress={() => setValue(sport)}
            title={FAVORITE_SPORT_LABELS[sport]}
            description={SPORT_DESCRIPTIONS[sport]}
            leading={
              <Text style={{ fontSize: 28 }}>{SPORT_EMOJI[sport]}</Text>
            }
          />
        ))}
      </View>
    </OnboardingScreen>
  );
}
