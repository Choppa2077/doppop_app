import { useQuery } from '@tanstack/react-query';

import { qk } from '../api/keys';
import {
  getCities,
  getFootballTypes,
  getSports,
} from '../api/reference';

// Reference data is server-immutable from the client's perspective: cities,
// sports, and football types only change via admin actions. Cache aggressively
// and skip refetches.
const REFERENCE_OPTIONS = {
  staleTime: 1000 * 60 * 60, // 1 hour
  gcTime: 1000 * 60 * 60 * 24,
} as const;

export function useCities() {
  return useQuery({
    queryKey: qk.cities(),
    queryFn: getCities,
    ...REFERENCE_OPTIONS,
  });
}

export function useSports() {
  return useQuery({
    queryKey: qk.sports(),
    queryFn: getSports,
    ...REFERENCE_OPTIONS,
  });
}

export function useFootballTypes() {
  return useQuery({
    queryKey: qk.footballTypes(),
    queryFn: getFootballTypes,
    ...REFERENCE_OPTIONS,
  });
}
