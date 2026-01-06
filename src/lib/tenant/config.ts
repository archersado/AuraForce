/**
 * Tenant Configuration
 *
 * Defines tenant settings schema, defaults, and utilities.
 */

export interface TenantSettings {
  branding: TenantBranding;
  features: TenantFeatures;
  quotas: TenantQuotas;
  notifications: TenantNotifications;
  // Additional settings for UI compatibility
  allowRegistration?: boolean;
  requireEmailVerification?: boolean;
  maxProjectsPerUser?: number;
}

export interface TenantBranding {
  logoUrl?: string;
  theme?: 'light' | 'dark' | 'system';
  customColors?: TenantColors;
}

export interface TenantColors {
  primary?: string;
  secondary?: string;
}

export interface TenantFeatures {
  allowPublicSkills: boolean;
  allowSkillSharing: boolean;
  enableAuditLogging: boolean;
}

export interface TenantQuotas {
  maxSkills: number;
  maxBusinessModels: number;
  maxMembers: number;
}

export interface TenantNotifications {
  inviteNotifications: boolean;
  activityDigest: boolean;
  billingAlerts: boolean;
}

export interface CreateTenantDto {
  name: string;
  description?: string;
  settings?: Partial<TenantSettings>;
}

export interface UpdateTenantDto {
  name?: string;
  description?: string;
  settings?: Partial<TenantSettings>;
  isActive?: boolean;
}

export interface TenantUsage {
  members: number;
  skills: number;
  createdAt: Date;
  subscriptionPlan: string;
  // Additional fields for UI compatibility
  memberCount?: number;
  maxMembers?: number;
  projectCount?: number;
  storageUsedMB?: number;
  storageLimitMB?: number;
}

export interface MemberUsage {
  userId: string;
  userName: string;
  userEmail: string;
  skillsCreated: number;
  lastActive: Date | null;
}

// Default tenant settings
export const DEFAULT_TENANT_SETTINGS: TenantSettings = {
  branding: {
    logoUrl: undefined,
    theme: 'system',
    customColors: undefined,
  },
  features: {
    allowPublicSkills: true,
    allowSkillSharing: true,
    enableAuditLogging: true,
  },
  quotas: {
    maxSkills: 100,
    maxBusinessModels: 50,
    maxMembers: 10,
  },
  notifications: {
    inviteNotifications: true,
    activityDigest: true,
    billingAlerts: true,
  },
  // Default UI settings
  allowRegistration: false,
  requireEmailVerification: true,
  maxProjectsPerUser: 10,
};

export function mergeTenantSettings(
  settings: Partial<TenantSettings> = {}
): TenantSettings {
  return {
    branding: { ...DEFAULT_TENANT_SETTINGS.branding, ...settings.branding },
    features: { ...DEFAULT_TENANT_SETTINGS.features, ...settings.features },
    quotas: { ...DEFAULT_TENANT_SETTINGS.quotas, ...settings.quotas },
    notifications: { ...DEFAULT_TENANT_SETTINGS.notifications, ...settings.notifications },
  };
}

export function validateTenantSettings(settings: Partial<TenantSettings>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (settings.branding?.customColors?.primary) {
    if (!/^#[0-9A-Fa-f]{6}$/.test(settings.branding.customColors.primary)) {
      errors.push('Primary color must be a valid hex color code');
    }
  }

  if (settings.branding?.customColors?.secondary) {
    if (!/^#[0-9A-Fa-f]{6}$/.test(settings.branding.customColors.secondary)) {
      errors.push('Secondary color must be a valid hex color code');
    }
  }

  if (settings.quotas && typeof settings.quotas === 'object') {
    if (settings.quotas.maxSkills !== undefined && settings.quotas.maxSkills < 0) {
      errors.push('Max skills must be a positive number');
    }
    if (settings.quotas.maxBusinessModels !== undefined && settings.quotas.maxBusinessModels < 0) {
      errors.push('Max business models must be a positive number');
    }
    if (settings.quotas.maxMembers !== undefined && settings.quotas.maxMembers < 1) {
      errors.push('Max members must be at least 1');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
