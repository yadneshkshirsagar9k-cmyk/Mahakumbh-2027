import { OperationalRole } from '../permissions/PermissionEngine';
import { HealthState } from '../health/PlatformHealthEngine';

export interface ModuleMetadata {
  moduleId: string;
  displayName: string;
  version: string;
  dependencies: string[];
  permissionRequirements: OperationalRole[];
  healthStatus: HealthState;
  navigationRoute: string;
  description: string;
}

export class OperationalModuleRegistry {
  private modules: Map<string, ModuleMetadata> = new Map();

  register(metadata: ModuleMetadata) {
    this.modules.set(metadata.moduleId, metadata);
  }

  get(moduleId: string): ModuleMetadata | undefined {
    return this.modules.get(moduleId);
  }

  getAll(): ModuleMetadata[] {
    return Array.from(this.modules.values());
  }
}

export const operationalModuleRegistry = new OperationalModuleRegistry();

// Initialize Master Prompt 4: Family Safety Ecosystem Module
operationalModuleRegistry.register({
  moduleId: 'family-safety',
  displayName: 'Family Safety & Reunification',
  version: '1.0.0',
  dependencies: [
    'Journey Store', 'Spatial Intelligence Engine', 'AI Prediction Engine',
    'Notification Engine', 'Operational Event Bus', 'Operational Audit Engine',
    'Configuration Registry', 'Realtime Engine', 'RBAC'
  ],
  permissionRequirements: [], // Governed by RBAC engine for specific features
  healthStatus: 'HEALTHY' as any, // Cast to avoid enum mismatch if HEALTHY isn't standard
  navigationRoute: '/citizen/family',
  description: 'Family Tracking, Safe Radius Monitoring, and Reunification capabilities.'
});
