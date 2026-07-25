/**
 * @file Citizen Identity & Journey Data Types
 * @description Production-grade type definitions for the Nashik–Trimbakeshwar Mahakumbh 2027
 * Smart Pilgrim Management Platform — Phase 1: Citizen Identity & Journey Data System.
 *
 * These types form the canonical data model for citizen profiles, pilgrim registrations,
 * vehicle permits, accommodation records, and journey metadata. Every major record
 * includes immutable audit metadata for future government verification workflows.
 */

// ============================================================
// AUDIT METADATA
// ============================================================

/** Immutable audit trail attached to every major record. */
export interface AuditMetadata {
  /** ISO timestamp when the record was first created */
  createdAt: string;
  /** ISO timestamp of the most recent update */
  updatedAt: string;
  /** Identity of the creator (e.g. "Self Registration", "Registration Officer") */
  createdBy: string;
  /** Identity of the last updater */
  updatedBy: string;
}

// ============================================================
// GOVERNMENT ID
// ============================================================

export type GovernmentIdType = 'Aadhaar' | 'Passport' | 'Driving Licence' | 'Voter ID' | 'PAN';

export type IdVerificationStatus = 'Verified' | 'Pending' | 'Not Verified' | 'Rejected';

/** Full metadata for a single government-issued identity document. */
export interface GovernmentIdMetadata {
  /** Type of the identity document */
  type: GovernmentIdType;
  /** Raw ID number (stored securely, never displayed in full on dashboards) */
  number: string;
  /** Current verification status */
  verificationStatus: IdVerificationStatus;
  /** Authority that performed the verification */
  verifiedBy: string;
  /** Method used for verification (e.g. "Document Upload", "Biometric", "In-Person") */
  verificationMethod: string;
  /** ISO timestamp when verification was completed */
  verificationTimestamp: string;
  /** Masked display version for dashboard summaries (e.g. "XXXX XXXX 4589") */
  maskedDisplay: string;
}

// ============================================================
// CITIZEN VERIFICATION STATUS
// ============================================================

export type VerificationState = 'Pending' | 'Verified' | 'Rejected' | 'Documents Pending' | 'Journey Ready';

/** Citizen-level verification tracking for future backend integration. */
export interface CitizenVerificationStatus {
  registrationStatus: VerificationState;
  identityVerification: VerificationState;
  documentVerification: VerificationState;
  journeyApproval: VerificationState;
  currentStage: string;
}

// ============================================================
// STRUCTURED ADDRESS
// ============================================================

/** Indian Government record-style structured address. */
export interface StructuredAddress {
  houseFlatNumber: string;
  buildingSociety: string;
  streetRoad: string;
  areaLocality: string;
  villageTownCity: string;
  talukaTehsil: string;
  district: string;
  state: string;
  country: string;
  pinCode: string;
}

// ============================================================
// MEDICAL PROFILE
// ============================================================

/** Structured medical information for emergency preparedness. */
export interface MedicalProfile {
  /** Array of chronic diseases */
  chronicDiseases: string[];
  /** Array of specific disabilities */
  disabilities: string[];
  /** Generic flag for special assistance */
  specialAssistanceRequired: boolean;
  diabetes: boolean;
  heartDisease: boolean;
  hypertension: boolean;
  asthma: boolean;
  epilepsy: boolean;
  physicalDisability: boolean;
  visualImpairment: boolean;
  hearingImpairment: boolean;
  wheelchairRequired: boolean;
  pregnant: boolean;
  regularMedication: boolean;
  medicationDetails: string;
  knownAllergies: string;
  doctorName: string;
  doctorContact: string;
  otherNotes: string;
}

// ============================================================
// EMERGENCY CONTACT
// ============================================================

export type EmergencyContactRole = 'Primary' | 'Secondary' | 'Doctor' | 'Local Contact';

/** A single emergency contact entry. */
export interface EmergencyContactDetail {
  name: string;
  relationship: string;
  phone: string;
  notes: string;
}

/** Complete emergency contact set with up to four contacts. */
export interface EmergencyContacts {
  primary: EmergencyContactDetail;
  secondary: EmergencyContactDetail;
  doctor: EmergencyContactDetail;
  localContact: EmergencyContactDetail;
}

