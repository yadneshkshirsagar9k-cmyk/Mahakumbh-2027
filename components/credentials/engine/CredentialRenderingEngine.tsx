import React, { useMemo } from 'react';
import type { DeclarativeBlueprint, RenderingContextData, RenderingManifest, ResolvedZone } from '@/types/rendering.types';
import { CredentialProvider } from './CredentialContext';
import { evaluateVisibility } from './VisibilityEngine';
import { validateBlueprint } from './BlueprintValidator';
import { ZoneResolver } from './ZoneResolver';

interface Props {
  contextData: RenderingContextData;
  blueprint: DeclarativeBlueprint;
  onEvent?: (eventName: string, payload: any) => void;
}

export function CredentialRenderingEngine({ contextData, blueprint, onEvent }: Props) {
  
  // Pipeline: Render Events, Visibility Resolution, Validation, Component Building
  
  const manifest: RenderingManifest = useMemo(() => {
    onEvent?.('BEFORE_RENDER', { context: contextData });

    // 1. Resolve Visibility for each zone
    const resolvedZones: ResolvedZone[] = blueprint.zones.map(zone => {
      const isVisible = evaluateVisibility(zone.visibilityRules, contextData);
      return { ...zone, isVisible };
    });
    
    onEvent?.('AFTER_ZONE_RESOLUTION', { resolvedZones });

    // 2. Validate Blueprint
    const validationState = validateBlueprint(blueprint, contextData);
    
    onEvent?.('AFTER_VALIDATION', { validationState });

    return {
      blueprintId: blueprint.credentialType,
      context: contextData,
      resolvedZones,
      validationState
    };
  }, [blueprint, contextData, onEvent]);

  // Log validation issues in dev mode
  if (process.env.NODE_ENV !== 'production' && !manifest.validationState.isValid) {
    console.error('Credential Blueprint Validation Failed:', manifest.validationState.errors);
  }

  return (
    <CredentialProvider value={contextData}>
      <ZoneResolver resolvedZones={manifest.resolvedZones} />
    </CredentialProvider>
  );
}
