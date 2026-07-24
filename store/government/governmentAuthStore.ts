import { create } from 'zustand';
import { OfficerProfile } from '@/types/government';

interface GovernmentAuthState {
  isAuthenticated: boolean;
  profile: OfficerProfile | null;
  setIsAuthenticated: (status: boolean) => void;
  setProfile: (profile: OfficerProfile | null) => void;
}

export const useGovernmentAuthStore = create<GovernmentAuthState>((set) => ({
  isAuthenticated: false,
  profile: null,
  setIsAuthenticated: (status) => set({ isAuthenticated: status }),
  setProfile: (profile) => set({ profile }),
}));
