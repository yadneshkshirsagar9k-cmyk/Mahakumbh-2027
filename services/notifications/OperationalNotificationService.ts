import { operationalEventBus } from '../event-bus/OperationalEventBus';
import { useNotificationStore } from '@/store/command-centre/notificationStore';
import { useSimulationOverlayStore } from '@/store/simulation/simulationOverlayStore';
import { OperationalEvent } from '@/types/operational-models';

export class OperationalNotificationService {
  private initialized = false;

  initialize() {
    if (this.initialized) return;
    operationalEventBus.subscribe('ZONE_RISK_ALERT', this.handleAlert.bind(this));
    operationalEventBus.subscribe('RESOURCE_DISPATCHED', this.handleAlert.bind(this));
    operationalEventBus.subscribe('INCIDENT_CREATED', this.handleAlert.bind(this));
    operationalEventBus.subscribe('CROSS_DEPT_REQUEST', this.handleAlert.bind(this));
    this.initialized = true;
  }

  private handleAlert(event: OperationalEvent) {
    if (event.simulationFlag) {
      const state = useSimulationOverlayStore.getState();
      state.setNotifications([event, ...state.notifications]);
    } else {
      useNotificationStore.getState().addNotification(event);
    }
    console.log(`[Notification Service] Processed Alert: ${event.eventType}`, event.payload);
  }
}

export const operationalNotificationService = new OperationalNotificationService();
