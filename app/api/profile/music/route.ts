import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || !user.profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, artist, audioUrl, coverUrl, isHidden } = body;

    if (!title || !audioUrl) {
      return NextResponse.json({ error: 'Title and Audio URL are required' }, { status: 400 });
    }

    const track = await prisma.musicTrack.upsert({
      where: { profileId: user.profile.id },
      update: {
        title,
        artist: artist || 'Unknown Artist',
        audioUrl,
        coverUrl: coverUrl || '',
        isHidden: !!isHidden,
      },
      create: {
        profileId: user.profile.id,
        title,
        artist: artist || 'Unknown Artist',
        audioUrl,
        coverUrl: coverUrl || '',
        isHidden: !!isHidden,
      },
    });

    return NextResponse.json({ success: true, track });
  } catch (error) {
    console.error('Music track save error:', error);
    return NextResponse.json({ error: 'Failed to update music track' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const user = await getSessionUser();
    if (!user || !user.profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.musicTrack.deleteMany({
      where: { profileId: user.profile.id },
    });

    return NextResponse.json({ success: true, message: 'Music track removed' });
  } catch (error) {
    console.error('Music track delete error:', error);
    return NextResponse.json({ error: 'Failed to remove music track' }, { status: 500 });
  }
}
