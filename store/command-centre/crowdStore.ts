import { create } from 'zustand';
import { UnifiedCrowdPoint } from '@/types/command-centre';

interface CrowdState {
  points: UnifiedCrowdPoint[];
  setPoints: (points: UnifiedCrowdPoint[]) => void;
  clearPoints: () => void;
}

export const useCrowdStore = create<CrowdState>((set) => ({
  points: [],
  setPoints: (points) => set({ points }),
  clearPoints: () => set({ points: [] }),
}));
