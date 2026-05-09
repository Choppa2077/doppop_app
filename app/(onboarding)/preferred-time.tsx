import { router } from 'expo-router';
import { Text, View } from 'react-native';

import {
  PREFERRED_TIMES,
  PREFERRED_TIME_LABELS,
  type PreferredTime,
} from '../../src/constants/parameters';
import { OnboardingScreen } from '../../src/components/OnboardingScreen';
import { SelectableCard } from '../../src/components/SelectableCard';
import { useOnboardingStore } from '../../src/stores/onboardingStore';

const TIME_EMOJI: Record<PreferredTime, string> = {
  morning: '🌅',
  afternoon: '☀️',
  evening: '🌆',
};

const TIME_DESCRIPTIONS: Record<PreferredTime, string> = {
  morning: 'Before work or class',
  afternoon: 'Lunch breaks and weekends',
  evening: 'After hours, under the lights',
};

export default function PreferredTimeScreen() {
  const value = useOnboardingStore((s) => s.preferredTime);
  const setValue = useOnboardingStore((s) => s.setPreferredTime);

  return (
    <OnboardingScreen
      step={4}
      total={6}
      title="When you play"
      subtitle="When do you usually have free time?"
      ctaDisabled={!value}
      onCta={() => router.push('/(onboarding)/preferences')}
    >
      <View style={{ gap: 12 }}>
        {PREFERRED_TIMES.map((time) => (
          <SelectableCard
            key={time}
            selected={value === time}
            onPress={() => setValue(time)}
            title={PREFERRED_TIME_LABELS[time]}
            description={TIME_DESCRIPTIONS[time]}
            leading={<Text style={{ fontSize: 28 }}>{TIME_EMOJI[time]}</Text>}
          />
        ))}
      </View>
    </OnboardingScreen>
  );
}
