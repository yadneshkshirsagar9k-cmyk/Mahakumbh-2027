import { create } from 'zustand';

export interface AdministrativeWorkItem {
  id: string;
  type: 'Grievance' | 'Approval' | 'Review';
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Assigned' | 'Escalated' | 'Completed';
  assignedTo?: string;
  created: number;
}

interface GrievanceState {
  workQueue: AdministrativeWorkItem[];
  adminKPIs: {
    workload: number;
    processingPerformance: number; // 0-100%
  };

  // Future Architectural Placeholders
  adminSLAStatus?: Record<string, 'OnTrack' | 'Breached'>;
  officerWorkloadMap?: Record<string, number>;
  queueIntelligenceScore?: number;
  workDistributionStrategy?: 'RoundRobin' | 'CapacityBased' | 'SkillBased';
  adminInsights?: string[];
}

export const useGrievanceStore = create<GrievanceState>((set) => ({
  workQueue: [
    { id: 'WQ-500', type: 'Grievance', priority: 'High', status: 'Escalated', created: Date.now() }
  ],
  adminKPIs: {
    workload: 85,
    processingPerformance: 94
  }
}));
