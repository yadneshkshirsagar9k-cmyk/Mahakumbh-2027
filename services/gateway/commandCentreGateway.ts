import { useCrowdStore } from '@/store/command-centre/crowdStore';
import { useTrafficStore } from '@/store/command-centre/trafficStore';
import { useIncidentStore } from '@/store/command-centre/incidentStore';
import { usePredictionStore } from '@/store/command-centre/predictionStore';
import { useCommandCentreStore } from '@/store/command-centre/commandCentreStore';
import { governmentSimulationEngine } from '../simulation/governmentSimulationEngine';

class CommandCentreGateway {
  private isConnected = false;

  connect() {
    if (this.isConnected) return;
    
    useCommandCentreStore.getState().setSystemStatus({ websocket: 'connected', lastUpdated: Date.now() });
    this.isConnected = true;
    
    // Instead of real WebSockets, we hook up the Simulation Engine to act as our live stream
    governmentSimulationEngine.start((event) => this.handleIncomingEvent(event));
  }

  disconnect() {
    this.isConnected = false;
    useCommandCentreStore.getState().setSystemStatus({ websocket: 'disconnected' });
    governmentSimulationEngine.stop();
  }

  private handleIncomingEvent(event: any) {
    const timestamp = Date.now();
    useCommandCentreStore.getState().setSystemStatus({ lastUpdated: timestamp });

    switch (event.type) {
      case 'CROWD_UPDATE':
        useCrowdStore.getState().setPoints(event.payload);
        break;
      case 'TRAFFIC_UPDATE':
        useTrafficStore.getState().setSegments(event.payload);
        break;
      case 'INCIDENT_UPDATE':
        useIncidentStore.getState().setIncidents(event.payload);
        break;
      case 'PREDICTION_UPDATE':
        usePredictionStore.getState().setPredictedPoints(event.payload);
        break;
      default:
        console.warn('Unknown event type from gateway:', event.type);
    }
  }
}

export const commandCentreGateway = new CommandCentreGateway();
