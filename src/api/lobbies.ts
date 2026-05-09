import { api } from './client';
import type {
  LobbyDetails,
  LobbyListItem,
  Paginated,
} from '../types/api';

export type LobbyFilters = {
  city?: number;
  sport?: number;
  football_type?: number;
  page?: number;
};

export async function getLobbies(
  filters: LobbyFilters = {},
): Promise<Paginated<LobbyListItem>> {
  const params: Record<string, string | number> = {};
  if (filters.city != null) params.city = filters.city;
  if (filters.sport != null) params.sport = filters.sport;
  if (filters.football_type != null)
    params.football_type = filters.football_type;
  if (filters.page) params.page = filters.page;
  const res = await api.get<Paginated<LobbyListItem>>('/lobbies/', { params });
  return res.data;
}

export async function getActiveLobbies(): Promise<LobbyListItem[]> {
  const res = await api.get<LobbyListItem[]>('/lobbies/active/');
  return res.data;
}

export async function getLobby(id: number): Promise<LobbyDetails> {
  const res = await api.get<LobbyDetails>(`/lobbies/${id}/`);
  return res.data;
}

export type CreateLobbyInput = {
  time_slot_id: number;
  max_players: number;
  description?: string;
};

export async function createLobby(
  input: CreateLobbyInput,
): Promise<LobbyDetails> {
  const res = await api.post<LobbyDetails>('/lobbies/', input);
  return res.data;
}

export async function joinLobby(id: number): Promise<LobbyDetails> {
  const res = await api.post<LobbyDetails>(`/lobbies/${id}/join/`);
  return res.data;
}

export type LeaveLobbyInput = {
  new_captain_id?: number | null;
};

export async function leaveLobby(
  id: number,
  input: LeaveLobbyInput = {},
): Promise<LobbyDetails> {
  const res = await api.post<LobbyDetails>(`/lobbies/${id}/leave/`, input);
  return res.data;
}
