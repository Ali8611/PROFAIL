import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { commentSchema } from '@/lib/validations';
import { hashIp } from '@/lib/analytics';

// POST: Add comment
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profileId, authorName, authorAvatar, message } = body;

    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID required' }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile || !profile.isGuestbookEnabled) {
      return NextResponse.json({ error: 'Guestbook is disabled for this profile' }, { status: 403 });
    }

    const parsed = commentSchema.safeParse({ authorName, message });
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid comment' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const ipHash = hashIp(ip);

    // Anti-spam: max 1 comment per 2 minutes from same IP
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const recentComment = await prisma.guestbookComment.findFirst({
      where: {
        profileId,
        ipHash,
        createdAt: { gte: twoMinutesAgo },
      },
    });

    if (recentComment) {
      return NextResponse.json(
        { error: 'Please wait a moment before sending another message' },
        { status: 429 }
      );
    }

    const comment = await prisma.guestbookComment.create({
      data: {
        profileId,
        authorName: parsed.data.authorName,
        authorAvatar: authorAvatar || '',
        message: parsed.data.message,
        ipHash,
      },
    });

    return NextResponse.json({ success: true, comment });
  } catch (error) {
    console.error('Guestbook post error:', error);
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }
}

// PATCH: Pin / unpin comment (Owner only)
export async function PATCH(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !user.profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { commentId, isPinned } = await req.json();
    if (!commentId) {
      return NextResponse.json({ error: 'Comment ID required' }, { status: 400 });
    }

    const comment = await prisma.guestbookComment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.profileId !== user.profile.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updated = await prisma.guestbookComment.update({
      where: { id: commentId },
      data: { isPinned: Boolean(isPinned) },
    });

    return NextResponse.json({ success: true, comment: updated });
  } catch (error) {
    console.error('Pin comment error:', error);
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}

// DELETE: Remove comment (Owner or Admin)
export async function DELETE(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get('id');

    if (!commentId) {
      return NextResponse.json({ error: 'Comment ID required' }, { status: 400 });
    }

    const comment = await prisma.guestbookComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // Check ownership or admin
    if (user.role !== 'ADMIN' && (!user.profile || comment.profileId !== user.profile.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.guestbookComment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    console.error('Delete comment error:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
