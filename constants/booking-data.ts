/**
 * @file Booking portal data constants
 * @description Stores structured datasets for accommodation nodes, vehicle categories,
 * parking slots, pilgrim services, and preview panels.
 */

import { 
  Accommodation, 
  VehicleCategory, 
  PilgrimService 
} from '@/types/booking.types';

// ============================================================
// SERVICE CARDS (Section 2)
// ============================================================

export interface BookingServiceCard {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
  anchorId: string;
}

export const SERVICE_CARDS_DATA: BookingServiceCard[] = [
  {
    id: 'bsc-2',
    title: 'Vehicle Registration',
    description: 'Register transit vehicles to obtain gates access and route passes.',
    icon: 'Car',
    anchorId: 'vehicle-section'
  },
  {
    id: 'bsc-4',
    title: 'Pilgrim Services',
    description: 'Access digital QR passes, medical registrations, and helper guides.',
    icon: 'Sparkles',
    anchorId: 'pilgrim-services-section'
  }
];

// ============================================================
// ACCOMMODATIONS (Section 3)
// ============================================================

export const ACCOMMODATIONS_DATA: Accommodation[] = [
  {
    id: 'acc-1',
    name: 'Sadhugram Municipal Sector 4 Camp',
    type: 'government',
    description: 'Official Government pilgrim dormitories featuring clean water, fans, and common dining halls.',
    distanceToGhatsKm: 1.5,
    futureAvailability: true,
    futureBedsAvailable: 450,
    futurePricePerNightINR: 0, // Free of charge for pilgrims
    futureRating: 4.2
  },
  {
    id: 'acc-2',
    name: 'Shree Gajanan Maharaj Dharamshala',
    type: 'dharamshala',
    description: 'Clean community Dharamshala with double bedrooms, hot water, and lift facility.',
    distanceToGhatsKm: 2.2,
    futureAvailability: true,
    futureBedsAvailable: 45,
    futurePricePerNightINR: 350,
    futureRating: 4.6
  },
  {
    id: 'acc-3',
    name: 'Simhastha Luxury Tent City Sector 1',
    type: 'tent_city',
    description: 'Premium weather-proof Swiss cottages featuring attached washrooms and dining lounge options.',
    distanceToGhatsKm: 0.8,
    futureAvailability: true,
    futureBedsAvailable: 80,
    futurePricePerNightINR: 2800,
    futureRating: 4.8
  },

  {
    id: 'acc-5',
    name: 'Godavari Vista Private Lodgings',
    type: 'private',
    description: 'Serviced apartments featuring double beds and modular kitchens, ideal for family groups.',
    distanceToGhatsKm: 3.5,
    futureAvailability: true,
    futureBedsAvailable: 15,
    futurePricePerNightINR: 1800,
    futureRating: 4.4
  },
  {
    id: 'acc-6',
    name: 'Nashik CBS Budget Hotel rooms',
    type: 'hotel',
    description: 'Standard budget hotel rooms near Central Bus Stand with air-conditioning.',
    distanceToGhatsKm: 4.2,
    futureAvailability: false,
    futureBedsAvailable: 0, // Fully booked
    futurePricePerNightINR: 1200,
    futureRating: 4.1
  }
];

// ============================================================
// VEHICLE CATEGORIES (Section 4)
// ============================================================

export interface VehicleCategoryItem {
  category: VehicleCategory;
  label: string;
  description: string;
  maxCapacity: number;
  tollRequired: boolean;
}

export const VEHICLE_CATEGORIES_DATA: VehicleCategoryItem[] = [
  { category: 'two_wheeler', label: 'Two Wheeler', description: 'Motorcycles and scooters. Inner city transit allowed.', maxCapacity: 2, tollRequired: false },
  { category: 'car', label: 'Private Car / Sedan', description: 'Sedans and hatchbacks. Ring road gate parking allocated.', maxCapacity: 5, tollRequired: true },
  { category: 'suv', label: 'SUV / Jeep', description: 'Off-road and large utility vehicles.', maxCapacity: 8, tollRequired: true },
  { category: 'bus', label: 'Pilgrimage Bus', description: 'Heavy passenger transit bus. Must park at Outer Depots.', maxCapacity: 45, tollRequired: true },
  { category: 'traveller', label: 'Tempo Traveller', description: 'Medium capacity passenger minivans.', maxCapacity: 17, tollRequired: true },
  { category: 'government', label: 'Government Vehicle', description: 'Official municipal or state administration transport.', maxCapacity: 6, tollRequired: false },
  { category: 'emergency', label: 'Emergency Response', description: 'Priority ambulances, fire trucks, and rescue units.', maxCapacity: 8, tollRequired: false },
  { category: 'vip', label: 'VIP Convoy', description: 'Authorized VIP transport passes.', maxCapacity: 5, tollRequired: false },
  { category: 'commercial', label: 'Commercial Cargo', description: 'Essential logistics and food supply trucks.', maxCapacity: 3, tollRequired: true }
];


// ============================================================
// PILGRIM SERVICES (Section 6)
// ============================================================

export const PILGRIM_SERVICES_DATA: PilgrimService[] = [
  { id: 'ps-1', name: 'Digital QR Pass', description: 'Access and print your secure biometric gate credentials and active entry permissions.', category: 'qr_pass', icon: 'QrCode', routePath: '/account/dashboard' },
  { id: 'ps-2', name: 'Health Advisory', description: 'Review Swasthya Yatra health guides, safety checklists, and medical helpline directories.', category: 'medical', icon: 'Heart', routePath: '/health-registration' },
  { id: 'ps-3', name: 'Smart Snan Booking', description: 'Reserve timed ghat bathing slots with live telemetry, water safety metrics, and river flow trackers.', category: 'snan', icon: 'Compass', routePath: '/account/smart-snan' },
  { id: 'ps-4', name: 'Smart Darshan Booking', description: 'Book timed temple entry slots for Trimbakeshwar Shiva Temple with simulated real-time wait times.', category: 'darshan', icon: 'Sparkles', routePath: '/account/smart-darshan' },
  { id: 'ps-5', name: 'Vehicle Permit Pass', description: 'Register private transit vehicles to obtain checkpoint access passes and parking slots.', category: 'vehicle', icon: 'Car', routePath: '/bookings/vehicle' },
  { id: 'ps-6', name: 'Family Registration', description: 'Add and manage accompanying group members, family pilgrims, and document credentials.', category: 'family', icon: 'Users', routePath: '/account/manage-pilgrims' }
];
