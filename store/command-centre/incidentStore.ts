import { create } from 'zustand';
import { UnifiedIncident } from '@/types/command-centre';

interface IncidentState {
  incidents: UnifiedIncident[];
  setIncidents: (incidents: UnifiedIncident[]) => void;
}

export const useIncidentStore = create<IncidentState>((set) => ({
  incidents: [],
  setIncidents: (incidents) => set({ incidents }),
}));
