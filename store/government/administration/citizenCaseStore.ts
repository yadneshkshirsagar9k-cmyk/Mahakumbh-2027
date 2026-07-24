import { create } from 'zustand';

export type AdminFlag = 'Priority' | 'VIP' | 'Medical' | 'International' | 'SeniorCitizen' | 'NeedsReview' | 'Restricted';

export interface InternalNote {
  id: string;
  authorId: string;
  timestamp: number;
  content: string;
}

export interface BusinessTimelineEvent {
  id: string;
  type: string;
  timestamp: number;
  description: string;
}

export interface CitizenAdministrativeCase {
  caseId: string;
  citizenId: string;
  name: string;
  governmentId: string;
  mobileNumber: string;
  
  adminFlags: AdminFlag[];
  internalNotes: InternalNote[];
  businessTimeline: BusinessTimelineEvent[];
  
  isServiceLocked: boolean;
  serviceHealth: {
    journey: 'Healthy' | 'Warning' | 'Critical';
    bookings: 'Healthy' | 'Warning' | 'Critical';
    vehicles: 'Healthy' | 'Warning' | 'Critical';
    documents: 'Healthy' | 'Warning' | 'Critical';
    verification: 'Healthy' | 'Warning' | 'Critical';
  };
  
  linkedCases: string[]; // Future architectural placeholder

  // Future Architectural Placeholders
  communicationHistory?: Array<{ id: string, type: string, timestamp: number }>;
  duplicateDetectionScore?: number;
  relationshipGraphNodes?: string[];
}

interface CaseState {
  cases: CitizenAdministrativeCase[];
  addFlag: (caseId: string, flag: AdminFlag) => void;
  removeFlag: (caseId: string, flag: AdminFlag) => void;
  addNote: (caseId: string, note: InternalNote) => void;
  toggleServiceLock: (caseId: string, locked: boolean) => void;
}

export const useCitizenCaseStore = create<CaseState>((set) => ({
  cases: [
    {
      caseId: 'CASE-001',
      citizenId: 'CIT-9021',
      name: 'Ravi Kumar',
      governmentId: 'AADHAAR-XXXX-1234',
      mobileNumber: '9876543210',
      adminFlags: ['Priority', 'NeedsReview'],
      internalNotes: [
        { id: 'n1', authorId: 'admin-1', timestamp: Date.now() - 100000, content: 'Requested urgent parking permit due to senior citizen status.' }
      ],
      businessTimeline: [
        { id: 'bt1', type: 'Registration', timestamp: Date.now() - 500000, description: 'Citizen account created.' },
        { id: 'bt2', type: 'Booking', timestamp: Date.now() - 200000, description: 'Snan booking initiated.' }
      ],
      isServiceLocked: false,
      serviceHealth: {
        journey: 'Healthy',
        bookings: 'Warning',
        vehicles: 'Healthy',
        documents: 'Healthy',
        verification: 'Warning'
      },
      linkedCases: []
    }
  ],
  addFlag: (caseId, flag) => set((state) => ({
    cases: state.cases.map(c => c.caseId === caseId ? { ...c, adminFlags: [...new Set([...c.adminFlags, flag])] } : c)
  })),
  removeFlag: (caseId, flag) => set((state) => ({
    cases: state.cases.map(c => c.caseId === caseId ? { ...c, adminFlags: c.adminFlags.filter(f => f !== flag) } : c)
  })),
  addNote: (caseId, note) => set((state) => ({
    cases: state.cases.map(c => c.caseId === caseId ? { ...c, internalNotes: [note, ...c.internalNotes] } : c)
  })),
  toggleServiceLock: (caseId, locked) => set((state) => ({
    cases: state.cases.map(c => c.caseId === caseId ? { ...c, isServiceLocked: locked } : c)
  }))
}));
