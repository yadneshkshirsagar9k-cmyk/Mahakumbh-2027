import type { DeclarativeBlueprint } from '@/types/rendering.types';
import { DocumentZoneType } from '@/types/rendering.types';
import { CredentialType } from '@/types/credential.types';

/**
 * Accommodation Pass Blueprint
 * 
 * Government Stay Permit — must display:
 * Camp, Sector, Tent/Facility, Occupants, Check-in, Check-out,
 * Holder Identity, QR, Government Seal, Authority
 */
export const AccommodationPassBlueprint: DeclarativeBlueprint = {
  credentialType: CredentialType.ACCOMMODATION_PASS,
  zones: [
    { type: DocumentZoneType.WATERMARK, id: 'ap-watermark', order: 0, visibilityRules: {} },
    { type: DocumentZoneType.SEAL, id: 'ap-seal', order: 1, visibilityRules: {} },
    { type: DocumentZoneType.HEADER, id: 'ap-header', order: 10, visibilityRules: {} },
    { type: DocumentZoneType.IDENTITY, id: 'ap-identity', order: 20, visibilityRules: { requiredData: ['citizen'] } },
    { type: DocumentZoneType.ACCOMMODATION, id: 'ap-accommodation', order: 25, visibilityRules: { requiredData: ['accommodation'] } },
    { type: DocumentZoneType.JOURNEY, id: 'ap-journey', order: 30, visibilityRules: { requiredData: ['journey'] } },
    { type: DocumentZoneType.SECURITY_QR, id: 'ap-security', order: 40, visibilityRules: {} },
    { type: DocumentZoneType.AUTHORITY, id: 'ap-authority', order: 50, visibilityRules: {} }
  ]
};
