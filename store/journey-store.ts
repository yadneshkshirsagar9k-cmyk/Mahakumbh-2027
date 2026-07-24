import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SafeStorage } from '@/utils/safe-storage';
import type {
  CitizenProfile,
  PilgrimProfile,
  VehicleInformation,
  AccommodationDetails,
  JourneyMetadata,
  AuditMetadata,
} from '@/types/citizen.types';
import {
  createDefaultCitizenProfile,
  createDefaultVehicleInfo,
  createDefaultAccommodation,
  createDefaultJourneyMetadata,
  createDefaultMedicalProfile,
  createDefaultGovernmentId,
  createDefaultEmergencyContact,
  createDefaultAddress,
  createDefaultEmergencyContacts,
  createDefaultVerificationStatus,
  createAuditMetadata,
} from '@/types/citizen.types';
import { initPilgrimCounter } from '@/utils/registration-ids';

// ============================================================
// LEGACY INTERFACES — PRESERVED FOR BACKWARD COMPATIBILITY
// ============================================================

/**
 * Legacy Pilgrim interface — kept for backward compatibility with old localStorage data.
 * New pilgrims use PilgrimProfile from citizen.types.ts.
 * The store migration layer converts old Pilgrims to PilgrimProfiles on hydration.
 */
export interface Pilgrim {
  photo: string; // Base64 data URI or placeholder
  name: string;
  age: number;
  gender: string;
  govId: string;
  relationship?: string;
  mobile: string;
  emergencyContact: string;
  state: string;
  country: string;
  medicalFlags: {
    seniorCitizen: boolean;
    pregnant: boolean;
    disabled: boolean;
    wheelchair: boolean;
    medicalAssistance: boolean;
  };
  bloodGroup: string;
}

export interface SnanBooking {
  ghatName: string;
  date: string;
  timeSlot: string;
  bookingCode: string;
  isValid?: boolean; // Smart Booking Revalidation
  invalidMsg?: string;
}

export interface DarshanBooking {
  templeName: string;
  date: string;
  timeSlot: string;
  bookingCode: string;
  isValid?: boolean; // Smart Booking Revalidation
  invalidMsg?: string;
}

export type JourneyStatus =
  | 'Draft'
  | 'Journey Registered'
  | 'Pilgrims Added'
  | 'Snan Booked'
  | 'Darshan Booked'
  | 'Journey Ready'
  | 'Journey Active'
  | 'Journey Completed';

// ============================================================
// EXPANDED JOURNEY INTERFACE
// ============================================================

export interface Journey {
  groupId?: string;
  issueTimestamp?: string;
  expiryDate?: string;
  memberIds?: string[];
  // --- Immutable Government Identifiers (generated once, never regenerated) ---
  id: string;
  registrationNumber: string;
  permitNumber: string;
  vehiclePassId: string;
  emergencySheetId: string;

  // --- Registration metadata ---
  qrCode: string;
  registrationTimestamp: string;
  journeyName: string;
  journeyType: 'Individual' | 'Family' | 'Group' | 'Organization';
  journeyStatus: JourneyStatus;

  // --- Dates ---
  startDate: string;
  endDate: string;

  // --- Travel ---
  arrivalMode: string;
  arrivalPoint: string;

  // --- Expanded Accommodation ---
  accommodation: AccommodationDetails;

  // --- Expanded Vehicle Info ---
  vehicleInfo: VehicleInformation;

  // --- Primary Registrant Reference ---
  primaryRegistrantId: string;

  // --- Emergency Contacts (legacy string — now backed by CitizenProfile) ---
  emergencyContacts: string;

  // --- Pilgrims ---
  pilgrimCount: number;
  pilgrims: PilgrimProfile[];

  // --- Destinations ---
  selectedGhats: string[];
  selectedTemples: string[];

  // --- Bookings ---
  snanBookings: SnanBooking[];
  darshanBookings: DarshanBooking[];

  // --- AI Planner ---
  journeyPlannerData: any | null;

