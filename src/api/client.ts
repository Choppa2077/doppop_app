import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

import type { ApiError, ApiErrorBody, RefreshResponse } from '../types/api';

const baseURL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

type TokenAccessor = {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setAccessToken: (token: string) => Promise<void> | void;
  onRefreshFailed: () => Promise<void> | void;
};

let tokenAccessor: TokenAccessor | null = null;

export function setTokenAccessor(accessor: TokenAccessor) {
  tokenAccessor = accessor;
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenAccessor?.getAccessToken();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type RetriableConfig = AxiosRequestConfig & { _retried?: boolean };

let refreshInFlight: Promise<string | null> | null = null;

async function runRefresh(): Promise<string | null> {
  const refresh = tokenAccessor?.getRefreshToken();
  if (!refresh) return null;
  try {
    const res = await axios.post<RefreshResponse>(
      `${baseURL}/auth/refresh/`,
      { refresh },
      { timeout: 15_000 },
    );
    const newAccess = res.data.access;
    await tokenAccessor?.setAccessToken(newAccess);
    return newAccess;
  } catch {
    await tokenAccessor?.onRefreshFailed();
    return null;
  }
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<ApiErrorBody>) => {
    const original = error.config as RetriableConfig | undefined;
    const status = error.response?.status;

    // Try one refresh + retry on 401, but not for the refresh endpoint itself.
    if (
      status === 401 &&
      original &&
      !original._retried &&
      !original.url?.includes('/auth/refresh/') &&
      !original.url?.includes('/auth/login/') &&
      !original.url?.includes('/auth/register/')
    ) {
      original._retried = true;

      if (!refreshInFlight) {
        refreshInFlight = runRefresh().finally(() => {
          refreshInFlight = null;
        });
      }
      const newAccess = await refreshInFlight;

      if (newAccess) {
        original.headers = original.headers ?? {};
        (original.headers as Record<string, string>).Authorization =
          `Bearer ${newAccess}`;
        return api.request(original);
      }
    }

    return Promise.reject(normalizeError(error));
  },
);

export function normalizeError(error: AxiosError<ApiErrorBody>): ApiError {
  const body = error.response?.data;
  return {
    status: error.response?.status ?? 0,
    code: body?.code ?? 'unknown_error',
    detail: body?.detail ?? error.message ?? 'Something went wrong',
    extra: body?.extra ?? {},
  };
}

export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'status' in value &&
    'code' in value &&
    'detail' in value
  );
}
