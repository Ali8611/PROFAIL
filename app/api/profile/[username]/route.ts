import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
  try {
    const username = params.username;

    const user = await prisma.user.findFirst({
      where: {
        username: { equals: username },
        isBanned: false,
      },
      select: {
        id: true,
        username: true,
        role: true,
        isPremium: true,
        createdAt: true,
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
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile: user });
  } catch (error) {
    console.error('Fetch public profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
