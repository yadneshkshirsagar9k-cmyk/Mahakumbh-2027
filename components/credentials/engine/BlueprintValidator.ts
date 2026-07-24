import type { DeclarativeBlueprint, RenderingManifest, RenderingContextData } from '@/types/rendering.types';
import { DocumentZoneType } from '@/types/rendering.types';
import { CredentialSpecs } from '@/config/credential-specs';

export function validateBlueprint(
  blueprint: DeclarativeBlueprint,
  context: RenderingContextData
): RenderingManifest['validationState'] {
  const errors: string[] = [];
  const warnings: string[] = [];
  const spec = CredentialSpecs[blueprint.credentialType];

  if (!spec) {
    errors.push(`No specification found for credential type: ${blueprint.credentialType}`);
    return { isValid: false, errors, warnings };
  }

  const zoneTypes = blueprint.zones.map(z => z.type);

  // Validate layout requirements
  if (!zoneTypes.includes(DocumentZoneType.HEADER)) {
    errors.push('Blueprint is missing a required HEADER zone.');
  }
  if (!zoneTypes.includes(DocumentZoneType.AUTHORITY)) {
    errors.push('Blueprint is missing a required AUTHORITY zone.');
  }

  // Validate against credential spec
  if (spec.zones.requiresIdentity && !zoneTypes.includes(DocumentZoneType.IDENTITY)) {
    errors.push(`Spec requires IDENTITY zone but it is missing in blueprint.`);
  }
  if (spec.zones.requiresJourney && !zoneTypes.includes(DocumentZoneType.JOURNEY)) {
    errors.push(`Spec requires JOURNEY zone but it is missing in blueprint.`);
  }

  if (spec.securityRequirements.qr && !zoneTypes.includes(DocumentZoneType.SECURITY_QR)) {
    warnings.push(`Spec recommends QR security, but SECURITY_QR zone is missing.`);
  }
  if (spec.securityRequirements.watermark && !zoneTypes.includes(DocumentZoneType.WATERMARK)) {
    warnings.push(`Spec recommends Watermark, but WATERMARK zone is missing.`);
  }
  if (spec.securityRequirements.seal && !zoneTypes.includes(DocumentZoneType.SEAL)) {
    warnings.push(`Spec recommends Seal, but SEAL zone is missing.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
