import { useQuery } from '@tanstack/react-query';

import { qk } from '../api/keys';
import { getMe } from '../api/me';
import { useAuthStore } from '../stores/authStore';

export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: qk.me(),
    queryFn: getMe,
    enabled: isAuthenticated,
  });
}
