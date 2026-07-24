import { UnifiedIncident } from '@/types/command-centre';

export const incidentAdapter = {
  fromSOS: (rawSos: any): UnifiedIncident => ({
    id: `sos-${rawSos.id}`,
    coordinates: [rawSos.lon, rawSos.lat],
    type: 'sos',
    severity: 'high',
    timestamp: rawSos.timestamp,
    status: 'active',
  }),
  fromSimulation: (simIncident: any): UnifiedIncident => ({
    ...simIncident
  })
};
