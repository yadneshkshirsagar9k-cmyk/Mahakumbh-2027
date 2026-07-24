import type { DeclarativeBlueprint } from '@/types/rendering.types';
import { DocumentZoneType } from '@/types/rendering.types';
import { CredentialType } from '@/types/credential.types';

/**
 * Vehicle Pass Blueprint
 * 
 * Government Vehicle Entry Permit — must display:
 * Vehicle Number, Driver Name, Vehicle Type, Registration Number,
 * Parking Allocation, Journey Route, Permit Number, Validity,
 * QR, Government Seal, Authority, Checkpoint Permissions
 */
export const VehiclePassBlueprint: DeclarativeBlueprint = {
  credentialType: CredentialType.VEHICLE_PASS,
  zones: [
    { type: DocumentZoneType.WATERMARK, id: 'vp-watermark', order: 0, visibilityRules: {} },
    { type: DocumentZoneType.SEAL, id: 'vp-seal', order: 1, visibilityRules: {} },
    { type: DocumentZoneType.HEADER, id: 'vp-header', order: 10, visibilityRules: {} },
    { type: DocumentZoneType.VEHICLE, id: 'vp-vehicle', order: 20, visibilityRules: { requiredData: ['vehicleInfo'] } },
    { type: DocumentZoneType.IDENTITY, id: 'vp-identity', order: 25, visibilityRules: { requiredData: ['citizen'] } },
    { type: DocumentZoneType.JOURNEY, id: 'vp-journey', order: 30, visibilityRules: { requiredData: ['journey'] } },
    { type: DocumentZoneType.SECURITY_QR, id: 'vp-security', order: 40, visibilityRules: {} },
    { type: DocumentZoneType.AUTHORITY, id: 'vp-authority', order: 50, visibilityRules: {} }
  ]
};
