/**
 * @file Profile Completion Calculator
 * @description Calculates the Citizen Profile Completion score, which is separate
 * from the Journey Readiness score. Evaluates the completeness of the citizen's
 * personal identity information.
 */

import type {
  CitizenProfile,
  ProfileCompletionItem,
  VehicleInformation,
  AccommodationDetails,
} from '@/types/citizen.types';

export interface ProfileCompletionResult {
  /** Completion percentage (0-100) */
  percentage: number;
  /** Individual checklist items */
  items: ProfileCompletionItem[];
}

/**
 * Calculate the Citizen Profile Completion score.
 *
 * Evaluates:
 * - Profile Photo
 * - Government ID (Aadhaar/Passport)
 * - Structured Address
 * - Emergency Contacts
 * - Medical Details
 * - Digital Signature
 * - Vehicle Information (optional, but tracked)
 * - Accommodation Details (optional, but tracked)
 * - Journey Information (optional, but tracked)
 */
export function calculateProfileCompletion(
  citizen: CitizenProfile | null,
  vehicle?: VehicleInformation | null,
  accommodation?: AccommodationDetails | null,
  hasJourney?: boolean
): ProfileCompletionResult {
  if (!citizen) {
    return {
      percentage: 0,
      items: [
        { label: 'Photo', completed: false, icon: 'warning' },
        { label: 'Aadhaar', completed: false, icon: 'warning' },
        { label: 'Emergency Contact', completed: false, icon: 'warning' },
        { label: 'Journey Details', completed: false, icon: 'warning' },
        { label: 'Signature', completed: false, icon: 'warning' },
        { label: 'Vehicle', completed: false, icon: 'warning' },
      ],
    };
  }

  const items: ProfileCompletionItem[] = [];

  // 1. Photo (weight: 15%)
  const hasPhoto = !!citizen.photo;
  items.push({ label: 'Photo', completed: hasPhoto, icon: hasPhoto ? 'check' : 'warning' });

  // 2. Government ID (weight: 20%)
  const hasGovId = citizen.governmentIds.length > 0 && citizen.governmentIds.some(id => !!id.number);
  items.push({ label: 'Aadhaar', completed: hasGovId, icon: hasGovId ? 'check' : 'warning' });

  // 3. Address (weight: 10%)
  const addr = citizen.address;
  const hasAddress = !!(addr.villageTownCity && addr.district && addr.state && addr.pinCode);
  items.push({ label: 'Address', completed: hasAddress, icon: hasAddress ? 'check' : 'warning' });

  // 4. Emergency Contacts (weight: 15%)
  const hasEmergency = !!(citizen.emergencyContacts.primary.name && citizen.emergencyContacts.primary.phone);
  items.push({ label: 'Emergency Contact', completed: hasEmergency, icon: hasEmergency ? 'check' : 'warning' });

  // 5. Medical Details (weight: 5%)
  const hasMedical = hasEmergency; // Basic — having emergency contact counts
  // Could extend to check if medical profile was explicitly reviewed

  // 6. Signature (weight: 10%)
  const hasSignature = !!citizen.signature;
  items.push({ label: 'Signature', completed: hasSignature, icon: hasSignature ? 'check' : 'warning' });

  // 7. Vehicle (weight: 10%)
  const hasVehicle = !!(vehicle && vehicle.vehicleNumber);
  items.push({ label: 'Vehicle', completed: hasVehicle, icon: hasVehicle ? 'check' : 'warning' });

  // 8. Accommodation (weight: 5%)
  const hasAccommodation = !!(accommodation && accommodation.name);
  items.push({ label: 'Accommodation', completed: hasAccommodation, icon: hasAccommodation ? 'check' : 'warning' });

  // 9. Journey Details (weight: 10%)
  const hasJourneyDetails = !!hasJourney;
  items.push({ label: 'Journey Details', completed: hasJourneyDetails, icon: hasJourneyDetails ? 'check' : 'warning' });

  // Calculate weighted percentage
  const weights = [15, 20, 10, 15, 5, 10, 10, 5, 10]; // Must sum to 100
  const completedItems = [hasPhoto, hasGovId, hasAddress, hasEmergency, hasMedical, hasSignature, hasVehicle, hasAccommodation, hasJourneyDetails];
  let percentage = 0;
  for (let i = 0; i < weights.length; i++) {
    if (completedItems[i]) percentage += weights[i];
  }

  return { percentage, items };
}
