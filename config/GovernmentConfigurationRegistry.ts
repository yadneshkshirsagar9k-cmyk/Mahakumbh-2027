export interface ConfigValues {
  riskThresholds: {
    warning: number;
    danger: number;
    critical: number;
  };
  simulationTiming: {
    tickRateMs: number;
  };
  zoneCapacities: Record<string, number>;
  severityColors: {
    low: string;
    medium: string;
    high: string;
    critical: string;
  };
  predictionWindowsMinutes: number[];
  resourceLimits: {
    maxDeploymentsPerZone: number;
  };
}

export class GovernmentConfigurationRegistry {
  private config: ConfigValues = {
    riskThresholds: {
      warning: 0.5,
      danger: 0.75,
      critical: 0.9,
    },
    simulationTiming: {
      tickRateMs: 1000,
    },
    zoneCapacities: {},
    severityColors: {
      low: '#22c55e',    
      medium: '#eab308', 
      high: '#f97316',   
      critical: '#ef4444'
    },
    predictionWindowsMinutes: [15, 30, 45, 60],
    resourceLimits: {
      maxDeploymentsPerZone: 10,
    }
  };

  get<K extends keyof ConfigValues>(key: K): ConfigValues[K] {
    return this.config[key];
  }

  update<K extends keyof ConfigValues>(key: K, value: Partial<ConfigValues[K]>) {
    this.config[key] = { ...this.config[key], ...value };
  }
}

export const governmentConfigurationRegistry = new GovernmentConfigurationRegistry();
