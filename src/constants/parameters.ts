// Mirrors the backend's ONBOARDING_REQUIRED_PARAMS. Keep in sync — the server
// will reject /me/onboarding/complete/ if any of these are missing.

export const PARAM = {
  FAVORITE_SPORT: 'favorite_sport',
  SKILL_LEVEL: 'skill_level',
  PLAY_FREQUENCY: 'play_frequency',
  PREFERRED_TIME: 'preferred_time',
  IS_OPEN_TO_NEW_TEAMMATES: 'is_open_to_new_teammates',
  IS_COMPETITIVE: 'is_competitive',
} as const;

export type ParamKey = (typeof PARAM)[keyof typeof PARAM];

export const REQUIRED_PARAMS: ParamKey[] = [
  PARAM.FAVORITE_SPORT,
  PARAM.SKILL_LEVEL,
  PARAM.PLAY_FREQUENCY,
  PARAM.PREFERRED_TIME,
  PARAM.IS_OPEN_TO_NEW_TEAMMATES,
  PARAM.IS_COMPETITIVE,
];

export const FAVORITE_SPORTS = ['football', 'volleyball', 'basketball'] as const;
export type FavoriteSport = (typeof FAVORITE_SPORTS)[number];

export const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
export type SkillLevel = (typeof SKILL_LEVELS)[number];

export const PLAY_FREQUENCIES = ['daily', 'weekly', 'monthly', 'rarely'] as const;
export type PlayFrequency = (typeof PLAY_FREQUENCIES)[number];

export const PREFERRED_TIMES = ['morning', 'afternoon', 'evening'] as const;
export type PreferredTime = (typeof PREFERRED_TIMES)[number];

export const SKILL_LEVEL_LABELS: Record<SkillLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export const PLAY_FREQUENCY_LABELS: Record<PlayFrequency, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  rarely: 'Rarely',
};

export const PREFERRED_TIME_LABELS: Record<PreferredTime, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
};

export const FAVORITE_SPORT_LABELS: Record<FavoriteSport, string> = {
  football: 'Football',
  volleyball: 'Volleyball',
  basketball: 'Basketball',
};
