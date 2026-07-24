import { create } from 'zustand';

interface IncidentState {
  activeSeparations: string[]; // List of Incident IDs
  addSeparation: (incidentId: string) => void;
  removeSeparation: (incidentId: string) => void;
}

export const useFamilyIncidentStore = create<IncidentState>((set) => ({
  activeSeparations: [],
  addSeparation: (id) => set((state) => ({ activeSeparations: [...state.activeSeparations, id] })),
  removeSeparation: (id) => set((state) => ({ activeSeparations: state.activeSeparations.filter(i => i !== id) }))
}));
