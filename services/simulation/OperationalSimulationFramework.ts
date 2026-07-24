import { simulationClock } from './SimulationClock';
import { operationalEventBus } from '../event-bus/OperationalEventBus';

export interface SimulationScenario {
  id: string;
  name: string;
  initialize: () => void;
  tick: (time: number) => void;
  cleanup: () => void;
}

class OperationalSimulationFramework {
  private activeScenarios: Map<string, SimulationScenario> = new Map();
  private unsubscribeClock: (() => void) | null = null;

  start() {
    simulationClock.start();
    this.unsubscribeClock = simulationClock.onTick((time) => {
      this.activeScenarios.forEach(scenario => {
        scenario.tick(time);
      });
    });
  }

  stop() {
    if (this.unsubscribeClock) {
      this.unsubscribeClock();
      this.unsubscribeClock = null;
    }
    simulationClock.stop();
  }

  loadScenario(scenario: SimulationScenario) {
    scenario.initialize();
    this.activeScenarios.set(scenario.id, scenario);
  }

  unloadScenario(scenarioId: string) {
    const scenario = this.activeScenarios.get(scenarioId);
    if (scenario) {
      scenario.cleanup();
      this.activeScenarios.delete(scenarioId);
    }
  }
}

export const operationalSimulationFramework = new OperationalSimulationFramework();
