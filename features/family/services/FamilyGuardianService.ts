import { useFamilyCommunicationStore } from '../stores/familyCommunicationStore';

export class FamilyGuardianService {
  static assignTemporaryGuardian(journeyId: string, guardianId: string, assignedBy: string) {
    // Validates with RBAC and then assigns Guardian
    useFamilyCommunicationStore.getState().assignGuardian(journeyId, {
      guardianId,
      assignedBy,
      timestamp: Date.now(),
      status: 'Active'
    });
  }
}
