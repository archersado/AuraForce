/**
 * Tenant Service
 *
 * Handles tenant creation, member management, and tenant operations.
 */

import { prisma } from '@/lib/prisma';
import { TenantRole, requirePermission, TenantMember } from './rbac.service';
import { CreateTenantDto, UpdateTenantDto, TenantUsage, MemberUsage, mergeTenantSettings, validateTenantSettings } from './config';
import { tenantAuditLogger, TenantAuditAction } from './audit-logger';

export class TenantService {
  /**
   * Create a new tenant
   */
  async createTenant(userId: string, data: CreateTenantDto) {
    // Validate user has ENTERPRISE subscription
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionLevel: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.subscriptionLevel !== 'ENTERPRISE') {
      throw new Error('Enterprise subscription required to create a tenant');
    }

    // Validate settings
    if (data.settings) {
      const validation = validateTenantSettings(data.settings);
      if (!validation.valid) {
        throw new Error(`Invalid settings: ${validation.errors.join(', ')}`);
      }
    }

    const settings = mergeTenantSettings(data.settings);

    const tenant = await prisma.tenant.create({
      data: {
        name: data.name,
        description: data.description,
        settings: settings as any,
        plan: 'ENTERPRISE',
        maxMembers: settings.quotas.maxMembers,
      },
    });

    // Add creator as admin
    await prisma.user.update({
      where: { id: userId },
      data: {
        tenantId: tenant.id,
        tenantRole: TenantRole.ADMIN,
      },
    });

    // Log creation
    await tenantAuditLogger.logTenantCreated(tenant.id, userId, tenant.name);

    // Reset user usage metrics for tenant
    await prisma.user.update({
      where: { id: userId },
      data: {
        usageMetrics: {
          skills: 0,
          businessModels: 0,
          apiCalls: 0,
        },
      },
    });

