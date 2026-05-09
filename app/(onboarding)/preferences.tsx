import { router } from 'expo-router';
import { Switch, Text, View } from 'react-native';

import { Card } from '../../src/components/Card';
import { OnboardingScreen } from '../../src/components/OnboardingScreen';
import { useOnboardingStore } from '../../src/stores/onboardingStore';
import { colors, text } from '../../src/theme';

export default function PreferencesScreen() {
  const isOpen = useOnboardingStore((s) => s.isOpenToNewTeammates);
  const setIsOpen = useOnboardingStore((s) => s.setIsOpenToNewTeammates);
  const isCompetitive = useOnboardingStore((s) => s.isCompetitive);
  const setIsCompetitive = useOnboardingStore((s) => s.setIsCompetitive);

  return (
    <OnboardingScreen
      step={5}
      total={6}
      title="Two more"
      subtitle="A couple of preferences for matchmaking."
      onCta={() => router.push('/(onboarding)/done')}
    >
      <View style={{ gap: 12 }}>
        <ToggleRow
          title="Open to new teammates"
          description="Show your lobby to people you haven't played with."
          value={isOpen}
          onChange={setIsOpen}
        />
        <ToggleRow
          title="I'm competitive"
          description="Prefer matches where everyone takes the score seriously."
          value={isCompetitive}
          onChange={setIsCompetitive}
        />
      </View>
    </OnboardingScreen>
  );
}

function ToggleRow({
  title,
  description,
  value,
  onChange,
}: {
  title: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Card>
      <View
        style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
      >
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={[text.bodyStrong, { color: colors.textPrimary }]}>
            {title}
          </Text>
          <Text style={[text.caption, { color: colors.textMuted }]}>
            {description}
          </Text>
        </View>
        <Switch
          value={value}
          onValueChange={onChange}
          trackColor={{ false: colors.surfaceMuted, true: colors.accent }}
          thumbColor="#FFFFFF"
          ios_backgroundColor={colors.surfaceMuted}
        />
      </View>
    </Card>
  );
}
