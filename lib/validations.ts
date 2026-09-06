import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and dashes'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  login: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const profileUpdateSchema = z.object({
  displayName: z.string().min(1, 'Display name is required').max(50),
  bio: z.string().max(500).optional().default(''),
  location: z.string().max(100).optional().default(''),
  pronouns: z.string().max(50).optional().default(''),
  avatarUrl: z.string().optional().default(''),
  bannerUrl: z.string().optional().default(''),
  backgroundType: z.enum(['COLOR', 'GRADIENT', 'IMAGE', 'VIDEO']).default('COLOR'),
  backgroundUrl: z.string().optional().default(''),
  backgroundColor: z.string().default('#0a0a0f'),
  accentColor: z.string().default('#9d4edd'),
  textColor: z.string().default('#ffffff'),
  cardColor: z.string().default('rgba(18, 18, 28, 0.75)'),
  backgroundBlur: z.coerce.number().min(0).max(30).default(0),
  overlayOpacity: z.coerce.number().min(0).max(1).default(0.4),
  fontFamily: z.string().default('Inter'),
  effectGlow: z.boolean().default(true),
  effectFloat: z.boolean().default(false),
  themeId: z.string().optional().default('cyber'),
  customCss: z.string().optional().default(''),
  isGuestbookEnabled: z.boolean().default(true),
  musicAutoplay: z.boolean().default(false),
  musicLoop: z.boolean().default(true),
  showSpotify: z.boolean().default(true),
  showDiscord: z.boolean().default(true),
  discordActivity: z.string().optional().default(''),
  spotifyTrack: z.string().optional().default(''),
  spotifyArtist: z.string().optional().default(''),
  spotifyCover: z.string().optional().default(''),
  spotifyUrl: z.string().optional().default(''),
});

export const linkSchema = z.object({
  platform: z.string().min(1),
  label: z.string().min(1, 'Label is required').max(100),
  url: z.string().url('Must be a valid URL'),
  icon: z.string().optional().default(''),
  style: z.enum(['filled', 'outline', 'glass', 'neon']).default('filled'),
  isEnabled: z.boolean().default(true),
});

export const commentSchema = z.object({
  authorName: z.string().min(2, 'Name must be at least 2 characters').max(40),
  message: z.string().min(2, 'Message must be at least 2 characters').max(300),
});

export const reportSchema = z.object({
  targetType: z.enum(['PROFILE', 'COMMENT']),
  targetId: z.string().min(1),
  profileId: z.string().optional(),
  reason: z.enum(['Spam', 'Harassment', 'NSFW', 'Scam', 'Impersonation', 'Illegal content', 'Other']),
  details: z.string().max(500).optional(),
});

export const badgeSchema = z.object({
  slug: z.string().min(2).max(30).regex(/^[a-z0-9-]+$/),
  name: z.string().min(2).max(50),
  icon: z.string().min(1).max(10),
  description: z.string().max(200),
  color: z.string().default('#9d4edd'),
});
