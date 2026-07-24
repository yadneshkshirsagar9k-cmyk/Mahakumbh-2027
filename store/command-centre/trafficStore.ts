import { create } from 'zustand';
import { UnifiedTrafficSegment } from '@/types/command-centre';

interface TrafficState {
  segments: UnifiedTrafficSegment[];
  setSegments: (segments: UnifiedTrafficSegment[]) => void;
}

export const useTrafficStore = create<TrafficState>((set) => ({
  segments: [],
  setSegments: (segments) => set({ segments }),
}));
