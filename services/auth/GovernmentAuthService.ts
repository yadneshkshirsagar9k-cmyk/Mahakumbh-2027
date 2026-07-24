import { operationalAuditEngine } from '../audit/OperationalAuditEngine';
import { OfficerProfile } from '@/types/government';
import { useGovernmentAuthStore } from '@/store/government/governmentAuthStore';

export class GovernmentAuthService {
  
  async login(employeeId: string, passwordHash: string): Promise<boolean> {
    const success = true; 
    
    if (success) {
      const profile: OfficerProfile = {
        id: `gov-${employeeId}`,
        fullName: 'Demo Officer',
        employeeId,
        department: 'Police',
        designation: 'Commander',
        officialEmail: 'demo@gov.in',
        officialMobile: '9999999999',
        district: 'Nashik',
        officeLocation: 'HQ',
        officeAddress: 'Main St',
        reportingAuthority: 'IGP',
        employeeCategory: 'Class A',
        role: 'PoliceCommand',
        status: 'Active',
        clearanceLevel: 5,
        assignedRegions: ['Zone 1'],
        assignedDepartments: ['Police', 'Traffic'],
        emergencyContact: '112',
        activeSessions: [],
        securityPolicy: {
          forcePasswordReset: false,
          mfaEnabled: true,
          failedLoginAttempts: 0
        },
        availability: 'Online'
      };

      useGovernmentAuthStore.getState().setProfile(profile);
      useGovernmentAuthStore.getState().setIsAuthenticated(true);
      
      operationalAuditEngine.record('Security', 'GOVERNMENT_LOGIN_SUCCESS', profile.id, {
        ipAddress: '192.168.1.1',
        device: 'Desktop'
      });
      return true;
    }
    
    operationalAuditEngine.record('Security', 'GOVERNMENT_LOGIN_FAILED', employeeId, {
      ipAddress: '192.168.1.1'
    });
    return false;
  }

  async logout(): Promise<void> {
    const profile = useGovernmentAuthStore.getState().profile;
    if (profile) {
      operationalAuditEngine.record('Security', 'GOVERNMENT_LOGOUT', profile.id, {});
    }
    useGovernmentAuthStore.getState().setProfile(null);
    useGovernmentAuthStore.getState().setIsAuthenticated(false);
  }
}

export const governmentAuthService = new GovernmentAuthService();
