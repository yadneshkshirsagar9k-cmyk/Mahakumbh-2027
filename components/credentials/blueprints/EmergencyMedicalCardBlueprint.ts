import type { DeclarativeBlueprint } from '@/types/rendering.types';
import { DocumentZoneType } from '@/types/rendering.types';
import { CredentialType } from '@/types/credential.types';

/**
 * Emergency Medical Card Blueprint
 * 
 * Government Emergency Identity — must display:
 * Citizen Identity (photo, name, blood group), Medical Conditions,
 * Emergency Contact, Hospital, QR, Government Seal, Authority
 */
export const EmergencyMedicalCardBlueprint: DeclarativeBlueprint = {
  credentialType: CredentialType.EMERGENCY_CARD,
  zones: [
    { type: DocumentZoneType.WATERMARK, id: 'em-watermark', order: 0, visibilityRules: {} },
    { type: DocumentZoneType.SEAL, id: 'em-seal', order: 1, visibilityRules: {} },
    { type: DocumentZoneType.HEADER, id: 'em-header', order: 10, visibilityRules: {} },
    { type: DocumentZoneType.IDENTITY, id: 'em-identity', order: 20, visibilityRules: { requiredData: ['citizen'] } },
    { type: DocumentZoneType.EMERGENCY, id: 'em-emergency', order: 25, visibilityRules: { requiredData: ['citizen'] } },
    { type: DocumentZoneType.SECURITY_QR, id: 'em-security', order: 40, visibilityRules: {} },
    { type: DocumentZoneType.AUTHORITY, id: 'em-authority', order: 50, visibilityRules: {} }
  ]
};
