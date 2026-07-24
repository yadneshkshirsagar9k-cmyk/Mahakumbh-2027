/**
 * @file Emergency portal data constants
 * @description Stores structured datasets for SOS actions, contact phonebooks,
 * safety guidelines, help camps, and disaster protocols.
 */

import { 
  EmergencyService, 
  EmergencyContact, 
  SafetyGuideline, 
  DisasterType,
  MedicalCamp,
  PoliceStation,
  Hospital
} from '@/types/emergency.types';

// ============================================================
// QUICK SOS ACTIONS (Section 2)
// ============================================================

export const SOS_ACTIONS_DATA: EmergencyService[] = [
  {
    id: 'sos-1',
    title: 'Police SOS',
    description: 'Trigger instant location coordinates check to nearest sector post.',
    category: 'police',
    color: 'blue',
    icon: 'ShieldAlert'
  },
  {
    id: 'sos-2',
    title: 'Medical Emergency',
    description: 'Alert the central medical desk for cardiac or acute trauma response.',
    category: 'medical',
    color: 'red',
    icon: 'HeartPulse'
  },
  {
    id: 'sos-3',
    title: 'Ambulance Dispatch',
    description: 'Deploy nearest emergency transit ambulance to your location.',
    category: 'ambulance',
    color: 'red',
    icon: 'Ambulance'
  },
  {
    id: 'sos-4',
    title: 'Fire Brigade',
    description: 'Alert fire rescue squads for localized tent or ghat fire hazards.',
    category: 'fire',
    color: 'amber',
    icon: 'Flame'
  },
  {
    id: 'sos-5',
    title: 'Women Safety',
    description: 'Instant link to local Damini squads and security task force.',
    category: 'women',
    color: 'red',
    icon: 'UserCheck'
  },
  {
    id: 'sos-6',
    title: 'Lost & Found desk',
    description: 'Report lost pilgrims or register found senior citizens.',
    category: 'lost_found',
    color: 'slate',
    icon: 'Users'
  },
  {
    id: 'sos-7',
    title: 'Disaster Management',
    description: 'Connect directly with SDRF/NDRF central division controls.',
    category: 'disaster',
    color: 'amber',
    icon: 'AlertOctagon'
  },
  {
    id: 'sos-8',
    title: 'Child Helpline',
    description: 'Instant alert to pediatric lost tracking and child safety teams.',
    category: 'child',
    color: 'slate',
    icon: 'Smile'
  },
  {
    id: 'sos-9',
    title: 'Senior Citizen Help',
    description: 'Priority medical checkups and transit cart deployment requests.',
    category: 'senior',
    color: 'blue',
    icon: 'HelpCircle'
  },
  {
    id: 'sos-10',
    title: 'Tourist Assistance',
    description: 'Language translators and route clearance help lines.',
    category: 'tourist',
    color: 'slate',
    icon: 'Compass'
  }
];

// ============================================================
// EMERGENCY CONTACTS DIRECTORY (Section 3)
// ============================================================

export const EMERGENCY_CONTACTS_DATA: EmergencyContact[] = [
  {
    id: 'ec-1',
    department: 'Kumbh Police Central Control Room',
    category: 'police',
    number: '112 / +91-253-2578900',
    availability: '24 Hours',
    coverage: 'Nashik Metropolitan Area'
  },
  {
    id: 'ec-2',
    department: 'Municipal Ambulance Service Desk',
    category: 'ambulance',
    number: '108 / +91-253-2315600',
    availability: '24 Hours',
    coverage: 'Nashik & Trimbakeshwar Sectors'
  },
  {
    id: 'ec-3',
    department: 'Simhastha Joint Fire Control',
    category: 'fire',
    number: '101 / +91-253-2597700',
    availability: '24 Hours',
    coverage: 'Nashik District Wide'
  },
  {
    id: 'ec-4',
    department: 'Civil Trauma Hospital Emergency',
    category: 'hospital',
    number: '+91-253-2576101',
    availability: '24 Hours',
    coverage: 'Nashik Road & CBS Sectors'
  },
  {
    id: 'ec-5',
    department: 'NDRF Zone 5 Deployment Command',
    category: 'disaster',
    number: '+91-22-29202570',
    availability: '24 Hours',
    coverage: 'All Maharashtra State'
  },
  {
    id: 'ec-6',
    department: 'Damini Women Security Squad',
    category: 'women',
    number: '1091 / +91-253-2570888',
    availability: '24 Hours',
    coverage: 'Sadhugram & Ghat Zones'
  },
  {
    id: 'ec-7',
    department: 'Official Pilgrim Info Hotline',
    category: 'tourist',
    number: '1913 / +91-253-2572522',
    availability: 'Day Shift',
    coverage: 'Simhastha Circuit Core'
  },
  {
    id: 'ec-8',
    department: 'Child Rescue Tracking Desk',
    category: 'child',
    number: '1098 / +91-253-2580108',
    availability: '24 Hours',
    coverage: 'Sector 4 Transit Hubs'
  },
  {
    id: 'ec-9',
    department: 'Maharashtra State Crisis Control',
    category: 'government',
    number: '+91-22-22027990',
    availability: '24 Hours',
    coverage: 'All Maharashtra State'
  },
  {
    id: 'ec-10',
    department: 'Apex Medical Coordination Cell',
    category: 'medical',
    number: '+91-253-2512140',
    availability: '24 Hours',
    coverage: 'Nashik Metropolitan Area'
  }
];

