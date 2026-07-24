/**
 * @file Booking Data Models and API Contracts
 * @description Central type definitions for the Smart Booking Portal,
 * specifying type contracts for lodgings, parking slots, transport verification,
 * and future checkout gateways.
 */

// ============================================================
// DATA MODELS (Section 9)
// ============================================================

export type AccommodationType = 
  | 'government' 
  | 'dharamshala' 
  | 'hotel' 
  | 'tent_city' 
  | 'community' 
  | 'private';

export interface Accommodation {
  id: string;
  name: string;
  type: AccommodationType;
  description: string;
  distanceToGhatsKm: number;
  
  // Future architecture fields
  futureAvailability: boolean;
  futureBedsAvailable: number;
  futurePricePerNightINR: number;
  futureRating: number;
}

export type VehicleCategory = 
  | 'two_wheeler' 
  | 'car' 
  | 'suv' 
  | 'bus' 
  | 'traveller' 
  | 'government' 
  | 'emergency' 
  | 'vip' 
  | 'commercial';

export interface Vehicle {
  id: string;
  ownerName: string;
  registrationNumber: string;
  category: VehicleCategory;
  districtOfOrigin: string;
  pilgrimPassId: string;
  aadhaarNumber: string;
}

export interface VehicleRegistration {
  registrationId: string;
  vehicle: Vehicle;
  approved: boolean;
  issuedPassUrl: string;
}



export interface PilgrimService {
  id: string;
  name: string;
  description: string;
  category: 'qr_pass' | 'medical' | 'volunteer' | 'special_assistance' | 'senior' | 'divyang' | 'group' | 'family';
  icon: string; // lucide icon name
  routePath: string;
}

export type BookingStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'cancelled' 
  | 'completed';

export interface Booking {
  bookingId: string;
  pilgrimId: string;
  serviceType: 'accommodation' | 'special_darshan';
  referenceId: string; // references accommodationId, zoneId, etc.
  bookingDate: string;
  status: BookingStatus;
  totalAmountPaid: number;
}

export interface GroupBooking {
  groupBookingId: string;
  groupName: string;
  leaderName: string;
  totalPilgrimsCount: number;
  verifiedPassIds: string[];
}

export interface FamilyBooking {
  familyBookingId: string;
  headName: string;
  familyMembersCount: number;
  relationsMap: Record<string, string>;
}

export interface QRBooking {
  qrPassId: string;
  encryptedToken: string;
  pilgrimName: string;
  verifiedId: string;
  scannedLogs: { checkpointId: string; timestamp: string }[];
}

// ============================================================
// API CONTRACTS (Section 10)
// ============================================================

export interface AccommodationAPI {
  searchLodgings: (filter: {
    type?: AccommodationType;
    maxDistanceKm?: number;
    checkIn?: string;
  }) => Promise<Accommodation[]>;
  reserveLodging: (accommodationId: string, pilgrimId: string, nights: number) => Promise<Booking>;
}

export interface VehicleRegistrationAPI {
  registerPilgrimVehicle: (vehicleData: Omit<Vehicle, 'id' | 'pilgrimPassId'>) => Promise<VehicleRegistration>;
  getVehiclePass: (registrationNumber: string) => Promise<VehicleRegistration | null>;
}



export interface BookingAPI {
  getPilgrimActiveBookings: (pilgrimId: string) => Promise<Booking[]>;
  cancelBookingTicket: (bookingId: string) => Promise<boolean>;
}

export interface QRAPI {
  generateEncryptedQR: (pilgrimId: string) => Promise<QRBooking>;
  verifyQRCheckIn: (encryptedToken: string, checkpointId: string) => Promise<boolean>;
}

export interface PaymentGatewayAPI {
  initiateTransaction: (amount: number, currency: 'INR', description: string) => Promise<{
    transactionId: string;
    gatewayToken: string;
    redirectUrl: string;
  }>;
  verifyTransactionSignature: (transactionId: string, signature: string) => Promise<boolean>;
}
