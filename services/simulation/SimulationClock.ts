class SimulationClock {
  private currentTime: number;
  private intervalId: NodeJS.Timeout | null = null;
  private baseTickRateMs: number = 1000; // Physical real-world ms per tick
  private speedMultiplier: number = 1;
  private onTickCallbacks: Set<(time: number) => void> = new Set();
  private lastTickPhysicalTime: number = 0;

  constructor() {
    this.currentTime = Date.now();
  }

  start() {
    if (this.intervalId) return;
    this.lastTickPhysicalTime = Date.now();
    this.intervalId = setInterval(() => {
      const now = Date.now();
      const deltaPhysical = now - this.lastTickPhysicalTime;
      this.lastTickPhysicalTime = now;
      
      // Advance simulation time by physical delta * multiplier
      this.currentTime += (deltaPhysical * this.speedMultiplier); 
      this.onTickCallbacks.forEach(cb => cb(this.currentTime));
    }, this.baseTickRateMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  setSpeed(multiplier: number) {
    this.speedMultiplier = multiplier;
  }
  
  getSpeed() {
    return this.speedMultiplier;
  }

  getCurrentTime() {
    return this.currentTime;
  }
  
  setCurrentTime(time: number) {
    this.currentTime = time;
  }

  onTick(callback: (time: number) => void) {
    this.onTickCallbacks.add(callback);
    return () => this.onTickCallbacks.delete(callback);
  }
}

export const simulationClock = new SimulationClock();
