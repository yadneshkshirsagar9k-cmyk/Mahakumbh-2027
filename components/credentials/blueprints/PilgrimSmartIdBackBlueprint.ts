import type { DeclarativeBlueprint } from '@/types/rendering.types';
import { DocumentZoneType } from '@/types/rendering.types';
import { CredentialType } from '@/types/credential.types';

// Technically the same CredentialType, but a different layout view.
// In a full implementation, the Rendering Engine could accept a specific Blueprint rather than resolving by Type alone.
export const PilgrimSmartIdBackBlueprint: DeclarativeBlueprint = {
  credentialType: CredentialType.PILGRIM_IDENTITY,
  zones: [
    { type: DocumentZoneType.WATERMARK, id: 'id-b-wm', order: 0, visibilityRules: {} },
    { type: DocumentZoneType.JOURNEY, id: 'id-b-j', order: 10, visibilityRules: { requiredData: ['journey'] } },
    { type: DocumentZoneType.AUTHORITY, id: 'id-b-a', order: 20, visibilityRules: {} }
  ]
};
