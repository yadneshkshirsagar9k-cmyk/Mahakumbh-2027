import { create } from 'zustand';

export interface LiveLocation {
  lat: number;
  lng: number;
  timestamp: number;
  batteryPct: number;
  accuracy: number;
  isOffline: boolean;
}

interface TrackingState {
  locations: Record<string, LiveLocation>; // Keyed by pilgrimId
  updateLocation: (pilgrimId: string, loc: LiveLocation) => void;
  getUpdateFrequency: (crowdDensity: string, isEmergency: boolean) => number;
  getFamilyMembers: (journey: any) => Array<{ id: string; status: string }>;
  getTrackingStatus: (journeyId: string) => string;
}

export const useFamilyTrackingStore = create<TrackingState>((set, get) => ({
  locations: {},
  updateLocation: (pilgrimId, loc) => set((state) => ({
    locations: { ...state.locations, [pilgrimId]: loc }
  })),
  getUpdateFrequency: (density, isEmergency) => {
    if (isEmergency) return 2000;
    if (density === 'High') return 10000;
    if (density === 'Moderate') return 15000;
    return 30000;
  },
  getFamilyMembers: (journey) => {
    if (!journey || !journey.pilgrims) return [];
    // Map actual pilgrims from the journey to tracking status
    return journey.pilgrims.map((p: any, idx: number) => ({
      id: p.fullName || `Pilgrim ${idx + 1}`,
      status: idx === 0 ? 'Safe' : (idx === 2 ? 'Outside Radius' : 'Safe')
    }));
  },
  getTrackingStatus: (journeyId) => {
    return 'Active';
  }
}));
