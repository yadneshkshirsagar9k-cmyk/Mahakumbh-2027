/**
 * @file Government Credential Registry & Document Types
 * @description Final Architectural Refinements for Phase 2.1.
 * Contains purely reusable definitions, enums, and interfaces for future document generation.
 */

import type { OfficialRegistrationRecord } from './citizen.types';

// ============================================================
// 1. CREDENTIAL IDENTIFIERS & ENUMS
// ============================================================

export enum CredentialType {
  REGISTRATION_CERTIFICATE = 'REGISTRATION_CERTIFICATE',
  PILGRIM_IDENTITY = 'PILGRIM_IDENTITY',
  VEHICLE_PASS = 'VEHICLE_PASS',
  ACCOMMODATION_PASS = 'ACCOMMODATION_PASS',
  EMERGENCY_CARD = 'EMERGENCY_CARD',
  VOLUNTEER_CARD = 'VOLUNTEER_CARD',
  STAFF_ID = 'STAFF_ID',
  VIP_PASS = 'VIP_PASS',
}

export enum CredentialStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  ACTIVE = 'ACTIVE',
  REVOKED = 'REVOKED',
  EXPIRED = 'EXPIRED',
  SUPERSEDED = 'SUPERSEDED',
  ARCHIVED = 'ARCHIVED',
}

export enum DocumentCategory {
  IDENTITY = 'IDENTITY',
  TRAVEL = 'TRAVEL',
  STAY = 'STAY',
  EMERGENCY = 'EMERGENCY',
  SPECIAL = 'SPECIAL',
}

export enum VerificationStatus {
  UNVERIFIED = 'UNVERIFIED',
  VERIFIED_ACTIVE = 'VERIFIED_ACTIVE',
  VERIFIED_EXPIRED = 'VERIFIED_EXPIRED',
  INVALID = 'INVALID',
  REVOKED = 'REVOKED',
}

export enum DocumentFormat {
  PDF = 'PDF',
  PASSBOOK = 'PASSBOOK',
  RFID_CHIP = 'RFID_CHIP',
  QR_ONLY = 'QR_ONLY',
}


// ============================================================
// CREDENTIAL LIFECYCLE & AUDIT
// ============================================================

export enum CredentialEventType {
  CREATED = 'CREATED',
  GENERATED = 'GENERATED',
  VIEWED = 'VIEWED',
  DOWNLOADED = 'DOWNLOADED',
  PRINTED = 'PRINTED',
  VERIFIED_ONLINE = 'VERIFIED_ONLINE',
  VERIFIED_QR = 'VERIFIED_QR',
  SHARED = 'SHARED',
  REGENERATED = 'REGENERATED',
  SUPERSEDED = 'SUPERSEDED',
  REVOKED = 'REVOKED',
  EXPIRED = 'EXPIRED',
  ARCHIVED = 'ARCHIVED',
  CITIZEN_ACCESS = 'CITIZEN_ACCESS',
  ADMIN_ACCESS = 'ADMIN_ACCESS',
  SYSTEM_GENERATED = 'SYSTEM_GENERATED',
}

export interface CredentialTimelineEvent {
  eventId: string;
  timestamp: string;
  eventType: CredentialEventType;
  actor: 'Citizen' | 'Admin' | 'System' | 'Verifier';
  actorId: string;
  notes?: string;
  metadata?: any;
}

// ============================================================
// ISSUING AUTHORITY & SIGNATURES
// ============================================================

export interface IssuingAuthority {
  authorityId: string;
  departmentName: string;
  officerName?: string;
  contactEmail?: string;
}

export interface DigitalSignatureModel {
  signatureId: string;
  signatureType: 'PKI' | 'HMAC' | 'BLOCKCHAIN';
  signingAuthority: string;
  certificateIdentifier: string;
  signingTimestamp: string;
  signatureData: string;
  isVerified: boolean;
}

// ============================================================
// THE GOVERNMENT CREDENTIAL
// ============================================================

/**
 * An IMMUTABLE managed record of a Government Credential.
 * Documents are rendered from this credential. 
 * If business data changes, a NEW version of this credential is created and the old one is marked SUPERSEDED.
 */
export interface GovernmentCredential {
  // Identity
  credentialId: string; // Internal UUID
  documentNumber: string; // e.g. REG-MH27-2027-000001
  credentialType: CredentialType;
  documentCategory: DocumentCategory;
  
  // References
  linkedCitizenId: string;
  linkedJourneyId: string;
  linkedRegistrationNumber: string;
  linkedApplicationId?: string; 
  
  // Issuing & Signing
  issuingAuthority: IssuingAuthority;
  digitalSignature?: DigitalSignatureModel;
  
  // Lifecycle
  status: CredentialStatus;
  issueDate: string;
  lastUpdated: string;
  expiryDate?: string;
  
  // Immutability & Versioning
  versionNumber: number;
  supersedesDocumentNumber?: string;
  isActive: boolean;
  isRevoked: boolean;
  
  // Audit & Metrics
  printCount: number;
  downloadCount: number;
  viewCount: number;
  timeline: CredentialTimelineEvent[];
  
  // Render Payloads
  qrPayloadRef: QrPayload;
}

// ============================================================
// 2. DOCUMENT IDENTITY & METADATA
// ============================================================

export interface DocumentNumberGenerator {
  generateDocumentNumber(type: CredentialType, identifier: string): string;
}

export interface OfficialDocumentMetadata {
  documentNumber: string; // The unique identity of the generated document (e.g. REG-MH27-001)
  credentialType: CredentialType;
  documentCategory: DocumentCategory;
  documentVersion: string;
  issueTimestamp: string;
  generatedTimestamp: string;
  digitalSignature: string;
  qrVersion: string;
  verificationUrl: string;
  printMetadata?: {
    printCount: number;
    lastPrintedAt: string;
    printedBy: string;
  };
}

// ============================================================
// 3. STANDARDIZED QR FOUNDATION
// ============================================================

export interface QrPayload<T = any> {
  payloadVersion: string;
  documentNumber: string;
  credentialType: CredentialType;
  citizenId: string;
  registrationNumber: string;
  issueTimestamp: string;
  verificationSignature: string; // Cryptographic signature
  extendedData?: T; // Future extension point for credential-specific payload data
}

// ============================================================
// 4. FUTURE DOCUMENT FACTORY PREPARATION
// ============================================================

export interface DocumentFactory {
  /**
   * Orchestrates the creation of a document using the standardized record.
   * Does not implement rendering, simply prepares the Data + Metadata.
   */
  generateCredential(
    record: OfficialRegistrationRecord,
    type: CredentialType
  ): Promise<GeneratedCredential>;
}

export interface GeneratedCredential {
  metadata: OfficialDocumentMetadata;
  qrPayload: QrPayload;
  // Raw representation to pass into future PDF renderers
  renderContext: OfficialRegistrationRecord; 
}

// ============================================================
// 5. FUTURE VERIFICATION FOUNDATION
// ============================================================

export interface DocumentVerificationService {
  validateDocument(documentNumber: string): Promise<VerificationStatus>;
  verifyQrSignature(qrPayload: QrPayload): boolean;
  checkRevocation(documentNumber: string): Promise<boolean>;
}

// ============================================================
// 6. FUTURE MY DOCUMENTS FOUNDATION (SUMMARY MODEL)
// ============================================================

export interface DocumentSummary {
  documentNumber: string;
  credentialType: CredentialType;
  status: CredentialStatus;
  issueDate: string;
  version: string;
  verificationBadge: VerificationStatus;
  downloadAvailable: boolean;
  printAvailable: boolean;
  linkedJourneyId: string;
}
