import type { LobbyDetails, User } from '../types/api';

export type LobbyAction =
  | { kind: 'join' }
  | { kind: 'lobby_full' }
  | { kind: 'leave' }
  | { kind: 'captain_leave' }
  | { kind: 'locked'; reason: 'confirmed' | 'cancelled' | 'finished' };

export function getLobbyAction(
  lobby: LobbyDetails,
  me: User | null | undefined,
): LobbyAction {
  const meId = me?.id;
  const captainId = lobby.captain.id;
  const isParticipant =
    meId != null &&
    lobby.participants.some((p) => p.user.id === meId);
  const isCaptain = meId != null && captainId === meId;

  if (lobby.status !== 'open') {
    return { kind: 'locked', reason: lobby.status };
  }

  if (isCaptain) {
    return { kind: 'captain_leave' };
  }

  if (isParticipant) {
    return { kind: 'leave' };
  }

  if (lobby.participant_count >= lobby.max_players) {
    return { kind: 'lobby_full' };
  }

  return { kind: 'join' };
}

export function isCurrentUserParticipant(
  lobby: LobbyDetails,
  me: User | null | undefined,
): boolean {
  const meId = me?.id;
  if (meId == null) return false;
  return lobby.participants.some((p) => p.user.id === meId);
}
