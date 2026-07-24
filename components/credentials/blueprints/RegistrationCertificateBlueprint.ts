import type { DeclarativeBlueprint } from '@/types/rendering.types';
import { DocumentZoneType } from '@/types/rendering.types';
import { CredentialType } from '@/types/credential.types';

export const RegistrationCertificateBlueprint: DeclarativeBlueprint = {
  credentialType: CredentialType.REGISTRATION_CERTIFICATE,
  zones: [
    {
      type: DocumentZoneType.WATERMARK,
      id: 'rc-watermark',
      order: 0,
      visibilityRules: {}
    },
    {
      type: DocumentZoneType.SEAL,
      id: 'rc-seal',
      order: 1,
      visibilityRules: {}
    },
    {
      type: DocumentZoneType.HEADER,
      id: 'rc-header',
      order: 10,
      visibilityRules: {}
    },
    {
      type: DocumentZoneType.IDENTITY,
      id: 'rc-identity',
      order: 20,
      visibilityRules: {
        requiredData: ['citizen']
      }
    },
    {
      type: DocumentZoneType.JOURNEY,
      id: 'rc-journey',
      order: 30,
      visibilityRules: {
        requiredData: ['journey']
      }
    },
    {
      type: DocumentZoneType.SECURITY_QR,
      id: 'rc-security',
      order: 40,
      visibilityRules: {}
    },
    {
      type: DocumentZoneType.AUTHORITY,
      id: 'rc-authority',
      order: 50,
      visibilityRules: {}
    }
  ],
  layoutConfig: {
    forceA4: true
  }
};
