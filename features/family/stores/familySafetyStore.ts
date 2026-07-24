import { create } from 'zustand';

export interface FamilySafetyConfig {
  safeRadiusMeters: number;
  isAutoRadius: boolean;
  status: 'Green' | 'Amber' | 'Red';
  batteryThreshold: number;
}

interface FamilySafetyState {
  configs: Record<string, FamilySafetyConfig>; // keyed by journeyId
  updateConfig: (journeyId: string, config: Partial<FamilySafetyConfig>) => void;
}

export const useFamilySafetyStore = create<FamilySafetyState>((set) => ({
  configs: {},
  updateConfig: (journeyId, config) => set((state) => ({
    configs: {
      ...state.configs,
      [journeyId]: {
        ...(state.configs[journeyId] || { safeRadiusMeters: 50, isAutoRadius: true, status: 'Green', batteryThreshold: 20 }),
        ...config
      }
    }
  }))
}));
