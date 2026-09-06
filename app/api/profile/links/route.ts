import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { linkSchema } from '@/lib/validations';

// POST: Add new link
export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !user.profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = linkSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid link data' }, { status: 400 });
    }

    // Limit check for free tier: max 6 links
    if (!user.isPremium) {
      const existingCount = await prisma.socialLink.count({ where: { profileId: user.profile.id } });
      if (existingCount >= 8) {
        return NextResponse.json(
          { error: 'Free accounts are limited to 8 social links. Upgrade to Premium for unlimited links!' },
          { status: 403 }
        );
      }
    }

    const maxOrder = await prisma.socialLink.findFirst({
      where: { profileId: user.profile.id },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const newOrder = (maxOrder?.order ?? -1) + 1;

    const link = await prisma.socialLink.create({
      data: {
        profileId: user.profile.id,
        ...parsed.data,
        order: newOrder,
      },
    });

    return NextResponse.json({ success: true, link });
  } catch (error) {
    console.error('Create link error:', error);
    return NextResponse.json({ error: 'Failed to create link' }, { status: 500 });
  }
}

// PATCH: Update link or reorder links
export async function PATCH(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !user.profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Check if reordering an array of links: { reorder: [{ id, order }] }
    if (Array.isArray(body.reorder)) {
      for (const item of body.reorder) {
        await prisma.socialLink.updateMany({
          where: { id: item.id, profileId: user.profile.id },
          data: { order: item.order },
        });
      }
      return NextResponse.json({ success: true, message: 'Links reordered successfully' });
    }

    // Otherwise single link update: { id, data: { ... } }
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ error: 'Link ID required' }, { status: 400 });
    }

    const updated = await prisma.socialLink.updateMany({
      where: { id, profileId: user.profile.id },
      data,
    });

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error('Update link error:', error);
    return NextResponse.json({ error: 'Failed to update link' }, { status: 500 });
  }
}

// DELETE: Remove link
export async function DELETE(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !user.profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const linkId = searchParams.get('id');

    if (!linkId) {
      return NextResponse.json({ error: 'Link ID required' }, { status: 400 });
    }

    await prisma.socialLink.deleteMany({
      where: { id: linkId, profileId: user.profile.id },
    });

    return NextResponse.json({ success: true, message: 'Link deleted' });
  } catch (error) {
    console.error('Delete link error:', error);
    return NextResponse.json({ error: 'Failed to delete link' }, { status: 500 });
  }
}