  // --- Progress ---
  journeyProgress: number; // percentage 0 - 100

  // --- Extended Journey Metadata ---
  journeyMetadata: JourneyMetadata;
// --- Timeline Events ---
  timelineEvents: import('@/types/citizen.types').TimelineEvent[];

  // --- Audit ---
  audit: AuditMetadata;

  // --- Legacy ---
  registeredOn?: string;
}

// ============================================================
// STORE STATE & ACTIONS
// ============================================================

interface JourneyState {
  // --- Citizen Profile (single source of truth for primary registrant identity) ---
  citizenProfile: CitizenProfile | null;

  // --- Journey ---
  journey: Journey | null;
  journeyHistory: Journey[];

  // --- Citizen Profile Actions ---
  setCitizenProfile: (profile: CitizenProfile) => void;
  updateCitizenProfile: (fields: Partial<CitizenProfile>) => void;

  // --- Journey Actions ---
  setJourney: (journey: Journey | null) => void;
  updateJourney: (fields: Partial<Journey>) => void;

  // --- Pilgrim Actions ---
  addPilgrim: (pilgrim: PilgrimProfile) => void;
  removePilgrim: (pilgrimId: string) => void;
  updatePilgrim: (pilgrimId: string, fields: Partial<PilgrimProfile>) => void;

  // --- Booking Actions ---
  addSnanBooking: (booking: SnanBooking) => void;
  addDarshanBooking: (booking: DarshanBooking) => void;
  removeSnanBooking: (code: string) => void;
  removeDarshanBooking: (code: string) => void;

  // --- Status ---
  recalculateStatus: () => void;
  archiveCurrentJourney: () => void;
  
  // --- Timeline Action ---
  addTimelineEvent: (event: Omit<import('@/types/citizen.types').TimelineEvent, 'eventId' | 'audit' | 'timestamp'>) => void;

  // --- Government Application Workflow ---
  submitApplication: (serviceKey: 'accommodation' | 'vehicleInfo', application: any) => void;
  updateApplicationStatus: (serviceKey: 'accommodation' | 'vehicleInfo', status: import('@/types/citizen.types').BookingStatus, currentStage: string) => void;
  simulateApplicationWorkflow: (serviceKey: 'accommodation' | 'vehicleInfo') => void;

  // --- Pipeline Workflow ---
  getPipelineStep: () => { stepNumber: number; title: string; desc: string; link: string; btnText: string; isComplete: boolean } | null;
  isPipelineComplete: () => boolean;

  // --- Session Management ---
  resetStore: () => void;
}

// ============================================================
// AUDIT HELPER
// ============================================================

function touchAudit(existing: AuditMetadata | undefined, by: string = 'Self Registration'): AuditMetadata {
  const now = new Date().toISOString();
  if (!existing || !existing.createdAt) {
    return { createdAt: now, updatedAt: now, createdBy: by, updatedBy: by };
  }
  return { ...existing, updatedAt: now, updatedBy: by };
}

// ============================================================
// STATE MIGRATION — BACKWARD COMPATIBLE HYDRATION
// ============================================================

/**
 * Migrate legacy persisted state to the expanded schema.
 * Ensures older localStorage data missing new fields gets sensible defaults
 * instead of causing runtime errors.
 */
