export type OperationalRole = 
  | 'SuperAdministrator'
  | 'DistrictCollector'
  | 'Police'
  | 'Health'
  | 'Transport'
  | 'TempleAdministration'
  | 'Executive';

export interface PermissionContext {
  userId: string;
  roles: OperationalRole[];
  assignedZones?: string[];
}

export class PermissionEngine {
  
  static canExecuteAction(context: PermissionContext, requiredRole: OperationalRole): boolean {
    if (context.roles.includes('SuperAdministrator')) return true;
    return context.roles.includes(requiredRole);
  }

  static canAccessZone(context: PermissionContext, zoneId: string): boolean {
    if (context.roles.includes('SuperAdministrator')) return true;
    if (context.roles.includes('DistrictCollector')) return true; 
    return context.assignedZones?.includes(zoneId) || false;
  }
}
