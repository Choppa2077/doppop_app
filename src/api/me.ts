import { api } from './client';
import type { User } from '../types/api';

export async function getMe(): Promise<User> {
  const res = await api.get<User>('/me/');
  return res.data;
}