// ============================================================
// OCCUPATION
// ============================================================

export type OccupationCategory =
  | 'Student'
  | 'Private Employee'
  | 'Government Employee'
  | 'Business'
  | 'Self-Employed'
  | 'Farmer'
  | 'Retired'
  | 'Volunteer'
  | 'Religious Organization'
  | 'Other';

// ============================================================
// NATIONALITY
// ============================================================

export type NationalityType = 'Indian Citizen' | 'Foreign National';

// ============================================================
// CITIZEN PROFILE
// ============================================================

/** Comprehensive citizen identity profile for the primary registrant. */
export interface CitizenProfile {
  /** Unique Government Citizen ID (e.g. CID-MHK-2027-001) */
  citizenId?: string;
  /** Passport-style profile photograph (base64 data URI) */
  photo: string;
  /** Full legal name as per Government records */
  fullName: string;
  /** Gender */
  gender: 'Male' | 'Female' | 'Other' | '';
  /** Date of Birth (ISO date string YYYY-MM-DD) */
  dateOfBirth: string;
  /** Primary mobile number */
  primaryMobile: string;
  /** Alternate mobile number */
  alternateMobile: string;
  /** Email address */
  email: string;
  /** Structured residential address */
  address: StructuredAddress;
  /** Nationality */
  nationality: NationalityType;
  /** Preferred language for communications */
  preferredLanguage: string;
  /** Blood group */
  bloodGroup: string;
  /** Structured occupation category */
  occupation: OccupationCategory;
  /** Custom occupation text (used when occupation is 'Other') */
  occupationOther: string;
  /** Government identity documents */
  governmentIds: GovernmentIdMetadata[];
  /** Emergency contacts */
  emergencyContacts: EmergencyContacts;
  /** Digital handwritten signature (base64 data URI) */
  signature: string;
  /** Citizen-level verification tracking */
  verification: CitizenVerificationStatus;
  /** Medical profile */
  medicalProfile?: MedicalProfile;
  /** Audit trail */
  audit: AuditMetadata;
}

// ============================================================
// PILGRIM PROFILE
// ============================================================

export type PilgrimRelationship =
  | 'Self'
  | 'Spouse'
  | 'Father'
  | 'Mother'
  | 'Son'
  | 'Daughter'
  | 'Brother'
  | 'Sister'
  | 'Relative'
  | 'Friend'
  | 'Group Member';

/** Complete profile for an accompanying pilgrim. */
export interface PilgrimProfile {
  /** Pilgrim category (e.g. Regular, VIP, Volunteer) */
  pilgrimCategory: string;
  /** Optional group information if part of a larger contingent */
  groupInformation: string;
  /** Government-style Pilgrim ID (e.g. PID-MHK-2027-000001) — immutable after creation */
  pilgrimId: string;
  /** Profile photograph (base64 data URI) */
  photo: string;
  /** Full legal name */
  fullName: string;
  /** Relationship to the primary registrant */
  relationship: PilgrimRelationship;
  /** Date of Birth (ISO date string YYYY-MM-DD) */
  dateOfBirth: string;
  /** Gender */
  gender: 'Male' | 'Female' | 'Other' | '';
  /** Blood group */
  bloodGroup: string;
  /** Government identity document */
  governmentId: GovernmentIdMetadata;
  /** Medical profile */
  medical: MedicalProfile;
  /** Mobile number */
  mobile: string;
  /** Emergency contact (primary) */
  emergencyContact: EmergencyContactDetail;
  /** Structured address */
  address: StructuredAddress;
  /** Preferred language */
  preferredLanguage: string;
  /** Nationality */
  nationality: NationalityType;
  /** Audit trail */
  audit: AuditMetadata;
}


// ============================================================
// GOVERNMENT APPLICATION FRAMEWORK
// ============================================================

export interface DocumentMetadata {
  id: string;
  title: string;
  fileName: string;
  status: 'ready' | 'pending' | 'unavailable';
}

export interface GovernmentApplication {
  applicationId: string;
  serviceType: 'Vehicle' | 'Accommodation' | 'Darshan' | 'Snan' | '';
  status: BookingStatus;
  referenceNumber: string;
  applicationDate: string;
  lastUpdated: string;
  currentStage: string;
  availableDocuments: DocumentMetadata[];
  activityTimeline: TimelineEvent[];
}

