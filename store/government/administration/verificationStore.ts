import { create } from 'zustand';

export interface ExceptionItem {
  id: string;
  type: 'DuplicateIdentity' | 'BookingConflict' | 'InvalidDocument' | 'CapacityConflict';
  relatedCaseId: string;
  severity: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'InReview' | 'Resolved';
  timestamp: number;
}

interface VerificationState {
  exceptionQueue: ExceptionItem[];
  pendingVerificationsCount: number;
  resolveException: (id: string) => void;

  // Future Architectural Placeholders
  bulkActionHistory?: string[];
  administrativeTemplates?: Record<string, any>;
}

export const useVerificationStore = create<VerificationState>((set) => ({
  exceptionQueue: [
    { id: 'EX-101', type: 'DuplicateIdentity', relatedCaseId: 'CASE-001', severity: 'High', status: 'Pending', timestamp: Date.now() }
  ],
  pendingVerificationsCount: 42,
  resolveException: (id) => set((state) => ({
    exceptionQueue: state.exceptionQueue.map(e => e.id === id ? { ...e, status: 'Resolved' } : e)
  }))
}));
