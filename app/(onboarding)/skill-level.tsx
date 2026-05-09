import { router } from 'expo-router';
import { View } from 'react-native';

import {
  SKILL_LEVELS,
  SKILL_LEVEL_LABELS,
  type SkillLevel,
} from '../../src/constants/parameters';
import { OnboardingScreen } from '../../src/components/OnboardingScreen';
import { SelectableCard } from '../../src/components/SelectableCard';
import { useOnboardingStore } from '../../src/stores/onboardingStore';

const SKILL_DESCRIPTIONS: Record<SkillLevel, string> = {
  beginner: 'Just starting out — light pace welcome',
  intermediate: 'Comfortable with the rules and the rhythm',
  advanced: 'Competitive, fit, and confident',
};

export default function SkillLevelScreen() {
  const value = useOnboardingStore((s) => s.skillLevel);
  const setValue = useOnboardingStore((s) => s.setSkillLevel);

  return (
    <OnboardingScreen
      step={2}
      total={6}
      title="Your level"
      subtitle="So we can match you with the right lobbies."
      ctaDisabled={!value}
      onCta={() => router.push('/(onboarding)/play-frequency')}
    >
      <View style={{ gap: 12 }}>
        {SKILL_LEVELS.map((level) => (
          <SelectableCard
            key={level}
            selected={value === level}
            onPress={() => setValue(level)}
            title={SKILL_LEVEL_LABELS[level]}
            description={SKILL_DESCRIPTIONS[level]}
          />
        ))}
      </View>
    </OnboardingScreen>
  );
}
