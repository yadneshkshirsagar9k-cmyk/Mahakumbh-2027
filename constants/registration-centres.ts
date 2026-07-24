/**
 * @file Registration Centres dataset
 * @description Centralized data source representing the physical registration network
 * of the Nashik Mahakumbh across Maharashtra. Covers key transport hubs
 * and municipal screening posts.
 */

export type CentreCategory = 
  | 'railway' 
  | 'bus' 
  | 'airport' 
  | 'government' 
  | 'temporary' 
  | 'info' 
  | 'medical' 
  | 'police';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface RegistrationCentre {
  id: string;
  name: string;
  category: CentreCategory;
  address: string;
  district: string;
  city: string;
  operatingHours: string;
  availableServices: string[];
  contactNumber: string;
  accessibility: string;
  coordinates: Coordinates;
  
  // Future architecture fields
  futureLiveStatus: 'active' | 'inactive' | 'busy';
  futureCrowdDensity: 'low' | 'moderate' | 'high' | 'critical';
  futureQueueTime: string; // e.g. "15 mins"
  futureEmergencySupport: boolean;
}

export const CATEGORY_METADATA: Record<CentreCategory, { label: string; color: string; icon: string }> = {
  railway: { label: 'Railway Stations', color: '#1E40AF', icon: 'Train' }, // Blue
  bus: { label: 'MSRTC Bus Stands', color: '#EA580C', icon: 'Bus' }, // Orange
  airport: { label: 'Airports', color: '#7C3AED', icon: 'Plane' }, // Purple
  government: { label: 'Govt Registration Centres', color: '#16A34A', icon: 'Building' }, // Green
  temporary: { label: 'Temporary Booths', color: '#D4A843', icon: 'Tent' }, // Gold
  info: { label: 'Information Centres', color: '#06B6D4', icon: 'Info' }, // Cyan
  medical: { label: 'Medical Screening', color: '#DC2626', icon: 'HeartPulse' }, // Red
  police: { label: 'Police Help Centres', color: '#475569', icon: 'ShieldAlert' } // Slate
};

