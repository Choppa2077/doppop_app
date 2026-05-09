import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radii, text } from '../theme';

export type OptionItem<V extends string | number> = {
  value: V;
  label: string;
  description?: string;
};

type OptionPickerProps<V extends string | number> = {
  visible: boolean;
  title: string;
  options: OptionItem<V>[];
  selectedValue?: V | null;
  onSelect: (value: V) => void;
  onClose: () => void;
};

export function OptionPicker<V extends string | number>({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}: OptionPickerProps<V>) {
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
            maxHeight: '80%',
          }}
        >
          <View
            style={{
              alignItems: 'center',
              paddingTop: 8,
              paddingBottom: 4,
            }}
          >
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
            <Text style={[text.h2, { color: colors.textPrimary }]}>{title}</Text>
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
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 4,
              paddingBottom: 16,
              gap: 8,
            }}
          >
            {options.map((opt) => {
              const selected = opt.value === selectedValue;
              return (
                <Pressable
                  key={String(opt.value)}
                  onPress={() => {
                    onSelect(opt.value);
                    onClose();
                  }}
                  style={{
                    backgroundColor: selected
                      ? colors.accentSoft
                      : colors.surface,
                    borderRadius: radii.md,
                    borderWidth: 2,
                    borderColor: selected ? colors.accent : colors.border,
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text
                      style={[
                        text.bodyStrong,
                        {
                          color: selected ? colors.accent : colors.textPrimary,
                        },
                      ]}
                    >
                      {opt.label}
                    </Text>
                    {opt.description ? (
                      <Text
                        style={[text.caption, { color: colors.textMuted }]}
                      >
                        {opt.description}
                      </Text>
                    ) : null}
                  </View>
                  {selected ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={colors.accent}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
