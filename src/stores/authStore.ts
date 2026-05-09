import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import { setTokenAccessor } from '../api/client';

const ACCESS_KEY = 'doppop.access';
const REFRESH_KEY = 'doppop.refresh';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  setTokens: (access: string, refresh: string) => Promise<void>;
  setAccessToken: (access: string) => Promise<void>;
  clearTokens: () => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  hydrated: false,

  setTokens: async (access, refresh) => {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_KEY, access),
      SecureStore.setItemAsync(REFRESH_KEY, refresh),
    ]);
    set({ accessToken: access, refreshToken: refresh, isAuthenticated: true });
  },

  setAccessToken: async (access) => {
    await SecureStore.setItemAsync(ACCESS_KEY, access);
    set({ accessToken: access, isAuthenticated: true });
  },

  clearTokens: async () => {
    await Promise.allSettled([
      SecureStore.deleteItemAsync(ACCESS_KEY),
      SecureStore.deleteItemAsync(REFRESH_KEY),
    ]);
    set({ accessToken: null, refreshToken: null, isAuthenticated: false });
  },

  hydrate: async () => {
    if (get().hydrated) return;
    const [access, refresh] = await Promise.all([
      SecureStore.getItemAsync(ACCESS_KEY),
      SecureStore.getItemAsync(REFRESH_KEY),
    ]);
    set({
      accessToken: access,
      refreshToken: refresh,
      isAuthenticated: !!access && !!refresh,
      hydrated: true,
    });
  },
}));

// Wire the auth store into the axios client so interceptors can read/refresh tokens
// without importing the store directly (avoids a circular dep).
setTokenAccessor({
  getAccessToken: () => useAuthStore.getState().accessToken,
  getRefreshToken: () => useAuthStore.getState().refreshToken,
  setAccessToken: (token) => useAuthStore.getState().setAccessToken(token),
  onRefreshFailed: () => useAuthStore.getState().clearTokens(),
});
