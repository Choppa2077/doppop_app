import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

import { isApiError } from '../../src/api/client';
import { qk } from '../../src/api/keys';
import { completeOnboarding, putParameters } from '../../src/api/me';
import { Button } from '../../src/components/Button';
import { ProgressBar } from '../../src/components/ProgressBar';
import { PARAM } from '../../src/constants/parameters';
import { useOnboardingStore } from '../../src/stores/onboardingStore';
import { colors, text } from '../../src/theme';
import type { ParameterUpsertInput } from '../../src/types/api';

export default function DoneScreen() {
  const queryClient = useQueryClient();
  const answers = useOnboardingStore();

  const submit = useMutation({
    mutationFn: async () => {
      if (
        !answers.favoriteSport ||
        !answers.skillLevel ||
        !answers.playFrequency ||
        !answers.preferredTime
      ) {
        throw new Error('Please complete all six steps before continuing.');
      }
      const payload: ParameterUpsertInput[] = [
        {
          name: PARAM.FAVORITE_SPORT,
          value_type: 'string',
          value: answers.favoriteSport,
        },
        {
          name: PARAM.SKILL_LEVEL,
          value_type: 'string',
          value: answers.skillLevel,
        },
        {
          name: PARAM.PLAY_FREQUENCY,
          value_type: 'string',
          value: answers.playFrequency,
        },
        {
          name: PARAM.PREFERRED_TIME,
          value_type: 'string',
          value: answers.preferredTime,
        },
        {
          name: PARAM.IS_OPEN_TO_NEW_TEAMMATES,
          value_type: 'boolean',
          value: answers.isOpenToNewTeammates,
        },
        {
          name: PARAM.IS_COMPETITIVE,
          value_type: 'boolean',
          value: answers.isCompetitive,
        },
      ];
      await putParameters(payload);
      await completeOnboarding();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: qk.me() });
      await queryClient.invalidateQueries({ queryKey: qk.meParameters() });
      answers.reset();
      router.replace('/(tabs)/lobbies');
    },
    onError: (err) => {
      const message = isApiError(err)
        ? err.detail
        : err instanceof Error
        ? err.message
        : 'Could not finish onboarding';
      toast.error(message);
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 8 }}>
        <ProgressBar step={6} total={6} />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
            paddingHorizontal: 12,
          }}
        >
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 999,
              backgroundColor: colors.accentSoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 44 }}>🎉</Text>
          </View>
          <Text
            style={[
              text.display,
              { color: colors.textPrimary, textAlign: 'center' },
            ]}
          >
            You're all set
          </Text>
          <Text
            style={[
              text.body,
              {
                color: colors.textMuted,
                textAlign: 'center',
                paddingHorizontal: 12,
              },
            ]}
          >
            We'll use your answers to suggest the right lobbies. You can change
            any of them later in your profile.
          </Text>
        </View>
        <View style={{ paddingVertical: 16 }}>
          <Button
            label="Let's play"
            variant="primary"
            fullWidth
            loading={submit.isPending}
            onPress={() => submit.mutate()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
