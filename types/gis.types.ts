/**
 * @file GIS and Mapping Interfaces
 * @description Future-ready GIS architecture contracts. Specifies type declarations
 * for future mapping providers (Google, Mapbox, OSM, Govt GIS) and live telemetry APIs.
 */

// ============================================================
// MAP PROVIDER CONTRACTS
// ============================================================

export interface MapProviderConfig {
  apiKey: string;
  tileUrl?: string;
  theme: 'light' | 'dark' | 'satellite' | 'hybrid';
  zoomRange: { min: number; max: number };
}

export interface GoogleMapsProvider {
  config: MapProviderConfig;
  loadLibrary: () => Promise<any>;
  renderMap: (elementId: string) => void;
  addKmlLayer: (kmlUrl: string) => void;
}

export interface MapboxProvider {
  config: MapProviderConfig;
  setStyle: (styleUrl: string) => void;
  flyTo: (coords: { lat: number; lng: number }, zoom: number) => void;
  addVectorLayer: (sourceId: string, tilesetUrl: string) => void;
}

export interface OpenStreetMapProvider {
  config: MapProviderConfig;
  setTileLayer: (layerUrl: string) => void;
  locateUser: () => void;
}

export interface GovernmentGISProvider {
  wmsUrl: string;
  layers: string[];
  projection: string;
  fetchSecureLayers: (token: string) => Promise<any>;
}

// ============================================================
// TELEMETRY & METRIC APIS
// ============================================================

export interface LiveCrowdMetric {
  sensorId: string;
  density: 'low' | 'moderate' | 'high' | 'critical';
  pilgrimCount: number;
  flowRatePerSec: number;
  lastUpdated: string;
}

export interface LiveCrowdAPI {
  getCrowdMetricsByZone: (zoneId: string) => Promise<LiveCrowdMetric>;
  getHotspotAnalysis: () => Promise<LiveCrowdMetric[]>;
  subscribeToLiveStream: (callback: (data: LiveCrowdMetric) => void) => () => void;
}

export interface IoTSensorData {
  sensorId: string;
  type: 'camera_feed' | 'wifi_sniffer' | 'rfid_gate' | 'drone_feed';
  status: 'active' | 'offline' | 'error';
  rawPayload: Record<string, any>;
  heartbeat: string;
}

export interface GPSTrackingData {
  deviceOrPilgrimId: string;
  latitude: number;
  longitude: number;
  speedKmh: number;
  bearing: number;
  batteryLevel: number;
  timestamp: string;
}

// ============================================================
// INTEGRATED SERVICE APIS
// ============================================================

export interface QRRegistrationAPI {
  verifyPassToken: (passToken: string) => Promise<{
    isValid: boolean;
    pilgrimId: string;
    allowedGates: string[];
    expiry: string;
  }>;
  recordCheckin: (checkinData: {
    pilgrimId: string;
    gateId: string;
    timestamp: string;
  }) => Promise<boolean>;
}

export interface EmergencyGISAlert {
  incidentId: string;
  type: 'fire' | 'medical' | 'stampede' | 'missing' | 'police_deploy';
  location: { lat: number; lng: number };
  status: 'reported' | 'dispatching' | 'on_scene' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
  reportingUnit: string;
}

export interface EmergencyAPI {
  reportIncident: (alert: Omit<EmergencyGISAlert, 'incidentId' | 'status'>) => Promise<string>;
  dispatchTeam: (incidentId: string, teamId: string) => Promise<boolean>;
  getLiveAlerts: () => Promise<EmergencyGISAlert[]>;
}
