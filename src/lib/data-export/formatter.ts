import { getUserExportData, generateExportMetadata, formatDateForExport } from './helpers';
import type { User } from '@prisma/client';

export interface ExportData {
  exportVersion: string;
  exportDate: string;
  user: UserData;
  skills: any[];
  conversations: any[];
  settings: any;
}

interface UserData {
  id: string;
  name: string | null;
  email: string;
  emailVerified: string | null;
  image: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

/**
 * Format user data as JSON
 *
 * @param userId - The user's ID
 * @returns JSON string of export data
 */
export async function formatAsJSON(userId: string): Promise<string> {
  const data = await getUserExportData(userId);

  if (!data) {
    throw new Error('User not found');
  }

  const exportData: ExportData = {
    exportVersion: '1.0',
    exportDate: new Date().toISOString(),
    user: {
      id: data.id,
      name: data.name,
      email: data.email,
      emailVerified: formatDateForExport(data.emailVerified),
      image: data.image,
      createdAt: formatDateForExport(data.createdAt),
      updatedAt: formatDateForExport(data.updatedAt),
    },
    skills: data.skills.map(skill => ({
      id: skill.id,
      title: skill.title,
      description: skill.description,
      content: skill.content,
      tags: skill.tags,
      category: skill.category,
      difficulty: skill.difficulty,
      isPublic: skill.isPublic,
      createdAt: formatDateForExport(skill.createdAt),
      updatedAt: formatDateForExport(skill.updatedAt),
    })),
    conversations: data.claudeConversations.map(conv => ({
      id: conv.id,
      title: conv.title,
      sessionId: conv.sessionId,
      messages: conv.messages,
      status: conv.status,
      createdAt: formatDateForExport(conv.createdAt),
      updatedAt: formatDateForExport(conv.updatedAt),
    })),
    settings: data.settings || null,
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Format user data as CSV
 *
 * @param userId - The user's ID
 * @returns CSV string of export data
 */
export async function formatAsCSV(userId: string): Promise<string> {
  const data = await getUserExportData(userId);

  if (!data) {
    throw new Error('User not found');
  }

  const lines: string[] = [];

  // Header for skills
  lines.push('type,id,title,description,tags,category,difficulty,isPublic,createdAt');

  // Skills data
  for (const skill of data.skills) {
    const tags = Array.isArray(skill.tags) ? `"${skill.tags.join(',')}"` : '';
    const title = skill.title !== null ? skill.title : '';
    const description = skill.description !== null ? skill.description : '';
    const category = skill.category !== null ? skill.category : '';
    const difficulty = skill.difficulty !== null ? skill.difficulty : '';
    const isPublic = skill.isPublic;

    lines.push(
      `Skill,${skill.id},"${escapeCSV(title)}","${escapeCSV(description)}",${tags},${category},${difficulty},${isPublic},${formatDateForExport(skill.createdAt)}`
    );
  }

  // Header for conversations
  lines.push('');
  lines.push('type,id,title,sessionId,status,createdAt');

  // Conversations data
  for (const conv of data.claudeConversations) {
    const title = conv.title !== null ? conv.title : '';
    const sessionId = conv.sessionId !== null ? conv.sessionId : '';

    lines.push(
      `Conversation,${conv.id},"${escapeCSV(title)}",${sessionId},${conv.status},${formatDateForExport(conv.createdAt)}`
    );
  }

  // User profile
  lines.push('');
  lines.push('type,id,name,email,emailVerified,image,createdAt,updatedAt');
  lines.push(
    `User,${data.id},"${escapeCSV(data.name || '')}",${data.email},"${data.image || ''}",${formatDateForExport(data.createdAt) || ''},${formatDateForExport(data.updatedAt) || ''}`
  );

  return lines.join('\n');
}

/**
 * Format user data as package (combines JSON and CSV)
 * Returns an object with the files
 *
 * @param userId - The user's ID
 * @returns Object with file names and content
 */
export async function formatAsPackage(userId: string): Promise<{ [filename: string]: string }> {
  const jsonData = await formatAsJSON(userId);
  const csvData = await formatAsCSV(userId);

  return {
    'export.json': jsonData,
    'export.csv': csvData,
    'README.txt': `AuraForce Data Export
=====================

This package contains your AuraForce account data.

Files:
- export.json: Your complete data in JSON format
- export.csv: Your data in CSV format (skills and conversations)

Export Date: ${new Date().toISOString()}

You can use this data to:
1. Keep a backup of your information
2. Transfer to another service
3. Analyze your usage patterns

If you have questions, please contact support.
`,
  };
}

/**
 * Generate filename for export
 *
 * @param userEmail - User's email
 * @param format - Export format
 * @returns Generated filename
 */
export function generateExportFilename(userEmail: string, format: 'json' | 'csv'): string {
  const date = new Date().toISOString().split('T')[0];
  const safeEmail = userEmail.replace(/[^a-zA-Z0-9]/g, '_');
  return `auraforce-export_${safeEmail}_${date}.${format}`;
}

/**
 * Escape CSV field values
 *
 * @param value - The value to escape
 * @returns Escaped value
 */
function escapeCSV(value: string): string {
  return value.replace(/"/g, '""');
}

/**
 * Get content type for format
 *
 * @param format - Export format
 * @returns Content-Type header value
 */
export function getContentType(format: 'json' | 'csv' | 'zip'): string {
  const types = {
    json: 'application/json',
    csv: 'text/csv',
    zip: 'application/zip',
  };
  return types[format];
}
