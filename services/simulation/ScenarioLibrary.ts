import { SimulationScenario } from './ScenarioManager';
import { operationalEventBus } from '../event-bus/OperationalEventBus';

// Generate 50 random crowd points around Ramkund for a glowing heatmap
const generateDenseCrowd = (baseLon: number, baseLat: number, time: number) => {
  return Array.from({ length: 50 }).map((_, i) => ({
    id: `sim-crowd-${time}-${i}`,
    coordinates: [baseLon + (Math.random() - 0.5) * 0.01, baseLat + (Math.random() - 0.5) * 0.01] as [number, number],
    weight: Math.floor(Math.random() * 80) + 20,
    source: 'simulation' as const,
    timestamp: time
  }));
};

export const ShahiSnanScenario: SimulationScenario = {
  id: 'shahi-snan',
  name: 'Peak Crowd - Shahi Snan',
  stages: [
    {
      timeOffsetMs: 2000,
      execute: (time) => {
         operationalEventBus.publish({
            eventId: `ev-crowd-${time}`,
            eventType: 'CROWD_UPDATE',
            timestamp: time,
            source: 'ScenarioExecutor',
            simulationFlag: true,
            payload: generateDenseCrowd(73.79, 20.00, time)
         });
      }
    },
    {
      timeOffsetMs: 5000,
      execute: (time) => {
         // Create a Family Separation incident to test the overlay
         operationalEventBus.publish({
            eventId: `ev-inc-${time}`,
            eventType: 'INCIDENT_UPDATE',
            timestamp: time,
            source: 'ScenarioExecutor',
            simulationFlag: true,
            payload: [{ 
              id: 'inc-family-1', 
              type: 'FamilySeparation', 
              severity: 'critical', 
              status: 'active', 
              coordinates: [73.79, 20.00], 
              timestamp: time,
              title: 'Missing Child - Sector A',
              location: 'Ramkund Gate 2'
            }]
         });
      }
    },
    {
      timeOffsetMs: 8000,
      execute: (time) => {
         operationalEventBus.publish({
            eventId: `ev-dispatch-${time}`,
            eventType: 'RESOURCE_DISPATCHED',
            timestamp: time,
            source: 'ScenarioExecutor',
            simulationFlag: true,
            payload: {
              resourceId: 'police-unit-alpha',
              department: 'police',
              status: 'dispatched'
            }
         });
      }
    }
  ]
};

export const MedicalEmergencyScenario: SimulationScenario = {
  id: 'medical-emergency',
  name: 'Critical Medical Emergency',
  stages: [
    {
      timeOffsetMs: 1000,
      execute: (time) => {
         operationalEventBus.publish({
            eventId: `ev-med-${time}`,
            eventType: 'INCIDENT_UPDATE',
            timestamp: time,
            source: 'ScenarioExecutor',
            simulationFlag: true,
            payload: [{ 
              id: 'med1', 
              type: 'medical', 
              severity: 'high', 
              status: 'active', 
              coordinates: [73.80, 20.01], 
              timestamp: time,
              title: 'Cardiac Arrest',
              location: 'Trimbakeshwar Main Temple'
            }]
         });
      }
    }
  ]
};

export const scenarioLibrary = [
  ShahiSnanScenario,
  MedicalEmergencyScenario
];
