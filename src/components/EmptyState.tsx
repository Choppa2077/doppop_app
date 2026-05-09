import { Ionicons } from '@expo/vector-icons';
import { type ReactNode } from 'react';
import { Text, View } from 'react-native';

import { Button } from './Button';
import { colors, text } from '../theme';

type EmptyStateProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  cta?: { label: string; onPress: () => void };
  custom?: ReactNode;
};

export function EmptyState({
  icon = 'search-outline',
  title,
  description,
  cta,
  custom,
}: EmptyStateProps) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 48,
        gap: 16,
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
        <Ionicons name={icon} size={36} color={colors.accent} />
      </View>
      <View style={{ alignItems: 'center', gap: 6 }}>
        <Text
          style={[
            text.h2,
            { color: colors.textPrimary, textAlign: 'center' },
          ]}
        >
          {title}
        </Text>
        {description ? (
          <Text
            style={[
              text.body,
              { color: colors.textMuted, textAlign: 'center' },
            ]}
          >
            {description}
          </Text>
        ) : null}
      </View>
      {custom}
      {cta ? (
        <View style={{ width: '100%', maxWidth: 320 }}>
          <Button label={cta.label} variant="primary" onPress={cta.onPress} />
        </View>
      ) : null}
    </View>
  );
}
