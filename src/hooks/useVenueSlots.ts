import { useQuery } from '@tanstack/react-query';

import { qk } from '../api/keys';
import { getVenueSlots } from '../api/venues';

export function useVenueSlots(id: number, date: string) {
  return useQuery({
    queryKey: qk.venueSlots(id, date),
    queryFn: () => getVenueSlots(id, date),
    enabled: Number.isFinite(id) && !!date,
  });
}
