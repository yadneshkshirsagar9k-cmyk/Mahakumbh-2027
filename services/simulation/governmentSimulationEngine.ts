import { crowdAdapter } from '../data-adapters/crowdAdapter';
import { trafficAdapter } from '../data-adapters/trafficAdapter';
import { incidentAdapter } from '../data-adapters/incidentAdapter';

// Deterministic simulation
// Scenario: Train arrival -> Crowd increases -> Traffic congestion -> Emergency (Medical) -> Resolution

const BASE_LAT = 20.0000;
const BASE_LNG = 73.7900;

class GovernmentSimulationEngine {
  private intervalId: NodeJS.Timeout | null = null;
  private step = 0;
  private onEvent: ((event: any) => void) | null = null;

  start(callback: (event: any) => void) {
    this.onEvent = callback;
    this.step = 0;
    
    this.intervalId = setInterval(() => {
      this.tick();
    }, 2000); // Trigger every 2 seconds for demonstration
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.onEvent = null;
  }

  private tick() {
    if (!this.onEvent) return;

    // Simulate growing crowd
    const crowdCount = 1000 + (this.step * 200); 
    const crowdPoints = [];
    for (let i = 0; i < crowdCount; i++) {
      // Gaussian scatter around base coords
      const lat = BASE_LAT + (Math.random() - 0.5) * 0.02 * (Math.sin(this.step / 10) + 1);
      const lng = BASE_LNG + (Math.random() - 0.5) * 0.02 * (Math.cos(this.step / 10) + 1);
      crowdPoints.push(
        crowdAdapter.fromSimulation({
          id: `pt-${i}`,
          coordinates: [lng, lat],
          weight: Math.random() > 0.9 ? 5 : 1, // some dense pockets
        })
      );
    }
    this.onEvent({ type: 'CROWD_UPDATE', payload: crowdPoints });

    // Traffic congestion simulation
    const speed = Math.max(10, 60 - (this.step * 2));
    const trafficSegments = [
      trafficAdapter.fromSimulation({
        id: 'route-main',
        path: [[73.78, 19.99], [73.79, 20.00], [73.80, 20.01]],
        speed: speed,
        capacity: 1000,
        status: speed < 20 ? 'congested' : 'normal'
      })
    ];
    this.onEvent({ type: 'TRAFFIC_UPDATE', payload: trafficSegments });

    // Incident simulation
    const incidents = [];
    if (this.step > 10) {
      incidents.push(
        incidentAdapter.fromSimulation({
          id: 'inc-1',
          coordinates: [73.795, 20.005],
          type: 'medical',
          severity: 'high',
          timestamp: Date.now(),
          status: 'active'
        })
      );
    }
    this.onEvent({ type: 'INCIDENT_UPDATE', payload: incidents });

    // Predictions
    const predictions = [];
    for(let i=0; i<500; i++) {
       predictions.push({
          id: `pred-${i}`,
          coordinates: [BASE_LNG + (Math.random() - 0.5)*0.03, BASE_LAT + (Math.random() - 0.5)*0.03],
          weight: 2,
          timeOffsetMinutes: 15
       });
    }
    this.onEvent({ type: 'PREDICTION_UPDATE', payload: predictions });

    this.step++;
    if (this.step > 30) {
       this.step = 0; // reset simulation loop
    }
  }
}

export const governmentSimulationEngine = new GovernmentSimulationEngine();
