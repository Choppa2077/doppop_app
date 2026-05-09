import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from '../../src/utils/toast';

import { isApiError } from '../../src/api/client';
import { qk } from '../../src/api/keys';
import { putParameters, uploadAvatar } from '../../src/api/me';
import { Avatar } from '../../src/components/Avatar';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import {
  OptionPicker,
  type OptionItem,
} from '../../src/components/OptionPicker';
import { SportBadge } from '../../src/components/SportBadge';
import {
  FAVORITE_SPORTS,
  FAVORITE_SPORT_LABELS,
  PARAM,
  PLAY_FREQUENCIES,
  PLAY_FREQUENCY_LABELS,
  PREFERRED_TIMES,
  PREFERRED_TIME_LABELS,
  SKILL_LEVELS,
  SKILL_LEVEL_LABELS,
  type FavoriteSport,
  type ParamKey,
  type PlayFrequency,
  type PreferredTime,
  type SkillLevel,
} from '../../src/constants/parameters';
import { useMe } from '../../src/hooks/useMe';
import { useAuthStore } from '../../src/stores/authStore';
import { colors, text } from '../../src/theme';
import type { ParameterValueType } from '../../src/types/api';
import {
  getBooleanParam,
  getStringParam,
} from '../../src/utils/parameters';

type StringPickerKind =
  | 'favorite_sport'
  | 'skill_level'
  | 'play_frequency'
  | 'preferred_time';

const STRING_PICKER_CONFIG: Record<
  StringPickerKind,
  {
    paramKey: ParamKey;
    title: string;
    options: OptionItem<string>[];
  }
> = {
  favorite_sport: {
    paramKey: PARAM.FAVORITE_SPORT,
    title: 'Favorite sport',
    options: FAVORITE_SPORTS.map<OptionItem<string>>((s) => ({
      value: s,
      label: FAVORITE_SPORT_LABELS[s],
    })),
  },
  skill_level: {
    paramKey: PARAM.SKILL_LEVEL,
    title: 'Skill level',
    options: SKILL_LEVELS.map<OptionItem<string>>((s) => ({
      value: s,
      label: SKILL_LEVEL_LABELS[s],
    })),
  },
  play_frequency: {
    paramKey: PARAM.PLAY_FREQUENCY,
    title: 'How often you play',
    options: PLAY_FREQUENCIES.map<OptionItem<string>>((s) => ({
      value: s,
      label: PLAY_FREQUENCY_LABELS[s],
    })),
  },
  preferred_time: {
    paramKey: PARAM.PREFERRED_TIME,
    title: 'Preferred time',
    options: PREFERRED_TIMES.map<OptionItem<string>>((s) => ({
      value: s,
      label: PREFERRED_TIME_LABELS[s],
    })),
  },
};

