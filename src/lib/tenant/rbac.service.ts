/**
 * Role-Based Access Control for Tenants
 *
 * Handles role definitions, permissions, and access control checks.
 */

export enum TenantRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
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
  [TenantRole.EDITOR]: {
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

export interface TenantMember {
  id: string;
  name: string | null;
  email: string;
  role: TenantRole;
  avatar: string | null;
  createdAt: Date;
}

export function getRolePermissions(role: TenantRole): Permissions {
  return ROLE_PERMISSIONS[role];
}

export function hasPermission(role: TenantRole, permission: keyof Permissions): boolean {
  return ROLE_PERMISSIONS[role][permission];
}

export function requirePermission(role: TenantRole, permission: keyof Permissions): void {
  if (!hasPermission(role, permission)) {
    throw new Error(
      `Permission denied: Tenant role ${role} does not have permission ${permission}`
    );
  }
}

export function getRoleDisplayName(role: TenantRole): string {
  const displayNames: Record<TenantRole, string> = {
    [TenantRole.ADMIN]: '管理员',
    [TenantRole.EDITOR]: '编辑者',
    [TenantRole.MEMBER]: '成员',
    [TenantRole.VIEWER]: '查看者',
  };
  return displayNames[role];
}

export function getRoleDescription(role: TenantRole): string {
  const descriptions: Record<TenantRole, string> = {
    [TenantRole.ADMIN]: '完整的租户管理权限，可以邀请成员、分配角色和管理设置',
    [TenantRole.EDITOR]: '可以创建和编辑内容，但不能管理成员或设置',
    [TenantRole.MEMBER]: '可以创建和管理技能，查看租户内容和使用统计',
    [TenantRole.VIEWER]: '只读权限，可以查看租户内的技能和使用统计',
  };
  return descriptions[role];
}
