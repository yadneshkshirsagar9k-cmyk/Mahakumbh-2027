export interface BaseOperationalEntity {
  id: string;
  coordinates?: [number, number]; // [longitude, latitude]
  timestamp: number;
  source: string;
  status: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  department?: string;
  metadata?: Record<string, any>;
}

export interface OperationalZone extends BaseOperationalEntity {
  name: string;
  capacity: number;
  currentOccupancy: number;
  predictedOccupancy: number;
  riskLevel: 'safe' | 'warning' | 'danger' | 'critical';
  congestionIndex: number; // 0 to 1
  polygon?: [number, number][]; // Boundary
  activeIncidents: string[];
  assignedResources: string[];
}

export interface OperationalResource extends BaseOperationalEntity {
  type: 'personnel' | 'vehicle' | 'equipment' | 'facility' | 'volunteer';
  name: string;
  department: string;
  assignedZoneId?: string;
  status: 'available' | 'assigned' | 'dispatched' | 'en_route' | 'on_scene' | 'mission_complete' | 'returning' | 'offline';
}

export interface OperationalEvent<T = any> {
  eventId: string;
  eventType: string;
  timestamp: number;
  payload: T;
  source: string;
  simulationFlag?: boolean;
}