function migrateState(persisted: any): Partial<JourneyState> {
  const state: any = { ...persisted };

  // Ensure citizenProfile exists
  if (!state.citizenProfile) {
    state.citizenProfile = null;
  } else {
    // Ensure all sub-objects exist within citizenProfile
    const cp = state.citizenProfile;
    if (!cp.address) cp.address = createDefaultAddress();
    if (!cp.emergencyContacts) cp.emergencyContacts = createDefaultEmergencyContacts();
    if (!cp.verification) cp.verification = createDefaultVerificationStatus();
    if (!cp.audit) cp.audit = createAuditMetadata();
    if (!cp.governmentIds) cp.governmentIds = [];
    if (cp.nationality === undefined) cp.nationality = 'Indian Citizen';
    if (cp.occupation === undefined) cp.occupation = 'Other';
    if (cp.occupationOther === undefined) cp.occupationOther = '';
    if (cp.signature === undefined) cp.signature = '';
    if (cp.alternateMobile === undefined) cp.alternateMobile = '';
    if (cp.preferredLanguage === undefined) cp.preferredLanguage = 'English';
    if (cp.bloodGroup === undefined) cp.bloodGroup = '';
  }

  // Migrate journey if present
  if (state.journey) {
    const j = state.journey;

    // New immutable IDs — preserve if already set
    if (!j.permitNumber) j.permitNumber = '';
    if (!j.vehiclePassId) j.vehiclePassId = '';
    if (!j.emergencySheetId) j.emergencySheetId = '';
    if (!j.primaryRegistrantId) j.primaryRegistrantId = '';

    // Migrate accommodation from legacy shape { type, name, distance, details } to AccommodationDetails
    if (j.accommodation && typeof j.accommodation.type === 'string' && j.accommodation.distance !== undefined) {
      // Legacy shape detected
      const legacy = j.accommodation;
      j.accommodation = {
        ...createDefaultAccommodation(),
        type: mapLegacyAccommodationType(legacy.type),
        name: legacy.name || '',
        address: legacy.details || '',
        audit: createAuditMetadata(),
      };
    } else if (!j.accommodation || !j.accommodation.audit) {
      j.accommodation = { ...createDefaultAccommodation(), ...j.accommodation, audit: createAuditMetadata() };
    }

    // Migrate vehicleInfo from legacy shape { registrationNumber, category } to VehicleInformation
    if (j.vehicleInfo && j.vehicleInfo.category !== undefined && j.vehicleInfo.vehicleType === undefined) {
      const legacy = j.vehicleInfo;
      j.vehicleInfo = {
        ...createDefaultVehicleInfo(),
        vehicleNumber: legacy.registrationNumber || '',
        vehicleType: legacy.category || '',
        audit: createAuditMetadata(),
      };
    } else if (!j.vehicleInfo || !j.vehicleInfo.audit) {
      j.vehicleInfo = { ...createDefaultVehicleInfo(), ...j.vehicleInfo, audit: createAuditMetadata() };
    }

    // Migrate pilgrims from legacy Pilgrim[] to PilgrimProfile[]
    if (j.pilgrims && j.pilgrims.length > 0) {
      j.pilgrims = j.pilgrims.map((p: any, idx: number) => {
        if (p.pilgrimId) return p; // Already migrated
        return migrateLegacyPilgrim(p, idx);
      });
      initPilgrimCounter(j.pilgrims.length);
    }

    // Ensure timelineEvents
    if (!j.timelineEvents) j.timelineEvents = [];

    // Ensure journeyMetadata
    if (!j.journeyMetadata) j.journeyMetadata = createDefaultJourneyMetadata();
    if (!j.audit) j.audit = createAuditMetadata();
  }

  // Migrate journeyHistory
  if (state.journeyHistory && Array.isArray(state.journeyHistory)) {
    state.journeyHistory = state.journeyHistory.map((j: any) => {
      if (!j.permitNumber) j.permitNumber = '';
      if (!j.vehiclePassId) j.vehiclePassId = '';
      if (!j.emergencySheetId) j.emergencySheetId = '';
      if (!j.primaryRegistrantId) j.primaryRegistrantId = '';
      if (!j.journeyMetadata) j.journeyMetadata = createDefaultJourneyMetadata();
      if (!j.audit) j.audit = createAuditMetadata();
      return j;
    });
  }

  return state;
}

/** Map legacy accommodation type strings to new AccommodationType. */
function mapLegacyAccommodationType(legacyType: string): any {
  const mapping: Record<string, string> = {
    'camp': 'Tent City',
    'dharamshala': 'Dharamshala',
    'hotel': 'Hotel',
    'own': 'Relative',
    '': '',
  };
  return mapping[legacyType] || legacyType || '';
}

