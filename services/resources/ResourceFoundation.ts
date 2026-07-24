import { OperationalResource } from '@/types/operational-models';
import { operationalEventBus } from '../event-bus/OperationalEventBus';

export class ResourceFoundation {
  private resources: Map<string, OperationalResource> = new Map();

  registerResource(resource: OperationalResource) {
    this.resources.set(resource.id, resource);
  }

  dispatchResource(resourceId: string, zoneId: string) {
    const res = this.resources.get(resourceId);
    if (res && res.status === 'available') {
      res.status = 'dispatched';
      res.assignedZoneId = zoneId;
      
      operationalEventBus.publish({
        eventId: `dispatch-${resourceId}-${Date.now()}`,
        eventType: 'RESOURCE_DISPATCHED',
        timestamp: Date.now(),
        payload: { resourceId, zoneId },
        source: 'ResourceFoundation'
      });
    }
  }

  getAvailableResourcesByType(type: string): OperationalResource[] {
    return Array.from(this.resources.values()).filter(r => r.type === type && r.status === 'available');
  }
}

export const resourceFoundation = new ResourceFoundation();
