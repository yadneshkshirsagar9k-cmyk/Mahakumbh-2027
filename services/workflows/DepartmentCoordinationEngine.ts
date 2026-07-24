import { operationalEventBus } from '../event-bus/OperationalEventBus';
import { OperationalEvent } from '@/types/operational-models';

class DepartmentCoordinationEngine {
  private initialized = false;

  initialize() {
    if (this.initialized) return;
    operationalEventBus.subscribe('INCIDENT_UPDATE', this.handleIncidentUpdate);
    operationalEventBus.subscribe('RECOMMENDATION_EXECUTED', this.handleRecommendationExecuted);
    this.initialized = true;
  }

  private handleIncidentUpdate = (event: OperationalEvent) => {
    const incidents = event.payload;
    // Basic auto-coordination logic for demonstration
    // If a new critical incident arrives, trigger cross dept requests
    if (Array.isArray(incidents)) {
      incidents.forEach(incident => {
        if (incident.severity === 'critical' && incident.status === 'active') {
          this.dispatchResourceRequest(
            'police', 
            `Urgent Police support required for ${incident.type} incident at ${incident.coordinates?.join(',')}`, 
            event.simulationFlag
          );
          if (incident.type === 'medical') {
            this.dispatchResourceRequest('health', 'Ambulance dispatch required', event.simulationFlag);
          }
        }
      });
    }
  };

  private handleRecommendationExecuted = (event: OperationalEvent) => {
    const rec = event.payload;
    if (rec.type === 'deploy_police') {
      this.dispatchResourceRequest('police', 'Deploy additional units to ' + rec.targetZone, event.simulationFlag);
    }

    // AI Outcome Analysis
    operationalEventBus.publish({
      eventId: `outcome-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,
      eventType: 'AI_OUTCOME_ANALYSIS',
      timestamp: Date.now(),
      source: 'AIDecisionSupport',
      simulationFlag: event.simulationFlag,
      payload: {
        recommendationId: rec.id,
        expectedResponseTime: '5 mins',
        predictedOutcome: 'Crowd density reduction by 15%',
        successScore: 0.92
      }
    });
  };

  private dispatchResourceRequest(department: string, message: string, isSimulation?: boolean) {
    operationalEventBus.publish({
      eventId: `coord-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,
      eventType: 'CROSS_DEPT_REQUEST',
      timestamp: Date.now(),
      source: 'ICCC Coordination',
      simulationFlag: isSimulation,
      payload: {
        department,
        message,
        status: 'pending'
      }
    });
  }
}

export const departmentCoordinationEngine = new DepartmentCoordinationEngine();