/** Convert a legacy Pilgrim to PilgrimProfile. */
function migrateLegacyPilgrim(legacy: any, index: number): PilgrimProfile {
  const pid = `PID-MHK-2027-${(index + 1).toString().padStart(6, '0')}`;
  return {
    pilgrimId: pid,
    photo: legacy.photo || '',
    fullName: legacy.name || '',
    relationship: (legacy.relationship as any) || 'Group Member',
    pilgrimCategory: 'Regular',
    groupInformation: '',
    dateOfBirth: '',
    gender: legacy.gender || '',
    bloodGroup: legacy.bloodGroup || '',
    governmentId: {
      ...createDefaultGovernmentId(),
      number: legacy.govId || '',
      maskedDisplay: legacy.govId ? `XXXX XXXX ${(legacy.govId || '').slice(-4)}` : '',
    },
    medical: {
      ...createDefaultMedicalProfile(),
      wheelchairRequired: legacy.medicalFlags?.wheelchair || false,
      pregnant: legacy.medicalFlags?.pregnant || false,
      physicalDisability: legacy.medicalFlags?.disabled || false,
    },
    mobile: legacy.mobile || '',
    emergencyContact: {
      ...createDefaultEmergencyContact(),
      phone: legacy.emergencyContact || '',
    },
    address: {
      ...createDefaultAddress(),
      state: legacy.state || 'Maharashtra',
      country: legacy.country || 'India',
    },
    preferredLanguage: 'English',
    nationality: 'Indian Citizen',
    audit: createAuditMetadata(),
  };
}

// ============================================================
// STORE IMPLEMENTATION
// ============================================================

