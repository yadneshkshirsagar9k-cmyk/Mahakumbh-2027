import { simulationClock } from './SimulationClock';

export interface ScenarioStage {
  timeOffsetMs: number;
  execute: (time: number) => void;
  executed?: boolean;
}

export interface SimulationScenario {
  id: string;
  name: string;
  stages: ScenarioStage[];
}

class ScenarioManager {
  private activeScenario: SimulationScenario | null = null;
  private scenarioStartTime: number = 0;
  private unsubscribeClock: (() => void) | null = null;

  loadScenario(scenario: SimulationScenario) {
    // Deep copy stages to reset execution state
    this.activeScenario = { 
      ...scenario, 
      stages: scenario.stages.map(s => ({...s, executed: false})) 
    };
  }

  start() {
    if (!this.activeScenario) return;
    this.scenarioStartTime = simulationClock.getCurrentTime();
    simulationClock.start();
    
    if (!this.unsubscribeClock) {
      this.unsubscribeClock = simulationClock.onTick((time) => {
        const elapsed = time - this.scenarioStartTime;
        
        this.activeScenario?.stages.forEach(stage => {
          if (!stage.executed && elapsed >= stage.timeOffsetMs) {
            stage.execute(time);
            stage.executed = true;
          }
        });
      });
    }
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
    if (this.activeScenario) {
       this.activeScenario.stages.forEach(s => s.executed = false);
    }
  }
  
  getActiveScenario() {
    return this.activeScenario;
  }
}

export const scenarioManager = new ScenarioManager();
