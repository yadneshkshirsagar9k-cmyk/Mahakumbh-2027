export type HealthState = 'Healthy' | 'Degraded' | 'Warning' | 'Critical' | 'Offline' | 'Maintenance';

export interface SubsystemHealth {
  name: string;
  state: HealthState;
  lastPing: number;
  details?: string;
}

export interface PlatformMetrics {
  eventBusQueueDepth: number;
  simulationFps: number;
  selectorLatencyMs: number;
  mapRenderingFps: number;
  memoryUsageMb: number;
  updateLatencyMs: number;
  activeConnections: number;
  platformAvailability: number; // Percentage
}

export class PlatformHealthEngine {
  private subsystems: Map<string, SubsystemHealth> = new Map();
  private metrics: PlatformMetrics = {
    eventBusQueueDepth: 0,
    simulationFps: 60,
    selectorLatencyMs: 1.2,
    mapRenderingFps: 60,
    memoryUsageMb: 120,
    updateLatencyMs: 15,
    activeConnections: 42,
    platformAvailability: 99.99
  };

  reportHealth(name: string, state: HealthState, details?: string) {
    this.subsystems.set(name, {
      name,
      state,
      lastPing: Date.now(),
      details
    });
  }

  updateMetrics(partialMetrics: Partial<PlatformMetrics>) {
    this.metrics = { ...this.metrics, ...partialMetrics };
  }

  getMetrics(): PlatformMetrics {
    return this.metrics;
  }

  getOverallHealth(): HealthState {
    const states = Array.from(this.subsystems.values()).map(s => s.state);
    
    if (states.includes('Offline')) return 'Offline';
    if (states.includes('Critical')) return 'Critical';
    if (states.includes('Degraded')) return 'Degraded';
    if (states.includes('Warning')) return 'Warning';
    if (states.includes('Maintenance')) return 'Maintenance';
    return 'Healthy';
  }

  getSubsystemHealth(name: string): SubsystemHealth | undefined {
    return this.subsystems.get(name);
  }
  
  getAllSubsystems(): SubsystemHealth[] {
    return Array.from(this.subsystems.values());
  }
}

export const platformHealthEngine = new PlatformHealthEngine();

// Initialize base platform services
platformHealthEngine.reportHealth('Operational Event Bus', 'Healthy');
platformHealthEngine.reportHealth('Simulation Engine', 'Healthy');
platformHealthEngine.reportHealth('Timeline Engine', 'Healthy');
platformHealthEngine.reportHealth('Notification Engine', 'Healthy');
platformHealthEngine.reportHealth('Spatial Intelligence Engine', 'Healthy');
platformHealthEngine.reportHealth('Resource Registry', 'Healthy');
