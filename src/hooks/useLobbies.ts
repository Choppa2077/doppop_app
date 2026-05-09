import { useQuery } from '@tanstack/react-query';

import { qk } from '../api/keys';
import {
  getActiveLobbies,
  getLobbies,
  getLobby,
  type LobbyFilters,
} from '../api/lobbies';

export function useLobbies(filters: LobbyFilters) {
  return useQuery({
    queryKey: qk.lobbies(filters),
    queryFn: () => getLobbies(filters),
  });
}

export function useActiveLobbies() {
  return useQuery({
    queryKey: qk.activeLobbies(),
    queryFn: getActiveLobbies,
  });
}

export function useLobby(id: number) {
  return useQuery({
    queryKey: qk.lobby(id),
    queryFn: () => getLobby(id),
    enabled: Number.isFinite(id),
  });
}
