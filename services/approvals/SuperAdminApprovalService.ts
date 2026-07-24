import { operationalAuditEngine } from '../audit/OperationalAuditEngine';
import { ApprovalAction, AccountStatus } from '@/types/government';

export class SuperAdminApprovalService {
  
  processVerification(officerId: string, action: ApprovalAction, adminId: string, notes?: string) {
    let newStatus: AccountStatus = 'PendingVerification';
    
    switch (action) {
      case 'Approve':
        newStatus = 'Active';
        break;
      case 'Reject':
        newStatus = 'Rejected';
        break;
      case 'SuspendReview':
        newStatus = 'Suspended';
        break;
      default:
        newStatus = 'PendingVerification'; 
    }

    operationalAuditEngine.record(
      'Administration',
      `OFFICER_VERIFICATION_${action.toUpperCase()}`,
      adminId,
      { officerId, notes, newStatus }
    );

    console.log(`[SuperAdminApproval] Officer ${officerId} verification updated by ${adminId}: ${action}`);
  }
}

export const superAdminApprovalService = new SuperAdminApprovalService();
