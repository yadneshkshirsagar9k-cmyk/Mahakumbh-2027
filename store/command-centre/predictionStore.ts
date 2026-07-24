import { create } from 'zustand';
import { PredictedCrowdPoint } from '@/types/command-centre';

interface PredictionState {
  predictedPoints: PredictedCrowdPoint[];
  activeTimeOffset: 15 | 30 | 45 | 60;
  setPredictedPoints: (points: PredictedCrowdPoint[]) => void;
  setActiveTimeOffset: (offset: 15 | 30 | 45 | 60) => void;
}

export const usePredictionStore = create<PredictionState>((set) => ({
  predictedPoints: [],
  activeTimeOffset: 15,
  setPredictedPoints: (predictedPoints) => set({ predictedPoints }),
  setActiveTimeOffset: (activeTimeOffset) => set({ activeTimeOffset }),
}));
