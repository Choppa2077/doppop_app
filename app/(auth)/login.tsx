import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from '../../src/utils/toast';

import { login } from '../../src/api/auth';
import { isApiError } from '../../src/api/client';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { useAuthStore } from '../../src/stores/authStore';
import { colors, text } from '../../src/theme';
import { loginSchema, type LoginValues } from '../../src/utils/validators';

export default function LoginScreen() {
  const setTokens = useAuthStore((s) => s.setTokens);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      const res = await login(values);
      await setTokens(res.access, res.refresh);
      router.replace('/');
    } catch (err) {
      const message = isApiError(err) ? err.detail : 'Could not sign in';
      toast.error(message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            padding: 24,
            justifyContent: 'center',
            gap: 24,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ gap: 8 }}>
            <View
              style={{
                alignSelf: 'flex-start',
                backgroundColor: colors.accentSoft,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 999,
                marginBottom: 4,
              }}
            >
              <Text
                style={[
                  text.micro,
                  {
                    color: colors.accent,
                    textTransform: 'uppercase',
                    letterSpacing: 1.2,
                  },
                ]}
              >
                welcome back
              </Text>
            </View>
            <Text style={[text.display, { color: colors.textPrimary }]}>
              Sign in
            </Text>
            <Text style={[text.body, { color: colors.textMuted }]}>
              Pick up where you left off.
            </Text>
          </View>

          <View style={{ gap: 16 }}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="you@example.com"
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  placeholder="••••••••"
                  secureTextEntry
                  autoComplete="password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                />
              )}
            />
          </View>

          <View style={{ gap: 12 }}>
            <Button
              label="Sign in"
              variant="primary"
              fullWidth
              loading={isSubmitting}
              onPress={handleSubmit(onSubmit)}
            />
            <Link href="/(auth)/register" asChild>
              <Button label="Create an account" variant="ghost" fullWidth />
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