export const REGISTRATION_CENTRES_DATA: RegistrationCentre[] = [
  {
    id: 'rc-1',
    name: 'Nashik Road Railway Station Centre',
    category: 'railway',
    address: 'Platform 1 Main Exit Gates, Nashik Road',
    district: 'Nashik',
    city: 'Nashik Road',
    operatingHours: '24 Hours (Rotational shifts)',
    availableServices: ['Verification of profile', 'QR Pass printing', 'Biometric matching', 'Medical tag distribution'],
    contactNumber: '+91-253-2462201',
    accessibility: 'Wheelchair access ramp, physical assistance desk',
    coordinates: { lat: 19.9634, lng: 73.8398 },
    futureLiveStatus: 'active',
    futureCrowdDensity: 'moderate',
    futureQueueTime: '10 mins',
    futureEmergencySupport: true
  },
  {
    id: 'rc-2',
    name: 'Thakkar Bazar Bus Stand Help Desk',
    category: 'bus',
    address: 'MSRTC Depot counter 12, CBS Road',
    district: 'Nashik',
    city: 'Nashik City',
    operatingHours: '06:00 AM to 11:00 PM',
    availableServices: ['Pilgrim verification', 'Offline registration guide', 'Emergency assistance'],
    contactNumber: '+91-253-2575631',
    accessibility: 'Level entrance, tactile paving',
    coordinates: { lat: 20.0012, lng: 73.7845 },
    futureLiveStatus: 'active',
    futureCrowdDensity: 'high',
    futureQueueTime: '25 mins',
    futureEmergencySupport: true
  },
  {
    id: 'rc-3',
    name: 'CSMT Mumbai Terminal Desk',
    category: 'railway',
    address: 'Near Booking Counter, CSMT Station, Fort',
    district: 'Mumbai City',
    city: 'Mumbai',
    operatingHours: '05:00 AM to Midnight',
    availableServices: ['Pre-verification', 'Digital pass generation', 'Sadhugram camp slot booking'],
    contactNumber: '+91-22-22621455',
    accessibility: 'Step-free access, Braille signage',
    coordinates: { lat: 18.9402, lng: 72.8354 },
    futureLiveStatus: 'active',
    futureCrowdDensity: 'high',
    futureQueueTime: '15 mins',
    futureEmergencySupport: false
  },
  {
    id: 'rc-4',
    name: 'Pune Junction Pilgrimage Cell',
    category: 'railway',
    address: 'Concourse Area, Platform 1 entrance, Pune Station',
    district: 'Pune',
    city: 'Pune',
    operatingHours: '24 Hours',
    availableServices: ['Pre-verification', 'Medical declaration scan', 'QR pass updates'],
    contactNumber: '+91-20-26126575',
    accessibility: 'Elevators access, priority line desk',
    coordinates: { lat: 18.5289, lng: 73.8744 },
    futureLiveStatus: 'active',
    futureCrowdDensity: 'moderate',
    futureQueueTime: '8 mins',
    futureEmergencySupport: true
  },
  {
    id: 'rc-5',
    name: 'Ozar Airport Nashik Counter',
    category: 'airport',
    address: 'Arrival Terminal Concourse, Ozar',
    district: 'Nashik',
    city: 'Ozar',
    operatingHours: '08:00 AM to 10:00 PM',
    availableServices: ['Fast-track VIP registration', 'RFID tag allocation', 'Pre-booked taxi verification'],
    contactNumber: '+91-253-2580199',
    accessibility: 'Fully accessible premium lounge desk',
    coordinates: { lat: 20.1189, lng: 73.9135 },
    futureLiveStatus: 'active',
    futureCrowdDensity: 'low',
    futureQueueTime: '2 mins',
    futureEmergencySupport: false
  },
  {
    id: 'rc-6',
    name: 'Collectorate Office Government Hub',
    category: 'government',
    address: 'First Floor, Old Collectorate Complex, Court Road',
    district: 'Nashik',
    city: 'Nashik City',
    operatingHours: '10:00 AM to 05:30 PM (Mon-Sat)',
    availableServices: ['Official pass verification', 'Grievance cell registry', 'Bulk group clearances'],
    contactNumber: '+91-253-2578500',
    accessibility: 'Elevators and wide ramps',
    coordinates: { lat: 19.9975, lng: 73.7898 },
    futureLiveStatus: 'active',
    futureCrowdDensity: 'low',
    futureQueueTime: '5 mins',
    futureEmergencySupport: false
  },
  {
    id: 'rc-7',
    name: 'Sadhugram Sector 1 Temporary Booth',
    category: 'temporary',
    address: 'Main Entrance gate, Sector 1 camp area',
    district: 'Nashik',
    city: 'Nashik',
    operatingHours: '24 Hours',
    availableServices: ['Instant biometric pass', 'Akhara entry permits', 'Blanket distribution ticket check'],
    contactNumber: '+91-253-2311022',
    accessibility: 'Ground level mud ramp',
    coordinates: { lat: 20.0156, lng: 73.8012 },
    futureLiveStatus: 'busy',
    futureCrowdDensity: 'critical',
    futureQueueTime: '45 mins',
    futureEmergencySupport: true
  },
  {
    id: 'rc-8',
    name: 'Dr. Babasaheb Ambedkar Airport Desk',
    category: 'airport',
    address: 'Arrival Lounge, Nagpur International Airport',
    district: 'Nagpur',
    city: 'Nagpur',
    operatingHours: '06:00 AM to 11:30 PM',
    availableServices: ['Information guides', 'Pre-verification support', 'Livestream map access'],
    contactNumber: '+91-712-2806200',
    accessibility: 'Fully wheelchair accessible',
    coordinates: { lat: 21.0922, lng: 79.0472 },
    futureLiveStatus: 'active',
    futureCrowdDensity: 'low',
    futureQueueTime: '3 mins',
    futureEmergencySupport: false
  },
  {
    id: 'rc-9',
    name: 'Sainagar Shirdi Station Help Centre',
    category: 'railway',
    address: 'Platform 1 exit gate, Shirdi Station',
    district: 'Ahilyanagar',
    city: 'Shirdi',
    operatingHours: '24 Hours',
    availableServices: ['Pre-verification', 'Shirdi darshan integration', 'Kumbh route map guidance'],
    contactNumber: '+91-2423-255101',
    accessibility: 'Wheelchair access support desk',
    coordinates: { lat: 19.7712, lng: 74.4912 },
    futureLiveStatus: 'active',
    futureCrowdDensity: 'moderate',
    futureQueueTime: '12 mins',
    futureEmergencySupport: true
  },

  {
    id: 'rc-11',
    name: 'Ram Kund Police Help Post',
    category: 'police',
    address: 'Ghat Entrance Post, adjacent to Ram Kund steps',
    district: 'Nashik',
    city: 'Nashik',
    operatingHours: '24 Hours',
    availableServices: ['Missing persons desk', 'Loudspeaker emergency broadast', 'Crowd flow instructions'],
    contactNumber: '+91-253-2512333',
    accessibility: 'Open pedestal',
    coordinates: { lat: 20.0058, lng: 73.7919 },
    futureLiveStatus: 'active',
    futureCrowdDensity: 'critical',
    futureQueueTime: '5 mins',
    futureEmergencySupport: true
  },
  {
    id: 'rc-delhi',
    name: 'New Delhi Railway Station Kumbh Cell',
    category: 'railway',
    address: 'Platform 1 Concourse Area, New Delhi Station',
    district: 'New Delhi',
    city: 'Delhi',
    operatingHours: '24 Hours',
    availableServices: ['National pre-registration', 'Medical advisory printing', 'RFID tag pre-allocation'],
    contactNumber: '+91-11-23340000',
    accessibility: 'Escalators and elevator access, tactile mapping',
    coordinates: { lat: 28.6418, lng: 77.2197 },
    futureLiveStatus: 'active',
    futureCrowdDensity: 'moderate',
    futureQueueTime: '5 mins',
    futureEmergencySupport: true
  },
  {
    id: 'rc-kolkata',
    name: 'Howrah Junction Kolkata Help Desk',
    category: 'railway',
    address: 'Main Booking Hall entrance, Howrah Station',
    district: 'Howrah',
    city: 'Kolkata',
    operatingHours: '06:00 AM to 10:00 PM',
    availableServices: ['Spiritual travel verification', 'Offline pass queries'],
    contactNumber: '+91-33-26410022',
    accessibility: 'Priority queue assist, step-free access',
    coordinates: { lat: 22.5834, lng: 88.3409 },
    futureLiveStatus: 'active',
    futureCrowdDensity: 'low',
    futureQueueTime: '3 mins',
    futureEmergencySupport: false
  },
  {
    id: 'rc-bengaluru',
    name: 'KSR Bengaluru Station Help Desk',
    category: 'railway',
    address: 'Main Entrance Gate 1, Majestic, Bengaluru',
    district: 'Bengaluru',
    city: 'Bengaluru',
    operatingHours: '05:00 AM to 11:30 PM',
    availableServices: ['Pre-verification clearances', 'Health tag checks'],
    contactNumber: '+91-80-22200033',
    accessibility: 'Step-free ramp entry, audio advisory desk',
    coordinates: { lat: 12.9780, lng: 77.5700 },
    futureLiveStatus: 'active',
    futureCrowdDensity: 'moderate',
    futureQueueTime: '8 mins',
    futureEmergencySupport: true
  },
  {
    id: 'rc-chennai',
    name: 'Chennai Central Pilgrimage Counter',
    category: 'railway',
    address: 'Near Main Waiting Hall, Chennai Central Station',
    district: 'Chennai',
    city: 'Chennai',
    operatingHours: '06:00 AM to 11:00 PM',
    availableServices: ['Biometric pre-checks', 'QR gatepass confirmation'],
    contactNumber: '+91-44-25350044',
    accessibility: 'Wheelchair guidance desk',
    coordinates: { lat: 13.0827, lng: 80.2707 },
    futureLiveStatus: 'active',
    futureCrowdDensity: 'low',
    futureQueueTime: '2 mins',
    futureEmergencySupport: false
  },
  {
    id: 'rc-ahmedabad',
    name: 'Kalupur Station Ahmedabad Help Cell',
    category: 'railway',
    address: 'Platform 1 Main Exit Lobby, Ahmedabad Station',
    district: 'Ahmedabad',
    city: 'Ahmedabad',
    operatingHours: '24 Hours',
    availableServices: ['Special group permits', 'Pre-registration validation'],
    contactNumber: '+91-79-22110055',
    accessibility: 'Tactile paths, step-free access',
    coordinates: { lat: 23.0280, lng: 72.6010 },
    futureLiveStatus: 'active',
    futureCrowdDensity: 'moderate',
    futureQueueTime: '6 mins',
    futureEmergencySupport: true
  }
];
