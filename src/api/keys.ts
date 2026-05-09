export const qk = {
  me: () => ['me'] as const,
  meParameters: () => ['me', 'parameters'] as const,
  cities: () => ['cities'] as const,
  sports: () => ['sports'] as const,
  footballTypes: () => ['sports', 'football-types'] as const,
  venues: (filters: unknown) => ['venues', filters] as const,
  venue: (id: number) => ['venues', id] as const,
  venueSlots: (id: number, date: string) =>
    ['venues', id, 'slots', date] as const,
  lobbies: (filters: unknown) => ['lobbies', filters] as const,
  lobby: (id: number) => ['lobbies', id] as const,
  activeLobbies: () => ['lobbies', 'active'] as const,
};
