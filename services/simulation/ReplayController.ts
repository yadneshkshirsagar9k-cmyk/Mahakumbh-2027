import { RecordedSession } from './SimulationRecorder';
import { operationalEventBus } from '../event-bus/OperationalEventBus';
import { simulationClock } from './SimulationClock';
import { useSimulationOverlayStore } from '@/store/simulation/simulationOverlayStore';

class ReplayController {
  private activeSession: RecordedSession | null = null;
  private unsubscribeClock: (() => void) | null = null;
  private currentEventIndex = 0;
  private replayStartTime = 0;

  loadSession(session: RecordedSession) {
    this.activeSession = session;
    this.currentEventIndex = 0;
  }

  play() {
    if (!this.activeSession) return;
    
    // Reset overlay before replay begins to ensure clean slate
    useSimulationOverlayStore.getState().resetOverlay();
    
    simulationClock.start();
    this.replayStartTime = simulationClock.getCurrentTime();
    
    // Sort events by timestamp just in case
    const events = [...this.activeSession.events].sort((a,b) => a.timestamp - b.timestamp);
    const sessionBaseTime = events.length > 0 ? events[0].timestamp : 0;

    this.unsubscribeClock = simulationClock.onTick((time) => {
      const elapsedReplayTime = time - this.replayStartTime;
      
      while (this.currentEventIndex < events.length) {
        const event = events[this.currentEventIndex];
        const eventOffset = event.timestamp - sessionBaseTime;
        
        if (eventOffset <= elapsedReplayTime) {
          // Republish into the event bus as a simulation event
          operationalEventBus.publish({
            ...event,
            simulationFlag: true,
            source: 'ReplayController'
          });
          this.currentEventIndex++;
        } else {
          break; // Next event is in the future
        }
      }
      
      if (this.currentEventIndex >= events.length) {
        this.stop(); // Replay complete
      }
    });
  }

  pause() {
    simulationClock.stop();
  }

  resume() {
    simulationClock.start();
  }

  stop() {
    simulationClock.stop();
    if (this.unsubscribeClock) {
      this.unsubscribeClock();
      this.unsubscribeClock = null;
    }
  }
}

export const replayController = new ReplayController();