// ============================================================
// VEHICLE INFORMATION

// ============================================================

export type VehicleType =
  | 'Car' | 'car'
  | 'SUV' | 'suv'
  | 'Van'
  | 'Mini Bus'
  | 'Bus' | 'bus'
  | 'Two Wheeler' | 'two_wheeler'
  | 'Auto Rickshaw'
  | 'Tempo Traveller' | 'traveller'
  | 'government'
  | 'emergency'
  | 'vip'
  | 'commercial'
  | 'Other';

export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid' | 'Other';

/** Expanded vehicle information with driver and parking details. */
export interface VehicleInformation extends Partial<GovernmentApplication> {
  /** Type of vehicle */
  vehicleType: VehicleType | '';
  /** Vehicle registration number (e.g. MH-04-AB-1234) */
  vehicleNumber: string;
  /** Name of the driver */
  driverName: string;
  /** Driver mobile number */
  driverMobile: string;
  /** Fuel type */
  fuelType: FuelType | '';

  /** FasTag ID (optional) */
  fasTagId: string;
  /** Immutable Vehicle Pass ID (e.g. VP-MH27-00485) — generated once */
  vehiclePassId: string;
  /** RC (Registration Certificate) Number */
  rcNumber?: string;
  /** Chassis Number */
  chassisNumber?: string;
  /** Engine Number */
  engineNumber?: string;
  /** Driver License Number */
  drivingLicenseNumber?: string;
  /** Audit trail */
  audit: AuditMetadata;
}

// ============================================================
// ACCOMMODATION DETAILS
// ============================================================

export type AccommodationType =
  | 'Hotel'
  | 'Tent City'
  | 'Government Camp'
  | 'Dharamshala'
  | 'Ashram'
  | 'Relative'
  | 'Day Visit'
  | '';

/** Full accommodation record. */
export interface AccommodationDetails extends Partial<GovernmentApplication> {
  /** Name or ID of the assigned camp */
  camp: string;
  /** Type of accommodation */
  type: AccommodationType;
  /** Name of the accommodation */
  name: string;
  /** Full address */
  address: string;
  /** Allocated sector */
  sector: string;
  /** Allocated zone */
  zone: string;
  /** Contact number at the accommodation */
  contactNumber: string;
  /** Check-in date (ISO date string) */
  checkIn: string;
  /** Check-out date (ISO date string) */
  checkOut: string;
  /** Audit trail */
  audit: AuditMetadata;
}

// ============================================================
// TIMELINE & BOOKING LIFECYCLE
// ============================================================

export type BookingStatus = 'Not Started' | 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Expired' | 'Rejected';

/** Official Event record for the Journey History Timeline. */
export interface TimelineEvent {
  eventId: string;
  timestamp: string;
  eventType: string;
  relatedAssetId?: string;
  status: BookingStatus;
  audit: AuditMetadata;
}

// ============================================================
// JOURNEY METADATA
// ============================================================

export type JourneyCategory = 'Pilgrimage' | 'Tourism' | 'Official' | 'Media' | 'Volunteer' | '';

/** Extended journey metadata for detailed scheduling and routing. */
export interface JourneyMetadata {
  /** Exit zone from Kumbh area */
  exitZone: string;
  /** Category of the journey */
  category: JourneyCategory;
  /** Purpose of the journey */
  purpose: string[];
  /** Name of the arrival station/point */
  arrivalStation: string;
  /** Departure point */
  departurePoint: string;
  /** Allocated sector */
  sector: string;
  /** Allocated zone */
  zone: string;
  /** Designated route */
  route: string;
  /** Batch assignment */
  batch: string;
  /** Expected arrival date (ISO) */
  expectedArrivalDate: string;
  /** Expected arrival time (HH:MM) */
  expectedArrivalTime: string;
  /** Expected departure date (ISO) */
  expectedDepartureDate: string;
  /** Expected departure time (HH:MM) */
  expectedDepartureTime: string;
}

// ============================================================
// PROFILE COMPLETION ITEM
// ============================================================

/** A single item in the profile completion checklist. */
export interface ProfileCompletionItem {
  label: string;
  completed: boolean;
  icon: 'check' | 'warning';
}

