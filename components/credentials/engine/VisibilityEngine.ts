import type { RenderingContextData, ZoneVisibilityCondition } from '@/types/rendering.types';

/**
 * Evaluates whether a zone should be visible based on its configuration
 * and the current rendering context.
 */
export function evaluateVisibility(
  condition: ZoneVisibilityCondition,
  context: RenderingContextData
): boolean {
  // 1. Check supported profiles
  if (condition.supportedProfiles && condition.supportedProfiles.length > 0) {
    if (!condition.supportedProfiles.includes(context.renderProfile)) {
      return false;
    }
  }

  // 2. Check supported modes
  if (condition.supportedModes && condition.supportedModes.length > 0) {
    if (!condition.supportedModes.includes(context.renderMode)) {
      return false;
    }
  }

  // 3. Check supported credential types
  if (condition.supportedCredentialTypes && condition.supportedCredentialTypes.length > 0) {
    if (!condition.supportedCredentialTypes.includes(context.credential.credentialType)) {
      return false;
    }
  }

  // 4. Check required data
  if (condition.requiredData && condition.requiredData.length > 0) {
    for (const key of condition.requiredData) {
      if (key === 'citizen' && !context.citizen) return false;
      if (key === 'journey' && !context.journey) return false;
      if (key === 'vehicleInfo' && !context.journey?.vehicleInfo) return false;
      if (key === 'accommodation' && !context.journey?.accommodation) return false;
    }
  }

  // 5. Custom rule evaluation
  if (condition.customRule) {
    if (!condition.customRule(context)) {
      return false;
    }
  }

  return true; // Visible by default if no rules explicitly fail
}
