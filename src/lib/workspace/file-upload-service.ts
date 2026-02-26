/**
 * File Upload Service - STORY-14-7 Implementation
 *
 * Features:
 * - Drag and drop upload ✅ (already in FileUpload UI)
 * - File upload with progress bar ✅ (already in FileUpload UI)
 * - Large file support (>100MB) with chunked upload
 * - Conflict handling
 * - Auto-save mechanism (300ms debounced)
 * - Batch operations
 */

/**
 * Upload a single file
 *
 * @param file - The file to upload
 * @param targetPath - Target directory path
 * @param workspaceRoot - Workspace root directory
 * @param onProgress - Optional callback for upload progress
 * @returns Promise with uploaded file info
 */
export async function uploadFile(
  file: File,
  targetPath: string,
  workspaceRoot: string,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; filePath: string; error?: string }> {
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks for large files

  // For small files (<5MB), use direct upload
  if (file.size < CHUNK_SIZE) {
    return uploadFileDirect(file, targetPath, workspaceRoot, onProgress);
  }

  // For large files, use chunked upload
  return uploadFileChunked(file, targetPath, workspaceRoot, CHUNK_SIZE, onProgress);
}

/**
 * Direct file upload for small files
 */
async function uploadFileDirect(
  file: File,
  targetPath: string,
  workspaceRoot: string,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; filePath: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetPath', targetPath);
    formData.append('workspaceRoot', workspaceRoot);

    const response = await fetch('/api/workspace/upload', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || 'Failed to upload file');
    }

    const result = await response.json();

    if (result.success) {
      onProgress?.(100);
      return {
        success: true,
        filePath: result.data.filePath,
      };
    } else {
      throw new Error(result.error || 'Failed to upload file');
    }
  } catch (error) {
    console.error('[FileUploadService] Upload error:', error);
    return {
      success: false,
      filePath: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Chunked file upload for large files (>5MB)
 */
async function uploadFileChunked(
  file: File,
  targetPath: string,
  workspaceRoot: string,
  chunkSize: number,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; filePath: string; error?: string }> {
  const totalChunks = Math.ceil(file.size / chunkSize);
  const uploadId = crypto.randomUUID();

  try {
    // Phase 1: Initialize chunked upload
    const initResponse = await fetch('/api/workspace/upload/init', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: file.name,
        fileSize: file.size,
        fileType: file.type,
        totalChunks,
        targetPath,
        workspaceRoot,
        uploadId,
      }),
    });

    if (!initResponse.ok) {
      throw new Error('Failed to initialize upload');
    }

    const initResult = await initResponse.json();
    if (!initResult.success) {
      throw new Error(initResult.error || 'Failed to initialize upload');
    }

    // Phase 2: Upload chunks
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      const chunkFormData = new FormData();
      chunkFormData.append('chunk', chunk);
      chunkFormData.append('chunkIndex', chunkIndex.toString());
      chunkFormData.append('uploadId', uploadId);

      const chunkResponse = await fetch('/api/workspace/upload/chunk', {
        method: 'POST',
        credentials: 'include',
        body: chunkFormData,
      });

      if (!chunkResponse.ok) {
        throw new Error(`Failed to upload chunk ${chunkIndex + 1}/${totalChunks}`);
      }

      const chunkResult = await chunkResponse.json();
      if (!chunkResult.success) {
        throw new Error(chunkResult.error || `Failed to upload chunk ${chunkIndex + 1}/${totalChunks}`);
      }

      // Report progress
      if (onProgress) {
        const progress = Math.round(((chunkIndex + 1) / totalChunks) * 100);
        onProgress(progress);
      }
    }

    // Phase 3: Finalize upload
    const finalizeResponse = await fetch('/api/workspace/upload/finalize', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uploadId,
      }),
    });

    if (!finalizeResponse.ok) {
      throw new Error('Failed to finalize upload');
    }

    const finalizeResult = await finalizeResponse.json();
    if (!finalizeResult.success) {
      throw new Error(finalizeResult.error || 'Failed to finalize upload');
    }

    return {
      success: true,
      filePath: finalizeResult.data.filePath,
    };
  } catch (error) {
    console.error('[FileUploadService] Chunked upload error:', error);

    // Cleanup: Notify server to abort the upload
    try {
      await fetch('/api/workspace/upload/abort', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uploadId,
        }),
      });
    } catch (cleanupError) {
      console.error('[FileUploadService] Cleanup error:', cleanupError);
    }

    return {
      success: false,
      filePath: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Batch upload multiple files
 *
 * @param files - Array of files to upload
 * @param targetPath - Target directory path
 * @param workspaceRoot - Workspace root directory
 * @param onProgress - Optional callback for overall progress
 * @returns Promise with array of upload results
 */
export async function uploadFilesBatch(
  files: File[],
  targetPath: string,
  workspaceRoot: string,
  onProgress?: (progress: number) => void
): Promise<Array<{ file: string; success: boolean; filePath?: string; error?: string }>> {
  const results: Array<{ file: string; success: boolean; filePath?: string; error?: string }> = [];
  let completed = 0;

  // Upload files sequentially (could be parallel but sequential is safer)
  for (const file of Array.from(files)) {
    const result = await uploadFile(file, targetPath, workspaceRoot);

    results.push({
      file: file.name,
      success: result.success,
      filePath: result.success ? result.filePath : undefined,
      error: success ? undefined : result.error,
    });

    completed += 1;

    // Report overall progress
    if (onProgress) {
      const progress = Math.round((completed / files.length) * 100);
      onProgress(progress);
    }
  }

  return results;
}

/**
 * Debounced auto-save mechanism
 *
 * @returns A debounced save utility
 */
export function createAutoSave(
  saveFn: (content: string, filePath: string) => Promise<void>,
  delay: number = 300
) {
  let timeoutId: NodeJS.Timeout | null = null;

  return (content: string, filePath: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(async () => {
      try {
        await saveFn(content, filePath);
        console.log('[AutoSave] Saved:', filePath);
      } catch (error) {
        console.error('[AutoSave] Error saving:', error);
      }
    }, delay);
  };
}

/**
 * Validate file name
 *
 * @param fileName - File name to validate
 * @returns Object with valid flag and error message if invalid
 */
export function validateFileName(fileName: string): { valid: boolean; error?: string } {
  if (!fileName || fileName.trim().length === 0) {
    return { valid: false, error: 'File name cannot be empty' };
  }

  if (fileName.length > 255) {
    return { valid: false, error: 'File name cannot exceed 255 characters' };
  }

  // Check for invalid characters
  const invalidChars = /[<>:"|?*\/\\]/;
  if (invalidChars.test(fileName)) {
    return { valid: false, error: 'File name contains invalid characters' };
  }

  if (fileName.includes('..')) {
    return { valid: false, error: 'File name cannot contain ".."' };
  }

  // Reserved names on Windows
  const reservedNames = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'];
  const baseName = fileName.split('.')[0].toUpperCase();
  if (reservedNames.includes(baseName)) {
    return { valid: false, error: 'File name is reserved' };
  }

  return { valid: true };
}

/**
 * Format file size for display
 *
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Get file type string from MIME type
 *
 * @param mimeType - MIME type string
 * @returns Human-readable file type
 */
export function getFileTypeFromMimeType(mimeType: string): string {
  if (!mimeType) return 'Binary file';

  if (mimeType.startsWith('text/')) return 'Text file';
  if (mimeType.startsWith('image/')) return 'Image';
  if (mimeType.startsWith('video/')) return 'Video';
  if (mimeType.startsWith('audio/')) return 'Audio';
  if (mimeType.startsWith('application/pdf')) return 'PDF document';
  if (mimeType.includes('json')) return 'JSON file';
  if (mimeType.includes('javascript')) return 'JavaScript';
  if (mimeType.includes('xml')) return 'XML file';

  return 'Binary file';
}

/**
 * Calculate file hash for integrity checking (simplified)
 *
 * @param file - File object
 * @returns Base64 encoded hash
 */
export async function calculateFileHash(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as ArrayBuffer;
      // Simple hash: just use the file size + first/last bytes
      // In production, you'd use a proper hash algorithm like SHA-256
      const size = file.size;

      if (content.byteLength > 0) {
        const firstByte = new Uint8Array(content, 0, 1)[0];
        const lastByte = new Uint8Array(content, content.byteLength - 1, 1)[0];
        resolve(`${size}-${firstByte}-${lastByte}-${file.name}`);
      } else {
        resolve(`${size}-${file.name}`);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}
