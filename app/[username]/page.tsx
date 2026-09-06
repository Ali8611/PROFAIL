import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { trackProfileView } from '@/lib/analytics';
import ProfileCard from '@/components/ProfileCard';

interface Props {
  params: { username: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const username = params.username;

  const user = await prisma.user.findFirst({
    where: { username: { equals: username } },
    include: { profile: true },
  });

  if (!user || !user.profile) {
    return {
      title: 'Profile Not Found — WANS',
    };
  }

  const title = `${user.profile.displayName} (@${user.username}) — WANS Profile`;
  const description = user.profile.bio || `Check out ${user.profile.displayName}'s official WANS profile.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: user.profile.avatarUrl ? [{ url: user.profile.avatarUrl }] : [],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: user.profile.avatarUrl ? [user.profile.avatarUrl] : [],
    },
  };
}

export default async function UserProfilePage({ params }: Props) {
  const username = params.username;

  // Retrieve user, profile, badges, links, music, guestbook
  const user = await prisma.user.findFirst({
    where: {
      username: { equals: username },
      isBanned: false,
    },
    include: {
      profile: {
        include: {
          links: {
            where: { isEnabled: true },
            orderBy: { order: 'asc' },
          },
          musicTrack: true,
          guestbook: {
            orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
            take: 30,
          },
        },
      },
      badges: {
        where: { isVisible: true },
        include: { badge: true },
      },
    },
  });

  if (!user || !user.profile) {
    notFound();
  }

  // Record profile view analytics
  const headersList = headers();
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
  const userAgent = headersList.get('user-agent') || '';
  const referrer = headersList.get('referer') || '';

  // Fire and forget
  trackProfileView({
    profileId: user.profile.id,
    ip,
    userAgent,
    referrer,
  });

  // Check if visitor is the owner
  const sessionUser = await getSessionUser();
  const isOwner = sessionUser?.id === user.id;

  const cardData = {
    ...user.profile,
    username: user.username,
    role: user.role,
    isPremium: user.isPremium,
    badges: user.badges,
    createdAt: user.createdAt,
  };

  return <ProfileCard profile={cardData} isOwner={isOwner} />;
}