// ============================================================
// HELP CENTRES GEOLOCATIONS (Section 4)
// ============================================================

export interface HelpCentre {
  id: string;
  name: string;
  category: 'police' | 'hospital' | 'camp' | 'desk' | 'info' | 'lost_found';
  address: string;
  contact: string;
  coordinates: { lat: number; lng: number };
}

export const HELP_CENTRES_DATA: HelpCentre[] = [
  {
    id: 'hc-1',
    name: 'Sadhugram Central Medical Camp',
    category: 'camp',
    address: 'Sector 4 Camp Grounds',
    contact: '+91-253-2311022',
    coordinates: { lat: 20.0156, lng: 73.8012 }
  },
  {
    id: 'hc-2',
    name: 'Ram Kund Police Help Booth',
    category: 'police',
    address: 'Ghat entry barrier 1, adjacent to holy steps',
    contact: '+91-253-2512333',
    coordinates: { lat: 20.0058, lng: 73.7919 }
  },
  {
    id: 'hc-3',
    name: 'Trimbakeshwar Government Civil Hospital',
    category: 'hospital',
    address: 'Main Road, adjacent to Trimbakeshwar Bus Stand',
    contact: '+91-253-2462201',
    coordinates: { lat: 19.9398, lng: 73.5385 }
  },
  {
    id: 'hc-4',
    name: 'Sector 4 Lost & Found biometric desk',
    category: 'lost_found',
    address: 'CBS Road intersection Booth 9',
    contact: '+91-253-2580108',
    coordinates: { lat: 20.0012, lng: 73.7845 }
  },
  {
    id: 'hc-5',
    name: 'Thakkar Bazar Information Desk',
    category: 'info',
    address: 'MSRTC Concourse Terminal, CBS',
    contact: '+91-253-2575631',
    coordinates: { lat: 19.9975, lng: 73.7898 }
  }
];

// ============================================================
// SAFETY GUIDELINES (Section 6)
// ============================================================

export const SAFETY_GUIDELINES_DATA: SafetyGuideline[] = [
  {
    id: 'sg-1',
    category: 'crowd',
    title: 'Crowd Safety & Queue Discipline',
    instructions: [
      'Always follow the metal barricading tracks. Do not climb rails.',
      'Identify exits and first-aid tents upon entering the darshan holds.',
      'In a crowd surge, fold arms across the chest and move diagonally with the flow.'
    ]
  },
  {
    id: 'sg-2',
    category: 'river',
    title: 'River Safety & Holy Bathing Rules',
    instructions: [
      'Bathing is permitted ONLY within designated safety chains at Ram Kund.',
      'Do not dive from high bridges or structural ghat platforms.',
      'Wet concrete is slippery. Move slowly and do not run on the river steps.'
    ]
  },
  {
    id: 'sg-3',
    category: 'heat',
    title: 'Heatstroke Prevention & Hydration',
    instructions: [
      'Drink water regularly from verified municipal filtration hubs.',
      'Avoid standing in unshaded outdoor squares between 12:00 PM and 3:00 PM.',
      'Wear light-colored, breathable cotton clothing and cover your head.'
    ]
  },
  {
    id: 'sg-4',
    category: 'medical',
    title: 'Basic Medical Assistance',
    instructions: [
      'Report symptoms of thermal fatigue or breathing difficulty instantly.',
      'Always keep essential personal medications and health pass documents ready.',
      'Medical tag trackers are available at all entry booths.'
    ]
  }
];

// ============================================================
// DISASTER MANAGEMENT (Section 7)
// ============================================================

export const DISASTER_MANAGEMENT_DATA: DisasterType[] = [
  {
    id: 'dm-1',
    name: 'Stampede Mitigation',
    description: 'Standard operational protocol during critical crowd surges or stampedes.',
    safetyInstructions: [
      'Do not stand still against the crowd flow; slide sideways.',
      'Keep feet firmly planted. If you fall, roll into a protective ball.',
      'Avoid screams to prevent mass vocal panic.'
    ],
    responseProtocol: [
      'Damini security teams will lock entry barriers to reduce crowd input.',
      'Sound broadcast channels will direct pilgrims to empty side-sectors.'
    ]
  },
  {
    id: 'dm-2',
    name: 'River Flood Protocols',
    description: 'Evacuation guidelines during high Godavari river water levels.',
    safetyInstructions: [
      'Immediately leave the ghat step platforms if warning sirens sound.',
      'Ascend to high-ground sectors (Sector 4 Outer Rings).',
      'Do not attempt to retrieve floating objects from current channels.'
    ],
    responseProtocol: [
      'SDRF water rescue teams will lock ghat barrier gates.',
      'Emergency alarms trigger automated sirens across the municipal grids.'
    ]
  },
  {
    id: 'dm-3',
    name: 'Camp Fire Outbreaks',
    description: 'Crisis guidelines for tent camps or kitchen fires.',
    safetyInstructions: [
      'Crawl under smoke layers to avoid carbon monoxide inhalation.',
      'Wrap in thick cotton blankets if clothing catches fire; drop and roll.',
      'Identify localized sand bucket bins located in Sadhugram sectors.'
    ],
    responseProtocol: [
      'Camp fire hydrant systems deploy water cannons.',
      'Sector isolation protocols cut local power grids to prevent electrical fires.'
    ]
  }
];
