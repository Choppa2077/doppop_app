import type { ParamKey } from '../constants/parameters';
import type { User, UserParameter } from '../types/api';

export function getParameter(
  user: User | undefined | null,
  name: ParamKey,
): UserParameter | undefined {
  return user?.parameters.find((p) => p.name === name);
}

export function getStringParam(
  user: User | undefined | null,
  name: ParamKey,
): string | undefined {
  const p = getParameter(user, name);
  if (!p) return undefined;
  return typeof p.value === 'string' ? p.value : undefined;
}

export function getBooleanParam(
  user: User | undefined | null,
  name: ParamKey,
): boolean | undefined {
  const p = getParameter(user, name);
  if (!p) return undefined;
  return typeof p.value === 'boolean' ? p.value : undefined;
}
