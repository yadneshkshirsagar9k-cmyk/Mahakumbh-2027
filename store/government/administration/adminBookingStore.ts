import { create } from 'zustand';

interface DocumentVersion {
  version: number;
  issuedAt: number;
  status: 'Active' | 'Invalidated' | 'Reissued' | 'Expired';
}

interface AdminBookingState {
  approvalPolicies: Record<string, string>; // Future placeholder for configurable policies
  documentVersions: Record<string, DocumentVersion[]>;
}

export const useAdminBookingStore = create<AdminBookingState>((set) => ({
  approvalPolicies: {
    'VIP_DARSHAN': 'MultiLevel_Tier2',
    'STANDARD_SNAN': 'AutoApprove'
  },
  documentVersions: {
    'DOC-99': [
      { version: 2, issuedAt: Date.now(), status: 'Active' },
      { version: 1, issuedAt: Date.now() - 86400000, status: 'Invalidated' }
    ]
  }
}));
