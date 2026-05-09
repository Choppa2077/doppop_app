import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, text } from '../../src/theme';

export default function VenuesPlaceholder() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, padding: 20, gap: 16 }}>
        <Text style={[text.display, { color: colors.textPrimary }]}>
          Venues
        </Text>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 999,
              backgroundColor: colors.accentSoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons
              name="location-outline"
              size={36}
              color={colors.accent}
            />
          </View>
          <Text style={[text.h2, { color: colors.textPrimary }]}>
            Coming in step 6
          </Text>
          <Text
            style={[
              text.body,
              {
                color: colors.textMuted,
                textAlign: 'center',
                paddingHorizontal: 24,
              },
            ]}
          >
            Browse venues, see open slots, and start a lobby straight from
            here.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
