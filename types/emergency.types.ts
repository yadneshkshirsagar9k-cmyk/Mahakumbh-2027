/**
 * @file Emergency Data Models and API Interfaces
 * @description Central type definitions for the Emergency Management Portal,
 * defining contracts for safety agencies, disaster alerts, and live reporting endpoints.
 */

// ============================================================
// DATA MODELS (Section 10)
// ============================================================

export type EmergencyCategory = 
  | 'police' 
  | 'medical' 
  | 'ambulance' 
  | 'fire' 
  | 'women' 
  | 'lost_found' 
  | 'disaster' 
  | 'child' 
  | 'senior' 
  | 'tourist'
  | 'government'
  | 'hospital';

export interface EmergencyContact {
  id: string;
  department: string;
  category: EmergencyCategory;
  number: string;
  availability: '24 Hours' | 'Day Shift' | 'On Call';
  coverage: string; // e.g., "All Maharashtra", "Nashik District Only"
}

export interface EmergencyService {
  id: string;
  title: string;
  description: string;
  category: EmergencyCategory;
  color: 'red' | 'amber' | 'blue' | 'slate';
  icon: string; // lucide icon name
}

export interface MedicalCamp {
  campId: string;
  name: string;
  sector: string;
  doctorInCharge: string;
  bedsAvailable: number;
  contactNumber: string;
  coordinates: { lat: number; lng: number };
}

export interface PoliceStation {
  stationId: string;
  name: string;
  division: string;
  inChargeRank: string;
  personnelStrength: number;
  patrolVehicles: number;
  coordinates: { lat: number; lng: number };
}

export interface Hospital {
  hospitalId: string;
  name: string;
  bedsTotal: number;
  icuBedsAvailable: number;
  traumaCentre: boolean;
  coordinates: { lat: number; lng: number };
}

export interface EmergencyAlert {
  id: string;
  title: string;
  type: 'stampede' | 'flood' | 'fire' | 'weather' | 'medical' | 'security' | 'power';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  affectedArea: string;
  instructions: string;
}

export interface LostFoundReport {
  reportId: string;
  type: 'missing' | 'found';
  fullName: string;
  age: number;
  gender: string;
  lastSeenLocation: string;
  lastSeenTime: string;
  contactPerson: string;
  status: 'pending' | 'searching' | 'resolved';
}

export interface SafetyGuideline {
  id: string;
  category: 'crowd' | 'river' | 'heat' | 'medical' | 'women' | 'child' | 'night' | 'evacuation';
  title: string;
  instructions: string[];
}

export interface DisasterType {
  id: string;
  name: string;
  description: string;
  safetyInstructions: string[];
  responseProtocol: string[];
}

export interface ResponseTeam {
  teamId: string;
  division: 'NDRF' | 'SDRF' | 'Civil Defense' | 'Municipal Corporation' | 'Red Cross';
  assignedZone: string;
  activePersonnel: number;
  currentTask: string;
  status: 'idle' | 'en_route' | 'on_scene';
}

// ============================================================
// API CONTRACTS (Section 11)
// ============================================================

export interface EmergencyBackendAPI {
  triggerSOS: (sosPayload: {
    pilgrimId?: string;
    coordinates: { lat: number; lng: number };
    type: EmergencyCategory;
    timestamp: string;
  }) => Promise<{
    incidentId: string;
    acknowledged: boolean;
    dispatchStatus: string;
    etaMinutes: number;
  }>;
  reportMissingPerson: (report: Omit<LostFoundReport, 'reportId' | 'status'>) => Promise<string>;
  getLiveActiveIncidents: () => Promise<EmergencyAlert[]>;
}

export interface PoliceAPI {
  fetchDeploymentStatus: (sectorId: string) => Promise<{
    activePatrols: number;
    checkpointsSecure: boolean;
    incidentCountPastHour: number;
  }>;
  broadcastPoliceAlert: (message: string) => Promise<boolean>;
}

export interface MedicalAPI {
  fetchCampCapacities: () => Promise<MedicalCamp[]>;
  reportMedicalEmergency: (campId: string, alertLevel: string) => Promise<boolean>;
}

export interface HospitalAPI {
  fetchBedAvailability: (hospitalId: string) => Promise<{
    icuAvailable: number;
    generalAvailable: number;
    ventilatorsAvailable: number;
  }>;
}

export interface GISEmergencyAPI {
  fetchEmergencyLayerKml: (layerName: 'hospitals' | 'evacuation_routes' | 'hazard_zones') => string;
  updateLocationCoordinates: (deviceId: string, lat: number, lng: number) => Promise<boolean>;
}

export interface GovernmentAlertAPI {
  sendSMSBroadcast: (zoneId: string, message: string) => Promise<number>; // returns total sent
  triggerSirens: (zoneId: string) => Promise<boolean>;
}
