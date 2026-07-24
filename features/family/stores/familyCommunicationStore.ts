import { create } from 'zustand';

export interface TemporaryGuardian {
  guardianId: string;
  assignedBy: string;
  timestamp: number;
  status: 'Active' | 'Revoked';
}

interface CommState {
  guardians: Record<string, TemporaryGuardian[]>; // keyed by journeyId
  assignGuardian: (journeyId: string, guardian: TemporaryGuardian) => void;
}

export const useFamilyCommunicationStore = create<CommState>((set) => ({
  guardians: {},
  assignGuardian: (journeyId, guardian) => set((state) => ({
    guardians: {
      ...state.guardians,
      [journeyId]: [...(state.guardians[journeyId] || []), guardian]
    }
  }))
}));
