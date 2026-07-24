export type GovernmentRole = 
  | 'SuperAdministrator'
  | 'NTKMA_Administrator'
  | 'DistrictCollector'
  | 'PoliceCommand'
  | 'HealthCommand'
  | 'TransportCommand'
  | 'DisasterManagement'
  | 'TempleAdministration'
  | 'MunicipalCorporation'
  | 'WaterSupply'
  | 'ElectricityDepartment'
  | 'SanitationDepartment'
  | 'FireDepartment'
  | 'VolunteerCoordination'
  | 'Executive';

export type AccountStatus = 
  | 'PendingVerification' 
  | 'Active' 
  | 'Inactive' 
  | 'Suspended' 
  | 'Locked' 
  | 'Rejected' 
  | 'Archived';

export type ApprovalAction = 
  | 'Approve' 
  | 'Reject' 
  | 'RequestAdditionalInformation' 
  | 'RequestDocuments' 
  | 'SuspendReview' 
  | 'Escalate';

export interface GovernmentSession {
  sessionId: string;
  device: string;
  browser: string;
  os: string;
  ipAddress: string;
  loginTime: number;
  lastActivity: number;
}

export interface SecurityPolicy {
  forcePasswordReset: boolean;
  credentialExpirationDate?: number;
  temporarySuspensionUntil?: number;
  mfaEnabled: boolean;
  failedLoginAttempts: number;
}

export interface OfficerProfile {
  id: string;
  fullName: string;
  employeeId: string;
  department: string;
  designation: string;
  officialEmail: string;
  officialMobile: string;
  district: string;
  officeLocation: string;
  officeAddress: string;
  reportingAuthority: string;
  employeeCategory: string;
  
  role: GovernmentRole;
  status: AccountStatus;
  
  clearanceLevel: number;
  assignedRegions: string[];
  assignedDepartments: string[];
  emergencyContact: string;
  
  activeSessions: GovernmentSession[];
  securityPolicy: SecurityPolicy;
  lastLogin?: number;
  
  // Directory & Operational fields
  availability: 'Online' | 'Offline' | 'Busy' | 'Deployed';
  currentAssignment?: string;
  currentWorkspace?: string;
}
