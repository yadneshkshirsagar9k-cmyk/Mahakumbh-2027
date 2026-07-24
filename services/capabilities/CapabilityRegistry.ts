export type CapabilityStatus = 'active' | 'inactive' | 'error' | 'maintenance';

export interface Capability {
  id: string;
  name: string;
  description: string;
  status: CapabilityStatus;
  version: string;
}

class CapabilityRegistry {
  private capabilities: Map<string, Capability> = new Map();

  register(capability: Capability) {
    this.capabilities.set(capability.id, capability);
  }

  updateStatus(id: string, status: CapabilityStatus) {
    const capability = this.capabilities.get(id);
    if (capability) {
      capability.status = status;
      this.capabilities.set(id, capability);
    }
  }

  getCapabilities(): Capability[] {
    return Array.from(this.capabilities.values());
  }

  getCapability(id: string): Capability | undefined {
    return this.capabilities.get(id);
  }

  isActive(id: string): boolean {
    return this.capabilities.get(id)?.status === 'active';
  }
}

export const capabilityRegistry = new CapabilityRegistry();

// Initialize the registry with the enterprise operational capabilities
const CORE_CAPABILITIES: Capability[] = [
  { id: 'sim-framework', name: 'Simulation Framework', description: 'Enterprise operational scenario simulation engine', status: 'active', version: '2.0.0' },
  { id: 'replay-engine', name: 'Replay Engine', description: 'Historical event recording and playback controller', status: 'active', version: '1.0.0' },
  { id: 'resource-registry', name: 'Resource Registry', description: 'Centralized government resource lifecycle management', status: 'active', version: '1.0.0' },
  { id: 'timeline-engine', name: 'Timeline Engine', description: 'Immutable operational history ledger', status: 'active', version: '1.0.0' },
  { id: 'notification-engine', name: 'Notification Engine', description: 'Actionable ephemeral alerting system', status: 'active', version: '1.0.0' },
  { id: 'ai-decision-support', name: 'AI Decision Support', description: 'Operational recommendation and outcome analysis engine', status: 'active', version: '2.1.0' },
  { id: 'spatial-intelligence', name: 'Spatial Intelligence', description: 'Real-time geographic data rendering pipeline', status: 'active', version: '3.0.0' },
  { id: 'platform-health', name: 'Platform Health Engine', description: 'Read-only diagnostic metrics and telemetry', status: 'active', version: '1.0.0' },
  { id: 'department-coordination', name: 'Department Coordination', description: 'Automated cross-department assignment workflows', status: 'active', version: '1.0.0' },
  { id: 'audit-engine', name: 'Audit Engine', description: 'Isolated partitioned operational action ledger', status: 'active', version: '1.5.0' },
];

CORE_CAPABILITIES.forEach(cap => capabilityRegistry.register(cap));
