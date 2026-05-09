import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { isApiError } from '../api/client';
import { qk } from '../api/keys';
import { createLobby } from '../api/lobbies';
import { Button } from './Button';
import { Card } from './Card';
import { colors, radii, text } from '../theme';
import type { TimeSlot } from '../types/api';
import { formatLongDate, formatTimeRange } from '../utils/format';
import { toast } from '../utils/toast';

type CreateLobbySheetProps = {
  visible: boolean;
  onClose: () => void;
  slot: TimeSlot | null;
  venueName: string;
  venueId: number;
};

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 20;
const DEFAULT_PLAYERS = 10;

export function CreateLobbySheet({
  visible,
  onClose,
  slot,
  venueName,
  venueId,
}: CreateLobbySheetProps) {
  const queryClient = useQueryClient();
  const [maxPlayers, setMaxPlayers] = useState<number>(DEFAULT_PLAYERS);
  const [description, setDescription] = useState<string>('');

  // Reset form whenever the sheet (re)opens.
  useEffect(() => {
    if (visible) {
      setMaxPlayers(DEFAULT_PLAYERS);
      setDescription('');
    }
  }, [visible]);

  const create = useMutation({
    mutationFn: async () => {
      if (!slot) throw new Error('No slot selected');
      return createLobby({
        time_slot_id: slot.id,
        max_players: maxPlayers,
        description: description.trim() || undefined,
      });
    },
    onSuccess: (lobby) => {
      // Invalidate slots for this venue/date, the user's active lobbies, and
      // any cached lobbies feed.
      queryClient.invalidateQueries({
        queryKey: qk.venueSlots(venueId, slot?.date ?? ''),
      });
      queryClient.invalidateQueries({ queryKey: qk.activeLobbies() });
      queryClient.invalidateQueries({ queryKey: ['lobbies'] });
      onClose();
      // router.replace so back goes to /(tabs)/lobbies, not back to the venue.
      router.replace(`/lobbies/${lobby.id}`);
    },
    onError: (err) => {
      const message = isApiError(err)
        ? err.detail
        : err instanceof Error
        ? err.message
        : 'Could not create lobby';
      toast.error(message);
      // If the slot was taken between selection and submit, the parent should
      // refetch slots — invalidating closes that gap on next focus.
      if (isApiError(err) && err.code === 'slot_taken') {
        queryClient.invalidateQueries({
          queryKey: qk.venueSlots(venueId, slot?.date ?? ''),
        });
        onClose();
      }
    },
  });

  if (!slot) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: colors.overlay }}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ backgroundColor: colors.bg }}
        >
          <SafeAreaView
            edges={['bottom']}
            style={{
              backgroundColor: colors.bg,
              borderTopLeftRadius: radii.xl,
              borderTopRightRadius: radii.xl,
              maxHeight: '90%',
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
                New lobby
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

            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingTop: 4,
                paddingBottom: 16,
                gap: 16,
              }}
              keyboardShouldPersistTaps="handled"
            >
              {/* Slot summary */}
              <Card>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 999,
                      backgroundColor: colors.accentSoft,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="time" size={20} color={colors.accent} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        text.bodyStrong,
                        { color: colors.textPrimary },
                      ]}
                    >
                      {formatTimeRange(slot.starts_at, slot.ends_at)}
                    </Text>
                    <Text
                      style={[text.caption, { color: colors.textMuted }]}
                      numberOfLines={1}
                    >
                      {formatLongDate(new Date(slot.starts_at))} · {venueName}
                    </Text>
                  </View>
                </View>
              </Card>

              {/* Max players */}
              <View style={{ gap: 12 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={[text.caption, { color: colors.textMuted }]}>
                    Max players
                  </Text>
                  <Text
                    style={[
                      text.display,
                      {
                        color: colors.textPrimary,
                        fontSize: 36,
                        lineHeight: 40,
                      },
                    ]}
                  >
                    {maxPlayers}
                  </Text>
                </View>
                <Slider
                  minimumValue={MIN_PLAYERS}
                  maximumValue={MAX_PLAYERS}
                  step={1}
                  value={maxPlayers}
                  onValueChange={(v) => setMaxPlayers(Math.round(v))}
                  minimumTrackTintColor={colors.accent}
                  maximumTrackTintColor={colors.surfaceMuted}
                  thumbTintColor={colors.accent}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={[text.micro, { color: colors.textMuted }]}
                  >
                    {MIN_PLAYERS}
                  </Text>
                  <Text
                    style={[text.micro, { color: colors.textMuted }]}
                  >
                    {MAX_PLAYERS}
                  </Text>
                </View>
              </View>

              {/* Description */}
              <View style={{ gap: 8 }}>
                <Text style={[text.caption, { color: colors.textMuted }]}>
                  Description (optional)
                </Text>
                <View
                  style={{
                    backgroundColor: colors.surfaceMuted,
                    borderRadius: radii.md,
                    borderWidth: 1,
                    borderColor: colors.border,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    minHeight: 96,
                  }}
                >
                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Casual evening match, all skill levels welcome…"
                    placeholderTextColor={colors.textMuted}
                    multiline
                    style={[
                      text.body,
                      {
                        color: colors.textPrimary,
                        textAlignVertical: 'top',
                        padding: 0,
                        minHeight: 72,
                      },
                    ]}
                    maxLength={400}
                  />
                </View>
              </View>
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
                label="Create lobby"
                variant="primary"
                fullWidth
                loading={create.isPending}
                onPress={() => create.mutate()}
              />
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
