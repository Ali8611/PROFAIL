import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { trackLinkClick } from '@/lib/analytics';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const linkId = params.id;
    const referrer = req.headers.get('referer') || '';

    const link = await prisma.socialLink.findUnique({
      where: { id: linkId },
    });

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    // Track click asynchronously
    await trackLinkClick(linkId, referrer);

    return NextResponse.json({ success: true, url: link.url });
  } catch (error) {
    console.error('Click tracking error:', error);
    return NextResponse.json({ error: 'Click tracking failed' }, { status: 500 });
  }
}
