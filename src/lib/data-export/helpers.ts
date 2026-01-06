import { prisma } from '@/lib/db';

/**
 * Gather all user data for export
 *
 * @param userId - The user's ID
 * @returns Aggregated user data
 */
export async function getUserExportData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      skills: {
        select: {
          id: true,
          title: true,
          description: true,
          content: true,
          tags: true,
          category: true,
          difficulty: true,
          isPublic: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      claudeConversations: {
        select: {
          id: true,
          title: true,
          sessionId: true,
          messages: true,
          metadata: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      settings: {
        select: {
          theme: true,
          language: true,
          notifications: true,
          claudePreferences: true,
          autoExpandTools: true,
          showRawParameters: true,
          showThinking: true,
          autoScrollToBottom: true,
          sendByCtrlEnter: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  return user;
}

/**
 * Sanitize user data for export
 * Removes sensitive information
 *
 * @param data - Raw user data
 * @returns Sanitized export data
 */
export function sanitizeExportData(data: any) {
  const sanitized = { ...data };

  // Remove any sensitive fields that might be added in the future
  // For now, we only export non-sensitive fields

  return sanitized;
}

/**
 * Generate export metadata
 *
 * @param userId - The user's ID
 * @param userEmail - The user's email
 * @returns Export metadata object
 */
export function generateExportMetadata(userId: string, userEmail: string) {
  return {
    version: '1.0',
    exportDate: new Date().toISOString(),
    platform: 'AuraForce',
    userId,
    userEmail,
  };
}

/**
 * Format date for export
 *
 * @param date - Date object or ISO string
 * @returns Formatted date string
 */
export function formatDateForExport(date: Date | string | null): string | null {
  if (!date) return null;

  const d = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(d.getTime())) return null;

  return d.toISOString();
}

/**
 * Parse and validate format parameter
 *
 * @param format - Format string from request
 * @returns Valid format or default
 */
export function parseExportFormat(format: string | null): 'json' | 'csv' | 'zip' {
  const validFormats = ['json', 'csv', 'zip'];
  return (format && validFormats.includes(format)) ? (format as any) : 'zip';
}

/**
 * Generate filename for export
 *
 * @param userEmail - User's email
 * @param format - Export format
 * @returns Generated filename
 */
export function generateExportFilename(userEmail: string, format: 'json' | 'csv' | 'zip'): string {
  const date = new Date().toISOString().split('T')[0];
  const safeEmail = userEmail.replace(/[^a-zA-Z0-9]/g, '_');
  return `auraforce-export_${safeEmail}_${date}.${format}`;
}