export default function ProfileScreen() {
  const queryClient = useQueryClient();
  const { data: me } = useMe();
  const clearTokens = useAuthStore((s) => s.clearTokens);

  const [picker, setPicker] = useState<StringPickerKind | null>(null);

  const updateParam = useMutation({
    mutationFn: async (input: {
      name: ParamKey;
      value: string | boolean;
      value_type: ParameterValueType;
    }) => {
      await putParameters([input]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.me() });
      queryClient.invalidateQueries({ queryKey: qk.meParameters() });
    },
    onError: (err) => {
      const message = isApiError(err)
        ? err.detail
        : 'Could not update preference';
      toast.error(message);
    },
  });

  const avatar = useMutation({
    mutationFn: async () => {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        throw new Error('Photo permission denied');
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });
      if (result.canceled || result.assets.length === 0) return null;
      const asset = result.assets[0];
      return uploadAvatar({
        uri: asset.uri,
        fileName: asset.fileName,
        mimeType: asset.mimeType,
      });
    },
    onSuccess: (user) => {
      if (user) {
        queryClient.setQueryData(qk.me(), user);
      }
    },
    onError: (err) => {
      const message = isApiError(err)
        ? err.detail
        : err instanceof Error
        ? err.message
        : 'Could not upload avatar';
      toast.error(message);
    },
  });

  const displayName =
    [me?.first_name, me?.last_name].filter(Boolean).join(' ') ||
    me?.email ||
    '...';

  const favoriteSport = getStringParam(me, PARAM.FAVORITE_SPORT) as
    | FavoriteSport
    | undefined;
  const skillLevel = getStringParam(me, PARAM.SKILL_LEVEL) as
    | SkillLevel
    | undefined;
  const playFrequency = getStringParam(me, PARAM.PLAY_FREQUENCY) as
    | PlayFrequency
    | undefined;
  const preferredTime = getStringParam(me, PARAM.PREFERRED_TIME) as
    | PreferredTime
    | undefined;
  const isOpen = getBooleanParam(me, PARAM.IS_OPEN_TO_NEW_TEAMMATES) ?? true;
  const isCompetitive = getBooleanParam(me, PARAM.IS_COMPETITIVE) ?? false;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 56, gap: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[text.display, { color: colors.textPrimary }]}>
          Profile
        </Text>

        <Card padded>
          <View style={{ alignItems: 'center', gap: 12 }}>
            <Pressable
              onPress={() => avatar.mutate()}
              hitSlop={8}
              style={{ position: 'relative' }}
            >
              <Avatar uri={me?.avatar_url} name={displayName} size={88} />
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  backgroundColor: colors.accent,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: colors.surface,
                }}
              >
                <Ionicons name="camera" size={14} color="#FFFFFF" />
              </View>
            </Pressable>
            <View style={{ alignItems: 'center', gap: 2 }}>
              <Text
                style={[text.h1, { color: colors.textPrimary }]}
                numberOfLines={1}
              >
                {displayName}
              </Text>
              <Text style={[text.caption, { color: colors.textMuted }]}>
                {me?.email ?? ''}
              </Text>
            </View>
            {(favoriteSport || skillLevel) && (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                  justifyContent: 'center',
                  marginTop: 4,
                }}
              >
                {favoriteSport ? (
                  <SportBadge sport={favoriteSport} size="sm" />
                ) : null}
                {skillLevel ? (
                  <Pill text={SKILL_LEVEL_LABELS[skillLevel]} />
                ) : null}
                {playFrequency ? (
                  <Pill text={PLAY_FREQUENCY_LABELS[playFrequency]} />
                ) : null}
              </View>
            )}
          </View>
        </Card>

        <Section title="Account">
          <Card padded={false}>
            <Row
              icon="person-outline"
              label="Edit profile"
              value={displayName}
              onPress={() => router.push('/profile/edit')}
            />
            <Divider />
            <Row
              icon="call-outline"
              label="Phone"
              value={me?.phone_number || 'Not set'}
              onPress={() => router.push('/profile/edit')}
            />
            <Divider />
            <Row
              icon="location-outline"
              label="City"
              value={me?.city?.name || 'Not set'}
              onPress={() => router.push('/profile/edit')}
            />
          </Card>
        </Section>

        <Section title="Preferences">
          <Card padded={false}>
            <Row
              icon="football-outline"
              label="Favorite sport"
              value={
                favoriteSport
                  ? FAVORITE_SPORT_LABELS[favoriteSport]
                  : 'Not set'
              }
              onPress={() => setPicker('favorite_sport')}
            />
            <Divider />
            <Row
              icon="trophy-outline"
              label="Skill level"
              value={skillLevel ? SKILL_LEVEL_LABELS[skillLevel] : 'Not set'}
              onPress={() => setPicker('skill_level')}
            />
            <Divider />
            <Row
              icon="calendar-outline"
              label="How often"
              value={
                playFrequency
                  ? PLAY_FREQUENCY_LABELS[playFrequency]
                  : 'Not set'
              }
              onPress={() => setPicker('play_frequency')}
            />
            <Divider />
            <Row
              icon="time-outline"
              label="Preferred time"
              value={
                preferredTime
                  ? PREFERRED_TIME_LABELS[preferredTime]
                  : 'Not set'
              }
              onPress={() => setPicker('preferred_time')}
            />
            <Divider />
            <ToggleRow
              icon="people-outline"
              label="Open to new teammates"
              value={isOpen}
              onChange={(v) =>
                updateParam.mutate({
                  name: PARAM.IS_OPEN_TO_NEW_TEAMMATES,
                  value: v,
                  value_type: 'boolean',
                })
              }
            />
            <Divider />
            <ToggleRow
              icon="flame-outline"
              label="I'm competitive"
              value={isCompetitive}
              onChange={(v) =>
                updateParam.mutate({
                  name: PARAM.IS_COMPETITIVE,
                  value: v,
                  value_type: 'boolean',
                })
              }
            />
          </Card>
        </Section>

        <Button
          label="Sign out"
          variant="danger"
          fullWidth
          onPress={async () => {
            await clearTokens();
            queryClient.clear();
            router.replace('/(auth)/login');
          }}
        />
      </ScrollView>

      {picker !== null && (
        <OptionPicker
          visible={picker !== null}
          title={STRING_PICKER_CONFIG[picker].title}
          options={STRING_PICKER_CONFIG[picker].options}
          selectedValue={getStringParam(
            me,
            STRING_PICKER_CONFIG[picker].paramKey,
          )}
          onSelect={(value) =>
            updateParam.mutate({
              name: STRING_PICKER_CONFIG[picker].paramKey,
              value,
              value_type: 'string',
            })
          }
          onClose={() => setPicker(null)}
        />
      )}
    </SafeAreaView>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ gap: 10 }}>
      <Text
        style={[
          text.micro,
          {
            color: colors.textMuted,
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            paddingHorizontal: 4,
          },
        ]}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

function Row({
  icon,
  label,
  value,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} android_ripple={{ color: colors.surfaceMuted }}>
      {({ pressed }) => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 14,
            paddingHorizontal: 16,
            opacity: pressed ? 0.6 : 1,
          }}
        >
          <View style={{ width: 32, alignItems: 'center' }}>
            <Ionicons name={icon} size={20} color={colors.textMuted} />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={[text.bodyStrong, { color: colors.textPrimary }]}>
              {label}
            </Text>
            <Text
              style={[text.caption, { color: colors.textMuted, marginTop: 2 }]}
              numberOfLines={1}
            >
              {value}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </View>
      )}
    </Pressable>
  );
}

function ToggleRow({
  icon,
  label,
  value,
  onChange,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
      }}
    >
      <View style={{ width: 32, alignItems: 'center' }}>
        <Ionicons name={icon} size={20} color={colors.textMuted} />
      </View>
      <View style={{ flex: 1, marginLeft: 8 }}>
        <Text style={[text.bodyStrong, { color: colors.textPrimary }]}>
          {label}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.surfaceMuted, true: colors.accent }}
        thumbColor="#FFFFFF"
        ios_backgroundColor={colors.surfaceMuted}
      />
    </View>
  );
}

function Divider() {
  return (
    <View style={{ height: 1, backgroundColor: colors.border, marginLeft: 56 }} />
  );
}

function Pill({ text: label }: { text: string }) {
  return (
    <View
      style={{
        backgroundColor: colors.surfaceMuted,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
      }}
    >
      <Text style={[text.caption, { color: colors.textPrimary }]}>{label}</Text>
    </View>
  );
}
