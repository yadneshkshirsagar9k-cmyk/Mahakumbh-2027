import { CredentialType } from '@/types/credential.types';

export interface CredentialCapabilities {
  /** Supports generating a secure QR code payload */
  supportsQrCode: boolean;
  /** Supports printing to PDF or paper */
  supportsPrinting: boolean;
  /** Supports downloading to local device */
  supportsDownload: boolean;
  /** Supports sharing via link or social */
  supportsSharing: boolean;
  /** Supports document versioning (e.g. rev 1, rev 2) */
  supportsVersioning: boolean;
  /** Can this credential be remotely revoked? */
  supportsRevocation: boolean;
  /** Does this credential expire? */
  supportsExpiry: boolean;
  /** Can this be verified offline via cryptographic QR? */
  supportsOfflineVerification: boolean;
  /** Can this be verified online via the Government API? */
  supportsOnlineVerification: boolean;
  /** Requires cryptographic digital signature? */
  requiresDigitalSignature: boolean;
  /** Requires visual watermark for printing? */
  requiresWatermark: boolean;
  /** Can be rendered in multiple languages? */
  supportsMultiLanguageRendering: boolean;
  /** Can the credential be regenerated (e.g. if lost)? */
  supportsRegeneration: boolean;
  /** Does it maintain an audit history of usage? */
  maintainsAuditHistory: boolean;
}

const DEFAULT_CAPABILITIES: CredentialCapabilities = {
  supportsQrCode: true,
  supportsPrinting: true,
  supportsDownload: true,
  supportsSharing: false,
  supportsVersioning: true,
  supportsRevocation: true,
  supportsExpiry: false,
  supportsOfflineVerification: true,
  supportsOnlineVerification: true,
  requiresDigitalSignature: true,
  requiresWatermark: true,
  supportsMultiLanguageRendering: true,
  supportsRegeneration: true,
  maintainsAuditHistory: true,
};

export const CREDENTIAL_CAPABILITIES_REGISTRY: Record<CredentialType, CredentialCapabilities> = {
  [CredentialType.REGISTRATION_CERTIFICATE]: {
    ...DEFAULT_CAPABILITIES,
    supportsSharing: true,
    supportsExpiry: false,
  },
  [CredentialType.PILGRIM_IDENTITY]: {
    ...DEFAULT_CAPABILITIES,
    supportsSharing: false,
    supportsExpiry: false,
    requiresWatermark: true,
  },
  [CredentialType.VEHICLE_PASS]: {
    ...DEFAULT_CAPABILITIES,
    supportsSharing: true,
    supportsExpiry: true,
  },
  [CredentialType.ACCOMMODATION_PASS]: {
    ...DEFAULT_CAPABILITIES,
    supportsSharing: true,
    supportsExpiry: true,
  },
  [CredentialType.EMERGENCY_CARD]: {
    ...DEFAULT_CAPABILITIES,
    supportsSharing: false,
    supportsExpiry: false,
    requiresWatermark: false,
    requiresDigitalSignature: false,
    supportsOfflineVerification: false,
  },
  [CredentialType.VOLUNTEER_CARD]: {
    ...DEFAULT_CAPABILITIES,
    supportsSharing: false,
    supportsExpiry: true,
  },
  [CredentialType.STAFF_ID]: {
    ...DEFAULT_CAPABILITIES,
    supportsSharing: false,
    supportsExpiry: true,
  },
  [CredentialType.VIP_PASS]: {
    ...DEFAULT_CAPABILITIES,
    supportsSharing: false,
    supportsExpiry: true,
  },
};

/** Helper utility to quickly query capabilities without deep checking objects */
export function getCredentialCapabilities(type: CredentialType): CredentialCapabilities {
  return CREDENTIAL_CAPABILITIES_REGISTRY[type] || DEFAULT_CAPABILITIES;
}
