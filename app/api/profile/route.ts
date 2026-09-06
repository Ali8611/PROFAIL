import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { profileUpdateSchema } from '@/lib/validations';

export async function PATCH(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !user.profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = profileUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }

    // Gated features check: non-premium users cannot use video backgrounds or custom css
    if (!user.isPremium) {
      if (parsed.data.backgroundType === 'VIDEO') {
        return NextResponse.json(
          { error: 'Video backgrounds require a WANS Premium subscription' },
          { status: 403 }
        );
      }
    }

    const updatedProfile = await prisma.profile.update({
      where: { id: user.profile.id },
      data: parsed.data,
      include: {
        links: { orderBy: { order: 'asc' } },
        musicTrack: true,
      },
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
