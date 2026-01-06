/**
 * Privacy Types
 *
 * Type definitions for privacy settings and sharing functionality.
 */

export interface PrivacySettings {
  // Profile Visibility
  allowPublicProfile: boolean;
  allowSearchIndexing: boolean;
  
  // Personal Information
  showEmail: boolean;
  showRealName: boolean;
  
  // Data Sharing
  thirdPartyDataSharing: boolean;
  marketingEmails: boolean;
  analyticsEnabled: boolean;
  
  // Default Visibility
  defaultSkillVisibility: 'public' | 'private';
}

export interface ShareLinkOptions {
  expiresAt?: Date;
  maxAccess?: number;
  password?: string;
}

export interface ShareLink {
  id: string;
  token: string;
  contentId: string;
  contentType: 'skill' | 'businessModel';
  url: string;
  expiresAt: Date | null;
  accessCount: number;
  maxAccess: number | null;
  isActive: boolean;
  createdAt: Date;
}

export interface ContentAccessLog {
  id: string;
  contentId: string;
  contentType: string;
  shareToken: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  visitedAt: Date;
}

export type ContentType = 'skill' | 'businessModel';

export interface PrivacySettingsInput {
  allowPublicProfile?: boolean;
  allowSearchIndexing?: boolean;
  showEmail?: boolean;
  showRealName?: boolean;
  thirdPartyDataSharing?: boolean;
  marketingEmails?: boolean;
  analyticsEnabled?: boolean;
  defaultSkillVisibility?: 'public' | 'private';
}
