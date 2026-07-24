import { create } from 'zustand';
import { UnifiedIncident, UnifiedCrowdPoint, UnifiedTrafficSegment, PredictedCrowdPoint } from '@/types/command-centre';
import { OperationalResource, OperationalEvent } from '@/types/operational-models';

interface SimulationOverlayState {
  incidents: UnifiedIncident[];
  crowdPoints: UnifiedCrowdPoint[];
  trafficSegments: UnifiedTrafficSegment[];
  resources: OperationalResource[];
  timelineEvents: OperationalEvent[];
  notifications: OperationalEvent[];
  predictions: PredictedCrowdPoint[];
  
  // Setters
  setIncidents: (data: UnifiedIncident[]) => void;
  setCrowdPoints: (data: UnifiedCrowdPoint[]) => void;
  setTrafficSegments: (data: UnifiedTrafficSegment[]) => void;
  setResources: (data: OperationalResource[]) => void;
  setTimelineEvents: (data: OperationalEvent[]) => void;
  setNotifications: (data: OperationalEvent[]) => void;
  setPredictions: (data: PredictedCrowdPoint[]) => void;
  
  resetOverlay: () => void;
}

export const useSimulationOverlayStore = create<SimulationOverlayState>((set) => ({
  incidents: [],
  crowdPoints: [],
  trafficSegments: [],
  resources: [],
  timelineEvents: [],
  notifications: [],
  predictions: [],
  
  setIncidents: (data) => set({ incidents: data }),
  setCrowdPoints: (data) => set({ crowdPoints: data }),
  setTrafficSegments: (data) => set({ trafficSegments: data }),
  setResources: (data) => set({ resources: data }),
  setTimelineEvents: (data) => set({ timelineEvents: data }),
  setNotifications: (data) => set({ notifications: data }),
  setPredictions: (data) => set({ predictions: data }),
  
  resetOverlay: () => set({
    incidents: [],
    crowdPoints: [],
    trafficSegments: [],
    resources: [],
    timelineEvents: [],
    notifications: [],
    predictions: [],
  })
}));
