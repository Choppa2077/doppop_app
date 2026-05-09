import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, Text, View } from 'react-native';

import { Button } from './Button';
import { colors, radii, text } from '../theme';

type OverlapModalProps = {
  visible: boolean;
  conflictingLobbyId: number | null;
  onView: (id: number) => void;
  onClose: () => void;
};

export function OverlapModal({
  visible,
  conflictingLobbyId,
  onView,
  onClose,
}: OverlapModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: colors.overlay,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <Pressable
          style={{ position: 'absolute', inset: 0 }}
          onPress={onClose}
        />
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: radii.xl,
            padding: 24,
            width: '100%',
            maxWidth: 360,
            alignItems: 'center',
            gap: 16,
          }}
        >
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 999,
              backgroundColor: colors.accentSoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons
              name="alert-circle"
              size={36}
              color={colors.accent}
            />
          </View>
          <View style={{ alignItems: 'center', gap: 6 }}>
            <Text
              style={[
                text.h2,
                { color: colors.textPrimary, textAlign: 'center' },
              ]}
            >
              Schedule conflict
            </Text>
            <Text
              style={[
                text.body,
                { color: colors.textMuted, textAlign: 'center' },
              ]}
            >
              You already have a lobby at this time.
            </Text>
          </View>
          <View style={{ width: '100%', gap: 8 }}>
            {conflictingLobbyId != null ? (
              <Button
                label="View it"
                variant="primary"
                fullWidth
                onPress={() => onView(conflictingLobbyId)}
              />
            ) : null}
            <Button
              label="OK"
              variant="ghost"
              fullWidth
              onPress={onClose}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
