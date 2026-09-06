import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { badgeId, isVisible } = await req.json();

    if (!badgeId) {
      return NextResponse.json({ error: 'Badge ID required' }, { status: 400 });
    }

    const updated = await prisma.userBadge.update({
      where: {
        userId_badgeId: {
          userId: user.id,
          badgeId,
        },
      },
      data: { isVisible: Boolean(isVisible) },
      include: { badge: true },
    });

    return NextResponse.json({ success: true, userBadge: updated });
  } catch (error) {
    console.error('Badge toggle error:', error);
    return NextResponse.json({ error: 'Failed to update badge visibility' }, { status: 500 });
  }
}
