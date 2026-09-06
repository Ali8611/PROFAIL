import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface UploadOptions {
  allowedMimes: string[];
  maxSizeInBytes: number;
}

export const UPLOAD_PROFILES = {
  IMAGE: {
    allowedMimes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxSizeInBytes: 5 * 1024 * 1024, // 5MB
  },
  AUDIO: {
    allowedMimes: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'],
    maxSizeInBytes: 15 * 1024 * 1024, // 15MB
  },
  VIDEO: {
    allowedMimes: ['video/mp4', 'video/webm'],
    maxSizeInBytes: 30 * 1024 * 1024, // 30MB
  },
};

export async function saveUploadedFile(
  file: File,
  type: 'IMAGE' | 'AUDIO' | 'VIDEO'
): Promise<{ success: boolean; url?: string; error?: string }> {
  const profile = UPLOAD_PROFILES[type];

  // Validate MIME type
  if (!profile.allowedMimes.includes(file.type)) {
    return {
      success: false,
      error: `Invalid file format: ${file.type}. Allowed: ${profile.allowedMimes.join(', ')}`,
    };
  }

  // Validate size
  if (file.size > profile.maxSizeInBytes) {
    const maxMb = Math.round(profile.maxSizeInBytes / (1024 * 1024));
    return {
      success: false,
      error: `File exceeds maximum allowed size of ${maxMb}MB`,
    };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Target upload directory inside public
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate safe unique filename
    const ext = path.extname(file.name) || (type === 'AUDIO' ? '.mp3' : type === 'VIDEO' ? '.mp4' : '.jpg');
    const safeName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext.toLowerCase()}`;
    const filePath = path.join(uploadsDir, safeName);

    fs.writeFileSync(filePath, buffer);

    return {
      success: true,
      url: `/uploads/${safeName}`,
    };
  } catch (err: any) {
    console.error('File write error:', err);
    return {
      success: false,
      error: 'Failed to write uploaded file to storage',
    };
  }
}
