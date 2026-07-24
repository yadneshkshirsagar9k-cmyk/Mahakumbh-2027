import { create } from 'zustand';

export type StandardIncidentStatus = 'Reported' | 'Verified' | 'Assigned' | 'Acknowledged' | 'InProgress' | 'Resolved' | 'Closed';
export type FamilyIncidentStatus = 'Detected' | 'Reported' | 'Verified' | 'Assigned' | 'Searching' | 'Located' | 'ReunificationInProgress' | 'Reunified' | 'Closed';

export type IncidentStatus = StandardIncidentStatus | FamilyIncidentStatus;

export interface Incident {
  id: string;
  type: 'General' | 'FamilySeparation';
  title: string;
  departmentId: string;
  status: IncidentStatus;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  severity: number;
  reportedAt: number;
  slaTargetMs: number;
  aiPriorityScore?: number;
  
  // Future Architectural Placeholders
  decisionLogs?: Array<{ timestamp: number, decision: string, by: string }>;
  executiveEscalationChain?: string[];
}

interface IncidentState {
  incidents: Incident[];
  addIncident: (incident: Incident) => void;
  updateStatus: (id: string, status: IncidentStatus) => void;
}

export const useIncidentStore = create<IncidentState>((set) => ({
  incidents: [
    { id: 'INC-101', type: 'General', title: 'Crowd Build-up at Gate 4', departmentId: 'police', status: 'InProgress', priority: 'High', severity: 4, reportedAt: Date.now() - 1000 * 60 * 15, slaTargetMs: 1000 * 60 * 30, aiPriorityScore: 92 },
    { id: 'INC-102', type: 'General', title: 'Medical Emergency near P3', departmentId: 'health', status: 'Assigned', priority: 'Critical', severity: 5, reportedAt: Date.now() - 1000 * 60 * 5, slaTargetMs: 1000 * 60 * 10, aiPriorityScore: 99 },
    { id: 'INC-103', type: 'FamilySeparation', title: 'Lost Child (7y) near Ghat', departmentId: 'police', status: 'Searching', priority: 'Critical', severity: 5, reportedAt: Date.now() - 1000 * 60 * 2, slaTargetMs: 1000 * 60 * 15, aiPriorityScore: 100 }
  ],
  addIncident: (inc) => set((state) => ({ incidents: [...state.incidents, inc] })),
  updateStatus: (id, status) => set((state) => ({
    incidents: state.incidents.map(i => i.id === id ? { ...i, status } : i)
  }))
}));
