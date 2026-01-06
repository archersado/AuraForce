// RBAC (Role-Based Access Control) definitions and permissions

export enum TenantRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER',
}

export interface Permissions {
  // Member management
  inviteMember: boolean;
  removeMember: boolean;
  updateMemberRole: boolean;

  // Content management
  createSkill: boolean;
  updateSkill: boolean;
  deleteSkill: boolean;
  viewAllSkills: boolean;

  // Tenant management
  updateSettings: boolean;
  viewUsage: boolean;
  manageBilling: boolean;
  exportData: boolean;

  // Audit
  viewAuditLogs: boolean;
}

export const ROLE_PERMISSIONS: Record<TenantRole, Permissions> = {
  [TenantRole.ADMIN]: {
    inviteMember: true,
    removeMember: true,
    updateMemberRole: true,
    createSkill: true,
    updateSkill: true,
    deleteSkill: true,
    viewAllSkills: true,
    updateSettings: true,
    viewUsage: true,
    manageBilling: true,
    exportData: true,
    viewAuditLogs: true,
  },
  [TenantRole.MEMBER]: {
    inviteMember: false,
    removeMember: false,
    updateMemberRole: false,
    createSkill: true,
    updateSkill: true,
    deleteSkill: true,
    viewAllSkills: true,
    updateSettings: false,
    viewUsage: true,
    manageBilling: false,
    exportData: false,
    viewAuditLogs: false,
  },
  [TenantRole.VIEWER]: {
    inviteMember: false,
    removeMember: false,
    updateMemberRole: false,
    createSkill: false,
    updateSkill: false,
    deleteSkill: false,
    viewAllSkills: true,
    updateSettings: false,
    viewUsage: true,
    manageBilling: false,
    exportData: false,
    viewAuditLogs: false,
  },
};

export const ROLE_LABELS: Record<TenantRole, string> = {
  [TenantRole.ADMIN]: '管理员',
  [TenantRole.MEMBER]: '成员',
  [TenantRole.VIEWER]: '查看者',
};

export type PermissionKey = keyof Permissions;
