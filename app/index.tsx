import { useQuery } from '@tanstack/react-query';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { qk } from '../src/api/keys';
import { getMe } from '../src/api/me';
import { useAuthStore } from '../src/stores/authStore';
import { colors } from '../src/theme';

export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data: me, isLoading, isError } = useQuery({
    queryKey: qk.me(),
    queryFn: getMe,
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.bg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  // If /me/ fails (token bad after refresh attempt), the interceptor will
  // have cleared tokens and isAuthenticated will flip on the next render.
  if (isError || !me) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!me.onboarding_completed) {
    return <Redirect href="/(onboarding)" />;
  }

  return <Redirect href="/(tabs)/lobbies" />;
}
