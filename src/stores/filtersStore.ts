import { create } from 'zustand';

export type VenueFilterState = {
  city?: number;
  sport?: number;
  football_type?: number;
  min_rating?: number;
  max_rating?: number;
};

export type LobbyFilterState = {
  city?: number;
  sport?: number;
  football_type?: number;
};

type FiltersStore = {
  venue: VenueFilterState;
  lobby: LobbyFilterState;
  setVenueFilter: <K extends keyof VenueFilterState>(
    key: K,
    value: VenueFilterState[K],
  ) => void;
  setVenueRating: (min?: number, max?: number) => void;
  resetVenue: () => void;
  setLobbyFilter: <K extends keyof LobbyFilterState>(
    key: K,
    value: LobbyFilterState[K],
  ) => void;
  resetLobby: () => void;
};

export const useFiltersStore = create<FiltersStore>((set) => ({
  venue: {},
  lobby: {},
  setVenueFilter: (key, value) =>
    set((s) => ({
      venue: cleanUndefined({ ...s.venue, [key]: value }),
    })),
  setVenueRating: (min, max) =>
    set((s) => ({
      venue: cleanUndefined({
        ...s.venue,
        min_rating: min,
        max_rating: max,
      }),
    })),
  resetVenue: () => set({ venue: {} }),
  setLobbyFilter: (key, value) =>
    set((s) => ({
      lobby: cleanUndefined({ ...s.lobby, [key]: value }),
    })),
  resetLobby: () => set({ lobby: {} }),
}));

function cleanUndefined<T extends Record<string, unknown>>(obj: T): T {
  const out = {} as T;
  (Object.keys(obj) as Array<keyof T>).forEach((k) => {
    if (obj[k] !== undefined) out[k] = obj[k];
  });
  return out;
}

export function activeFilterCount(state: VenueFilterState | LobbyFilterState) {
  return Object.values(state).filter((v) => v !== undefined).length;
}
