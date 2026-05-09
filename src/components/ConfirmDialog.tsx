import { Modal, Pressable, Text, View } from 'react-native';

import { Button } from './Button';
import { colors, radii, text } from '../theme';

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmDialog({
  visible,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  loading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
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
            padding: 20,
            width: '100%',
            maxWidth: 360,
            gap: 16,
          }}
        >
          <View style={{ gap: 6 }}>
            <Text style={[text.h2, { color: colors.textPrimary }]}>
              {title}
            </Text>
            {description ? (
              <Text style={[text.body, { color: colors.textMuted }]}>
                {description}
              </Text>
            ) : null}
          </View>
          <View style={{ gap: 8 }}>
            <Button
              label={confirmLabel}
              variant={destructive ? 'danger' : 'primary'}
              fullWidth
              loading={loading}
              onPress={onConfirm}
            />
            <Button
              label={cancelLabel}
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
