import { useQuery } from '@tanstack/react-query';

import { qk } from '../api/keys';
import { getVenue, getVenues, type VenueFilters } from '../api/venues';

export function useVenues(filters: VenueFilters) {
  return useQuery({
    queryKey: qk.venues(filters),
    queryFn: () => getVenues(filters),
  });
}

export function useVenue(id: number) {
  return useQuery({
    queryKey: qk.venue(id),
    queryFn: () => getVenue(id),
    enabled: Number.isFinite(id),
  });
}
