import { operationalEventBus } from '../event-bus/OperationalEventBus';
import { OperationalEvent } from '@/types/operational-models';

export interface RecordedSession {
  id: string;
  startTime: number;
  endTime: number;
  events: OperationalEvent[];
}

class SimulationRecorder {
  private isRecording = false;
  private currentSession: RecordedSession | null = null;
  private unsubscribeBus: (() => void) | null = null;

  startRecording() {
    if (this.isRecording) return;
    this.isRecording = true;
    this.currentSession = {
      id: `rec-${Date.now()}`,
      startTime: Date.now(),
      endTime: 0,
      events: []
    };

    this.unsubscribeBus = operationalEventBus.subscribe('*', (event) => {
      // Record all events, both production and simulation, 
      // but usually we just want to record simulation events or all for fidelity
      if (this.isRecording && this.currentSession) {
        this.currentSession.events.push(event);
      }
    });
  }

  stopRecording(): RecordedSession | null {
    if (!this.isRecording) return null;
    this.isRecording = false;
    if (this.unsubscribeBus) {
      this.unsubscribeBus();
      this.unsubscribeBus = null;
    }
    
    if (this.currentSession) {
      this.currentSession.endTime = Date.now();
      return this.currentSession;
    }
    return null;
  }
}

export const simulationRecorder = new SimulationRecorder();
