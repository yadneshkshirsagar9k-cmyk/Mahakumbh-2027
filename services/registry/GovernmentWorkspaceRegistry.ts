import { GovernmentRole } from '@/types/government';

export interface WorkspaceMetadata {
  workspaceId: string;
  displayName: string;
  department: string;
  route: string;
  requiredRoles: GovernmentRole[];
  description: string;
}

export class GovernmentWorkspaceRegistry {
  private workspaces: Map<string, WorkspaceMetadata> = new Map();

  register(workspace: WorkspaceMetadata) {
    this.workspaces.set(workspace.workspaceId, workspace);
  }

  get(workspaceId: string): WorkspaceMetadata | undefined {
    return this.workspaces.get(workspaceId);
  }

  getAll(): WorkspaceMetadata[] {
    return Array.from(this.workspaces.values());
  }

  getAvailableForRole(roles: GovernmentRole[]): WorkspaceMetadata[] {
    if (roles.includes('SuperAdministrator')) return this.getAll();
    return this.getAll().filter(w => w.requiredRoles.some(r => roles.includes(r)));
  }
}

export const governmentWorkspaceRegistry = new GovernmentWorkspaceRegistry();

// Initialize the 12 core departments
[
  { id: 'police', name: 'Police' },
  { id: 'health', name: 'Health' },
  { id: 'fire', name: 'Fire' },
  { id: 'transport', name: 'Transport' },
  { id: 'temple', name: 'Temple Administration' },
  { id: 'municipal', name: 'Municipal Corporation' },
  { id: 'water', name: 'Water Supply' },
  { id: 'electricity', name: 'Electricity' },
  { id: 'sanitation', name: 'Sanitation' },
  { id: 'disaster', name: 'Disaster Management' },
  { id: 'volunteer', name: 'Volunteer Coordination' },
  { id: 'executive', name: 'Executive Operations' }
].forEach(dept => {
  governmentWorkspaceRegistry.register({
    workspaceId: dept.id,
    displayName: `${dept.name} Workspace`,
    department: dept.name,
    route: `/government/workspaces/${dept.id}`,
    requiredRoles: ['SuperAdministrator', 'Executive'], // Will add specific roles later
    description: `Operational workspace for ${dept.name} department`
  });
});
