import { 
  CredentialType, 
  GovernmentCredential, 
  DocumentCategory,
  CredentialStatus,
  CredentialEventType,
  IssuingAuthority
} from '@/types/credential.types';
import { generateDocumentNumber, generateCredentialId } from '@/utils/document-numbering';
import { getOfficialRegistrationRecord, generateQrPayload } from '@/utils/credential-generator';
import type { Journey } from '@/store/journey-store';
import type { CitizenProfile } from '@/types/citizen.types';

// Mock issuing authority for Nashik Mahakumbh
const DEFAULT_ISSUING_AUTHORITY: IssuingAuthority = {
  authorityId: 'AUTH-MH27-MAIN',
  departmentName: 'Mahakumbh Administration Office',
  officerName: 'Chief Registration Officer',
};

/**
 * Maps a CredentialType to a logical DocumentCategory
 */
function mapCredentialToCategory(type: CredentialType): DocumentCategory {
  switch (type) {
    case CredentialType.REGISTRATION_CERTIFICATE:
    case CredentialType.PILGRIM_IDENTITY:
    case CredentialType.VIP_PASS:
    case CredentialType.VOLUNTEER_CARD:
    case CredentialType.STAFF_ID:
      return DocumentCategory.IDENTITY;
    case CredentialType.VEHICLE_PASS:
      return DocumentCategory.TRAVEL;
    case CredentialType.ACCOMMODATION_PASS:
      return DocumentCategory.STAY;
    case CredentialType.EMERGENCY_CARD:
      return DocumentCategory.EMERGENCY;
    default:
      return DocumentCategory.SPECIAL;
  }
}

/**
 * Centralized Government Credential Generation Service.
 * This is the ONLY entry point for generating official credentials.
 */
export class CredentialGenerationService {
  
  /**
   * Generates a completely new Government Credential (v1).
   * It relies strictly on the underlying authoritative domain models.
   */
  static generateNewCredential(
    type: CredentialType,
    journey: Journey,
    citizen: CitizenProfile,
    applicationId?: string
  ): GovernmentCredential {
    
    const now = new Date().toISOString();
    const documentNumber = generateDocumentNumber(type);
    
    // 1. Generate the Official Record (Aggregation Layer)
    const officialRecord = getOfficialRegistrationRecord(journey, citizen);
    
    // 2. Generate the Secure QR Payload based on the record
    const qrPayload = generateQrPayload(officialRecord, type, documentNumber);
    
    // 3. Construct the Immutable Government Credential
    return {
      credentialId: generateCredentialId(),
      documentNumber,
      credentialType: type,
      documentCategory: mapCredentialToCategory(type),
      
      linkedCitizenId: citizen.citizenId || '',
      linkedJourneyId: journey.id,
      linkedRegistrationNumber: journey.registrationNumber,
      linkedApplicationId: applicationId,
      
      issuingAuthority: DEFAULT_ISSUING_AUTHORITY,
      // digitalSignature is reserved for future implementation
      
      status: CredentialStatus.ACTIVE,
      issueDate: now,
      lastUpdated: now,
      // Expiry could be derived based on journey dates, simplified here:
      expiryDate: journey.endDate || undefined,
      
      versionNumber: 1,
      isActive: true,
      isRevoked: false,
      
      printCount: 0,
      downloadCount: 0,
      viewCount: 0,
      
      timeline: [
        {
          eventId: generateCredentialId(),
          timestamp: now,
          eventType: CredentialEventType.SYSTEM_GENERATED,
          actor: 'System',
          actorId: 'SYS-GEN',
          notes: `Initial ${type} generation`,
        }
      ],
      
      qrPayloadRef: qrPayload
    };
  }

  /**
   * Creates a new version of an existing credential.
   * Maintains the same documentNumber (or creates a sub-version) but issues a new credential ID.
   */
  static createNewVersion(
    oldCredential: GovernmentCredential,
    journey: Journey,
    citizen: CitizenProfile
  ): GovernmentCredential {
    const now = new Date().toISOString();
    
    // 1. Generate updated Official Record & QR Payload
    const officialRecord = getOfficialRegistrationRecord(journey, citizen);
    const qrPayload = generateQrPayload(officialRecord, oldCredential.credentialType, oldCredential.documentNumber);
    
    return {
      ...oldCredential,
      credentialId: generateCredentialId(), // New internal ID
      
      // Bump version
      versionNumber: oldCredential.versionNumber + 1,
      supersedesDocumentNumber: oldCredential.documentNumber, // Same doc number but previous version logic applies
      
      // Reset counters for the new version
      printCount: 0,
      downloadCount: 0,
      viewCount: 0,
      
      lastUpdated: now,
      
      // Fresh timeline
      timeline: [
        {
          eventId: generateCredentialId(),
          timestamp: now,
          eventType: CredentialEventType.REGENERATED,
          actor: 'System',
          actorId: 'SYS-GEN',
          notes: `Version ${oldCredential.versionNumber + 1} generated due to business data update`,
        }
      ],
      
      qrPayloadRef: qrPayload
    };
  }
}
