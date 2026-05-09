import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';

import { getMe } from '../../src/api/me';
import { qk } from '../../src/api/keys';
import { Avatar } from '../../src/components/Avatar';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { useAuthStore } from '../../src/stores/authStore';
import { colors, text } from '../../src/theme';

export default function LobbiesPlaceholder() {
  const clearTokens = useAuthStore((s) => s.clearTokens);
  const { data: me } = useQuery({
    queryKey: qk.me(),
    queryFn: getMe,
  });

  const displayName =
    [me?.first_name, me?.last_name].filter(Boolean).join(' ') ||
    me?.email ||
    '...';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, padding: 20, gap: 16 }}>
        <Text style={[text.display, { color: colors.textPrimary }]}>
          Lobbies
        </Text>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Avatar uri={me?.avatar_url} name={displayName} size={48} />
            <View style={{ flex: 1 }}>
              <Text style={[text.bodyStrong, { color: colors.textPrimary }]}>
                Signed in as
              </Text>
              <Text style={[text.caption, { color: colors.textMuted }]}>
                {displayName}
              </Text>
            </View>
          </View>
          <Text
            style={[
              text.caption,
              { color: colors.textMuted, marginTop: 12 },
            ]}
          >
            The real lobbies feed lands in step 8.
          </Text>
        </Card>
        <Button label="Sign out" variant="danger" onPress={clearTokens} />
      </View>
    </SafeAreaView>
  );
}
