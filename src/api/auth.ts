import { api } from './client';
import type { AuthResponse } from '../types/api';

export type LoginInput = { email: string; password: string };
export type RegisterInput = { email: string; password: string };

export async function login(input: LoginInput): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/login/', input);
  return res.data;
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/register/', input);
  return res.data;
}
