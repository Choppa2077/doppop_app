import { api } from './client';
import type {
  ParameterUpsertInput,
  User,
  UserParameter,
} from '../types/api';

export async function getMe(): Promise<User> {
  const res = await api.get<User>('/me/');
  return res.data;
}

export type MeUpdateInput = Partial<{
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  city_id: number;
}>;

export async function updateMe(input: MeUpdateInput): Promise<User> {
  const res = await api.patch<User>('/me/', input);
  return res.data;
}

export async function putParameters(
  inputs: ParameterUpsertInput[],
): Promise<UserParameter[]> {
  // PUT body is a JSON array per backend contract.
  const res = await api.put<UserParameter[]>('/me/parameters/', inputs);
  return res.data;
}

export type CompleteOnboardingResponse = {
  onboarding_completed: boolean;
  required_parameters: string[];
};

export async function completeOnboarding(): Promise<CompleteOnboardingResponse> {
  const res = await api.post<CompleteOnboardingResponse>(
    '/me/onboarding/complete/',
  );
  return res.data;
}
