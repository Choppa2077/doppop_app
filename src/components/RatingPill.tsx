import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors, text } from '../theme';

type RatingPillProps = {
  rating: number;
};

export function RatingPill({ rating }: RatingPillProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.accentSoft,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        gap: 4,
      }}
    >
      <Ionicons name="star" size={12} color={colors.accent} />
      <Text style={[text.caption, { color: colors.accent }]}>
        {rating.toFixed(1)}
      </Text>
    </View>
  );
}