// ============================================================
// DEFAULT FACTORIES
// ============================================================

/** Create a blank AuditMetadata with current timestamp. */
export function createAuditMetadata(by: string = 'Self Registration'): AuditMetadata {
  const now = new Date().toISOString();
  return { createdAt: now, updatedAt: now, createdBy: by, updatedBy: by };
}

/** Create a blank StructuredAddress. */
export function createDefaultAddress(): StructuredAddress {
  return {
    houseFlatNumber: '',
    buildingSociety: '',
    streetRoad: '',
    areaLocality: '',
    villageTownCity: '',
    talukaTehsil: '',
    district: '',
    state: 'Maharashtra',
    country: 'India',
    pinCode: '',
  };
}

/** Create a blank MedicalProfile. */
export function createDefaultMedicalProfile(): MedicalProfile {
  return {
    chronicDiseases: [],
    disabilities: [],
    specialAssistanceRequired: false,
    diabetes: false,
    heartDisease: false,
    hypertension: false,
    asthma: false,
    epilepsy: false,
    physicalDisability: false,
    visualImpairment: false,
    hearingImpairment: false,
    wheelchairRequired: false,
    pregnant: false,
    regularMedication: false,
    medicationDetails: '',
    knownAllergies: '',
    doctorName: '',
    doctorContact: '',
    otherNotes: '',
  };
}

/** Create a blank EmergencyContactDetail. */
export function createDefaultEmergencyContact(): EmergencyContactDetail {
  return { name: '', relationship: '', phone: '', notes: '' };
}

/** Create a blank EmergencyContacts set. */
export function createDefaultEmergencyContacts(): EmergencyContacts {
  return {
    primary: createDefaultEmergencyContact(),
    secondary: createDefaultEmergencyContact(),
    doctor: createDefaultEmergencyContact(),
    localContact: createDefaultEmergencyContact(),
  };
}

/** Create a blank GovernmentIdMetadata. */
export function createDefaultGovernmentId(): GovernmentIdMetadata {
  return {
    type: 'Aadhaar',
    number: '',
    verificationStatus: 'Not Verified',
    verifiedBy: '',
    verificationMethod: '',
    verificationTimestamp: '',
    maskedDisplay: '',
  };
}

/** Create a blank CitizenVerificationStatus. */
export function createDefaultVerificationStatus(): CitizenVerificationStatus {
  return {
    registrationStatus: 'Pending',
    identityVerification: 'Pending',
    documentVerification: 'Pending',
    journeyApproval: 'Pending',
    currentStage: 'Registration Initiated',
  };
}

/** Create a blank CitizenProfile. */
export function createDefaultCitizenProfile(seedData?: {
  fullName?: string;
  primaryMobile?: string;
  email?: string;
}): CitizenProfile {
  return {
    photo: '',
    fullName: seedData?.fullName || '',
    gender: '',
    dateOfBirth: '',
    primaryMobile: seedData?.primaryMobile || '',
    alternateMobile: '',
    email: seedData?.email || '',
    address: createDefaultAddress(),
    nationality: 'Indian Citizen',
    preferredLanguage: 'English',
    bloodGroup: '',
    occupation: 'Other',
    occupationOther: '',
    governmentIds: [],
    emergencyContacts: createDefaultEmergencyContacts(),
    signature: '',
    verification: createDefaultVerificationStatus(),
    audit: createAuditMetadata(),
  };
}

/** Create a blank VehicleInformation. */
export function createDefaultVehicleInfo(): VehicleInformation {
  return {
    applicationId: '',
    serviceType: 'Vehicle',
    status: 'Not Started',
    referenceNumber: '',
    applicationDate: '',
    lastUpdated: '',
    currentStage: 'Not Started',
    availableDocuments: [],
    activityTimeline: [],
    vehicleType: '',
    vehicleNumber: '',
    driverName: '',
    driverMobile: '',
    fuelType: '',

    fasTagId: '',
    vehiclePassId: '',
    audit: createAuditMetadata(),
  };
}