export const useJourneyStore = create<JourneyState>()(
  persist(
    (set, get) => ({
      citizenProfile: null,
      journey: null,
      journeyHistory: [],

      // --- Citizen Profile Actions ---

      setCitizenProfile: (profile) => {
        set({ citizenProfile: { ...profile, audit: touchAudit(profile.audit) } });
      },

      updateCitizenProfile: (fields) => {
        const current = get().citizenProfile;
        if (!current) {
          // Auto-create profile if not present
          const newProfile = createDefaultCitizenProfile({
            fullName: fields.fullName,
            primaryMobile: fields.primaryMobile,
            email: fields.email,
          });
          set({ citizenProfile: { ...newProfile, ...fields, audit: touchAudit(undefined) } });
          return;
        }
        set({
          citizenProfile: {
            ...current,
            ...fields,
            audit: touchAudit(current.audit),
          },
        });
      },

      // --- Journey Actions ---

      setJourney: (journey) => {
        if (journey) {
          // Ensure audit metadata
          journey.audit = touchAudit(journey.audit);
          // Initialize pilgrim counter from existing pilgrims
          if (journey.pilgrims) {
            initPilgrimCounter(journey.pilgrims.length);
          }
        }
        set({ journey });
        if (journey) {
          get().recalculateStatus();
        }
      },

      updateJourney: (fields) => {
        const current = get().journey;
        if (!current) return;

        let updated = { ...current, ...fields };

        // IMMUTABLE ID PROTECTION: Never overwrite existing government identifiers
        updated.id = current.id;
        updated.registrationNumber = current.registrationNumber;
        updated.permitNumber = current.permitNumber;
        updated.vehiclePassId = current.vehiclePassId;
        updated.emergencySheetId = current.emergencySheetId;

        // Update audit
        updated.audit = touchAudit(current.audit);

        // Smart Booking Revalidation
        if (fields.startDate || fields.endDate) {
          const start = fields.startDate || current.startDate;
          const end = fields.endDate || current.endDate;

          if (start && end) {
            if (updated.snanBookings) {
              updated.snanBookings = updated.snanBookings.map((b) => {
                const inside = b.date >= start && b.date <= end;
                return {
                  ...b,
                  isValid: inside,
                  invalidMsg: inside
                    ? undefined
                    : 'Your previous Snan booking is outside your updated Journey dates. Please select a new slot.',
                };
              });
            }

            if (updated.darshanBookings) {
              updated.darshanBookings = updated.darshanBookings.map((b) => {
                const inside = b.date >= start && b.date <= end;
                return {
                  ...b,
                  isValid: inside,
                  invalidMsg: inside
                    ? undefined
                    : 'Your previous Darshan booking is outside your updated Journey dates. Please select a new slot.',
                };
              });
            }
          }
        }

        set({ journey: updated });
        get().recalculateStatus();
      },

      // --- Pilgrim Actions ---

      addPilgrim: (pilgrim) => {
        const current = get().journey;
        if (!current) return;
        // Ensure audit metadata
        pilgrim.audit = touchAudit(pilgrim.audit);
        const pilgrims = [...current.pilgrims, pilgrim];
        set({
          journey: {
            ...current,
            pilgrims,
            pilgrimCount: pilgrims.length,
            audit: touchAudit(current.audit),
          },
        });
        get().recalculateStatus();
      },

      removePilgrim: (pilgrimId) => {
        const current = get().journey;
        if (!current) return;
        const pilgrims = current.pilgrims.filter((p) => p.pilgrimId !== pilgrimId);
        set({
          journey: {
            ...current,
            pilgrims,
            pilgrimCount: pilgrims.length,
            audit: touchAudit(current.audit),
          },
        });
        get().recalculateStatus();
      },

      updatePilgrim: (pilgrimId, fields) => {
        const current = get().journey;
        if (!current) return;
        const pilgrims = current.pilgrims.map((p) => {
          if (p.pilgrimId !== pilgrimId) return p;
          return {
            ...p,
            ...fields,
            pilgrimId: p.pilgrimId, // Immutable
            audit: touchAudit(p.audit),
          };
        });
        set({
          journey: {
            ...current,
            pilgrims,
            audit: touchAudit(current.audit),
          },
        });
      },

      // --- Booking Actions ---

      addSnanBooking: (booking) => {
        const current = get().journey;
        if (!current) return;
        // Avoid duplicate booking for same slot/day
        const exists = current.snanBookings.some(
          (b) => b.ghatName === booking.ghatName && b.date === booking.date
        );
        if (exists) return;
        set({
          journey: {
            ...current,
            snanBookings: [...current.snanBookings, { ...booking, isValid: true }],
            audit: touchAudit(current.audit),
          },
        });
        get().recalculateStatus();
      },

      addDarshanBooking: (booking) => {
        const current = get().journey;
        if (!current) return;
        // Avoid duplicate booking for same slot/day
        const exists = current.darshanBookings.some(
          (b) => b.templeName === booking.templeName && b.date === booking.date
        );
        if (exists) return;
        set({
          journey: {
            ...current,
            darshanBookings: [...current.darshanBookings, { ...booking, isValid: true }],
            audit: touchAudit(current.audit),
          },
        });
        get().recalculateStatus();
      },

      removeSnanBooking: (code) => {
        const current = get().journey;
        if (!current) return;
        set({
          journey: {
            ...current,
            snanBookings: current.snanBookings.filter((b) => b.bookingCode !== code),
            audit: touchAudit(current.audit),
          },
        });
        get().recalculateStatus();
      },

      removeDarshanBooking: (code) => {
        const current = get().journey;
        if (!current) return;
        set({
          journey: {
            ...current,
            darshanBookings: current.darshanBookings.filter((b) => b.bookingCode !== code),
            audit: touchAudit(current.audit),
          },
        });
        get().recalculateStatus();
      },

      // --- Status Recalculation ---

      recalculateStatus: () => {
        const j = get().journey;
        if (!j) return;

        let status: JourneyStatus = 'Draft';
        let progress = 0;

        // 1. Journey Registered
        if (j.registrationNumber) {
          status = 'Journey Registered';
          progress += 20;
        }

        // 2. Pilgrims Added
        if (j.pilgrims && j.pilgrims.length > 0) {
          status = 'Pilgrims Added';
          progress += 20;
        }

        // 3. Vehicle Registered
        const hasVehicle = j.vehicleInfo && !!j.vehicleInfo.vehicleNumber;
        if (hasVehicle) {
          progress += 20;
        }

        // 4. Snan Booked
        const hasSnan = j.snanBookings && j.snanBookings.length > 0;
        if (hasSnan) {
          status = 'Snan Booked';
          progress += 20;
        }

        // 5. Darshan Booked
        const hasDarshan = j.darshanBookings && j.darshanBookings.length > 0;
        if (hasDarshan) {
          status = 'Darshan Booked';
          progress += 20;
        }

        if (progress === 100) {
          status = 'Journey Ready';
        }

        // 6. Automatic Journey Completion / Active Status Check
        if (j.startDate && j.endDate) {
          const today = new Date().toISOString().split('T')[0];
          if (today > j.endDate) {
            status = 'Journey Completed';
            progress = 100;
          } else if (today >= j.startDate && progress === 100) {
            status = 'Journey Active';
          }
        }

        set({
          journey: {
            ...j,
            journeyStatus: status,
            journeyProgress: progress,
            registeredOn: j.registeredOn || new Date().toISOString().split('T')[0],
          },
        });
      },

      archiveCurrentJourney: () => {
        const j = get().journey;
        if (!j) return;
        const history = get().journeyHistory;
        set({
          journeyHistory: [...history, { ...j, journeyStatus: 'Journey Completed' }],
          journey: null,
        });
      },

      getPipelineStep: () => {
        const j = get().journey;
        if (!j) {
          return { stepNumber: 1, title: 'Step 1: Register Journey', desc: 'Create your primary journey itinerary to begin.', link: '/account/dashboard?action=new', btnText: 'Start Registration', isComplete: false };
        }
        if (!j.pilgrims || j.pilgrims.length === 0) {
          return { stepNumber: 2, title: 'Step 2: Add Pilgrims', desc: 'Add family members or accompanying pilgrims to your journey.', link: '/account/manage-pilgrims', btnText: 'Next: Add Pilgrims', isComplete: false };
        }
        if (!j.vehicleInfo || !j.vehicleInfo.vehicleNumber) {
          return { stepNumber: 3, title: 'Step 3: Vehicle Registration', desc: 'Register your vehicle details for tracking and entry permits.', link: '/bookings/vehicle', btnText: 'Next: Register Vehicle', isComplete: false };
        }
        if (!j.snanBookings || j.snanBookings.length === 0) {
          return { stepNumber: 4, title: 'Step 4: Smart Snan Booking', desc: 'Reserve your holy bathing ghat slot for the Mahakumbh.', link: '/account/smart-snan', btnText: 'Next: Book Snan', isComplete: false };
        }
        if (!j.darshanBookings || j.darshanBookings.length === 0) {
          return { stepNumber: 5, title: 'Step 5: Smart Darshan Booking', desc: 'Reserve timed access passes for key temples like Trimbakeshwar.', link: '/account/smart-darshan', btnText: 'Next: Book Darshan', isComplete: false };
        }
        
        // Everything complete
        return { stepNumber: 6, title: 'Save Biometric QR Gatepass', desc: 'Your permit is ready for checkposts.', link: '#downloads', btnText: 'Get QR Pass', isComplete: true };
      },

      isPipelineComplete: () => {
        const step = get().getPipelineStep();
        return step !== null && step.isComplete;
      },

      // --- Timeline Action ---
      addTimelineEvent: (eventData) => {
        const current = get().journey;
        if (!current) return;
        
        const now = new Date().toISOString();
        const newEvent: import('@/types/citizen.types').TimelineEvent = {
          ...eventData,
          eventId: `EVT-${Math.floor(100000 + Math.random() * 900000)}`,
          timestamp: now,
          audit: touchAudit(undefined)
        };
        
        set({
          journey: {
            ...current,
            timelineEvents: [...current.timelineEvents, newEvent],
            audit: touchAudit(current.audit),
          }
        });
      },

      // --- Government Application Workflow ---
      submitApplication: (serviceKey, application) => {
        const current = get().journey;
        if (!current) return;
        
        const appWithStatus = {
          ...application,
          status: 'Submitted',
          currentStage: 'Application Submitted',
          applicationDate: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          activityTimeline: [
            {
              eventId: `EVT-${Math.floor(100000 + Math.random() * 900000)}`,
              timestamp: new Date().toISOString(),
              eventType: 'Application Started',
              status: 'Draft',
              audit: touchAudit(undefined)
            },
            {
              eventId: `EVT-${Math.floor(100000 + Math.random() * 900000)}`,
              timestamp: new Date().toISOString(),
              eventType: 'Submitted',
              status: 'Submitted',
              audit: touchAudit(undefined)
            }
          ]
        };

        set({
          journey: {
            ...current,
            [serviceKey]: appWithStatus
          }
        });
        
        get().addTimelineEvent({
          eventType: `${application.serviceType} Application Submitted`,
          relatedAssetId: application.referenceNumber,
          status: 'Submitted'
        });
      },
      
      updateApplicationStatus: (serviceKey, status, currentStage) => {
        const current = get().journey;
        if (!current || !current[serviceKey]) return;
        
        const app = current[serviceKey] as any;
        
        const newEvent = {
          eventId: `EVT-${Math.floor(100000 + Math.random() * 900000)}`,
          timestamp: new Date().toISOString(),
          eventType: currentStage,
          status: status,
          audit: touchAudit(undefined)
        };

        const updatedApp = {
          ...app,
          status,
          currentStage,
          lastUpdated: new Date().toISOString(),
          activityTimeline: [...(app.activityTimeline || []), newEvent]
        };

        // Generate documents if approved/confirmed
        if ((status === 'Approved' || status === 'Confirmed') && (!updatedApp.availableDocuments || updatedApp.availableDocuments.length === 0)) {
          updatedApp.availableDocuments = [
             {
               id: `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
               title: `Official ${app.serviceType} Pass`,
               fileName: `${app.serviceType}-Pass-${app.referenceNumber}.pdf`,
               status: 'ready'
             }
          ];
        }

        set({
          journey: {
            ...current,
            [serviceKey]: updatedApp
          }
        });
        
        get().addTimelineEvent({
          eventType: `${app.serviceType} Application: ${currentStage}`,
          relatedAssetId: app.referenceNumber,
          status: status
        });
      },
      
      simulateApplicationWorkflow: (serviceKey) => {
        // Step 1: Validating Info (1s)
        setTimeout(() => {
          get().updateApplicationStatus(serviceKey, 'Under Review', 'Validating Information');
          
          // Step 2: Generating Ref (2.5s)
          setTimeout(() => {
            get().updateApplicationStatus(serviceKey, 'Under Review', 'Government Verification');
            
            // Step 3: Approved (4s)
            setTimeout(() => {
               // Use 'Approved' for vehicle, 'Confirmed' for Accommodation/Parking
               const serviceName = (get().journey as any)?.[serviceKey]?.serviceType;
               const finalStatus = serviceName === 'Vehicle' ? 'Approved' : 'Confirmed';
               get().updateApplicationStatus(serviceKey, finalStatus, finalStatus);
            }, 1500);
          }, 1500);
        }, 1000);
      },

      // --- Session Management ---
      resetStore: () => {
        set({
          citizenProfile: null,
          journey: null,
          journeyHistory: [],
        });
      },
    }),
    {
      name: 'mahakumbh_journey_store',
      storage: createJSONStorage(() => SafeStorage),
      // State migration for backward compatibility
      merge: (persisted, current) => {
        const migrated = migrateState(persisted || {});
        return { ...current, ...migrated };
      },
    }
  )
);
