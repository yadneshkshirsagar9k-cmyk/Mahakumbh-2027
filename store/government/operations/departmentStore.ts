import { create } from 'zustand';

export type ShiftState = 'Morning' | 'Evening' | 'Night';
export type DepartmentStatus = 'Operational' | 'PartiallyOperational' | 'Degraded' | 'Critical' | 'Maintenance';

export interface ShiftInfo {
  activeShift: ShiftState;
  nextShift: ShiftState;
  supervisor: string;
  strength: number;
  status: 'Active' | 'Handover' | 'Ending';
  handoverNotes: string[];
}

export interface TeamAvailability {
  teamId: string;
  name: string;
  status: 'Available' | 'Busy' | 'Standby' | 'Resting' | 'Training';
}

interface DepartmentState {
  departmentId: string | null;
  status: DepartmentStatus;
  shiftInfo: ShiftInfo;
  slaHealth: number; // 0-100%
  teams: TeamAvailability[];
  
  setContext: (deptId: string) => void;
  updateShift: (updates: Partial<ShiftInfo>) => void;
  setStatus: (status: DepartmentStatus) => void;

  // Future Architectural Placeholders
  departmentHealthScore?: number;
  workforceCapacity?: { total: number; deployed: number; available: number; resting: number };
  operationalReadinessForecast?: string;
  performanceScorecard?: Record<string, any>;
  operationalDependencyMap?: string[];
  rulesEngineConfig?: Record<string, any>;
}

export const useDepartmentStore = create<DepartmentState>((set) => ({
  departmentId: null,
  status: 'Operational',
  shiftInfo: {
    activeShift: 'Morning',
    nextShift: 'Evening',
    supervisor: 'Cmdr. Patil',
    strength: 145,
    status: 'Active',
    handoverNotes: []
  },
  slaHealth: 98,
  teams: [
    { teamId: 't1', name: 'Alpha Squad', status: 'Available' },
    { teamId: 't2', name: 'Bravo Squad', status: 'Busy' },
    { teamId: 't3', name: 'Charlie Squad', status: 'Standby' }
  ],
  
  setContext: (deptId) => set({ departmentId: deptId }),
  updateShift: (updates) => set((state) => ({ shiftInfo: { ...state.shiftInfo, ...updates } })),
  setStatus: (status) => set({ status })
}));