/** Create a blank AccommodationDetails. */
export function createDefaultAccommodation(): AccommodationDetails {
  return {
    camp: "",
    applicationId: '',
    serviceType: 'Accommodation',
    status: 'Not Started',
    referenceNumber: '',
    applicationDate: '',
    lastUpdated: '',
    currentStage: 'Not Started',
    availableDocuments: [],
    activityTimeline: [],
    type: '',
    name: '',
    address: '',
    sector: '',
    zone: '',
    contactNumber: '',
    checkIn: '',
    checkOut: '',
    audit: createAuditMetadata(),
  };
}

/** Create a blank JourneyMetadata. */
export function createDefaultJourneyMetadata(): JourneyMetadata {
  return {
    exitZone: "",
    category: '',
    purpose: [],
    arrivalStation: '',
    departurePoint: '',
    sector: '',
    zone: '',
    route: '',
    batch: '',
    expectedArrivalDate: '',
    expectedArrivalTime: '',
    expectedDepartureDate: '',
    expectedDepartureTime: '',
  };
}

/** Create a blank PilgrimProfile. */
export function createDefaultPilgrimProfile(pilgrimId: string): PilgrimProfile {
  return {
    pilgrimCategory: "Regular",
    groupInformation: "",
    pilgrimId,
    photo: '',
    fullName: '',
    relationship: 'Group Member',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    governmentId: createDefaultGovernmentId(),
    medical: createDefaultMedicalProfile(),
    mobile: '',
    emergencyContact: createDefaultEmergencyContact(),
    address: createDefaultAddress(),
    preferredLanguage: 'English',
    nationality: 'Indian Citizen',
    audit: createAuditMetadata(),
  };
}

/**
 * Format a StructuredAddress into a single canonical display string.
 * Components with empty values are omitted.
 */
export function formatAddress(addr: StructuredAddress): string {
  const parts = [
    addr.houseFlatNumber,
    addr.buildingSociety,
    addr.streetRoad,
    addr.areaLocality,
    addr.villageTownCity,
    addr.talukaTehsil && `Tal. ${addr.talukaTehsil}`,
    addr.district && `Dist. ${addr.district}`,
    addr.state,
    addr.country,
    addr.pinCode && `- ${addr.pinCode}`,
  ].filter(Boolean);
  return parts.join(', ');
}


// ============================================================
// AGGREGATION LAYER & DOCUMENT VIEW MODELS
// ============================================================



export interface OfficialRegistrationRecord {
  registration: {
    registrationNumber: string;
    registrationDate: string;
    registrationStatus: string;
    verificationStatus: CitizenVerificationStatus;
    applicationNumber: string;
    journeyId: string;
    citizenId: string;
    groupId: string;
    issueTimestamp?: string;
    expiryDate?: string;
  };
  identity: {
    fullName: string;
    photograph: string;
    gender: 'Male' | 'Female' | 'Other' | '';
    dateOfBirth: string;
    nationality: NationalityType;
    country: string;
    occupation: OccupationCategory;
    preferredLanguage: string;
    identification: GovernmentIdMetadata[];
  };
  contact: {
    primaryMobile: string;
    secondaryMobile: string;
    email: string;
    emergencyContacts: EmergencyContacts;
  };
  address: StructuredAddress;
  medical: {
    bloodGroup: string;
    medicalConditions: string[];
    chronicDiseases: string[];
    currentMedication: string;
    allergies: string;
    specialMedicalNotes: string;
    disabilities: string[];
    specialAssistanceRequired: boolean;
  };
  journey: {
    journeyName: string;
    journeyType: string;
    arrivalDate: string;
    departureDate: string;
    route: string;
    entryZone: string;
    exitZone: string;
    journeyStatus: string;
  };
  pilgrims: {
    pilgrimCategory: string;
    groupInformation: string;
    leaderInformation: string;
    pilgrimCount: number;
    memberIds: string[];
  };
  travel: {
    modeOfTravel: string;
    vehicle: VehicleInformation;
  };
  accommodation: {
    details: AccommodationDetails;
    bookingReference: string;
    checkIn: string;
    checkOut: string;
    sector: string;
    camp: string;
  };
  audit: AuditMetadata;
  derived: {
    age: number;
    journeyDurationDays: number;
    profileCompletionPercentage: number;
    journeyReadinessPercentage: number;
    isVerified: boolean;
  };
}
