import { operationalEventBus } from './OperationalEventBus';
import { useTimelineStore } from '@/store/command-centre/timelineStore';
import { useSimulationOverlayStore } from '@/store/simulation/simulationOverlayStore';
import { OperationalEvent } from '@/types/operational-models';

export class TimelineEngine {
  private initialized = false;

  initialize() {
    if (this.initialized) return;
    
    // Subscribe to all operational events
    operationalEventBus.subscribe('*', this.handleEvent.bind(this));
    
    this.initialized = true;
  }

  private handleEvent(event: OperationalEvent) {
    if (event.simulationFlag) {
      const state = useSimulationOverlayStore.getState();
      state.setTimelineEvents([event, ...state.timelineEvents]);
    } else {
      useTimelineStore.getState().addProductionEvent(event);
    }
  }
}

export const timelineEngine = new TimelineEngine();
