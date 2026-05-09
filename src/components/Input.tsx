import { forwardRef, useState } from 'react';
import {
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

import { colors, radii, text } from '../theme';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  hint?: string;
};

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, error, hint, onFocus, onBlur, style, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? colors.danger
    : focused
    ? colors.accent
    : colors.border;

  return (
    <View style={{ width: '100%' }}>
      {label ? (
        <Text style={[text.caption, { color: colors.textMuted, marginBottom: 6 }]}>
          {label}
        </Text>
      ) : null}
      <View
        style={{
          backgroundColor: colors.surfaceMuted,
          borderRadius: radii.md,
          borderWidth: 1,
          borderColor,
          paddingHorizontal: 16,
          height: 52,
          justifyContent: 'center',
        }}
      >
        <TextInput
          ref={ref}
          {...rest}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          placeholderTextColor={colors.textMuted}
          style={[
            text.body,
            { color: colors.textPrimary, padding: 0 },
            style,
          ]}
        />
      </View>
      {error ? (
        <Text style={[text.caption, { color: colors.danger, marginTop: 6 }]}>
          {error}
        </Text>
      ) : hint ? (
        <Text style={[text.caption, { color: colors.textMuted, marginTop: 6 }]}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
});
