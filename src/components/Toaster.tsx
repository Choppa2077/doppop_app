import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutUp,
  LinearTransition,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useToastStore, type ToastEntry } from '../utils/toast';
import { colors, radii, shadows, text } from '../theme';

const VARIANT_ICON: Record<ToastEntry['variant'], keyof typeof Ionicons.glyphMap> = {
  default: 'information-circle',
  success: 'checkmark-circle',
  error: 'alert-circle',
};

const VARIANT_TINT: Record<ToastEntry['variant'], string> = {
  default: colors.accent,
  success: colors.success,
  error: colors.danger,
};

const TOAST_DURATION_MS = 3500;

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        top: insets.top + 8,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        gap: 8,
      }}
    >
      {toasts.map((t) => (
        <ToastRow key={t.id} entry={t} />
      ))}
    </View>
  );
}

function ToastRow({ entry }: { entry: ToastEntry }) {
  const dismiss = useToastStore((s) => s.dismiss);

  useEffect(() => {
    const timer = setTimeout(() => dismiss(entry.id), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [entry.id, dismiss]);

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(18)}
      exiting={FadeOutUp.duration(180)}
      layout={LinearTransition.springify().damping(18)}
    >
      <Pressable
        onPress={() => dismiss(entry.id)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.surface,
          borderRadius: radii.md,
          paddingVertical: 12,
          paddingHorizontal: 14,
          gap: 10,
          ...shadows.card,
        }}
      >
        <Ionicons
          name={VARIANT_ICON[entry.variant]}
          size={20}
          color={VARIANT_TINT[entry.variant]}
        />
        <Text
          style={[
            text.body,
            { color: colors.textPrimary, flex: 1 },
          ]}
          numberOfLines={3}
        >
          {entry.message}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
