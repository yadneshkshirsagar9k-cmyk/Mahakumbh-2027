'use client';
import { useEffect } from 'react';
import { operationalEventBus } from '@/services/event-bus/OperationalEventBus';
import { useIncidentStore } from '@/store/command-centre/incidentStore';
import { useCrowdStore } from '@/store/command-centre/crowdStore';
import { useTrafficStore } from '@/store/command-centre/trafficStore';
import { useSimulationOverlayStore } from '@/store/simulation/simulationOverlayStore';
import { timelineEngine } from '@/services/event-bus/TimelineEngine';
import { operationalNotificationService } from '@/services/notifications/OperationalNotificationService';
import { departmentCoordinationEngine } from '@/services/workflows/DepartmentCoordinationEngine';

export function OperationalEventSubscriber() {
  useEffect(() => {
    // Initialize engines
    timelineEngine.initialize();
    operationalNotificationService.initialize();
    departmentCoordinationEngine.initialize();

    const unsubIncident = operationalEventBus.subscribe('INCIDENT_UPDATE', (event) => {
      if (event.simulationFlag) {
        useSimulationOverlayStore.getState().setIncidents(event.payload);
      } else {
        useIncidentStore.getState().setIncidents(event.payload);
      }
    });

    const unsubCrowd = operationalEventBus.subscribe('CROWD_UPDATE', (event) => {
      if (event.simulationFlag) {
        useSimulationOverlayStore.getState().setCrowdPoints(event.payload);
      } else {
        useCrowdStore.getState().setPoints(event.payload);
      }
    });

    const unsubTraffic = operationalEventBus.subscribe('TRAFFIC_UPDATE', (event) => {
      if (event.simulationFlag) {
        useSimulationOverlayStore.getState().setTrafficSegments(event.payload);
      } else {
        useTrafficStore.getState().setSegments(event.payload);
      }
    });

    return () => {
      unsubIncident();
      unsubCrowd();
      unsubTraffic();
    };
  }, []);

  return null;
}
