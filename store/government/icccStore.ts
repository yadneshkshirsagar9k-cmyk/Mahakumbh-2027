import { create } from 'zustand';

export type OperationalMode = 'Normal' | 'PeakFestival' | 'Emergency' | 'VIPMovement' | 'NightOperations' | 'Simulation' | 'Maintenance';

interface ICCCState {
  operationalMode: OperationalMode;
  setOperationalMode: (mode: OperationalMode) => void;
  
  pinnedPanels: string[];
  togglePinPanel: (panelId: string) => void;
  fullscreenPanel: string | null;
  setFullscreenPanel: (panelId: string | null) => void;

  mapFocus: [number, number] | null;
  setMapFocus: (coords: [number, number] | null) => void;

  // Future Architectural Placeholders
  activeDisplayProfile?: string;
  widgetConfig?: Record<string, any>;
  watchLists?: string[];
  bookmarks?: string[];

  // Simulation Controls
  simulationState: 'stopped' | 'playing' | 'paused';
  setSimulationState: (state: 'stopped' | 'playing' | 'paused') => void;
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  activeScenarioId: string | null;
  setActiveScenarioId: (id: string | null) => void;
}

export const useICCCStore = create<ICCCState>((set) => ({
  operationalMode: 'Normal',
  setOperationalMode: (mode) => set({ operationalMode: mode }),
  
  pinnedPanels: [],
  togglePinPanel: (panelId) => set((state) => ({
    pinnedPanels: state.pinnedPanels.includes(panelId)
      ? state.pinnedPanels.filter(id => id !== panelId)
      : [...state.pinnedPanels, panelId]
  })),
  
  fullscreenPanel: null,
  setFullscreenPanel: (panelId) => set({ fullscreenPanel: panelId }),

  mapFocus: null,
  setMapFocus: (coords) => set({ mapFocus: coords }),

  simulationState: 'stopped',
  setSimulationState: (state) => set({ simulationState: state }),
  simulationSpeed: 1,
  setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),
  activeScenarioId: null,
  setActiveScenarioId: (id) => set({ activeScenarioId: id }),
}));