    return tenant;
  }

  /**
   * Get tenant by ID
   */
  async getTenant(tenantId: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new Error('Tenant not found');
    }

    return tenant;
  }

  /**
   * Get user's tenant
   */
  async getUserTenant(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { tenantId: true, tenantRole: true },
    });

    if (!user?.tenantId) {
      return null;
    }

    return this.getTenant(user.tenantId);
  }

  /**
   * Invite a new member to tenant
   */
  async inviteMember(tenantId: string, inviterUserId: string, email: string, role: TenantRole) {
    const tenant = await this.getTenant(tenantId);

    // Check if inviter is admin
    const inviter = await prisma.user.findUnique({
      where: { id: inviterUserId },
      select: { tenantRole: true },
    });

    if (!inviter || inviter.tenantRole !== TenantRole.ADMIN) {
      throw new Error('Only administrators can invite members');
    }

    // Check if user already exists and is in another tenant
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, tenantId: true, tenantRole: true },
    });

    if (existingUser && existingUser.tenantId) {
      if (existingUser.tenantId === tenantId) {
        throw new Error('User is already a member of this tenant');
      }
      throw new Error('User is already a member of another tenant');
    }

    // Check member limit
    const memberCount = await prisma.user.count({
      where: { tenantId },
    });

    if (memberCount >= tenant.maxMembers) {
      throw new Error('Tenant has reached maximum member limit');
    }

    // Create invitation
    const token = this.generateInvitationToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const invitation = await prisma.tenantInvitation.create({
      data: {
        tenantId,
        email,
        role,
        token,
        expiresAt,
      },
    });

    // In production, send email here
    // await this.sendInvitationEmail(email, token, tenant.name, role);

    await tenantAuditLogger.logMemberAdded(tenantId, inviterUserId, email, email, role);

    return invitation;
  }

  /**
   * Accept a tenant invitation
   */
  async acceptInvitation(token: string, userId: string) {
    const invitation = await prisma.tenantInvitation.findUnique({
      where: { token },
      include: { tenant: true },
    });

    if (!invitation) {
      throw new Error('Invalid invitation token');
    }

    if (invitation.status !== 'pending') {
      throw new Error('Invitation is not pending');
    }

    if (invitation.expiresAt < new Date()) {
      await prisma.tenantInvitation.update({
        where: { id: invitation.id },
        data: { status: 'expired' },
      });
      throw new Error('Invitation has expired');
    }

    // Check if user is already in a tenant
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { tenantId: true },
    });

    if (user?.tenantId) {
      if (user.tenantId === invitation.tenantId) {
        await prisma.tenantInvitation.update({
          where: { id: invitation.id },
          data: { status: 'accepted' },
        });
        return { tenantId: invitation.tenantId, role: invitation.role as TenantRole };
      }
      throw new Error('You are already a member of a different tenant');
    }

    // Add user to tenant
    await prisma.user.update({
      where: { id: userId },
      data: {
        tenantId: invitation.tenantId,
        tenantRole: invitation.role,
      },
    });

    // Mark invitation as accepted
    await prisma.tenantInvitation.update({
      where: { id: invitation.id },
      data: { status: 'accepted', acceptedAt: new Date() },
    });

    return { tenantId: invitation.tenantId, role: invitation.role as TenantRole };
  }

  /**
   * Update member role
   */
  async updateMemberRole(tenantId: string, adminUserId: string, targetUserId: string, newRole: TenantRole) {
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, email: true, tenantId: true, tenantRole: true },
    });

    if (!targetUser || targetUser.tenantId !== tenantId) {
      throw new Error('User is not a member of this tenant');
    }

    if (targetUserId === adminUserId) {
      throw new Error('Cannot update your own role');
    }

    // Check if this is the last admin
    if (targetUser.tenantRole === TenantRole.ADMIN && newRole !== TenantRole.ADMIN) {
      const adminCount = await prisma.user.count({
        where: {
          tenantId,
          tenantRole: TenantRole.ADMIN,
        },
      });

      if (adminCount <= 1) {
        throw new Error('Cannot remove the last administrator');
      }
    }

    const oldRole = targetUser.tenantRole as string;

    await prisma.user.update({
      where: { id: targetUserId },
      data: { tenantRole: newRole },
    });

    await tenantAuditLogger.logRoleChanged(
      tenantId,
      adminUserId,
      targetUserId,
      targetUser.email || '',
      oldRole,
      newRole
    );
  }

  /**
   * Remove member from tenant
   */
  async removeMember(tenantId: string, adminUserId: string, targetUserId: string) {
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, email: true, tenantId: true, tenantRole: true },
    });

    if (!targetUser || targetUser.tenantId !== tenantId) {
      throw new Error('User is not a member of this tenant');
    }

    if (targetUserId === adminUserId) {
      throw new Error('Cannot remove yourself from the tenant');
    }

    // Check if this is the last admin
    if (targetUser.tenantRole === TenantRole.ADMIN) {
      const adminCount = await prisma.user.count({
        where: {
          tenantId,
          tenantRole: TenantRole.ADMIN,
        },
      });

      if (adminCount <= 1) {
        throw new Error('Cannot remove the last administrator');
      }
    }

    await prisma.user.update({
      where: { id: targetUserId },
      data: {
        tenantId: null,
        tenantRole: null,
      },
    });

    await tenantAuditLogger.logMemberRemoved(
      tenantId,
      adminUserId,
      targetUserId,
      targetUser.email || ''
    );
  }

  /**
   * Get all tenant members
   */
  async getTenantMembers(tenantId: string): Promise<TenantMember[]> {
    const members = await prisma.user.findMany({
      where: { tenantId },
      select: {
        id: true,
        name: true,
        email: true,
        tenantRole: true,
        image: true,
        createdAt: true,
      },
      orderBy: [
        { tenantRole: 'desc' }, // Admins first
        { name: 'asc' },
      ],
    });

    return members.map(member => ({
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.tenantRole as TenantRole,
      avatar: member.image,
      createdAt: member.createdAt,
    }));
  }

  /**
   * Get tenant usage statistics
   */
  async getTenantUsage(tenantId: string): Promise<TenantUsage> {
    const tenant = await this.getTenant(tenantId);

    const members = await prisma.user.count({
      where: { tenantId },
    });

    const skills = await prisma.skill.count({
      where: { tenantId },
    });

    return {
      members,
      skills,
      createdAt: tenant.createdAt,
      subscriptionPlan: tenant.plan,
    };
  }

  /**
   * Get member usage statistics
   */
  async getMemberUsage(tenantId: string): Promise<MemberUsage[]> {
    const members = await prisma.user.findMany({
      where: { tenantId },
      select: {
        id: true,
        name: true,
        email: true,
        skills: {
          select: {
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    return members.map(member => ({
      userId: member.id,
      userName: member.name || '',
      userEmail: member.email,
      skillsCreated: 0, // Would need to aggregate from skills table
      lastActive: member.skills.length > 0 ? member.skills[0].createdAt : null,
    }));
  }

  /**
   * Update tenant settings
   */
  async updateSettings(tenantId: string, userId: string, settings: any) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { tenantId: true, tenantRole: true },
    });

    if (!user || user.tenantId !== tenantId) {
      throw new Error('You are not a member of this tenant');
    }

    requirePermission(user.tenantRole as TenantRole, 'updateSettings');

    // Validate settings
    const validation = validateTenantSettings(settings);
    if (!validation.valid) {
      throw new Error(`Invalid settings: ${validation.errors.join(', ')}`);
    }

    const tenant = await this.getTenant(tenantId);
    const mergedSettings = mergeTenantSettings(settings);

    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        settings: mergedSettings as any,
      },
    });

    await tenantAuditLogger.logSettingsUpdated(tenantId, userId, settings);

    return this.getTenant(tenantId);
  }

  /**
   * Update tenant details
   */
  async updateTenant(tenantId: string, userId: string, data: UpdateTenantDto) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { tenantId: true, tenantRole: true },
    });

    if (!user || user.tenantId !== tenantId) {
      throw new Error('You are not a member of this tenant');
    }

    requirePermission(user.tenantRole as TenantRole, 'updateSettings');

    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        name: data.name,
        description: data.description,
        isActive: data.isActive,
        settings: data.settings ? (mergeTenantSettings(data.settings) as any) : undefined,
      },
    });

    if (data.settings) {
      await tenantAuditLogger.logSettingsUpdated(tenantId, userId, data.settings);
    }

    return this.getTenant(tenantId);
  }

  /**
   * Generate a random invitation token
   */
  private generateInvitationToken(): string {
    return Buffer.from(Date.now() + Math.random().toString()).toString('base64').substring(0, 32);
  }
}

// Export singleton instance
export const tenantService = new TenantService();
