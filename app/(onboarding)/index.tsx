import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '../../src/api/client';
import { qk } from '../../src/api/keys';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { colors, text } from '../../src/theme';

// Placeholder onboarding screen — the real 6-step flow lands in step 4.
// For now this just lets a freshly registered user mark onboarding complete
// so they can see the rest of the app while we're in step 2/3.
export default function OnboardingPlaceholder() {
  const queryClient = useQueryClient();
  const skip = useMutation({
    mutationFn: async () => {
      await api.post('/me/onboarding/complete/');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.me() });
      router.replace('/');
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View
        style={{
          flex: 1,
          padding: 24,
          justifyContent: 'center',
          gap: 24,
        }}
      >
        <View style={{ gap: 8 }}>
          <View
            style={{
              alignSelf: 'flex-start',
              backgroundColor: colors.accentSoft,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 999,
            }}
          >
            <Text
              style={[
                text.micro,
                {
                  color: colors.accent,
                  textTransform: 'uppercase',
                  letterSpacing: 1.2,
                },
              ]}
            >
              onboarding · placeholder
            </Text>
          </View>
          <Text style={[text.display, { color: colors.textPrimary }]}>
            Almost there
          </Text>
          <Text style={[text.body, { color: colors.textMuted }]}>
            The real 6-question flow lands in step 4. For now you can mark
            onboarding complete to continue.
          </Text>
        </View>
        <Card>
          <Text style={[text.caption, { color: colors.textMuted }]}>
            Skipping will likely fail until parameters are saved (the backend
            requires them). That's expected — wire onboarding in step 4.
          </Text>
        </Card>
        <Button
          label="Try to skip"
          variant="secondary"
          fullWidth
          loading={skip.isPending}
          onPress={() => skip.mutate()}
        />
      </View>
    </SafeAreaView>
  );
}
