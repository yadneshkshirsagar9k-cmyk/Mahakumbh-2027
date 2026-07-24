import { CredentialType, DocumentCategory } from '@/types/credential.types';
import { DocumentFormat } from './document-tokens';

/**
 * Defines the strict specification for a given Government Credential.
 */
export interface CredentialSpecification {
  credentialType: CredentialType;
  title: string;
  department: string;
  purpose: string;
  audience: string;
  category: DocumentCategory;
  
  // Design Standards
  recommendedFormat: DocumentFormat;
  supportedFormats: DocumentFormat[];
  
  // Composition mapping
  zones: {
    requiresIdentity: boolean;
    requiresJourney: boolean;
    requiresVehicle: boolean;
    requiresAccommodation: boolean;
    requiresMedical: boolean;
  };
  
  // Security
  securityRequirements: {
    watermark: boolean;
    qr: boolean;
    digitalSignature: boolean;
    seal: boolean;
  };
}

export const CredentialSpecs: Record<CredentialType, CredentialSpecification> = {
  [CredentialType.REGISTRATION_CERTIFICATE]: {
    credentialType: CredentialType.REGISTRATION_CERTIFICATE,
    title: 'Mahakumbh Registration Certificate',
    department: 'Mahakumbh Administration Office, Government of Maharashtra',
    purpose: 'Primary proof of registered pilgrimage.',
    audience: 'Law Enforcement, Ghat Authorities, Temple Authorities',
    category: DocumentCategory.IDENTITY,
    recommendedFormat: 'a4',
    supportedFormats: ['a4', 'mobileView'],
    zones: {
      requiresIdentity: true,
      requiresJourney: true,
      requiresVehicle: false,
      requiresAccommodation: false,
      requiresMedical: true,
    },
    securityRequirements: {
      watermark: true,
      qr: true,
      digitalSignature: true,
      seal: true,
    }
  },
  [CredentialType.PILGRIM_IDENTITY]: {
    credentialType: CredentialType.PILGRIM_IDENTITY,
    title: 'Pilgrim Identity Card',
    department: 'Mahakumbh Administration Office',
    purpose: 'Portable identity verification for individuals.',
    audience: 'Security Checkpoints, Local Transport',
    category: DocumentCategory.IDENTITY,
    recommendedFormat: 'idCard',
    supportedFormats: ['idCard', 'mobileView'],
    zones: {
      requiresIdentity: true,
      requiresJourney: false, // ID card is small, minimal journey info
      requiresVehicle: false,
      requiresAccommodation: false,
      requiresMedical: true, // Blood group
    },
    securityRequirements: {
      watermark: true,
      qr: true,
      digitalSignature: false, // Too small
      seal: true,
    }
  },
  [CredentialType.VEHICLE_PASS]: {
    credentialType: CredentialType.VEHICLE_PASS,
    title: 'Official Vehicle Pass',
    department: 'Traffic Police, Nashik',
    purpose: 'Authorizes vehicle entry into specific zones.',
    audience: 'Traffic Police, Parking Attendants',
    category: DocumentCategory.TRAVEL,
    recommendedFormat: 'a5', // For dashboard display
    supportedFormats: ['a5', 'a4', 'mobileView'],
    zones: {
      requiresIdentity: true, // Driver/Owner info
      requiresJourney: true, // Route info
      requiresVehicle: true,
      requiresAccommodation: false,
      requiresMedical: false,
    },
    securityRequirements: {
      watermark: true,
      qr: true,
      digitalSignature: true,
      seal: true,
    }
  },

  [CredentialType.ACCOMMODATION_PASS]: {
    credentialType: CredentialType.ACCOMMODATION_PASS,
    title: 'Accommodation Confirmation',
    department: 'Tourism Department, Maharashtra',
    purpose: 'Proof of stay booking.',
    audience: 'Tent City Managers, Hotel Reception',
    category: DocumentCategory.STAY,
    recommendedFormat: 'a4',
    supportedFormats: ['a4', 'mobileView'],
    zones: {
      requiresIdentity: true,
      requiresJourney: false,
      requiresVehicle: false,
      requiresAccommodation: true,
      requiresMedical: false,
    },
    securityRequirements: {
      watermark: true,
      qr: true,
      digitalSignature: false,
      seal: true,
    }
  },
  [CredentialType.EMERGENCY_CARD]: {
    credentialType: CredentialType.EMERGENCY_CARD,
    title: 'Emergency Medical & Contact Card',
    department: 'Health Department, Maharashtra',
    purpose: 'Critical medical and contact info for first responders.',
    audience: 'Paramedics, Police, Doctors',
    category: DocumentCategory.EMERGENCY,
    recommendedFormat: 'idCard',
    supportedFormats: ['idCard', 'mobileView'],
    zones: {
      requiresIdentity: true,
      requiresJourney: false,
      requiresVehicle: false,
      requiresAccommodation: false,
      requiresMedical: true,
    },
    securityRequirements: {
      watermark: false, // Keep it highly readable
      qr: true,
      digitalSignature: false,
      seal: false,
    }
  },
  [CredentialType.VOLUNTEER_CARD]: {
    credentialType: CredentialType.VOLUNTEER_CARD,
    title: 'Volunteer Identity',
    department: 'Mahakumbh Administration Office',
    purpose: 'Identifies registered volunteers.',
    audience: 'Event Organizers, Police',
    category: DocumentCategory.SPECIAL,
    recommendedFormat: 'idCard',
    supportedFormats: ['idCard', 'mobileView'],
    zones: {
      requiresIdentity: true,
      requiresJourney: false,
      requiresVehicle: false,
      requiresAccommodation: false,
      requiresMedical: true,
    },
    securityRequirements: {
      watermark: true,
      qr: true,
      digitalSignature: false,
      seal: true,
    }
  },
  [CredentialType.VIP_PASS]: {
    credentialType: CredentialType.VIP_PASS,
    title: 'VIP Access Pass',
    department: 'Protocol Department, Maharashtra',
    purpose: 'Special access for dignitaries.',
    audience: 'Special Security Group',
    category: DocumentCategory.SPECIAL,
    recommendedFormat: 'a5',
    supportedFormats: ['a5', 'mobileView'],
    zones: {
      requiresIdentity: true,
      requiresJourney: true,
      requiresVehicle: true,
      requiresAccommodation: true,
      requiresMedical: false,
    },
    securityRequirements: {
      watermark: true,
      qr: true,
      digitalSignature: true,
      seal: true,
    }
  },
  [CredentialType.STAFF_ID]: {
    credentialType: CredentialType.STAFF_ID,
    title: 'Government Duty Pass',
    department: 'Government of Maharashtra',
    purpose: 'Official staff identification.',
    audience: 'All Authorities',
    category: DocumentCategory.SPECIAL,
    recommendedFormat: 'idCard',
    supportedFormats: ['idCard', 'mobileView'],
    zones: {
      requiresIdentity: true,
      requiresJourney: false,
      requiresVehicle: false,
      requiresAccommodation: false,
      requiresMedical: true,
    },
    securityRequirements: {
      watermark: true,
      qr: true,
      digitalSignature: false,
      seal: true,
    }
  },
};
