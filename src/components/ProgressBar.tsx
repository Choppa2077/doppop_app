import { Text, View } from 'react-native';

import { colors, text } from '../theme';

type ProgressBarProps = {
  step: number;
  total: number;
};

export function ProgressBar({ step, total }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, step / total));
  return (
    <View style={{ gap: 8 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={[
            text.micro,
            {
              color: colors.textMuted,
              textTransform: 'uppercase',
              letterSpacing: 1.2,
            },
          ]}
        >
          step {step} / {total}
        </Text>
      </View>
      <View
        style={{
          height: 6,
          borderRadius: 999,
          backgroundColor: colors.surfaceMuted,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            height: '100%',
            width: `${pct * 100}%`,
            backgroundColor: colors.accent,
            borderRadius: 999,
          }}
        />
      </View>
    </View>
  );
}
