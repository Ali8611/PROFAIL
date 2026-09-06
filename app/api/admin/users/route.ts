import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q') || '';

    const users = await prisma.user.findMany({
      where: search
        ? {
            OR: [
              { username: { contains: search } },
              { email: { contains: search } },
            ],
          }
        : undefined,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isPremium: true,
        isBanned: true,
        createdAt: true,
        profile: {
          select: {
            displayName: true,
            avatarUrl: true,
            _count: { select: { views: true, links: true } },
          },
        },
        badges: {
          include: { badge: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    if (error.message === 'FORBIDDEN' || error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { userId, isBanned, isPremium, role, username } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const dataToUpdate: any = {};
    if (isBanned !== undefined) dataToUpdate.isBanned = Boolean(isBanned);
    if (isPremium !== undefined) dataToUpdate.isPremium = Boolean(isPremium);
    if (role && ['USER', 'ADMIN'].includes(role)) dataToUpdate.role = role;
    if (username) {
      // Check username collision
      const existing = await prisma.user.findFirst({
        where: { username, NOT: { id: userId } },
      });
      if (existing) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
      }
      dataToUpdate.username = username;
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    if (error.message === 'FORBIDDEN' || error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    if (admin.id === userId) {
      return NextResponse.json({ error: 'Cannot delete your own admin account' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true, message: 'User deleted' });
  } catch (error: any) {
    if (error.message === 'FORBIDDEN' || error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
