import { create } from 'zustand';

export interface OperationalMission {
  id: string;
  title: string;
  objective: string;
  departments: string[];
  status: 'Planning' | 'Active' | 'Completed' | 'Aborted';
  progress: number; // 0-100
}

interface MissionState {
  missions: OperationalMission[];
  addMission: (mission: OperationalMission) => void;
}

export const useMissionStore = create<MissionState>((set) => ({
  missions: [
    { id: 'miss-1', title: 'Crowd Diversion Alpha', objective: 'Prevent stampede at Ramkund', departments: ['police', 'health', 'transport'], status: 'Active', progress: 40 }
  ],
  addMission: (m) => set((state) => ({ missions: [...state.missions, m] }))
}));
