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

  // Password hash for all sample accounts: "Password123!"  // 3. Seed Only Real Owner Account: aliwasn1
  const passwordHash = await bcrypt.hash('wans-owner-2026!', 10);

  const userWans = await prisma.user.upsert({
    where: { username: 'aliwasn1' },
    update: {
      role: 'ADMIN',
      isPremium: true,
      discordId: '925438310418112592',
      discordUsername: 'aliwasn1',
    },
    create: {
      username: 'aliwasn1',
      email: 'aliwasn1@wans.gg',
      passwordHash,
      role: 'ADMIN',
      isPremium: true,
      discordId: '925438310418112592',
      discordUsername: 'aliwasn1',
      profile: {
        create: {
          displayName: 'aliwasn1',
          bio: '👑 Founder & Lead Architect at WANS Platform.',
          location: 'WANS HQ',
          pronouns: 'he/him',
          avatarUrl: 'https://cdn.discordapp.com/avatars/925438310418112592/a_8f.png',
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
          discordActivity: 'Playing with WANS Engine',
          links: {
            create: [
              { platform: 'Discord', label: 'Discord Server / Profile', url: 'https://discord.com/users/925438310418112592', style: 'neon', order: 0, clickCount: 0 },
            ],
          },
        },
      },
    },
  });

  // Assign Owner Badges to aliwasn1
  const badgesList = await prisma.badge.findMany();
  for (const b of badgesList.filter(x => ['owner', 'developer', 'verified', 'premium'].includes(x.slug))) {
    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId: userWans.id, badgeId: b.id } },
      update: { isVisible: true },
      create: { userId: userWans.id, badgeId: b.id, isVisible: true },
    });
  }

  console.log('🎉 Clean Real Data Seed finished! Only real owner aliwasn1 is present.');

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
