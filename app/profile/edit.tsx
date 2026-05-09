import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from '../../src/utils/toast';

import { isApiError } from '../../src/api/client';
import { qk } from '../../src/api/keys';
import { updateMe } from '../../src/api/me';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Input } from '../../src/components/Input';
import {
  OptionPicker,
  type OptionItem,
} from '../../src/components/OptionPicker';
import { useMe } from '../../src/hooks/useMe';
import { useCities } from '../../src/hooks/useReferenceData';
import { colors, text } from '../../src/theme';
import {
  profileEditSchema,
  type ProfileEditValues,
} from '../../src/utils/validators';

export default function EditProfileScreen() {
  const queryClient = useQueryClient();
  const { data: me } = useMe();
  const { data: cities } = useCities();
  const [cityPickerOpen, setCityPickerOpen] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileEditValues>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      phone_number: '',
    },
  });

  // Hydrate the form from /me/ once it loads.
  useEffect(() => {
    if (me) {
      reset({
        first_name: me.first_name ?? '',
        last_name: me.last_name ?? '',
        phone_number: me.phone_number ?? '',
      });
      setSelectedCityId(me.city?.id ?? null);
    }
  }, [me, reset]);

  const cityChanged = (me?.city?.id ?? null) !== selectedCityId;

  const save = useMutation({
    mutationFn: async (values: ProfileEditValues) => {
      const payload: Record<string, unknown> = {};
      if (values.first_name !== (me?.first_name ?? ''))
        payload.first_name = values.first_name ?? '';
      if (values.last_name !== (me?.last_name ?? ''))
        payload.last_name = values.last_name ?? '';
      if (values.phone_number !== (me?.phone_number ?? ''))
        payload.phone_number = values.phone_number ?? '';
      if (cityChanged && selectedCityId !== null)
        payload.city_id = selectedCityId;
      if (Object.keys(payload).length === 0) return null;
      return updateMe(payload);
    },
    onSuccess: (user) => {
      if (user) {
        queryClient.setQueryData(qk.me(), user);
      }
      router.back();
    },
    onError: (err) => {
      const message = isApiError(err)
        ? err.detail
        : 'Could not save changes';
      toast.error(message);
    },
  });

  const cityOptions: OptionItem<number>[] =
    cities?.map((c) => ({ value: c.id, label: c.name })) ?? [];

  const selectedCity = cities?.find((c) => c.id === selectedCityId);
  const canSave = isDirty || cityChanged;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 8,
          gap: 4,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={[text.h2, { color: colors.textPrimary }]}>
          Edit profile
        </Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 24,
            gap: 24,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ gap: 16 }}>
            <Controller
              control={control}
              name="first_name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="First name"
                  placeholder="Mukan"
                  autoCapitalize="words"
                  autoComplete="given-name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.first_name?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="last_name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Last name"
                  placeholder="Idrissov"
                  autoCapitalize="words"
                  autoComplete="family-name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.last_name?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="phone_number"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Phone"
                  placeholder="+7 700 123 4567"
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.phone_number?.message}
                />
              )}
            />
          </View>

          <View style={{ gap: 8 }}>
            <Text style={[text.caption, { color: colors.textMuted }]}>
              City
            </Text>
            <Card padded={false}>
              <Pressable onPress={() => setCityPickerOpen(true)}>
                {({ pressed }) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 16,
                      opacity: pressed ? 0.6 : 1,
                    }}
                  >
                    <View style={{ width: 32, alignItems: 'center' }}>
                      <Ionicons
                        name="location-outline"
                        size={20}
                        color={colors.textMuted}
                      />
                    </View>
                    <Text
                      style={[
                        text.body,
                        {
                          color: selectedCity
                            ? colors.textPrimary
                            : colors.textMuted,
                          flex: 1,
                          marginLeft: 8,
                        },
                      ]}
                    >
                      {selectedCity?.name ?? 'Choose a city'}
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={colors.textMuted}
                    />
                  </View>
                )}
              </Pressable>
            </Card>
          </View>

          <Button
            label="Save changes"
            variant="primary"
            fullWidth
            disabled={!canSave}
            loading={isSubmitting || save.isPending}
            onPress={handleSubmit((v) => save.mutate(v))}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <OptionPicker<number>
        visible={cityPickerOpen}
        title="City"
        options={cityOptions}
        selectedValue={selectedCityId}
        onSelect={(v) => setSelectedCityId(v)}
        onClose={() => setCityPickerOpen(false)}
      />
    </SafeAreaView>
  );
}
