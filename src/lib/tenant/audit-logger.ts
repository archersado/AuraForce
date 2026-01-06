/**
 * Tenant Audit Logger
 *
 * Handles activity logging for tenant management and compliance.
 */

import { prisma } from '@/lib/prisma';

export enum TenantAuditAction {
  TENANT_CREATED = 'TENANT_CREATED',
  TENANT_UPDATED = 'TENANT_UPDATED',
  MEMBER_ADDED = 'MEMBER_ADDED',
  MEMBER_REMOVED = 'MEMBER_REMOVED',
  ROLE_CHANGED = 'ROLE_CHANGED',
  SETTINGS_UPDATED = 'SETTINGS_UPDATED',
  USAGE_VIEWED = 'USAGE_VIEWED',
  DATA_EXPORTED = 'DATA_EXPORTED',
}

export interface AuditLogEntry {
  tenantId: string;
  userId: string;
  action: TenantAuditAction;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export class TenantAuditLogger {
  /**
   * Log an audit event
   */
  async log(entry: AuditLogEntry): Promise<void> {
    try {
      await prisma.tenantAuditLog.create({
        data: entry,
      });
    } catch (error) {
      console.error('Failed to log tenant audit event:', error);
      // Don't throw - audit logging failures shouldn't break the application
    }
  }

  /**
   * Log tenant creation
   */
  async logTenantCreated(tenantId: string, userId: string, tenantName: string): Promise<void> {
    await this.log({
      tenantId,
      userId,
      action: TenantAuditAction.TENANT_CREATED,
      details: { tenantName },
    });
  }

  /**
   * Log member added to tenant
   */
  async logMemberAdded(
    tenantId: string,
    adminUserId: string,
    targetUserId: string,
    targetEmail: string,
    role: string
  ): Promise<void> {
    await this.log({
      tenantId,
      userId: adminUserId,
      action: TenantAuditAction.MEMBER_ADDED,
      details: { targetUserId, targetEmail, role },
    });
  }

  /**
   * Log member removed from tenant
   */
  async logMemberRemoved(
    tenantId: string,
    adminUserId: string,
    targetUserId: string,
    targetEmail: string
  ): Promise<void> {
    await this.log({
      tenantId,
      userId: adminUserId,
      action: TenantAuditAction.MEMBER_REMOVED,
      details: { targetUserId, targetEmail },
    });
  }

  /**
   * Log role change
   */
  async logRoleChanged(
    tenantId: string,
    adminUserId: string,
    targetUserId: string,
    targetEmail: string,
    oldRole: string,
    newRole: string
  ): Promise<void> {
    await this.log({
      tenantId,
      userId: adminUserId,
      action: TenantAuditAction.ROLE_CHANGED,
      details: { targetUserId, targetEmail, oldRole, newRole },
    });
  }

  /**
   * Log settings update
   */
  async logSettingsUpdated(
    tenantId: string,
    userId: string,
    changes: Record<string, any>
  ): Promise<void> {
    await this.log({
      tenantId,
      userId,
      action: TenantAuditAction.SETTINGS_UPDATED,
      details: { changes },
    });
  }

  /**
   * Get audit logs for a tenant
   */
  async getTenantAuditLogs(tenantId: string, limit = 100) {
    return prisma.tenantAuditLog.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Get audit logs by action
   */
  async getAuditLogsByAction(
    tenantId: string,
    action: TenantAuditAction,
    limit = 50
  ) {
    return prisma.tenantAuditLog.findMany({
      where: { tenantId, action },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Get audit logs by user
   */
  async getUserAuditLogs(tenantId: string, userId: string, limit = 100) {
    return prisma.tenantAuditLog.findMany({
      where: { tenantId, userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Get audit logs by date range
   */
  async getAuditLogsByDateRange(
    tenantId: string,
    startDate: Date,
    endDate: Date,
    limit = 100
  ) {
    return prisma.tenantAuditLog.findMany({
      where: {
        tenantId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}

// Export singleton instance
export const tenantAuditLogger = new TenantAuditLogger();
