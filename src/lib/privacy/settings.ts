import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth/session';

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  skillsVisibility: 'public' | 'private' | 'friends';
  showEmail: boolean;
  showProfileCompleted: boolean;
  allowDataCollection: boolean;
  allowAnalytics: boolean;
  allowMarketingEmails: boolean;
  allowPersonalization: boolean;
  shareUsageMetrics: boolean;
}

const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  profileVisibility: 'private',
  skillsVisibility: 'private',
  showEmail: false,
  showProfileCompleted: false,
  allowDataCollection: true,
  allowAnalytics: true,
  allowMarketingEmails: false,
  allowPersonalization: false,
  shareUsageMetrics: true,
};

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
interface JsonObject { [key: string]: JsonValue }
interface JsonArray extends Array<JsonValue> {}

/**
 * Get user's privacy settings
 */
export async function getUserPrivacySettings(): Promise<PrivacySettings | null> {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { settings: true },
    });

    if (!user || !user.settings) {
      return DEFAULT_PRIVACY_SETTINGS;
    }

    const notifications = (user.settings as JsonObject).notifications;
    if (!notifications || typeof notifications !== 'object') {
      return DEFAULT_PRIVACY_SETTINGS;
    }

    const privacy = (notifications as JsonObject).privacy;
    if (!privacy || typeof privacy !== 'object') {
      return DEFAULT_PRIVACY_SETTINGS;
    }

    return {
      ...DEFAULT_PRIVACY_SETTINGS,
      ...privacy as Partial<PrivacySettings>,
    };
  } catch (error) {
    console.error('Error fetching privacy settings:', error);
    return DEFAULT_PRIVACY_SETTINGS;
  }
}

/**
 * Update user's privacy settings
 */
export async function updateUserPrivacySettings(
  settings: Partial<PrivacySettings>
): Promise<boolean> {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      throw new Error('Not authenticated');
    }

    // Get current settings
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { settings: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Prepare updated settings
    const currentSettings = (user.settings as JsonObject) || {};
    const notifications = (currentSettings.notifications as JsonObject) || {};
    const currentPrivacy = (notifications.privacy as JsonObject) || {};
    const updatedPrivacy = { ...currentPrivacy, ...settings };

    const updatedSettings: JsonObject = {
      ...currentSettings,
      notifications: {
        ...notifications,
        privacy: updatedPrivacy,
      },
    };

    // Update user settings
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        settings: updatedSettings,
      },
    });

    return true;
  } catch (error) {
    console.error('Error updating privacy settings:', error);
    throw error;
  }
}

/**
 * Check if user's profile is visible to another user
 */
export async function isProfileVisibleTo(userAId: string, userBId: string): Promise<boolean> {
  try {
    const userB = await prisma.user.findUnique({
      where: { id: userBId },
      select: { settings: true },
    });

    if (!userB || !userB.settings) {
      return false;
    }

    const settings = userB.settings as JsonObject;
    const notifications = (settings.notifications as JsonObject) || {};
    const privacy = (notifications.privacy as JsonObject) || {};

    if (!privacy.profileVisibility) {
      return false;
    }

    // If it's the same user, always visible
    if (userAId === userBId) {
      return true;
    }

    // Check visibility
    switch (privacy.profileVisibility as string) {
      case 'public':
        return true;
      case 'private':
        return false;
      case 'friends':
        // Check if users are friends (implement friend relationship check)
        // For now, return false
        return false;
      default:
        return false;
    }
  } catch (error) {
    console.error('Error checking profile visibility:', error);
    return false;
  }
}

/**
 * Check if user's skills are visible to another user
 */
export async function areSkillsVisibleTo(userAId: string, userBId: string): Promise<boolean> {
  try {
    const userB = await prisma.user.findUnique({
      where: { id: userBId },
      select: { settings: true },
    });

    if (!userB || !userB.settings) {
      return false;
    }

    const settings = userB.settings as JsonObject;
    const notifications = (settings.notifications as JsonObject) || {};
    const privacy = (notifications.privacy as JsonObject) || {};

    if (!privacy.skillsVisibility) {
      return false;
    }

    // If it's the same user, always visible
    if (userAId === userBId) {
      return true;
    }

    // Check visibility
    switch (privacy.skillsVisibility as string) {
      case 'public':
        return true;
      case 'private':
        return false;
      case 'friends':
        // Check if users are friends
        return false;
      default:
        return false;
    }
  } catch (error) {
    console.error('Error checking skills visibility:', error);
    return false;
  }
}

/**
 * Get user's public profile information based on privacy settings
 */
export async function getPublicProfile(
  userId: string,
  viewerId: string | null
): Promise<{
  name: string | null;
  email: string | null;
  profileCompleted?: boolean;
} | null> {
  try {
    // Check if allowed to view profile
    if (viewerId) {
      const visible = await isProfileVisibleTo(viewerId, userId);
      if (!visible) {
        return null;
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        settings: true,
      },
    });

    if (!user) {
      return null;
    }

    let showEmail = false;
    if (user.settings) {
      const settings = user.settings as JsonObject;
      const notifications = (settings.notifications as JsonObject) || {};
      const privacy = (notifications.privacy as JsonObject) || {};
      showEmail = !!privacy.showEmail;
    }

    return {
      name: user.name,
      email: showEmail ? user.email : null,
    };
  } catch (error) {
    console.error('Error getting public profile:', error);
    return null;
  }
}
