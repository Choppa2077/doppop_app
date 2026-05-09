import { router } from 'expo-router';
import { Text, View } from 'react-native';

import {
  PLAY_FREQUENCIES,
  PLAY_FREQUENCY_LABELS,
  type PlayFrequency,
} from '../../src/constants/parameters';
import { OnboardingScreen } from '../../src/components/OnboardingScreen';
import { SelectableCard } from '../../src/components/SelectableCard';
import { useOnboardingStore } from '../../src/stores/onboardingStore';

const FREQUENCY_EMOJI: Record<PlayFrequency, string> = {
  daily: '🔥',
  weekly: '🗓️',
  monthly: '🌙',
  rarely: '🪶',
};

export default function PlayFrequencyScreen() {
  const value = useOnboardingStore((s) => s.playFrequency);
  const setValue = useOnboardingStore((s) => s.setPlayFrequency);

  return (
    <OnboardingScreen
      step={3}
      total={6}
      title="How often"
      subtitle="Roughly, how much do you play right now?"
      ctaDisabled={!value}
      onCta={() => router.push('/(onboarding)/preferred-time')}
    >
      <View style={{ gap: 12 }}>
        {PLAY_FREQUENCIES.map((freq) => (
          <SelectableCard
            key={freq}
            selected={value === freq}
            onPress={() => setValue(freq)}
            title={PLAY_FREQUENCY_LABELS[freq]}
            leading={
              <Text style={{ fontSize: 24 }}>{FREQUENCY_EMOJI[freq]}</Text>
            }
          />
        ))}
      </View>
    </OnboardingScreen>
  );
}
