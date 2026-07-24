import type { GovernmentCredential, CredentialType } from './credential.types';
import type { CitizenProfile } from './citizen.types';
import type { Journey } from '@/store/journey-store';
import type { CredentialSpecification } from '@/config/credential-specs';
import type { DocumentFormat } from '@/config/document-tokens';

// ============================================================
// RENDER MODES & PROFILES
// ============================================================
export enum RenderMode {
  PREVIEW = 'PREVIEW',
  PRINT = 'PRINT',
  PDF = 'PDF',
  MOBILE = 'MOBILE',
  THUMBNAIL = 'THUMBNAIL'
}

export enum RenderProfile {
  CITIZEN_VIEW = 'CITIZEN_VIEW',
  CITIZEN_PRINT = 'CITIZEN_PRINT',
  GOVERNMENT_PRINT = 'GOVERNMENT_PRINT',
  ADMINISTRATOR_VIEW = 'ADMINISTRATOR_VIEW',
  VERIFICATION_VIEW = 'VERIFICATION_VIEW'
}

export interface AccessibilityPreferences {
  highContrast: boolean;
  largeText: boolean;
  printFriendly: boolean;
  reducedMotion: boolean;
}

// ============================================================
// RENDERING CONTEXT
// ============================================================
export interface RenderingContextData {
  credential: GovernmentCredential;
  citizen: CitizenProfile;
  journey: Journey;
  spec: CredentialSpecification;
  
  // Render Settings
  renderMode: RenderMode;
  renderProfile: RenderProfile;
  format: DocumentFormat;
  locale: 'en' | 'hi' | 'mr' | 'sa'; // English, Hindi, Marathi, Sanskrit
  
  accessibility: AccessibilityPreferences;
  featureFlags: Record<string, boolean>;
}

// ============================================================
// ZONE & BLUEPRINT ABSTRACTIONS
// ============================================================
export enum DocumentZoneType {
  BACKGROUND = 'BACKGROUND',
  WATERMARK = 'WATERMARK',
  SEAL = 'SEAL',
  HEADER = 'HEADER',
  IDENTITY = 'IDENTITY',
  JOURNEY = 'JOURNEY',
  VEHICLE = 'VEHICLE',
  ACCOMMODATION = 'ACCOMMODATION',
  MEDICAL = 'MEDICAL',
  EMERGENCY = 'EMERGENCY',
  SECURITY_QR = 'SECURITY_QR',
  AUTHORITY = 'AUTHORITY',
  FOOTER = 'FOOTER'
}

export interface ZoneVisibilityCondition {
  requiredData?: ('citizen' | 'journey' | 'vehicleInfo' | 'accommodation')[];
  supportedProfiles?: RenderProfile[];
  supportedModes?: RenderMode[];
  supportedCredentialTypes?: CredentialType[];
  customRule?: (ctx: RenderingContextData) => boolean;
}

export interface DeclarativeZone {
  type: DocumentZoneType;
  id: string; // Unique identifier (e.g., 'main-header')
  order: number;
  visibilityRules: ZoneVisibilityCondition;
  configOverrides?: Record<string, any>;
}

export interface DeclarativeBlueprint {
  credentialType: CredentialType;
  zones: DeclarativeZone[];
  // Global blueprint overrides
  layoutConfig?: {
    hideWatermark?: boolean;
    forceA4?: boolean;
  };
}

// ============================================================
// RENDERING MANIFEST
// ============================================================
export interface ResolvedZone extends DeclarativeZone {
  isVisible: boolean;
  // Result of component resolution (the React Node to render)
  resolvedComponent?: React.ReactNode;
}

export interface RenderingManifest {
  blueprintId: string;
  context: RenderingContextData;
  resolvedZones: ResolvedZone[];
  validationState: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
}

// ============================================================
// RENDER EVENTS
// ============================================================
export enum RenderEventType {
  BEFORE_RENDER = 'BEFORE_RENDER',
  AFTER_BLUEPRINT_RESOLUTION = 'AFTER_BLUEPRINT_RESOLUTION',
  AFTER_ZONE_RESOLUTION = 'AFTER_ZONE_RESOLUTION',
  AFTER_VALIDATION = 'AFTER_VALIDATION',
  AFTER_RENDER = 'AFTER_RENDER'
}
