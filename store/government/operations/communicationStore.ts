import { create } from 'zustand';

export interface OperationalComm {
  id: string;
  type: 'Broadcast' | 'DepartmentRequest' | 'Advisory' | 'Emergency';
  sourceDept: string;
  targetDept?: string;
  message: string;
  timestamp: number;
  status: 'Sent' | 'Acknowledged' | 'Resolved';
}

interface CommState {
  communications: OperationalComm[];
  sendComm: (comm: OperationalComm) => void;
  acknowledgeComm: (id: string) => void;
}

export const useCommunicationStore = create<CommState>((set) => ({
  communications: [],
  sendComm: (comm) => set((state) => ({ communications: [comm, ...state.communications] })),
  acknowledgeComm: (id) => set((state) => ({
    communications: state.communications.map(c => c.id === id ? { ...c, status: 'Acknowledged' } : c)
  }))
}));
