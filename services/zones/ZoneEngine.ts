import { OperationalZone } from '@/types/operational-models';
import { operationalEventBus } from '../event-bus/OperationalEventBus';

export class ZoneEngine {
  private zones: Map<string, OperationalZone> = new Map();

  constructor() {
    operationalEventBus.subscribe('CROWD_UPDATED', (event) => {
      this.recalculateZoneRisks();
    });
  }

  registerZone(zone: OperationalZone) {
    this.zones.set(zone.id, zone);
  }

  getZone(id: string): OperationalZone | undefined {
    return this.zones.get(id);
  }

  getAllZones(): OperationalZone[] {
    return Array.from(this.zones.values());
  }

  private recalculateZoneRisks() {
    this.zones.forEach(zone => {
      const utilization = zone.currentOccupancy / zone.capacity;
      zone.congestionIndex = Math.min(utilization, 1.0);
      
      if (utilization > 0.9) zone.riskLevel = 'critical';
      else if (utilization > 0.75) zone.riskLevel = 'danger';
      else if (utilization > 0.5) zone.riskLevel = 'warning';
      else zone.riskLevel = 'safe';

      if (zone.riskLevel === 'critical' || zone.riskLevel === 'danger') {
        operationalEventBus.publish({
          eventId: `alert-${zone.id}-${Date.now()}`,
          eventType: 'ZONE_RISK_ALERT',
          timestamp: Date.now(),
          payload: { zoneId: zone.id, riskLevel: zone.riskLevel },
          source: 'ZoneEngine'
        });
      }
    });
  }
}

export const zoneEngine = new ZoneEngine();
