import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors, text } from '../theme';
import type { LobbyStatus } from '../types/api';

const STATUS_META: Record<
  LobbyStatus,
  { label: string; bg: string; fg: string; icon?: keyof typeof Ionicons.glyphMap }
> = {
  open: { label: 'Open', bg: 'rgba(31,183,106,0.12)', fg: colors.success },
  confirmed: {
    label: 'Confirmed',
    bg: colors.accentSoft,
    fg: colors.accent,
    icon: 'lock-closed',
  },
  cancelled: {
    label: 'Cancelled',
    bg: colors.surfaceMuted,
    fg: colors.textMuted,
  },
  finished: {
    label: 'Finished',
    bg: colors.surfaceMuted,
    fg: colors.textMuted,
  },
};

type StatusPillProps = {
  status: LobbyStatus;
  size?: 'sm' | 'md';
};

export function StatusPill({ status, size = 'md' }: StatusPillProps) {
  const meta = STATUS_META[status];
  const isSm = size === 'sm';
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: meta.bg,
        paddingHorizontal: isSm ? 8 : 10,
        paddingVertical: isSm ? 3 : 4,
        borderRadius: 999,
      }}
    >
      {meta.icon ? (
        <Ionicons name={meta.icon} size={isSm ? 10 : 12} color={meta.fg} />
      ) : null}
      <Text
        style={[
          isSm ? text.micro : text.caption,
          { color: meta.fg },
        ]}
      >
        {meta.label}
      </Text>
    </View>
  );
}
