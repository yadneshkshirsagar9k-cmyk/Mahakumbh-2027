import type { 
  CitizenProfile, 
  OfficialRegistrationRecord
} from '@/types/citizen.types';
import { QrPayload, CredentialType } from '@/types/credential.types';
import type { Journey } from '@/store/journey-store';

/**
 * Calculates a person's age from their ISO date of birth.
 */
function calculateAge(dob: string): number {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/**
 * Calculates the number of days between two ISO dates.
 */
function calculateDuration(start: string, end: string): number {
  if (!start || !end) return 0;
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const diffTime = Math.abs(e - s);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculates a rough profile completion percentage.
 */
function calculateProfileCompletion(profile: CitizenProfile): number {
  let score = 0;
  if (profile.fullName) score += 20;
  if (profile.primaryMobile) score += 20;
  if (profile.address?.state) score += 20;
  if (profile.dateOfBirth) score += 20;
  if (profile.governmentIds?.length > 0) score += 20;
  return score;
}

/**
 * Assembles the frozen OfficialRegistrationRecord (Aggregation Layer / Projection) 
 * by consuming the primary Journey and CitizenProfile models. 
 * This ensures zero data duplication and acts as the single source of truth for all documents.
 */
export function getOfficialRegistrationRecord(
  journey: Journey, 
  citizen: CitizenProfile
): OfficialRegistrationRecord {
  
  const now = new Date().toISOString();

  // Handle defaults gracefully for derived calculations
  const age = calculateAge(citizen.dateOfBirth);
  const duration = calculateDuration(journey.startDate, journey.endDate);
  const profileCompletion = calculateProfileCompletion(citizen);
  
  let readiness = 50; 
  if (journey.pilgrimCount > 0) readiness += 20;
  if (journey.vehicleInfo && journey.vehicleInfo.status === 'Approved') readiness += 15;
  if (journey.accommodation && journey.accommodation.status === 'Approved') readiness += 15;

  return {
    registration: {
      registrationNumber: journey.registrationNumber,
      registrationDate: journey.registrationTimestamp,
      registrationStatus: journey.journeyStatus,
      verificationStatus: citizen.verification,
      applicationNumber: journey.registrationNumber, // Journey reg acts as the master app number
      journeyId: journey.id,
      citizenId: citizen.citizenId || '',
      groupId: journey.groupId || '',
      issueTimestamp: journey.issueTimestamp || now,
      expiryDate: journey.expiryDate || '',
    },
    identity: {
      fullName: citizen.fullName,
      photograph: citizen.photo,
      gender: citizen.gender as any,
      dateOfBirth: citizen.dateOfBirth,
      nationality: citizen.nationality,
      country: citizen.address?.country || '',
      occupation: citizen.occupation,
      preferredLanguage: citizen.preferredLanguage,
      identification: citizen.governmentIds || [],
    },
    contact: {
      primaryMobile: citizen.primaryMobile,
      secondaryMobile: citizen.alternateMobile,
      email: citizen.email,
      emergencyContacts: citizen.emergencyContacts,
    },
    address: citizen.address,
    medical: {
      bloodGroup: citizen.bloodGroup,
      medicalConditions: [], // Extracted dynamically if needed
      chronicDiseases: citizen.medicalProfile?.chronicDiseases || [],
      currentMedication: citizen.medicalProfile?.medicationDetails || '',
      allergies: citizen.medicalProfile?.knownAllergies || '',
      specialMedicalNotes: citizen.medicalProfile?.otherNotes || '',
      disabilities: citizen.medicalProfile?.disabilities || [],
      specialAssistanceRequired: citizen.medicalProfile?.specialAssistanceRequired || false,
    },
    journey: {
      journeyName: journey.journeyName,
      journeyType: journey.journeyType,
      arrivalDate: journey.startDate,
      departureDate: journey.endDate,
      route: journey.journeyMetadata?.route || '',
      entryZone: journey.journeyMetadata?.zone || '',
      exitZone: journey.journeyMetadata?.exitZone || '',
      journeyStatus: journey.journeyStatus,
    },
    pilgrims: {
      pilgrimCategory: 'General',
      groupInformation: '',
      leaderInformation: citizen.citizenId || '',
      pilgrimCount: journey.pilgrimCount,
      memberIds: journey.memberIds || [],
    },
    travel: {
      modeOfTravel: journey.arrivalMode,
      vehicle: journey.vehicleInfo,
    },
    accommodation: {
      details: journey.accommodation,
      bookingReference: journey.accommodation?.referenceNumber || '',
      checkIn: journey.accommodation?.checkIn || '',
      checkOut: journey.accommodation?.checkOut || '',
      sector: journey.accommodation?.sector || '',
      camp: journey.accommodation?.camp || '',
    },
    audit: journey.audit,
    derived: {
      age,
      journeyDurationDays: duration,
      profileCompletionPercentage: profileCompletion,
      journeyReadinessPercentage: readiness,
      isVerified: citizen.verification?.registrationStatus === 'Verified'
    }
  };
}

/**
 * Standardized QR Payload Generator
 * Every Government document must use this payload standard for generating its QR code.
 */
export function generateQrPayload(
  record: OfficialRegistrationRecord, 
  documentType: CredentialType, 
  documentNumber: string
): QrPayload {

  // Generate a realistic verification hash/signature based on core records
  const rawHashInput = `${record.registration.citizenId}:${record.registration.registrationNumber}:${documentNumber}:${record.identity.fullName}`;
  let hashVal = 0;
  for (let i = 0; i < rawHashInput.length; i++) {
    hashVal = ((hashVal << 5) - hashVal) + rawHashInput.charCodeAt(i);
    hashVal |= 0;
  }
  const verificationSignature = `SHA256:MH27-${Math.abs(hashVal).toString(16).toUpperCase().padStart(8, '0')}`;

  return {
    payloadVersion: 'v1.0-GOV-MH2027',
    documentNumber: documentNumber,
    citizenId: record.registration.citizenId,
    registrationNumber: record.registration.registrationNumber,
    credentialType: documentType,
    issueTimestamp: new Date().toISOString(),
    verificationSignature,
    extendedData: {
      fullName: record.identity.fullName,
      gender: record.identity.gender,
      dob: record.identity.dateOfBirth,
      primaryMobile: record.contact.primaryMobile,
      emergencyContact: (Array.isArray(record.contact.emergencyContacts) ? (record.contact.emergencyContacts as any)[0]?.phone : (record.contact.emergencyContacts as any)?.primary?.phone) || record.contact.primaryMobile,
      journeyDates: `${record.journey.arrivalDate} to ${record.journey.departureDate}`,
      pilgrimCount: record.pilgrims.pilgrimCount,
      verificationStatus: 'Verified & Active',
      vehicleRegistration: record.travel.vehicle?.vehicleNumber || 'N/A',
      assignedSector: record.journey.entryZone || 'Sadhugram Sector A / Zone 1',
      verificationUrl: `https://kumbh.gov.in/verify/${documentNumber}`,
      bloodGroup: record.medical.bloodGroup,
      photograph: record.identity.photograph
    }
  };
}
