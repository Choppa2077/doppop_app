import { api } from './client';
import type {
  Paginated,
  TimeSlot,
  Venue,
  VenueDetails,
} from '../types/api';

export type VenueFilters = {
  city?: number;
  sport?: number;
  football_type?: number;
  min_rating?: number;
  max_rating?: number;
  search?: string;
  page?: number;
};

export async function getVenues(
  filters: VenueFilters = {},
): Promise<Paginated<Venue>> {
  const params: Record<string, string | number> = {};
  if (filters.city != null) params.city = filters.city;
  if (filters.sport != null) params.sport = filters.sport;
  if (filters.football_type != null)
    params.football_type = filters.football_type;
  if (filters.min_rating != null) params.min_rating = filters.min_rating;
  if (filters.max_rating != null) params.max_rating = filters.max_rating;
  if (filters.search) params.search = filters.search;
  if (filters.page) params.page = filters.page;
  const res = await api.get<Paginated<Venue>>('/venues/', { params });
  return res.data;
}

export async function getVenue(id: number): Promise<VenueDetails> {
  const res = await api.get<VenueDetails>(`/venues/${id}/`);
  return res.data;
}

export async function getVenueSlots(
  id: number,
  date: string,
): Promise<TimeSlot[]> {
  const res = await api.get<TimeSlot[]>(`/venues/${id}/time-slots/`, {
    params: { date },
  });
  return res.data;
}
