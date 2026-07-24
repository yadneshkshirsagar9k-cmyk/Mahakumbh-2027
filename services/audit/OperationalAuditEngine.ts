import { operationalEventBus } from '../event-bus/OperationalEventBus';
import { OperationalEvent } from '@/types/operational-models';

export type AuditCategory = 
  | 'Security' 
  | 'Operations' 
  | 'Resources' 
  | 'Workflow' 
  | 'Prediction' 
  | 'Simulation' 
  | 'Administration';

export interface AuditRecord {
  auditId: string;
  category: AuditCategory;
  timestamp: number;
  actor: string; 
  action: string;
  details: any;
}

export class OperationalAuditEngine {
  private ledger: AuditRecord[] = [];

  constructor() {
    operationalEventBus.subscribe('*', this.autoAuditEvents.bind(this));
  }

  record(category: AuditCategory, action: string, actor: string, details: any) {
    const record: AuditRecord = {
      auditId: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      category,
      timestamp: Date.now(),
      actor,
      action,
      details
    };
    this.ledger.push(record);
  }

  getRecords(category?: AuditCategory): ReadonlyArray<AuditRecord> {
    if (category) return this.ledger.filter(r => r.category === category);
    return this.ledger;
  }

  private autoAuditEvents(event: OperationalEvent) {
    if (event.eventType.startsWith('RESOURCE_')) {
      this.record('Resources', event.eventType, event.source, event.payload);
    } else if (event.eventType.startsWith('COMMAND_')) {
      this.record('Workflow', event.eventType, event.source, event.payload);
    } else if (event.eventType.startsWith('SECURITY_')) {
      this.record('Security', event.eventType, event.source, event.payload);
    }
  }
}

export const operationalAuditEngine = new OperationalAuditEngine();
