import { create } from 'zustand';
import { MapLayerId } from '@/types/command-centre';

interface CommandCentreState {
  activeLayers: Record<MapLayerId, boolean>;
  systemStatus: {
    websocket: 'connected' | 'disconnected' | 'reconnecting';
    lastUpdated: number | null;
  };
  filters: {
    timeRange: [number, number] | null;
    zones: string[];
    severityThreshold: 'low' | 'medium' | 'high' | 'critical';
  };
  toggleLayer: (layerId: MapLayerId) => void;
  setSystemStatus: (status: Partial<CommandCentreState['systemStatus']>) => void;
  setFilters: (filters: Partial<CommandCentreState['filters']>) => void;
}

export const useCommandCentreStore = create<CommandCentreState>((set) => ({
  activeLayers: {
    'crowd-heatmap': true,
    'traffic-intelligence': true,
    'emergency-intelligence': true,
    'predictive-crowd': false,
  },
  systemStatus: {
    websocket: 'disconnected',
    lastUpdated: null,
  },
  filters: {
    timeRange: null,
    zones: [],
    severityThreshold: 'low',
  },
  toggleLayer: (layerId) =>
    set((state) => ({
      activeLayers: {
        ...state.activeLayers,
        [layerId]: !state.activeLayers[layerId],
      },
    })),
  setSystemStatus: (status) =>
    set((state) => ({
      systemStatus: { ...state.systemStatus, ...status },
    })),
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
}));
