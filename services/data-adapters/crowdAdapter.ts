import { UnifiedCrowdPoint } from '@/types/command-centre';

export const crowdAdapter = {
  fromGPS: (rawGpsData: any): UnifiedCrowdPoint => ({
    id: `gps-${rawGpsData.deviceId}`,
    coordinates: [rawGpsData.lon, rawGpsData.lat],
    weight: 1, 
    source: 'gps',
    timestamp: Date.now(),
  }),
  
  fromCCTV: (rawCCTVData: any): UnifiedCrowdPoint => ({
    id: `cctv-${rawCCTVData.cameraId}`,
    coordinates: [rawCCTVData.cameraLon, rawCCTVData.cameraLat],
    weight: rawCCTVData.crowdCount, 
    source: 'cctv',
    timestamp: Date.now(),
  }),
  
  fromSimulation: (simData: any): UnifiedCrowdPoint => ({
    id: `sim-${simData.id}`,
    coordinates: simData.coordinates,
    weight: simData.weight,
    source: 'simulation',
    timestamp: Date.now(),
  }),
};
