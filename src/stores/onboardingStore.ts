import { create } from 'zustand';

import type {
  FavoriteSport,
  PlayFrequency,
  PreferredTime,
  SkillLevel,
} from '../constants/parameters';

type OnboardingAnswers = {
  favoriteSport: FavoriteSport | null;
  skillLevel: SkillLevel | null;
  playFrequency: PlayFrequency | null;
  preferredTime: PreferredTime | null;
  isOpenToNewTeammates: boolean;
  isCompetitive: boolean;
};

type OnboardingState = OnboardingAnswers & {
  setFavoriteSport: (v: FavoriteSport) => void;
  setSkillLevel: (v: SkillLevel) => void;
  setPlayFrequency: (v: PlayFrequency) => void;
  setPreferredTime: (v: PreferredTime) => void;
  setIsOpenToNewTeammates: (v: boolean) => void;
  setIsCompetitive: (v: boolean) => void;
  reset: () => void;
};

const INITIAL: OnboardingAnswers = {
  favoriteSport: null,
  skillLevel: null,
  playFrequency: null,
  preferredTime: null,
  isOpenToNewTeammates: true,
  isCompetitive: false,
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...INITIAL,
  setFavoriteSport: (v) => set({ favoriteSport: v }),
  setSkillLevel: (v) => set({ skillLevel: v }),
  setPlayFrequency: (v) => set({ playFrequency: v }),
  setPreferredTime: (v) => set({ preferredTime: v }),
  setIsOpenToNewTeammates: (v) => set({ isOpenToNewTeammates: v }),
  setIsCompetitive: (v) => set({ isCompetitive: v }),
  reset: () => set(INITIAL),
}));
