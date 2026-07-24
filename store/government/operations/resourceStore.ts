import { create } from 'zustand';

export type ResourceType = 'Personnel' | 'Vehicle' | 'Equipment' | 'MedicalSupply' | 'FixedAsset';
export type ResourceStatus = 'Available' | 'Assigned' | 'Busy' | 'EnRoute' | 'OnSite' | 'Offline' | 'Maintenance';

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  departmentId: string;
  status: ResourceStatus;
  assignmentId?: string; // Links to incident, task, or mission
  location: [number, number];
  isFixedAsset: boolean;
}

interface ResourceState {
  resources: Resource[];
  dispatchResource: (resourceId: string, assignmentId: string, dest: [number, number]) => void;
  updateStatus: (resourceId: string, status: ResourceStatus) => void;

  // Future Architectural Placeholders
  conflictDetectionActive?: boolean;
  detectedConflicts?: string[];
}

export const useResourceStore = create<ResourceState>((set) => ({
  resources: [
    { id: 'res-p1', name: 'Patrol Alpha', type: 'Vehicle', departmentId: 'police', status: 'Available', location: [73.79, 20.00], isFixedAsset: false },
    { id: 'res-h1', name: 'MedCamp North', type: 'FixedAsset', departmentId: 'health', status: 'Available', location: [73.795, 20.005], isFixedAsset: true }
  ],
  dispatchResource: (id, assignmentId, dest) => set((state) => ({
    resources: state.resources.map(r => r.id === id ? { ...r, status: 'EnRoute', assignmentId, location: dest } : r)
  })),
  updateStatus: (id, status) => set((state) => ({
    resources: state.resources.map(r => r.id === id ? { ...r, status } : r)
  }))
}));
