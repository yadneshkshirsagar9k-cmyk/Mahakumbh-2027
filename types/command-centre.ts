export type MapLayerId = 'crowd-heatmap' | 'traffic-intelligence' | 'emergency-intelligence' | 'predictive-crowd' | string;

export interface UnifiedCrowdPoint {
  id: string;
  coordinates: [number, number]; // [longitude, latitude]
  weight: number;
  source: 'gps' | 'cctv' | 'qr' | 'wifi' | 'simulation';
  timestamp: number;
}

export interface UnifiedTrafficSegment {
  id: string;
  path: [number, number][]; // LineString
  speed: number;
  capacity: number;
  status: 'normal' | 'congested' | 'blocked' | 'diverted';
}

export interface UnifiedIncident {
  id: string;
  coordinates: [number, number];
  type: 'medical' | 'police' | 'fire' | 'sos' | 'stampede-risk';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  status: 'active' | 'dispatched' | 'resolved';
}

export interface PredictedCrowdPoint {
  id: string;
  coordinates: [number, number];
  weight: number;
  timeOffsetMinutes: 15 | 30 | 45 | 60;
}
