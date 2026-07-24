import type { DeclarativeBlueprint } from '@/types/rendering.types';
import { DocumentZoneType } from '@/types/rendering.types';
import { CredentialType } from '@/types/credential.types';

/**
 * Pilgrim Smart ID (Front) Blueprint
 * 
 * Government Identity Card — must display:
 * Citizen Identity (photo, name, blood group, Aadhaar),
 * Journey details, Government Seal, QR, Authority
 */
export const PilgrimSmartIdFrontBlueprint: DeclarativeBlueprint = {
  credentialType: CredentialType.PILGRIM_IDENTITY,
  zones: [
    { type: DocumentZoneType.WATERMARK, id: 'id-f-watermark', order: 0, visibilityRules: {} },
    { type: DocumentZoneType.SEAL, id: 'id-f-seal', order: 1, visibilityRules: {} },
    { type: DocumentZoneType.HEADER, id: 'id-f-header', order: 10, visibilityRules: {} },
    { type: DocumentZoneType.IDENTITY, id: 'id-f-identity', order: 20, visibilityRules: { requiredData: ['citizen'] } },
    { type: DocumentZoneType.JOURNEY, id: 'id-f-journey', order: 30, visibilityRules: { requiredData: ['journey'] } },
    { type: DocumentZoneType.SECURITY_QR, id: 'id-f-security', order: 40, visibilityRules: {} },
    { type: DocumentZoneType.AUTHORITY, id: 'id-f-authority', order: 50, visibilityRules: {} }
  ]
};
