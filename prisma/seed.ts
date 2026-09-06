import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting WANS database seed...');

  // 1. Seed Badges
  const badgesData = [
    { slug: 'owner', name: 'Owner', icon: '👑', description: 'Platform Creator & Founder', color: '#ffd166', isSystem: true },
    { slug: 'developer', name: 'Developer', icon: '🛠', description: 'Core Platform Engineer', color: '#00f0ff', isSystem: true },
    { slug: 'verified', name: 'Verified', icon: '✓', description: 'Official Verified Identity', color: '#3a86ff', isSystem: true },
    { slug: 'premium', name: 'Premium', icon: '💎', description: 'WANS Diamond Subscriber', color: '#ff007f', isSystem: true },
    { slug: 'early', name: 'Early User', icon: '⭐', description: 'One of the first 100 pioneers', color: '#ffb703', isSystem: true },
    { slug: 'gamer', name: 'Gamer', icon: '🎮', description: 'Competitive Pro Gamer', color: '#9d4edd', isSystem: true },
    { slug: 'popular', name: 'Popular', icon: '🔥', description: 'Trending high-traffic profile', color: '#fb5607', isSystem: true },
    { slug: 'staff', name: 'Staff', icon: '🏆', description: 'Official WANS Community Staff', color: '#06d6a0', isSystem: true },
  ];

  for (const b of badgesData) {
    await prisma.badge.upsert({
      where: { slug: b.slug },
      update: b,
      create: b,
    });
  }
  console.log('✅ Badges seeded');

  // 2. Seed Themes
  const themesData = [
    {
      slug: 'cyber',
      name: 'Cyberpunk Neon',
      previewBg: 'linear-gradient(135deg, #0f0c1b 0%, #1a0933 100%)',
      cardBg: 'rgba(20, 15, 38, 0.82)',
      accentColor: '#00f0ff',
      textColor: '#ffffff',
      borderStyle: 'border-cyan-500/30',
      isPremium: false,
    },
    {
      slug: 'neon-purple',
      name: 'Royal Nebula',
      previewBg: 'linear-gradient(135deg, #090314 0%, #20053b 100%)',
      cardBg: 'rgba(25, 8, 48, 0.85)',
      accentColor: '#9d4edd',
      textColor: '#ffffff',
      borderStyle: 'border-purple-500/30',
      isPremium: false,
    },
    {
      slug: 'dark',
      name: 'Obsidian Midnight',
      previewBg: '#0a0a0f',
      cardBg: 'rgba(18, 18, 24, 0.85)',
      accentColor: '#a855f7',
      textColor: '#ffffff',
      borderStyle: 'border-zinc-800',
      isPremium: false,
    },
    {
      slug: 'crimson',
      name: 'Crimson Blood',
      previewBg: 'linear-gradient(135deg, #120307 0%, #290510 100%)',
      cardBg: 'rgba(38, 8, 17, 0.85)',
      accentColor: '#ff0055',
      textColor: '#ffffff',
      borderStyle: 'border-rose-500/30',
      isPremium: true,
    },
    {
      slug: 'azure',
      name: 'Azure Horizon',
      previewBg: 'linear-gradient(135deg, #040d1a 0%, #08213e 100%)',
      cardBg: 'rgba(8, 28, 54, 0.85)',
      accentColor: '#38bdf8',
      textColor: '#ffffff',
      borderStyle: 'border-sky-500/30',
      isPremium: false,
    },
    {
      slug: 'minimal',
      name: 'Minimal Dark',
      previewBg: '#000000',
      cardBg: '#0d0d11',
      accentColor: '#ffffff',
      textColor: '#ededed',
      borderStyle: 'border-zinc-800',
      isPremium: false,
    },
    {
      slug: 'gaming-rgb',
      name: 'BattleStation RGB',
      previewBg: 'linear-gradient(135deg, #070714 0%, #150a28 100%)',
      cardBg: 'rgba(16, 12, 30, 0.85)',
      accentColor: '#10b981',
      textColor: '#ffffff',
      borderStyle: 'border-emerald-500/40',
      isPremium: true,
    },
    {
      slug: 'glassmorphism',
      name: 'Frosted Glass',
      previewBg: 'linear-gradient(135deg, #18192b 0%, #0b0c16 100%)',
      cardBg: 'rgba(255, 255, 255, 0.05)',
      accentColor: '#c084fc',
      textColor: '#ffffff',
      borderStyle: 'border-white/10',
      isPremium: false,
    },
    {
      slug: 'amoled',
      name: 'Pitch Black AMOLED',
      previewBg: '#000000',
      cardBg: '#050505',
      accentColor: '#e0e7ff',
      textColor: '#ffffff',
      borderStyle: 'border-zinc-900',
      isPremium: true,
    },
  ];

  for (const t of themesData) {
    await prisma.theme.upsert({
      where: { slug: t.slug },
      update: t,
      create: t,
    });
  }
  console.log('✅ Themes seeded');

  // Password hash for all sample accounts: "Password123!"
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 3. Seed Users
  // Account 1: WANS (Admin / Founder)
  const userWans = await prisma.user.upsert({
    where: { username: 'WANS' },
    update: {},
    create: {
      username: 'WANS',
      email: 'admin@wans.gg',
      passwordHash,
      role: 'ADMIN',
      isPremium: true,
      discordUsername: 'WansDev#0001',
      profile: {
        create: {
          displayName: 'WANS',
          bio: 'Founder & Lead Architect at WANS. Building next-generation digital identities and cyber profile systems.',
          location: 'Cyber City, Orbit',
          pronouns: 'he/him',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face',
          backgroundType: 'GRADIENT',
          backgroundColor: '#0a0a14',
          accentColor: '#00f0ff',
          textColor: '#ffffff',
          cardColor: 'rgba(16, 16, 28, 0.85)',
          backgroundBlur: 4,
          overlayOpacity: 0.5,
          fontFamily: 'Inter',
          effectGlow: true,
          effectFloat: true,
          themeId: 'cyber',
          discordActivity: 'Coding WANS 2.0 with Next.js',
          spotifyTrack: 'Resonance',
          spotifyArtist: 'HOME',
          spotifyCover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop',
          spotifyUrl: 'https://open.spotify.com/track/1Tu2x9k00k3c4z5e6f7g8',
          musicAutoplay: false,
          musicLoop: true,
          musicTrack: {
            create: {
              title: 'Synthwave Nightride',
              artist: 'Cyber Dreamers',
              audioUrl: 'https://cdn.freesound.org/previews/573/573539_11861866-lq.mp3',
              coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop',
            },
          },
          links: {
            create: [
              { platform: 'GitHub', label: 'GitHub Repository', url: 'https://github.com', style: 'neon', order: 0, clickCount: 142 },
              { platform: 'Discord', label: 'WANS Official Discord', url: 'https://discord.gg', style: 'neon', order: 1, clickCount: 389 },
              { platform: 'X', label: 'Follow on X', url: 'https://x.com', style: 'glass', order: 2, clickCount: 88 },
              { platform: 'YouTube', label: 'Tech Showcase Channel', url: 'https://youtube.com', style: 'filled', order: 3, clickCount: 215 },
              { platform: 'Website', label: 'Personal Portfolio', url: 'https://wans.gg', style: 'glass', order: 4, clickCount: 94 },
            ],
          },
          guestbook: {
            create: [
              { authorName: 'NeonKnight', authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop', message: 'The smoothest profile builder in the scene! Love the neon glow 🔥', isPinned: true },
              { authorName: 'Astra_Girl', authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', message: 'Music player works like a charm. Outstanding UI.', isPinned: false },
            ],
          },
          views: {
            create: [
              { deviceType: 'desktop', browser: 'Chrome', referrer: 'https://x.com', country: 'United States' },
              { deviceType: 'desktop', browser: 'Firefox', referrer: 'Direct', country: 'Germany' },
              { deviceType: 'mobile', browser: 'Safari', referrer: 'https://discord.gg', country: 'United Kingdom' },
              { deviceType: 'mobile', browser: 'Chrome', referrer: 'Direct', country: 'United States' },
              { deviceType: 'desktop', browser: 'Edge', referrer: 'https://github.com', country: 'Canada' },
            ],
          },
        },
      },
    },
  });

  // Assign Badges to WANS
  const badgesList = await prisma.badge.findMany();
  for (const b of badgesList.filter(x => ['owner', 'developer', 'verified', 'premium'].includes(x.slug))) {
    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId: userWans.id, badgeId: b.id } },
      update: {},
      create: { userId: userWans.id, badgeId: b.id, isVisible: true },
    });
  }

  // Account 2: HACKER
  const userHacker = await prisma.user.upsert({
    where: { username: 'HACKER' },
    update: {},
    create: {
      username: 'HACKER',
      email: 'hacker@wans.gg',
      passwordHash,
      role: 'USER',
      isPremium: true,
      profile: {
        create: {
          displayName: 'HACKER',
          bio: 'Reverse engineer, exploit researcher, cyber sec enthusiast. I break things to make them safer.',
          location: '127.0.0.1',
          pronouns: 'they/them',
          avatarUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop',
          backgroundType: 'SOLID',
          backgroundColor: '#05070a',
          accentColor: '#10b981',
          textColor: '#e6edf3',
          cardColor: 'rgba(8, 14, 18, 0.9)',
          backgroundBlur: 0,
          overlayOpacity: 0.3,
          fontFamily: 'Mono',
          effectGlow: true,
          themeId: 'dark',
          discordActivity: 'Compiling kernel module',
          spotifyTrack: 'Robot Rock',
          spotifyArtist: 'Daft Punk',
          spotifyCover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop',
          links: {
            create: [
              { platform: 'GitHub', label: 'Security Exploits & CVEs', url: 'https://github.com', style: 'neon', order: 0, clickCount: 512 },
              { platform: 'Telegram', label: 'Encrypted Channel', url: 'https://t.me', style: 'outline', order: 1, clickCount: 280 },
              { platform: 'X', label: 'Zero-Day Updates', url: 'https://x.com', style: 'glass', order: 2, clickCount: 167 },
            ],
          },
          guestbook: {
            create: [
              { authorName: 'CipherZero', message: 'Nice writeup on the latest bug bounty!', isPinned: true },
            ],
          },
          views: {
            create: [
              { deviceType: 'desktop', browser: 'Tor Browser', referrer: 'Direct', country: 'Global' },
              { deviceType: 'desktop', browser: 'Firefox', referrer: 'https://reddit.com', country: 'Switzerland' },
            ],
          },
        },
      },
    },
  });

  for (const b of badgesList.filter(x => ['developer', 'early', 'popular'].includes(x.slug))) {
    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId: userHacker.id, badgeId: b.id } },
      update: {},
      create: { userId: userHacker.id, badgeId: b.id, isVisible: true },
    });
  }

  // Account 3: GAMER
  const userGamer = await prisma.user.upsert({
    where: { username: 'GAMER' },
    update: {},
    create: {
      username: 'GAMER',
      email: 'gamer@wans.gg',
      passwordHash,
      role: 'USER',
      isPremium: true,
      profile: {
        create: {
          displayName: 'ApexPhantom',
          bio: 'Radiant Valorant & Top 500 Overwatch. Streaming daily on Twitch. GG only!',
          location: 'Seoul / Tokyo',
          pronouns: 'he/him',
          avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=400&fit=crop',
          backgroundType: 'GRADIENT',
          backgroundColor: '#0c051a',
          accentColor: '#9d4edd',
          textColor: '#ffffff',
          cardColor: 'rgba(25, 12, 45, 0.85)',
          backgroundBlur: 6,
          overlayOpacity: 0.6,
          fontFamily: 'Inter',
          effectGlow: true,
          themeId: 'neon-purple',
          discordActivity: 'Playing VALORANT (Competitive Match)',
          spotifyTrack: 'Legends Never Die',
          spotifyArtist: 'Against The Current',
          spotifyCover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=300&fit=crop',
          links: {
            create: [
              { platform: 'Twitch', label: 'Live Stream Daily', url: 'https://twitch.tv', style: 'neon', order: 0, clickCount: 890 },
              { platform: 'YouTube', label: 'Montages & Highlights', url: 'https://youtube.com', style: 'filled', order: 1, clickCount: 420 },
              { platform: 'Discord', label: 'Join The Gaming Squad', url: 'https://discord.gg', style: 'glass', order: 2, clickCount: 650 },
              { platform: 'Steam', label: 'Steam Inventory & Profile', url: 'https://steamcommunity.com', style: 'outline', order: 3, clickCount: 180 },
            ],
          },
          guestbook: {
            create: [
              { authorName: 'SniperKing', message: 'That clutch last night on stream was insane bro!!', isPinned: true },
            ],
          },
          views: {
            create: [
              { deviceType: 'mobile', browser: 'Safari', referrer: 'https://twitch.tv', country: 'South Korea' },
              { deviceType: 'desktop', browser: 'Chrome', referrer: 'https://youtube.com', country: 'Japan' },
            ],
          },
        },
      },
    },
  });

  for (const b of badgesList.filter(x => ['gamer', 'popular', 'premium'].includes(x.slug))) {
    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId: userGamer.id, badgeId: b.id } },
      update: {},
      create: { userId: userGamer.id, badgeId: b.id, isVisible: true },
    });
  }

  // Account 4: DEVELOPER
  const userDev = await prisma.user.upsert({
    where: { username: 'DEVELOPER' },
    update: {},
    create: {
      username: 'DEVELOPER',
      email: 'dev@wans.gg',
      passwordHash,
      role: 'USER',
      isPremium: false,
      profile: {
        create: {
          displayName: 'Alex Rivers',
          bio: 'Full-stack TypeScript advocate, open source contributor, and distributed systems nerd.',
          location: 'Stockholm, Sweden',
          pronouns: 'she/her',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
          backgroundType: 'SOLID',
          backgroundColor: '#0a0a0f',
          accentColor: '#38bdf8',
          textColor: '#ffffff',
          cardColor: 'rgba(15, 23, 42, 0.8)',
          backgroundBlur: 0,
          overlayOpacity: 0.4,
          fontFamily: 'Inter',
          effectGlow: false,
          themeId: 'azure',
          links: {
            create: [
              { platform: 'GitHub', label: 'GitHub - Open Source Repos', url: 'https://github.com', style: 'glass', order: 0, clickCount: 310 },
              { platform: 'X', label: 'Engineering Musings on X', url: 'https://x.com', style: 'outline', order: 1, clickCount: 154 },
              { platform: 'Website', label: 'Read Technical Blog', url: 'https://example.com', style: 'filled', order: 2, clickCount: 89 },
            ],
          },
        },
      },
    },
  });

  for (const b of badgesList.filter(x => ['developer', 'verified'].includes(x.slug))) {
    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId: userDev.id, badgeId: b.id } },
      update: {},
      create: { userId: userDev.id, badgeId: b.id, isVisible: true },
    });
  }

  console.log('🎉 WANS Seed successfully finished!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
