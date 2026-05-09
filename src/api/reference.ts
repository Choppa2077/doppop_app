import { api } from './client';
import type { City, FootballType, Sport } from '../types/api';

export async function getCities(): Promise<City[]> {
  const res = await api.get<City[]>('/cities/');
  return res.data;
}

export async function getSports(): Promise<Sport[]> {
  const res = await api.get<Sport[]>('/sports/');
  return res.data;
}

export async function getFootballTypes(): Promise<FootballType[]> {
  const res = await api.get<FootballType[]>('/sports/football-types/');
  return res.data;
}
