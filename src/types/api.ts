// Types mirror the backend contract documented in the project plan.
// Base URL: http://localhost:8000/api/v1/

export type City = {
  id: number;
  name: string;
  slug: string;
  is_active?: boolean;
};

export type Sport = {
  id: number;
  name: string;
  slug: string;
  icon_url: string | null;
  is_active: boolean;
};

export type FootballType = {
  id: number;
  name: string;
  slug: 'mini' | 'big' | string;
};

export type ParameterValueType = 'string' | 'number' | 'boolean';

export type UserParameter = {
  id: number;
  name: string;
  value_type: ParameterValueType;
  value: string | number | boolean;
  updated_at: string;
};

export type ParameterUpsertInput = {
  name: string;
  value_type: ParameterValueType;
  value: string | number | boolean;
};

export type User = {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  city: City | null;
  avatar_url: string | null;
  onboarding_completed: boolean;
  parameters: UserParameter[];
  created_at: string;
  updated_at: string;
};

// Compact user used inside lobby/participant payloads.
export type UserMini = {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
};

export type AuthResponse = {
  access: string;
  refresh: string;
  user: User;
};

export type RefreshResponse = {
  access: string;
};

export type ApiErrorBody = {
  detail: string;
  code?: string;
  extra?: Record<string, unknown>;
};

export type ApiError = {
  status: number;
  code: string;
  detail: string;
  extra: Record<string, unknown>;
};

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

// --- Venues -----------------------------------------------------------------

export type SportBase = {
  id: number;
  name: string;
  city: City;
  address: string;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  photo_url: string | null;
};

export type Venue = {
  id: number;
  name: string;
  sport: Sport;
  football_type: FootballType | null;
  sport_base: SportBase;
  rating: number;
  price_per_hour: string;
  photo_url: string | null;
  is_active: boolean;
};

export type VenueDetails = Venue & {
  recent_open_lobbies: LobbyListItem[];
};

export type TimeSlot = {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  starts_at: string;
  ends_at: string;
  is_blocked: boolean;
  is_taken: boolean;
};

// --- Lobbies ----------------------------------------------------------------

export type LobbyStatus = 'open' | 'confirmed' | 'cancelled' | 'finished';

export type LobbyVenueRef = {
  id: number;
  name: string;
  city_id: number;
  city_name: string;
  sport_base_id: number;
  sport_base_name: string;
};

export type LobbyParticipant = {
  id: number;
  user: UserMini;
  is_captain: boolean;
  joined_at: string;
};

export type LobbyListItem = {
  id: number;
  captain: UserMini;
  venue: LobbyVenueRef;
  sport: Sport;
  football_type: FootballType | null;
  time_slot: TimeSlot;
  max_players: number;
  participant_count: number;
  description: string | null;
  status: LobbyStatus;
  created_at: string;
};

export type LobbyDetails = LobbyListItem & {
  participants: LobbyParticipant[];
};
