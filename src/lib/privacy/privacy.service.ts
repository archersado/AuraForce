/**
 * Privacy Service
 *
 * Handles privacy settings management and content sharing functionality.
 */

import { prisma } from '@/lib/prisma';
import {
  PrivacySettings,
  ShareLinkOptions,
  ShareLink,
  ContentAccessLog,
  ContentType,
  PrivacySettingsInput,
} from './types';

export class PrivacyService {
  /**
   * Get user's privacy settings
   */
  async getPrivacySettings(userId: string): Promise<PrivacySettings> {
    let settings = await prisma.userPrivacySettings.findUnique({
      where: { userId },
    });

    // Create default settings if not exist
    if (!settings) {
      settings = await prisma.userPrivacySettings.create({
        data: { userId },
      });
    }

    return {
      allowPublicProfile: settings.allowPublicProfile,
      allowSearchIndexing: settings.allowSearchIndexing,
      showEmail: settings.showEmail,
      showRealName: settings.showRealName,
      thirdPartyDataSharing: settings.thirdPartyDataSharing,
      marketingEmails: settings.marketingEmails,
      analyticsEnabled: settings.analyticsEnabled,
      defaultSkillVisibility: settings.defaultSkillVisibility as 'public' | 'private',
    };
  }

  /**
   * Update user's privacy settings
   */
  async updatePrivacySettings(userId: string, data: PrivacySettingsInput): Promise<PrivacySettings> {
    const settings = await prisma.userPrivacySettings.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });

    return {
      allowPublicProfile: settings.allowPublicProfile,
      allowSearchIndexing: settings.allowSearchIndexing,
      showEmail: settings.showEmail,
      showRealName: settings.showRealName,
      thirdPartyDataSharing: settings.thirdPartyDataSharing,
      marketingEmails: settings.marketingEmails,
      analyticsEnabled: settings.analyticsEnabled,
      defaultSkillVisibility: settings.defaultSkillVisibility as 'public' | 'private',
    };
  }

  /**
   * Generate a shareable link for content
   */
  async generateShareLink(
    userId: string,
    contentId: string,
    contentType: ContentType,
    options?: ShareLinkOptions
  ): Promise<ShareLink> {
    // Verify user owns the content
    if (contentType === 'skill') {
      const skill = await prisma.skill.findUnique({
        where: { id: contentId },
      });

      if (!skill || skill.userId !== userId) {
        throw new Error('Content not found or access denied');
      }
    }

    // Generate secure token
    const token = this.generateSecureToken();
    const expiresAt = options?.expiresAt;

    const shareToken = await prisma.shareToken.create({
      data: {
        userId,
        contentId,
        contentType,
        token,
        expiresAt: expiresAt || null,
        maxAccess: options?.maxAccess || null,
        password: options?.password || null,
      },
    });

    return {
      id: shareToken.id,
      token: shareToken.token,
      contentId: shareToken.contentId,
      contentType: shareToken.contentType as ContentType,
      url: `/share/${shareToken.token}`,
      expiresAt: shareToken.expiresAt,
      accessCount: shareToken.accessCount,
      maxAccess: shareToken.maxAccess,
      isActive: shareToken.isActive,
      createdAt: shareToken.createdAt,
    };
  }

  /**
   * Validate a share link and log access
   */
  async validateShareLink(
    token: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ valid: boolean; contentId?: string; contentType?: ContentType }> {
    const shareToken = await prisma.shareToken.findUnique({
      where: { token },
    });

    if (!shareToken) {
      return { valid: false };
    }

    // Check if active
    if (!shareToken.isActive) {
      return { valid: false };
    }

    // Check expiration
    if (shareToken.expiresAt && shareToken.expiresAt < new Date()) {
      return { valid: false };
    }

    // Check max access
    if (shareToken.maxAccess && shareToken.accessCount >= shareToken.maxAccess) {
      return { valid: false };
    }

    // Increment access count
    await prisma.shareToken.update({
      where: { id: shareToken.id },
      data: { accessCount: { increment: 1 } },
    });

    // Log access
    await prisma.contentAccessLog.create({
      data: {
        contentId: shareToken.contentId,
        contentType: shareToken.contentType,
        shareToken: shareToken.token,
        ipAddress,
        userAgent,
      },
    });

    return {
      valid: true,
      contentId: shareToken.contentId,
      contentType: shareToken.contentType as ContentType,
    };
  }

  /**
   * Revoke a share link
   */
  async revokeShareLink(userId: string, tokenId: string): Promise<void> {
    const shareToken = await prisma.shareToken.findUnique({
      where: { id: tokenId },
    });

    if (!shareToken || shareToken.userId !== userId) {
      throw new Error('Share link not found or access denied');
    }

    await prisma.shareToken.update({
      where: { id: tokenId },
      data: { isActive: false },
    });
  }

  /**
   * Get all share links for a user
   */
  async getUserShareLinks(userId: string): Promise<ShareLink[]> {
    const shareTokens = await prisma.shareToken.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return shareTokens.map((st) => ({
      id: st.id,
      token: st.token,
      contentId: st.contentId,
      contentType: st.contentType as ContentType,
      url: `/share/${st.token}`,
      expiresAt: st.expiresAt,
      accessCount: st.accessCount,
      maxAccess: st.maxAccess,
      isActive: st.isActive,
      createdAt: st.createdAt,
    }));
  }

  /**
   * Get access logs for content
   */
  async getContentAccessLogs(contentId: string): Promise<ContentAccessLog[]> {
    const logs = await prisma.contentAccessLog.findMany({
      where: { contentId },
      orderBy: { visitedAt: 'desc' },
      take: 100,
    });

    return logs.map((log) => ({
      id: log.id,
      contentId: log.contentId,
      contentType: log.contentType,
      shareToken: log.shareToken,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      visitedAt: log.visitedAt,
    }));
  }

  /**
   * Toggle content visibility (private/public)
   */
  async toggleContentVisibility(userId: string, contentId: string, isPublic: boolean, contentType: ContentType): Promise<void> {
    if (contentType === 'skill') {
      const skill = await prisma.skill.findUnique({
        where: { id: contentId },
      });

      if (!skill || skill.userId !== userId) {
        throw new Error('Content not found or access denied');
      }

      await prisma.skill.update({
        where: { id: contentId },
        data: { isPublic },
      });
    }
  }

  /**
   * Export all user data (GDPR right to access)
   */
  async exportAllUserData(userId: string): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        createdAt: true,
      },
    });

    const skills = await prisma.skill.findMany({
      where: { userId },
    });

    const conversations = await prisma.claudeConversation.findMany({
      where: { userId },
    });

    const settings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    const privacySettings = await prisma.userPrivacySettings.findUnique({
      where: { userId },
    });

    const shareLinks = await prisma.shareToken.findMany({
      where: { userId },
    });

    const exportData = {
      user,
      skills,
      conversations,
      settings,
      privacySettings,
      shareLinks,
      exportedAt: new Date().toISOString(),
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Request account deletion (GDPR right to erasure)
   */
  async requestAccountDeletion(userId: string): Promise<void> {
    // Mark user for deletion with a 30-day grace period
    await prisma.user.update({
      where: { id: userId },
      data: {
        email: `deleted_${userId}@auraforce.local`,
        name: 'Deleted User',
        pendingEmail: null,
        pendingEmailToken: null,
      },
    });

    // Deactivate all share links
    await prisma.shareToken.updateMany({
      where: { userId },
      data: { isActive: false },
    });

    // Make all content private
    await prisma.skill.updateMany({
      where: { userId },
      data: { isPublic: false },
    });
  }

  /**
   * Generate a cryptographically secure random token
   */
  private generateSecureToken(): string {
    const array = new Uint8Array(24);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }
}

// Export singleton instance
export const privacyService = new PrivacyService();
