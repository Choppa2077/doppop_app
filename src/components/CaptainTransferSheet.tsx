import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from './Avatar';
import { Button } from './Button';
import { colors, radii, text } from '../theme';
import type { LobbyParticipant } from '../types/api';

type CaptainTransferSheetProps = {
  visible: boolean;
  candidates: LobbyParticipant[];
  loading?: boolean;
  onConfirm: (newCaptainId: number) => void;
  onClose: () => void;
};

export function CaptainTransferSheet({
  visible,
  candidates,
  loading = false,
  onConfirm,
  onClose,
}: CaptainTransferSheetProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (visible) setSelectedId(null);
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: colors.overlay }}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <SafeAreaView
          edges={['bottom']}
          style={{
            backgroundColor: colors.bg,
            borderTopLeftRadius: radii.xl,
            borderTopRightRadius: radii.xl,
            maxHeight: '85%',
          }}
        >
          <View style={{ alignItems: 'center', paddingTop: 8 }}>
            <View
              style={{
                width: 36,
                height: 4,
                borderRadius: 999,
                backgroundColor: colors.border,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingVertical: 12,
            }}
          >
            <Text style={[text.h2, { color: colors.textPrimary }]}>
              Pick a new captain
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              style={{
                width: 32,
                height: 32,
                borderRadius: 999,
                backgroundColor: colors.surfaceMuted,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="close" size={18} color={colors.textPrimary} />
            </Pressable>
          </View>
          <Text
            style={[
              text.body,
              { color: colors.textMuted, paddingHorizontal: 20 },
            ]}
          >
            Choose someone to take over the lobby. They'll become captain when
            you leave.
          </Text>
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 16,
              gap: 8,
            }}
          >
            {candidates.map((p) => {
              const name =
                [p.user.first_name, p.user.last_name]
                  .filter(Boolean)
                  .join(' ') || p.user.email;
              const selected = selectedId === p.user.id;
              return (
                <Pressable
                  key={p.user.id}
                  onPress={() => setSelectedId(p.user.id)}
                  style={{
                    backgroundColor: selected
                      ? colors.accentSoft
                      : colors.surface,
                    borderRadius: radii.md,
                    borderWidth: 2,
                    borderColor: selected ? colors.accent : colors.border,
                    paddingVertical: 12,
                    paddingHorizontal: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <Avatar uri={p.user.avatar_url} name={name} size={40} />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        text.bodyStrong,
                        {
                          color: selected
                            ? colors.accent
                            : colors.textPrimary,
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {name}
                    </Text>
                    <Text
                      style={[text.caption, { color: colors.textMuted }]}
                      numberOfLines={1}
                    >
                      {p.user.email}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 999,
                      borderWidth: 2,
                      borderColor: selected ? colors.accent : colors.border,
                      backgroundColor: selected
                        ? colors.accent
                        : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {selected ? (
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    ) : null}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 12,
              paddingBottom: 16,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              backgroundColor: colors.bg,
            }}
          >
            <Button
              label="Confirm leave"
              variant="danger"
              fullWidth
              loading={loading}
              disabled={selectedId == null}
              onPress={() => {
                if (selectedId != null) onConfirm(selectedId);
              }}
            />
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
