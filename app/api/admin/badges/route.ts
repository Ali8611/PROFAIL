import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { badgeSchema } from '@/lib/validations';

export async function GET() {
  try {
    const badges = await prisma.badge.findMany({
      include: {
        _count: { select: { userBadges: true } },
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ success: true, badges });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch badges' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();

    // Check if assigning/unassigning badge to user: { action: 'assign' | 'unassign', userId, badgeId }
    if (body.action === 'assign') {
      const { userId, badgeId } = body;
      const userBadge = await prisma.userBadge.upsert({
        where: { userId_badgeId: { userId, badgeId } },
        update: {},
        create: { userId, badgeId, isVisible: true },
      });
      return NextResponse.json({ success: true, userBadge });
    }

    if (body.action === 'unassign') {
      const { userId, badgeId } = body;
      await prisma.userBadge.deleteMany({
        where: { userId, badgeId },
      });
      return NextResponse.json({ success: true, message: 'Badge unassigned' });
    }

    // Otherwise, create new badge
    const parsed = badgeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid badge' }, { status: 400 });
    }

    const badge = await prisma.badge.create({
      data: {
        ...parsed.data,
        isSystem: false,
      },
    });

    return NextResponse.json({ success: true, badge });
  } catch (error: any) {
    if (error.message === 'FORBIDDEN' || error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to process badge' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const badgeId = searchParams.get('id');

    if (!badgeId) {
      return NextResponse.json({ error: 'Badge ID required' }, { status: 400 });
    }

    await prisma.badge.delete({
      where: { id: badgeId },
    });

    return NextResponse.json({ success: true, message: 'Badge deleted' });
  } catch (error: any) {
    if (error.message === 'FORBIDDEN' || error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to delete badge' }, { status: 500 });
  }
}
